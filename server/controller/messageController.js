
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios'; 
import supabase from '../db/supabase.js'; 
import { checkFreeSlots, createEventFromAI } from './calendarController.js'; 
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const hvacTools = {
    functionDeclarations: [
        {
            name: "book_appointment",
            description: "Use this function ONLY when you have collected all required details: customer name, appointment date, preferred time, exact address, and issue description.",
            parameters: {
                type: "OBJECT",
                properties: {
                    name: { type: "STRING", description: "Customer's full name" },
                    date: { type: "STRING", description: "Appointment Date (e.g. YYYY-MM-DD or DD-Month-YYYY)" },
                    time: { type: "STRING", description: "Appointment Time (e.g. 10:00 AM or 02:00 PM)" },
                    issue: { type: "STRING", description: "The HVAC issue (e.g. AC leaking, blowing warm air)" },
                    address: { type: "STRING", description: "Customer's exact residential address" }
                },
                required: ["name", "date", "time", "issue", "address"]
            }
        }
    ]
};

const waSessions = new Map();

// 🔥 Meta Webhook Verification (GET Route)
export const verifyMetaWebhook = (req, res) => {
    const VERIFY_TOKEN = "HVAC_SECRET_TOKEN_123"; 

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

// 🔥 Customer Messages Handling & AI (POST Route)
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

//         console.log(`\n📩 WhatsApp Msg from \({cleanPhone}: "\){incomingMsg}"`);

//         const todayDate = new Date().toDateString();
//         const vendorId = "4c3d0f01-7bd2-4bcd-9130-3752cb68cf7e"; 

//         const calendarStatus = await checkFreeSlots(vendorId);

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
// 3. Collect missing details one by one (Name, Address, Issue, Preferred Time).
// 4. As soon as you have all 5 details locked and agreed upon, call the 'book_appointment' function immediately.`
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
//                         const { data: existingCustomer } = await supabase
//                             .from('customers')
//                             .select('id')
//                             .eq('phone_number', cleanPhone)
//                             .maybeSingle();

//                         if (existingCustomer) {
//                             customerId = existingCustomer.id;
//                             await supabase.from('customers').update({
//                                 issue_description: aiData.issue,
//                                 address: aiData.address
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
//                             const parsedDate = new Date(`\({aiData.date}\){aiData.time}`);
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
// 🔥 Customer Messages Handling & AI (POST Route)
export const handleWhatsAppMessage = async (req, res) => {
    try {
        const body = req.body;
        
        // Agar webhook event whatsapp ka nahi hai
        if (body.object !== 'whatsapp_business_account') {
            return res.sendStatus(404);
        }

        const entry = body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const messages = value?.messages;

        if (!messages || !messages[0]) {
            return res.sendStatus(200); 
        }

        const incomingMsg = messages[0].text.body;
        const senderNumber = messages[0].from; 
        const cleanPhone = senderNumber.trim();

        console.log(`\n📩 WhatsApp Msg from (${cleanPhone}): "${incomingMsg}"`);

        const todayDate = new Date().toDateString();
        const vendorId = "4c3d0f01-7bd2-4bcd-9130-3752cb68cf7e"; 

        const calendarStatus = await checkFreeSlots(vendorId);

        // 🔥 1. Check if returning customer
        const { data: existingCustomer } = await supabase
            .from('customers')
            .select('*')
            .eq('phone_number', cleanPhone)
            .maybeSingle();

        // 🔥 2. Smart Instructions Set Karo
        let smartInstructions = "";
        if (existingCustomer) {
            smartInstructions = `
CRITICAL RULE: This is a RETURNING customer. 
Their Name is: ${existingCustomer.name}
Their Address is: ${existingCustomer.address}
DO NOT ask for their name, phone number, or residential address again. Assume you already have them. 
Just ask what issue they are facing right now (if not provided), and confirm the appointment time.`;
        } else {
            smartInstructions = `Collect missing details one by one (Name, Address, Issue, Preferred Time).`;
        }

        // 🔥 3. AI Model Setup (Nayi Smart Instructions Ke Sath)
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
3. ${smartInstructions}
4. As soon as you have all details locked and agreed upon, call the 'book_appointment' function immediately.`
        });

        let chat;
        if (!waSessions.has(senderNumber)) {
            chat = model.startChat();
            waSessions.set(senderNumber, chat);
        } else {
            chat = waSessions.get(senderNumber);
        }

        let result = await chat.sendMessage(incomingMsg);
        let response = result.response;
        let aiReply = "";

        const functionCalls = response.functionCalls();
        
        if (functionCalls && functionCalls.length > 0) {
            const call = functionCalls[0];
            
            if (call.name === "book_appointment") {
                console.log("\n🚀 AI Triggered Tool: book_appointment");
                const aiData = call.args;

                aiData.phone = cleanPhone;
                aiData.preferredTime = aiData.time; 
                
                const eventLink = await createEventFromAI(vendorId, aiData);

                if (!eventLink) {
                    const functionResponseResult = await chat.sendMessage([{
                        functionResponse: {
                            name: "book_appointment",
                            response: { success: false, message: "That specific time slot was just taken. Apologize and ask the customer to pick another free time." }
                        }
                    }]);
                    aiReply = functionResponseResult.response.text();
                } else {
                    try {
                        let customerId;
                        const { data: dbCustomer } = await supabase
                            .from('customers')
                            .select('id')
                            .eq('phone_number', cleanPhone)
                            .maybeSingle();

                        if (dbCustomer) {
                            customerId = dbCustomer.id;
                            await supabase.from('customers').update({
                                issue_description: aiData.issue,
                                address: aiData.address // Updates address in case they provided a new one
                            }).eq('id', customerId);
                        } else {
                            const { data: newCustomer, error: custError } = await supabase
                                .from('customers')
                                .insert([{
                                    phone_number: cleanPhone,
                                    name: aiData.name,
                                    address: aiData.address,
                                    issue_description: aiData.issue,
                                    vendor_id: vendorId
                                }])
                                .select('id')
                                .single();
                                
                            if (custError) throw custError;
                            customerId = newCustomer.id;
                        }

                        let slotTimeISO;
                        try {
                            const parsedDate = new Date(`${aiData.date} ${aiData.time}`);
                            slotTimeISO = isNaN(parsedDate.getTime()) ? new Date().toISOString() : parsedDate.toISOString();
                        } catch (e) {
                            slotTimeISO = new Date().toISOString();
                        }

                        const { error: apptError } = await supabase
                            .from('appointments') 
                            .insert([{
                                customer_id: customerId,
                                vendor_id: vendorId,
                                slot_time: slotTimeISO,
                                google_calendar_event_id: eventLink,
                                status: 'Pending'
                            }]);

                        if (apptError) throw apptError;
                        console.log("✅ Supabase Customer & Appointment Records Saved!");

                    } catch (dbError) {
                        console.error("❌ Supabase Insertion Error:", dbError);
                    }

                    const functionResponseResult = await chat.sendMessage([{
                        functionResponse: {
                            name: "book_appointment",
                            response: { success: true, message: "Appointment successfully scheduled in Google Calendar and DB. Confirm warmly to the customer." }
                        }
                    }]);
                    aiReply = functionResponseResult.response.text();
                }
            }
        } else {
            aiReply = response.text();
        }

        console.log(`🤖 Alex (AI): ${aiReply}`);

        // 🔥 Meta API ke through Message bhejna
        try {
            await axios.post(
                `https://graph.facebook.com/v18.0/${process.env.META_WA_PHONE_ID}/messages`,
                {
                    messaging_product: 'whatsapp',
                    to: cleanPhone,
                    type: 'text',
                    text: { body: aiReply }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.META_WA_TOKEN}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log("✅ Message direct WhatsApp par deliver ho gaya!");
        } catch (metaErr) {
            console.error("❌ Meta Direct Send Error:", metaErr.response ? metaErr.response.data : metaErr.message);
        }

        res.sendStatus(200);

    } catch (error) {
        console.error("❌ WhatsApp Webhook Error:", error);
        res.status(500).send("Server Error");
    }
};