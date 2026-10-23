

import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import supabase from '../db/supabase.js';
import { checkFreeSlots, createEventFromAI } from './calendarController.js';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const VENDOR_ID = "4c3d0f01-7bd2-4bcd-9130-3752cb68cf7e";
const MAX_HISTORY = 20;                 // last 20 turns (10 user + 10 model)
const SESSION_TTL_MS = 60 * 60 * 1000;  // chat history 1 ghante baad expire

const MAINTENANCE_ISSUE = "Routine maintenance inspection";

// Maintenance flow mein 'issue' required nahi hota (code khud MAINTENANCE_ISSUE bhar deta hai),
// isliye model ke paas issue poochne ki wajah hi nahi bachti.
function buildTools(maintenanceFlow) {
    return {
        functionDeclarations: [
            {
                name: "book_appointment",
                description: maintenanceFlow
                    ? "Use this function as soon as the customer picks a time for the maintenance inspection. Do NOT ask for the issue. Pass issue only if the customer themselves described a real problem."
                    : "Use this function ONLY when you have collected all required details: customer name, appointment date, preferred time, exact address, and issue description.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        name: { type: "STRING", description: "Customer's full name" },
                        date: { type: "STRING", description: "Appointment Date in YYYY-MM-DD format" },
                        time: { type: "STRING", description: "Appointment Time as hh:mm AM/PM (e.g. 10:00 AM or 02:00 PM)" },
                        issue: { type: "STRING", description: "The HVAC issue (e.g. AC leaking, blowing warm air)" },
                        address: { type: "STRING", description: "Customer's exact residential address" }
                    },
                    required: maintenanceFlow
                        ? ["name", "date", "time", "address"]
                        : ["name", "date", "time", "issue", "address"]
                }
            }
        ]
    };
}

// phone -> { history: Content[], updatedAt }
// NOTE: chat object cache nahi kar rahe, sirf history. Warna system instruction
// (calendar status) pehle message ke baad kabhi refresh nahi hota.
const waSessions = new Map();
const seenMessageIds = new Set();

// ---------- helpers ----------

function alreadyProcessed(id) {
    if (!id) return false;
    if (seenMessageIds.has(id)) return true;
    seenMessageIds.add(id);
    if (seenMessageIds.size > 500) {
        seenMessageIds.delete(seenMessageIds.values().next().value);
    }
    return false;
}

function getSavedHistory(phone) {
    const s = waSessions.get(phone);
    if (!s) return [];
    if (Date.now() - s.updatedAt > SESSION_TTL_MS) {
        waSessions.delete(phone);
        return [];
    }
    return s.history;
}

// Karachi (UTC+5) ki date 'YYYY-MM-DD' (offsetDays=1 -> kal)
function karachiDate(offsetDays = 0) {
    return new Date(Date.now() + 5 * 3600 * 1000 + offsetDays * 86400000).toISOString().slice(0, 10);
}

// "2026-10-23" + "02:00 PM" -> ISO string, Karachi time (+05:00) ke hisaab se.
// Render server UTC pe chalta hai, isliye new Date("date time") 5 ghante aage/peeche jata tha.
function toSlotISO(dateStr, timeStr) {
    const m = String(timeStr).trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i);
    if (!m) return null;

    let hour = parseInt(m[1], 10);
    const minute = m[2] || '00';
    const meridiem = m[3] ? m[3].toUpperCase() : null;
    if (meridiem === 'PM' && hour < 12) hour += 12;
    if (meridiem === 'AM' && hour === 12) hour = 0;

    let day = /^\d{4}-\d{2}-\d{2}$/.test(String(dateStr).trim()) ? String(dateStr).trim() : null;
    if (!day) {
        const parsed = new Date(`${dateStr} 12:00 UTC`);
        if (isNaN(parsed.getTime())) return null;
        day = parsed.toISOString().slice(0, 10);
    }

    const d = new Date(`${day}T${String(hour).padStart(2, '0')}:${minute}:00+05:00`);
    return isNaN(d.getTime()) ? null : d.toISOString();
}

