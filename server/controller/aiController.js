


import { GoogleGenerativeAI } from '@google/generative-ai';
import { asyncHandler } from '../utils/asyncHandlerUtility.js';
import ErrorHandler from '../utils/errorHandlerUtility.js';
import { createEventFromAI, checkFreeSlots } from './calendarController.js';
import supabase from '../db/supabase.js';

// 👈 .env ko bypass karke direct nayi key laga di
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const sessions = new Map();

function getSession(userId) {
    if (!sessions.has(userId)) {
        sessions.set(userId, { messages: [], booked: false });
    }
    return sessions.get(userId);
}

export const qualifyLead = asyncHandler(async (req, res, next) => {
    const { message, sessionId, vendorId } = req.body;

    if (!message || !sessionId || !vendorId) {
        return next(new ErrorHandler("Please provide message, sessionId, and vendorId", 400));
    }

    const session = getSession(sessionId);
    session.messages.push({ role: "user", content: message });

    const vendorSchedule = await checkFreeSlots(vendorId);

    const formattedHistory = session.messages
        .map((m) => `${m.role === "user" ? "Customer" : "Dispatcher"}: ${m.content}`)
        .join("\n");

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });

    // Business ka actual local time yahan use ho raha hai (Karachi nahi) — taake
    // AI "tomorrow"/"kal" jaisi date-reasoning bhi sahi timezone ke hisaab se kare
    const businessNow = new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' });

    const prompt = `
You are Alex, a warm, professional, and highly efficient AI dispatcher for an HVAC company, chatting live with a customer.

Vendor's Live Schedule Status: "${vendorSchedule}"
Current Date & Time (business's own local time, Asia/Karachi): ${businessNow}

Your Job Rules:
1. Act like a real human dispatcher — natural, helpful, and concise.
2. Ask for ONLY ONE missing piece of information at a time. Look at the FULL conversation history. Never re-ask for details already provided.
3. Collect: Customer Name, Phone Number, Problem/Issue, Residential Address, and a Preferred Appointment Time.
4. STRICT SCHEDULING & FREE SLOT RULE:
   - Look carefully at "Vendor's Live Schedule Status" above. It shows exactly which slots are BUSY/BOOKED also donot offer slots which are already booked.
   - If the customer asks for a time that falls inside a BUSY slot, STRICTLY REJECT IT. Say politely: "Sorry, tomorrow at [Time] is already booked. I have free slots available at [Offer 2 Free Times]. Which works best for you?"
   - If the customer makes a general request like "tomorrow morning" or "afternoon", look at the working hours (9 AM - 6 PM) and check what slots are NOT in the busy list, and suggest two specific free times.
5. If the user mentions extreme conditions (water flooding, no heat in freezing temp, sparks), acknowledge the emergency immediately.
6. Set "readyToBook" to true ONLY when:
   - You have the Customer Name, Phone Number, issue, exact address, AND an available agreed time that is NOT BUSY.
   - The customer explicitly confirms the booking (e.g., "yes", "book it", "that time works", "ok").

Return ONLY valid JSON without markdown formatting or backticks:
{
  "reply": "<your natural conversational reply to the customer>",
  "extracted": {
    "name": "<string or null>",
    "phone": "<string or null>",
    "address": "<string or null>",
    "issue": "<string or null>",
    "preferredTime": "<e.g., 'Tomorrow at 10:00 AM' or null>",
    "isoStartTime": "<if you can determine a specific date and time, write it as YYYY-MM-DDTHH:mm:ss in the BUSINESS'S OWN LOCAL TIME shown above. Do NOT convert to UTC, do NOT add 'Z' or any timezone offset. Otherwise null>",
    "isEmergency": <true or false>
  },
  "readyToBook": <true or false>
}

Full conversation history:
${formattedHistory}
    `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    let parsedData;
    try {
        parsedData = JSON.parse(responseText);
    } catch (e) {
        return next(new ErrorHandler("AI response could not be parsed", 500));
    }

    // Booking SIRF tab trigger hogi jab sab fields mil chuke hain AUR is session
    // ke liye pehle se koi booking successful nahi ho chuki
    let bookingResult = null;
    let finalReply = parsedData.reply;

    if (parsedData.readyToBook === true && !session.booked) {
        console.log("🎉 All details locked! Attempting to create Google Calendar appointment...");
        bookingResult = await createEventFromAI(vendorId, parsedData.extracted);

        if (bookingResult) {
            session.booked = true; // SIRF successful booking par hi lock karo

            // SUPABASE DB SAVE — sirf tab, jab booking WAKAI successful hui ho
            if (parsedData.extracted.phone) {
                try {
                    let customerId;
                    const aiData = parsedData.extracted;

                    const { data: existingCustomer } = await supabase
                        .from('customers')
                        .select('id')
                        .eq('phone_number', aiData.phone)
                        .single();

                    if (existingCustomer) {
                        customerId = existingCustomer.id;
                        await supabase.from('customers').update({
                            issue_description: aiData.issue,
                            address: aiData.address
                        }).eq('id', customerId);
                    } else {
                        const { data: newCustomer, error: insertErr } = await supabase
                            .from('customers')
                            .insert([{
                                vendor_id: vendorId,
                                name: aiData.name || 'Unknown',
                                phone_number: aiData.phone,
                                address: aiData.address || 'Unknown',
                                issue_description: aiData.issue
                            }])
                            .select('id')
                            .single();

                        if (insertErr) throw insertErr;
                        customerId = newCustomer.id;
                    }

                    if (customerId) {
                        // Yahan wahi resolved time use ho rahi hai jo calendar event
                        // mein gayi — alag se dobara Date math nahi ho raha, isliye
                        // dono jagah (calendar + DB) exactly wahi time rahegi
                        await supabase.from('appointments').insert([{
                            customer_id: customerId,
                            slot_time: bookingResult.startTimeISO,
                            google_calendar_event_id: bookingResult.link,
                            status: 'Pending'
                        }]);
                        console.log("✅ Chatbot Lead Supabase mein Save ho gayi!");
                    }
                } catch (dbError) {
                    console.error("❌ Chatbot Supabase DB Error:", dbError);
                }
            }
        } else {
            // Booking fail hui (jaise slot abhi abhi kisi aur ne le liya) — Gemini
            // ka pehle se likha optimistic "confirmed" reply mat bhejo
            console.log("Booking failed (slot likely taken) — overriding reply");
            finalReply = "That time just got taken — what other time works for you?";
        }
    }

    session.messages.push({ role: "assistant", content: finalReply });

    res.status(200).json({
        success: true,
        data: { ...parsedData, reply: finalReply },
        calendarLink: bookingResult ? bookingResult.link : null
    });
});