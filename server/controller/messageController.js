
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import axios from 'axios'; 
// import supabase from '../db/supabase.js'; 
// import { checkFreeSlots, createEventFromAI } from './calendarController.js'; 
// import dotenv from 'dotenv';
// dotenv.config();

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const hvacTools = {
//     functionDeclarations: [
//         {
//             name: "book_appointment",
//             description: "Use this function ONLY when you have collected all required details: customer name, appointment date, preferred time, exact address, and issue description.",
//             parameters: {
//                 type: "OBJECT",
//                 properties: {
//                     name: { type: "STRING", description: "Customer's full name" },
//                     date: { type: "STRING", description: "Appointment Date (e.g. YYYY-MM-DD or DD-Month-YYYY)" },
//                     time: { type: "STRING", description: "Appointment Time (e.g. 10:00 AM or 02:00 PM)" },
//                     issue: { type: "STRING", description: "The HVAC issue (e.g. AC leaking, blowing warm air)" },
//                     address: { type: "STRING", description: "Customer's exact residential address" }
//                 },
//                 required: ["name", "date", "time", "issue", "address"]
//             }
//         }
//     ]
// };

// const waSessions = new Map();

// // 🔥 Meta Webhook Verification (GET Route)
// export const verifyMetaWebhook = (req, res) => {
//     const VERIFY_TOKEN = "HVAC_SECRET_TOKEN_123"; 

//     const mode = req.query['hub.mode'];
//     const token = req.query['hub.verify_token'];
//     const challenge = req.query['hub.challenge'];

//     if (mode && token) {
//         if (mode === 'subscribe' && token === VERIFY_TOKEN) {
//             console.log('✅ Meta Webhook Verified Successfully!');
//             res.status(200).send(challenge);
//         } else {
//             res.sendStatus(403);
//         }
//     } else {
//         res.status(400).send("Missing parameters");
//     }
// };

// // 🔥 Customer Messages Handling & AI (POST Route)
// // export const handleWhatsAppMessage = async (req, res) => {
// //     try {
// //         const body = req.body;
        
// //         // Agar webhook event whatsapp ka nahi hai
// //         if (body.object !== 'whatsapp_business_account') {
// //             return res.sendStatus(404);
// //         }

// //         const entry = body.entry?.[0];
// //         const changes = entry?.changes?.[0];
// //         const value = changes?.value;
// //         const messages = value?.messages;

// //         if (!messages || !messages[0]) {
// //             return res.sendStatus(200); 
// //         }

// //         const incomingMsg = messages[0].text.body;
// //         const senderNumber = messages[0].from; 
// //         const cleanPhone = senderNumber.trim();

// //         console.log(`\n📩 WhatsApp Msg from \({cleanPhone}: "\){incomingMsg}"`);

// //         const todayDate = new Date().toDateString();
// //         const vendorId = "4c3d0f01-7bd2-4bcd-9130-3752cb68cf7e"; 

// //         const calendarStatus = await checkFreeSlots(vendorId);

// //         const model = genAI.getGenerativeModel({ 
// //             model: "gemini-3.5-flash-lite",
// //             tools: [hvacTools],
// //             systemInstruction: `You are Alex, a warm, polite, and highly responsive human AI dispatcher for an HVAC service team on WhatsApp.
// // Today's date is: ${todayDate}.

// // 🚨 LIVE CALENDAR SCHEDULE STATUS:
// // ${calendarStatus}

// // RULES FOR CHATTING:
// // 1. Speak naturally like a friendly customer support representative. Keep replies brief (1 to 2 sentences max).
// // 2. STRICT CALENDAR RULE: NEVER accept or offer slots that are listed as BUSY/BOOKED. If a customer asks for a booked time, politely inform them it's unavailable and suggest 2 open slots from the calendar status.
// // 3. Collect missing details one by one (Name, Address, Issue, Preferred Time).
// // 4. As soon as you have all 5 details locked and agreed upon, call the 'book_appointment' function immediately.`
// //         });

// //         let chat;
// //         if (!waSessions.has(senderNumber)) {
// //             chat = model.startChat();
// //             waSessions.set(senderNumber, chat);
// //         } else {
// //             chat = waSessions.get(senderNumber);
// //         }

// //         let result = await chat.sendMessage(incomingMsg);
// //         let response = result.response;
// //         let aiReply = "";

// //         const functionCalls = response.functionCalls();
        
// //         if (functionCalls && functionCalls.length > 0) {
// //             const call = functionCalls[0];
            
// //             if (call.name === "book_appointment") {
// //                 console.log("\n🚀 AI Triggered Tool: book_appointment");
// //                 const aiData = call.args;

// //                 aiData.phone = cleanPhone;
// //                 aiData.preferredTime = aiData.time; 
                
// //                 const eventLink = await createEventFromAI(vendorId, aiData);

// //                 if (!eventLink) {
// //                     const functionResponseResult = await chat.sendMessage([{
// //                         functionResponse: {
// //                             name: "book_appointment",
// //                             response: { success: false, message: "That specific time slot was just taken. Apologize and ask the customer to pick another free time." }
// //                         }
// //                     }]);
// //                     aiReply = functionResponseResult.response.text();
// //                 } else {
// //                     try {
// //                         let customerId;
// //                         const { data: existingCustomer } = await supabase
// //                             .from('customers')
// //                             .select('id')
// //                             .eq('phone_number', cleanPhone)
// //                             .maybeSingle();

// //                         if (existingCustomer) {
// //                             customerId = existingCustomer.id;
// //                             await supabase.from('customers').update({
// //                                 issue_description: aiData.issue,
// //                                 address: aiData.address
// //                             }).eq('id', customerId);
// //                         } else {
// //                             const { data: newCustomer, error: custError } = await supabase
// //                                 .from('customers')
// //                                 .insert([{
// //                                     phone_number: cleanPhone,
// //                                     name: aiData.name,
// //                                     address: aiData.address,
// //                                     issue_description: aiData.issue,
// //                                     vendor_id: vendorId
// //                                 }])
// //                                 .select('id')
// //                                 .single();
                                
// //                             if (custError) throw custError;
// //                             customerId = newCustomer.id;
// //                         }

// //                         let slotTimeISO;
// //                         try {
// //                             const parsedDate = new Date(`\({aiData.date}\){aiData.time}`);
// //                             slotTimeISO = isNaN(parsedDate.getTime()) ? new Date().toISOString() : parsedDate.toISOString();
// //                         } catch (e) {
// //                             slotTimeISO = new Date().toISOString();
// //                         }

// //                         const { error: apptError } = await supabase
// //                             .from('appointments') 
// //                             .insert([{
// //                                 customer_id: customerId,
// //                                 vendor_id: vendorId,
// //                                 slot_time: slotTimeISO,
// //                                 google_calendar_event_id: eventLink,
// //                                 status: 'Pending'
// //                             }]);

// //                         if (apptError) throw apptError;
// //                         console.log("✅ Supabase Customer & Appointment Records Saved!");

// //                     } catch (dbError) {
// //                         console.error("❌ Supabase Insertion Error:", dbError);
// //                     }

// //                     const functionResponseResult = await chat.sendMessage([{
// //                         functionResponse: {
// //                             name: "book_appointment",
// //                             response: { success: true, message: "Appointment successfully scheduled in Google Calendar and DB. Confirm warmly to the customer." }
// //                         }
// //                     }]);
// //                     aiReply = functionResponseResult.response.text();
// //                 }
// //             }
// //         } else {
// //             aiReply = response.text();
// //         }

// //         console.log(`🤖 Alex (AI): ${aiReply}`);

// //         // 🔥 Meta API ke through Message bhejna
// //         try {
// //             await axios.post(
// //                 `https://graph.facebook.com/v18.0/${process.env.META_WA_PHONE_ID}/messages`,
// //                 {
// //                     messaging_product: 'whatsapp',
// //                     to: cleanPhone,
// //                     type: 'text',
// //                     text: { body: aiReply }
// //                 },
// //                 {
// //                     headers: {
// //                         'Authorization': `Bearer ${process.env.META_WA_TOKEN}`,
// //                         'Content-Type': 'application/json'
// //                     }
// //                 }
// //             );
// //             console.log("✅ Message direct WhatsApp par deliver ho gaya!");
// //         } catch (metaErr) {
// //             console.error("❌ Meta Direct Send Error:", metaErr.response ? metaErr.response.data : metaErr.message);
// //         }

// //         res.sendStatus(200);

// //     } catch (error) {
// //         console.error("❌ WhatsApp Webhook Error:", error);
// //         res.status(500).send("Server Error");
// //     }
// // };
// // 🔥 Customer Messages Handling & AI (POST Route)
// export const handleWhatsAppMessage = async (req, res) => {
//     try {
//         const body = req.body;
        
//         // Agar webhook event whatsapp ka nahi hai
//         if (body.object !== 'whatsapp_business_account') {
//             return res.sendStatus(404);
//         }

//         const entry = body.entry?.[0];
//         const changes = entry?.changes?.[0];
//         const value = changes?.value;
//         const messages = value?.messages;

//         if (!messages || !messages[0]) {
//             return res.sendStatus(200); 
//         }

//         const incomingMsg = messages[0].text.body;
//         const senderNumber = messages[0].from; 
//         const cleanPhone = senderNumber.trim();

//         console.log(`\n📩 WhatsApp Msg from (${cleanPhone}): "${incomingMsg}"`);

//         const todayDate = new Date().toDateString();
//         const vendorId = "4c3d0f01-7bd2-4bcd-9130-3752cb68cf7e"; 

//         const calendarStatus = await checkFreeSlots(vendorId);

//         // 🔥 1. Check if returning customer
//         const { data: existingCustomer } = await supabase
//             .from('customers')
//             .select('*')
//             .eq('phone_number', cleanPhone)
//             .maybeSingle();

//         // 🔥 2. Smart Instructions Set Karo
//         let smartInstructions = "";
//         if (existingCustomer) {
//             smartInstructions = `
// CRITICAL RULE: This is a RETURNING customer. 
// Their Name is: ${existingCustomer.name}
// Their Address is: ${existingCustomer.address}
// DO NOT ask for their name, phone number, or residential address again. Assume you already have them. 
// Just ask what issue they are facing right now (if not provided), and confirm the appointment time.`;
//         } else {
//             smartInstructions = `Collect missing details one by one (Name, Address, Issue, Preferred Time).`;
//         }

//         // 🔥 3. AI Model Setup (Nayi Smart Instructions Ke Sath)
//         const model = genAI.getGenerativeModel({ 
//             model: "gemini-3.5-flash-lite",
//             tools: [hvacTools],
//             systemInstruction: `You are Alex, a warm, polite, and highly responsive human AI dispatcher for an HVAC service team on WhatsApp.
// Today's date is: ${todayDate}.

// 🚨 LIVE CALENDAR SCHEDULE STATUS:
// ${calendarStatus}

// RULES FOR CHATTING:
// 1. Speak naturally like a friendly customer support representative. Keep replies brief (1 to 2 sentences max).
// 2. STRICT CALENDAR RULE: NEVER accept or offer slots that are listed as BUSY/BOOKED. If a customer asks for a booked time, politely inform them it's unavailable and suggest 2 open slots from the calendar status.
// 3. ${smartInstructions}
// 4. As soon as you have all details locked and agreed upon, call the 'book_appointment' function immediately.`
//         });

//         let chat;
//         if (!waSessions.has(senderNumber)) {
//             chat = model.startChat();
//             waSessions.set(senderNumber, chat);
//         } else {
//             chat = waSessions.get(senderNumber);
//         }

//         let result = await chat.sendMessage(incomingMsg);
//         let response = result.response;
//         let aiReply = "";

//         const functionCalls = response.functionCalls();
        
//         if (functionCalls && functionCalls.length > 0) {
//             const call = functionCalls[0];
            
//             if (call.name === "book_appointment") {
//                 console.log("\n🚀 AI Triggered Tool: book_appointment");
//                 const aiData = call.args;

//                 aiData.phone = cleanPhone;
//                 aiData.preferredTime = aiData.time; 
                
//                 const eventLink = await createEventFromAI(vendorId, aiData);

//                 if (!eventLink) {
//                     const functionResponseResult = await chat.sendMessage([{
//                         functionResponse: {
//                             name: "book_appointment",
//                             response: { success: false, message: "That specific time slot was just taken. Apologize and ask the customer to pick another free time." }
//                         }
//                     }]);
//                     aiReply = functionResponseResult.response.text();
//                 } else {
//                     try {
//                         let customerId;
//                         const { data: dbCustomer } = await supabase
//                             .from('customers')
//                             .select('id')
//                             .eq('phone_number', cleanPhone)
//                             .maybeSingle();

//                         if (dbCustomer) {
//                             customerId = dbCustomer.id;
//                             await supabase.from('customers').update({
//                                 issue_description: aiData.issue,
//                                 address: aiData.address // Updates address in case they provided a new one
//                             }).eq('id', customerId);
//                         } else {
//                             const { data: newCustomer, error: custError } = await supabase
//                                 .from('customers')
//                                 .insert([{
//                                     phone_number: cleanPhone,
//                                     name: aiData.name,
//                                     address: aiData.address,
//                                     issue_description: aiData.issue,
//                                     vendor_id: vendorId
//                                 }])
//                                 .select('id')
//                                 .single();
                                
//                             if (custError) throw custError;
//                             customerId = newCustomer.id;
//                         }

//                         let slotTimeISO;
//                         try {
//                             const parsedDate = new Date(`${aiData.date} ${aiData.time}`);
//                             slotTimeISO = isNaN(parsedDate.getTime()) ? new Date().toISOString() : parsedDate.toISOString();
//                         } catch (e) {
//                             slotTimeISO = new Date().toISOString();
//                         }

//                         const { error: apptError } = await supabase
//                             .from('appointments') 
//                             .insert([{
//                                 customer_id: customerId,
//                                 vendor_id: vendorId,
//                                 slot_time: slotTimeISO,
//                                 google_calendar_event_id: eventLink,
//                                 status: 'Pending'
//                             }]);

//                         if (apptError) throw apptError;
//                         console.log("✅ Supabase Customer & Appointment Records Saved!");

//                     } catch (dbError) {
//                         console.error("❌ Supabase Insertion Error:", dbError);
//                     }

//                     const functionResponseResult = await chat.sendMessage([{
//                         functionResponse: {
//                             name: "book_appointment",
//                             response: { success: true, message: "Appointment successfully scheduled in Google Calendar and DB. Confirm warmly to the customer." }
//                         }
//                     }]);
//                     aiReply = functionResponseResult.response.text();
//                 }
//             }
//         } else {
//             aiReply = response.text();
//         }

//         console.log(`🤖 Alex (AI): ${aiReply}`);

//         // 🔥 Meta API ke through Message bhejna
//         try {
//             await axios.post(
//                 `https://graph.facebook.com/v18.0/${process.env.META_WA_PHONE_ID}/messages`,
//                 {
//                     messaging_product: 'whatsapp',
//                     to: cleanPhone,
//                     type: 'text',
//                     text: { body: aiReply }
//                 },
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${process.env.META_WA_TOKEN}`,
//                         'Content-Type': 'application/json'
//                     }
//                 }
//             );
//             console.log("✅ Message direct WhatsApp par deliver ho gaya!");
//         } catch (metaErr) {
//             console.error("❌ Meta Direct Send Error:", metaErr.response ? metaErr.response.data : metaErr.message);
//         }

//         res.sendStatus(200);

//     } catch (error) {
//         console.error("❌ WhatsApp Webhook Error:", error);
//         res.status(500).send("Server Error");
//     }
// };
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
const OFFER_VALID_MS = 48 * 60 * 60 * 1000;

const hvacTools = {
    functionDeclarations: [
        {
            name: "book_appointment",
            description: "Use this function ONLY when you have collected all required details: customer name, appointment date, preferred time, exact address, and issue description.",
            parameters: {
                type: "OBJECT",
                properties: {
                    name: { type: "STRING", description: "Customer's full name" },
                    date: { type: "STRING", description: "Appointment Date in YYYY-MM-DD format" },
                    time: { type: "STRING", description: "Appointment Time as hh:mm AM/PM (e.g. 10:00 AM or 02:00 PM)" },
                    issue: { type: "STRING", description: "The HVAC issue (e.g. AC leaking, blowing warm air)" },
                    address: { type: "STRING", description: "Customer's exact residential address" }
                },
                required: ["name", "date", "time", "issue", "address"]
            }
        }
    ]
};

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

async function bookAppointment(args, cleanPhone, offer) {
    const aiData = { ...args, phone: cleanPhone, preferredTime: args.time };

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

        if (offer) {
            await supabase.from('pending_offers').update({ status: 'booked' }).eq('id', offer.id);
        }

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

    // Cron ne jo offer bheja tha, wo yahan se uthate hain
    const { data: offer } = await supabase
        .from('pending_offers')
        .select('*')
        .eq('phone_number', cleanPhone)
        .eq('status', 'open')
        .gte('created_at', new Date(Date.now() - OFFER_VALID_MS).toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    const known = [];
    if (customer?.name) known.push(`Name: ${customer.name}`);
    if (customer?.address) known.push(`Address: ${customer.address}`);

    const customerRules = known.length
        ? `This is a RETURNING customer. Known details: ${known.join(' | ')}. Do NOT ask for these again. Ask only for what is still missing.`
        : `This is a NEW customer. Collect missing details one by one (Name, Address, Issue, Preferred Time).`;

    const offerRules = offer
        ? `
ACTIVE OFFER: We already messaged this customer offering a routine maintenance inspection on ${offer.offer_date} with these free slots: ${(offer.slots || []).join(', ')}.
If the customer replies with a time, or says yes / book it, treat that as accepting this offer: date = ${offer.offer_date}, issue = "Routine maintenance inspection". Do NOT ask for the issue again.
If they pick a time that is not in the offered list, accept it only if it is FREE in the live calendar status above.`
        : '';

    const model = genAI.getGenerativeModel({
        model: "gemini-3.5-flash-lite",
        tools: [hvacTools],
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
${offerRules}`
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
        aiReply = await bookAppointment(functionCalls[0].args, cleanPhone, offer);
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