async function sendWhatsAppText(to, body) {
    try {
        const r = await axios.post(
            `https://graph.facebook.com/v18.0/${process.env.META_WA_PHONE_ID}/messages`,
            {
                messaging_product: 'whatsapp',
                to,
                type: 'text',
                text: { body }
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.META_WA_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log("✅ Meta accepted message, id:", r.data?.messages?.[0]?.id);
    } catch (metaErr) {
        console.error("❌ Meta Send Error:", metaErr.response ? JSON.stringify(metaErr.response.data) : metaErr.message);
    }
}

// ---------- webhook verification ----------

export const verifyMetaWebhook = (req, res) => {
    const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || "HVAC_SECRET_TOKEN_123";

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('✅ Meta Webhook Verified Successfully!');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    } else {
        res.status(400).send("Missing parameters");
    }
};

// ---------- booking ----------

async function bookAppointment(args, cleanPhone, maintenanceFlow) {
    const aiData = {
        ...args,
        issue: args.issue || (maintenanceFlow ? MAINTENANCE_ISSUE : "General HVAC service"),
        phone: cleanPhone,
        preferredTime: args.time
    };

    const eventLink = await createEventFromAI(VENDOR_ID, aiData);

    if (!eventLink) {
        return `Sorry ${aiData.name}, ${aiData.time} on ${aiData.date} is already taken. Please send me another time and I'll check it for you.`;
    }

    try {
        const customerFields = {
            name: aiData.name,
            address: aiData.address,
            issue_description: aiData.issue
        };

        const { data: dbCustomer } = await supabase
            .from('customers')
            .select('id')
            .eq('phone_number', cleanPhone)
            .maybeSingle();

        let customerId;
        if (dbCustomer) {
            customerId = dbCustomer.id;
            const { error: updErr } = await supabase
                .from('customers')
                .update(customerFields)
                .eq('id', customerId);
            if (updErr) throw updErr;
        } else {
            const { data: newCustomer, error: custError } = await supabase
                .from('customers')
                .insert([{ ...customerFields, phone_number: cleanPhone, vendor_id: VENDOR_ID }])
                .select('id')
                .single();
            if (custError) throw custError;
            customerId = newCustomer.id;
        }

        const slotTimeISO = toSlotISO(aiData.date, aiData.time);
        if (!slotTimeISO) throw new Error(`Slot parse nahi hua: "${aiData.date}" "${aiData.time}"`);

        // Nayi appointment ka maintenance_sent default false hota hai, isliye is booking ke baad
        // maintenance flow khud khatam ho jata hai.
        const { error: apptError } = await supabase
            .from('appointments')
            .insert([{
                customer_id: customerId,
                vendor_id: VENDOR_ID,
                slot_time: slotTimeISO,
                google_calendar_event_id: eventLink,
                status: 'Pending'
            }]);
        if (apptError) throw apptError;

        console.log("✅ Supabase Customer & Appointment Records Saved!");
    } catch (dbError) {
        // Calendar event ban chuka hai, isliye customer ko confirm karte hain, bas log mein error rakho
        console.error("❌ Supabase Insertion Error:", dbError);
    }

    return `Done ${aiData.name}! Your appointment is booked for ${aiData.date} at ${aiData.time}. Our technician will see you then 👍`;
}

// ---------- main message flow ----------

async function processMessage(msg, cleanPhone) {
    if (msg.type !== 'text') {
        await sendWhatsAppText(cleanPhone, "Sorry, I can only read text messages right now. Please type your message.");
        return;
    }

    const incomingMsg = msg.text.body;
    console.log(`\n📩 WhatsApp Msg from (${cleanPhone}): "${incomingMsg}"`);

    const todayDate = new Date().toDateString();
    const calendarStatus = await checkFreeSlots(VENDOR_ID);

    const { data: customer } = await supabase
        .from('customers')
        .select('*')
        .eq('phone_number', cleanPhone)
        .maybeSingle();

    // DB change ke bagair "maintenance flow" pehchanna: cron offer bhejne ke baad us customer ki
    // appointment pe maintenance_sent = true kar deta hai. Agar customer ki sabse nayi appointment
    // aisi hai, to uska reply maintenance offer ka jawab maana jata hai.
    let maintenanceFlow = false;
    if (customer?.id) {
        const { data: lastAppt, error: apptLookupError } = await supabase
            .from('appointments')
            .select('id, maintenance_sent, created_at')
            .eq('customer_id', customer.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (apptLookupError) console.error("❌ appointments lookup error:", apptLookupError);
        maintenanceFlow = !!lastAppt?.maintenance_sent;
    }
    console.log(maintenanceFlow
        ? `🎯 Maintenance flow ON for ${cleanPhone}`
        : `ℹ️ Normal flow for ${cleanPhone}`);

    const known = [];
    if (customer?.name) known.push(`Name: ${customer.name}`);
    if (customer?.address) known.push(`Address: ${customer.address}`);

    const customerRules = known.length
        ? `This is a RETURNING customer. Known details: ${known.join(' | ')}. Do NOT ask for these again. Ask only for what is still missing.`
        : `This is a NEW customer. Collect missing details one by one (Name, Address, Issue, Preferred Time).`;

    const tomorrow = karachiDate(1);
    const maintenanceRules = maintenanceFlow
        ? `
MAINTENANCE MODE: We recently messaged this customer offering a routine maintenance inspection for tomorrow (${tomorrow}) with free slots. Their reply is an answer to that offer.
- NEVER ask what issue or problem they are facing. This is a maintenance booking, not a repair.
- When they give a time (or say yes / book it), call 'book_appointment' immediately: date = ${tomorrow} unless they name another date, and do not pass an issue.
- Only if the customer themselves clearly describe a problem (leaking, not cooling, strange noise, etc.), treat it as a normal repair request and pass that issue.
- The time must be FREE in the live calendar status above. If it is busy, politely say so and suggest 2 free slots.`
        : '';

    const model = genAI.getGenerativeModel({
        model: "gemini-3.5-flash-lite",
        tools: [buildTools(maintenanceFlow)],
        systemInstruction: `You are Alex, a warm, polite, and highly responsive human AI dispatcher for an HVAC service team on WhatsApp.
Today's date is: ${todayDate}.

🚨 LIVE CALENDAR SCHEDULE STATUS:
${calendarStatus}

RULES FOR CHATTING:
1. Speak naturally like a friendly customer support representative. Keep replies brief (1 to 2 sentences max).
2. STRICT CALENDAR RULE: NEVER accept or offer slots that are listed as BUSY/BOOKED. If a customer asks for a booked time, politely inform them it's unavailable and suggest 2 open slots from the calendar status.
3. ${customerRules}
4. Customers often type a bare hour like "5" or "4 pm". A bare hour from 1 to 6 means PM, from 7 to 11 means AM.
5. As soon as you have all details locked and agreed upon, call the 'book_appointment' function immediately. Pass date as YYYY-MM-DD and time as hh:mm AM/PM.
${maintenanceRules}`
    });

    const chat = model.startChat({ history: getSavedHistory(cleanPhone) });

    const result = await chat.sendMessage(incomingMsg);
    const response = result.response;
    const functionCalls = response.functionCalls();

    let aiReply = "";

    if (functionCalls && functionCalls.length > 0 && functionCalls[0].name === "book_appointment") {
        console.log("\n🚀 AI Triggered Tool: book_appointment", JSON.stringify(functionCalls[0].args));

        // Booking ke baad history clear. Gemini ko functionResponse wapas bhejne ki zarurat nahi,
        // hum khud confirmation bhejte hain (isse 'Role function is not supported' 400 khatam).
        waSessions.delete(cleanPhone);
        aiReply = await bookAppointment(functionCalls[0].args, cleanPhone, maintenanceFlow);
    } else {
        aiReply = response.text();
        const history = await chat.getHistory();
        waSessions.set(cleanPhone, { history: history.slice(-MAX_HISTORY), updatedAt: Date.now() });
    }

    console.log(`🤖 Alex (AI): ${aiReply}`);
    await sendWhatsAppText(cleanPhone, aiReply);
}

export const handleWhatsAppMessage = async (req, res) => {
    const body = req.body;

    if (body?.object !== 'whatsapp_business_account') {
        return res.sendStatus(404);
    }

    const value = body.entry?.[0]?.changes?.[0]?.value;

    // delivered / read / failed events yahan aate hain
    if (value?.statuses) {
        for (const s of value.statuses) {
            if (s.status === 'failed') {
                console.error("📊 WA DELIVERY FAILED:", JSON.stringify(s.errors || s));
            }
        }
    }

    const msg = value?.messages?.[0];
    if (!msg) return res.sendStatus(200);

    // Pehle 200 bhejo. Gemini + calendar slow ho to Meta retry karta hai aur duplicate booking ban jati hai.
    res.sendStatus(200);

    if (alreadyProcessed(msg.id)) return;

    const cleanPhone = msg.from.trim();

    try {
        await processMessage(msg, cleanPhone);
    } catch (error) {
        console.error("❌ WhatsApp Webhook Error:", error);
        waSessions.delete(cleanPhone);
        await sendWhatsAppText(cleanPhone, "Sorry, something went wrong on our side. Please send your message again in a moment.");
    }
};