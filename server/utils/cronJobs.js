// import cron from 'node-cron';
// import axios from 'axios';
// import { DateTime } from 'luxon';
// import supabase from '../db/supabase.js'; 
// import { checkFreeSlots } from '../controller/calendarController.js'; 
// import dotenv from 'dotenv';
// dotenv.config();

// const getCareTips = (issue = "") => {
//     const lowerIssue = issue.toLowerCase();
//     if (lowerIssue.includes("water") || lowerIssue.includes("leak")) {
//         return "💡 *AC Care Tip:* Please check your drain pipe monthly for dust clogs to prevent water leakage in the future.";
//     } else if (lowerIssue.includes("cool") || lowerIssue.includes("warm") || lowerIssue.includes("gas")) {
//         return "💡 *AC Care Tip:* Keep your air filters clean every 2 weeks. Clean filters save 15% electricity and give ice-cold air!";
//     } else {
//         return "💡 *AC Care Tip:* Always run your AC on Auto-fan mode and get the outdoor condenser coil washed every season.";
//     }
// };

// const getThreeFreeSlots = (busyScheduleString = "") => {
//     const defaultHours = ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM", "06:00 PM"];
//     const freeSlots = defaultHours.filter(time => !busyScheduleString.includes(time.slice(0, 2)));
//     return freeSlots.slice(0, 3).join(", ") || "09:00 AM, 11:30 AM, 03:00 PM";
// };

// const sendWhatsAppMsg = async (toNumber, message) => {
//     try {
//         let cleanNumber = toNumber.replace(/[^0-9]/g, ''); 
        
//         // 🔥 NAYA FIX: Agar number '0' se shuru ho raha hai, toh usay '92' mein convert kar do
//         if (cleanNumber.startsWith('0')) {
//             cleanNumber = '92' + cleanNumber.substring(1);
//         }
        
//         await axios.post(
//             `https://graph.facebook.com/v18.0/${process.env.META_WA_PHONE_ID}/messages`,
//             {
//                 messaging_product: 'whatsapp',
//                 to: cleanNumber,
//                 type: 'text',
//                 text: { body: message }
//             },
//             {
//                 headers: {
//                     'Authorization': `Bearer ${process.env.META_WA_TOKEN}`,
//                     'Content-Type': 'application/json'
//                 }
//             }
//         );
//         console.log(`✅ Message sent successfully to ${cleanNumber}`);
//     } catch (error) {
//         console.error("❌ Meta Send Error:", error.response ? error.response.data : error.message);
//     }
// };

// export const startCronJobs = () => {
//     cron.schedule('* * * * *', async () => {
//         console.log("\n⏰ [CRON JOB] Checking appointments for Review & Maintenance...");

//         try {
//             const { data: appointments, error } = await supabase
//                 .from('appointments')
//                 .select(`
//                     id,
//                     created_at,
//                     slot_time,
//                     vendor_id,
//                     review_sent,
//                     maintenance_sent,
//                     customers ( name, phone_number, issue_description )
//                 `);

//             if (error) throw error;

//             const now = DateTime.now().setZone('Asia/Karachi');

//             for (const appt of appointments) {
//                 if (!appt.customers?.phone_number) continue;

//                 const createdDate = DateTime.fromISO(appt.created_at || appt.slot_time).setZone('Asia/Karachi');
//                 const diffMinutes = Math.floor(now.diff(createdDate, 'minutes').minutes);

//                 const phone = appt.customers.phone_number;
//                 const name = appt.customers.name || "Valued Customer";
//                 const issue = appt.customers.issue_description || "AC HVAC Service";
//                 const careTip = getCareTips(issue);

//                 if (diffMinutes >= 1 && !appt.review_sent) {
//                     console.log(`💬 Sending Customized Review Ask to \({name} for issue: "\){issue}"`);
                    
//                    const reviewMsg = `Hello  🛠️\n\nOur technician recently resolved your HVAC issue . We hope everything is working perfectly now!\n\n${careTip}\n\n🌟 *Did you like our service?* Please reply with a 5-STAR rating (⭐⭐⭐⭐⭐) or tell us how we can improve. Your feedback means the world to us!`;
//                     await sendWhatsAppMsg(phone, reviewMsg);
//                     await supabase.from('appointments').update({ review_sent: true }).eq('id', appt.id);
//                 }

//                 else if (diffMinutes >= 2 && appt.review_sent && !appt.maintenance_sent) {
//                     console.log(`🛠️ Fetching Live Calendar Slots & Sending 1-Month Inspection Offer to ${name}...`);
                    
//                     const scheduleStatus = await checkFreeSlots(appt.vendor_id || "4c3d0f01-7bd2-4bcd-9130-3752cb68cf7e");
//                     const threeSlots = getThreeFreeSlots(scheduleStatus);
                    
// const maintenanceMsg = `Hi It feels like a month has already passed since we fixed your AC! Regular maintenance checks can save you up to 50% on major repair costs and keep your cooling bills low.\n\n📅 *We checked our technician's live availability for tomorrow and have these FREE slots:* \n👉 *[ ${threeSlots} ]*\n\nWould you like me to lock in a routine inspection slot for you right now? Just reply with your preferred time (e.g. *"Book 11:30 AM"*) or call us anytime!`
                    
//                     await sendWhatsAppMsg(phone, maintenanceMsg);
//                     await supabase.from('appointments').update({ maintenance_sent: true }).eq('id', appt.id);
//                 }
//             }
//             console.log("✅ Cron Cycle Complete!");

//         } catch (error) {
//             console.error("❌ Cron Job Error:", error);
//         }
//     });
// };








// import cron from 'node-cron';
// import axios from 'axios';
// import { DateTime } from 'luxon';
// import supabase from '../db/supabase.js';
// import { checkFreeSlots } from '../controller/calendarController.js';
// import dotenv from 'dotenv';
// dotenv.config();

// const getCareTips = (issue = "") => {
//     const lowerIssue = issue.toLowerCase();
//     if (lowerIssue.includes("water") || lowerIssue.includes("leak")) {
//         return "💡 *AC Care Tip:* Please check your drain pipe monthly for dust clogs to prevent water leakage in the future.";
//     } else if (lowerIssue.includes("cool") || lowerIssue.includes("warm") || lowerIssue.includes("gas")) {
//         return "💡 *AC Care Tip:* Keep your air filters clean every 2 weeks. Clean filters save 15% electricity and give ice-cold air!";
//     } else {
//         return "💡 *AC Care Tip:* Always run your AC on Auto-fan mode and get the outdoor condenser coil washed every season.";
//     }
// };

// // Ab ARRAY return karta hai (pending_offers mein save karne ke liye), message mein .join(', ') hota hai
// const getThreeFreeSlots = (busyScheduleString = "") => {
//     const defaultHours = ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM", "06:00 PM"];
//     const freeSlots = defaultHours.filter(time => !busyScheduleString.includes(time.slice(0, 2)));
//     const picked = freeSlots.slice(0, 3);
//     return picked.length ? picked : ["09:00 AM", "11:30 AM", "03:00 PM"];
// };

// // Success pe normalized number return karta hai, fail pe null.
// // Taake review_sent / maintenance_sent sirf tab true ho jab Meta ne message accept kiya ho.
// const sendWhatsAppMsg = async (toNumber, message) => {
//     try {
//         let cleanNumber = toNumber.replace(/[^0-9]/g, '');

//         // Agar number '0' se shuru ho raha hai, toh usay '92' mein convert kar do
//         if (cleanNumber.startsWith('0')) {
//             cleanNumber = '92' + cleanNumber.substring(1);
//         }

//         const r = await axios.post(
//             `https://graph.facebook.com/v18.0/${process.env.META_WA_PHONE_ID}/messages`,
//             {
//                 messaging_product: 'whatsapp',
//                 to: cleanNumber,
//                 type: 'text',
//                 text: { body: message }
//             },
//             {
//                 headers: {
//                     'Authorization': `Bearer ${process.env.META_WA_TOKEN}`,
//                     'Content-Type': 'application/json'
//                 }
//             }
//         );
//         console.log(`✅ Meta accepted message for ${cleanNumber}, id: ${r.data?.messages?.[0]?.id}`);
//         return cleanNumber;
//     } catch (error) {
//         console.error("❌ Meta Send Error:", error.response ? JSON.stringify(error.response.data) : error.message);
//         return null;
//     }
// };

// export const startCronJobs = () => {
//     cron.schedule('* * * * *', async () => {
//         console.log("\n⏰ [CRON JOB] Checking appointments for Review & Maintenance...");

//         try {
//             const { data: appointments, error } = await supabase
//                 .from('appointments')
//                 .select(`
//                     id,
//                     created_at,
//                     slot_time,
//                     vendor_id,
//                     review_sent,
//                     maintenance_sent,
//                     customers ( name, phone_number, issue_description )
//                 `);

//             if (error) throw error;

//             const now = DateTime.now().setZone('Asia/Karachi');

//             for (const appt of appointments) {
//                 if (!appt.customers?.phone_number) continue;

//                 const createdDate = DateTime.fromISO(appt.created_at || appt.slot_time).setZone('Asia/Karachi');
//                 const diffMinutes = Math.floor(now.diff(createdDate, 'minutes').minutes);

//                 const phone = appt.customers.phone_number;
//                 const name = appt.customers.name || "Valued Customer";
//                 const issue = appt.customers.issue_description || "AC HVAC Service";
//                 const careTip = getCareTips(issue);

//                 // NOTE: 1 aur 2 minute testing ke liye hain. Production mein review ke liye
//                 // ~1 din (1440) aur maintenance ke liye ~30 din (43200) rakhna.
//                 if (diffMinutes >= 1 && !appt.review_sent) {
//                     console.log(`💬 Sending Customized Review Ask to ${name} for issue: "${issue}"`);

//                     const reviewMsg = `Hello ${name} 🛠️\n\nOur technician recently resolved your HVAC issue regarding: *"${issue}"*. We hope everything is working perfectly now!\n\n${careTip}\n\n🌟 *Did you like our service?* Please reply with a 5-STAR rating (⭐⭐⭐⭐⭐) or tell us how we can improve. Your feedback means the world to us!`;

//                     const sentTo = await sendWhatsAppMsg(phone, reviewMsg);
//                     if (sentTo) {
//                         await supabase.from('appointments').update({ review_sent: true }).eq('id', appt.id);
//                     }
//                 }

//                 else if (diffMinutes >= 2 && appt.review_sent && !appt.maintenance_sent) {
//                     console.log(`🛠️ Fetching Live Calendar Slots & Sending 1-Month Inspection Offer to ${name}...`);

//                     const scheduleStatus = await checkFreeSlots(appt.vendor_id || "4c3d0f01-7bd2-4bcd-9130-3752cb68cf7e");
//                     const slots = getThreeFreeSlots(scheduleStatus);
//                     const offerDate = now.plus({ days: 1 }).toISODate(); // 'YYYY-MM-DD', Karachi ke hisaab se "tomorrow"

//                     const maintenanceMsg = `Hi ${name}! It feels like a month has already passed since we fixed your AC! Regular maintenance checks can save you up to 50% on major repair costs and keep your cooling bills low.\n\n📅 *We checked our technician's live availability for tomorrow and have these FREE slots:* \n👉 *[ ${slots.join(', ')} ]*\n\nWould you like me to lock in a routine inspection slot for you right now? Just reply with your preferred time (e.g. *"Book 11:30 AM"*) or call us anytime!`;

//                     const sentTo = await sendWhatsAppMsg(phone, maintenanceMsg);

//                     if (sentTo) {
//                         // Isi record se webhook handler samajhta hai ke customer ka reply is offer ka jawab hai
//                         const { error: offerErr } = await supabase.from('pending_offers').insert({
//                             phone_number: sentTo,
//                             offer_date: offerDate,
//                             slots,
//                             status: 'open'
//                         });
//                         if (offerErr) console.error("❌ pending_offers insert error:", offerErr);

//                         await supabase.from('appointments').update({ maintenance_sent: true }).eq('id', appt.id);
//                     }
//                 }
//             }
//             console.log("✅ Cron Cycle Complete!");

//         } catch (error) {
//             console.error("❌ Cron Job Error:", error);
//         }
//     });
// };




import cron from 'node-cron';
import axios from 'axios';
import { DateTime } from 'luxon';
import supabase from '../db/supabase.js';
import { checkFreeSlots } from '../controller/calendarController.js';
import dotenv from 'dotenv';
dotenv.config();

const getCareTips = (issue = "") => {
    const lowerIssue = issue.toLowerCase();
    if (lowerIssue.includes("water") || lowerIssue.includes("leak")) {
        return "💡 *AC Care Tip:* Please check your drain pipe monthly for dust clogs to prevent water leakage in the future.";
    } else if (lowerIssue.includes("cool") || lowerIssue.includes("warm") || lowerIssue.includes("gas")) {
        return "💡 *AC Care Tip:* Keep your air filters clean every 2 weeks. Clean filters save 15% electricity and give ice-cold air!";
    } else {
        return "💡 *AC Care Tip:* Always run your AC on Auto-fan mode and get the outdoor condenser coil washed every season.";
    }
};

// ARRAY return karta hai, message mein .join(', ') hota hai
const getThreeFreeSlots = (busyScheduleString = "") => {
    const defaultHours = ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM", "06:00 PM"];
    const freeSlots = defaultHours.filter(time => !busyScheduleString.includes(time.slice(0, 2)));
    const picked = freeSlots.slice(0, 3);
    return picked.length ? picked : ["09:00 AM", "11:30 AM", "03:00 PM"];
};

// Success pe normalized number return karta hai, fail pe null.
// Taake review_sent / maintenance_sent sirf tab true ho jab Meta ne message accept kiya ho.
const sendWhatsAppMsg = async (toNumber, message) => {
    try {
        let cleanNumber = toNumber.replace(/[^0-9]/g, '');

        // Agar number '0' se shuru ho raha hai, toh usay '92' mein convert kar do
        if (cleanNumber.startsWith('0')) {
            cleanNumber = '92' + cleanNumber.substring(1);
        }

        const r = await axios.post(
            `https://graph.facebook.com/v18.0/${process.env.META_WA_PHONE_ID}/messages`,
            {
                messaging_product: 'whatsapp',
                to: cleanNumber,
                type: 'text',
                text: { body: message }
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.META_WA_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log(`✅ Meta accepted message for ${cleanNumber}, id: ${r.data?.messages?.[0]?.id}`);
        return cleanNumber;
    } catch (error) {
        console.error("❌ Meta Send Error:", error.response ? JSON.stringify(error.response.data) : error.message);
        return null;
    }
};

export const startCronJobs = () => {
    cron.schedule('* * * * *', async () => {
        console.log("\n⏰ [CRON JOB] Checking appointments for Review & Maintenance...");

        try {
            const { data: appointments, error } = await supabase
                .from('appointments')
                .select(`
                    id,
                    created_at,
                    slot_time,
                    vendor_id,
                    review_sent,
                    maintenance_sent,
                    customers ( name, phone_number, issue_description )
                `);

            if (error) throw error;

            const now = DateTime.now().setZone('Asia/Karachi');

            for (const appt of appointments) {
                if (!appt.customers?.phone_number) continue;

                const createdDate = DateTime.fromISO(appt.created_at || appt.slot_time).setZone('Asia/Karachi');
                const diffMinutes = Math.floor(now.diff(createdDate, 'minutes').minutes);

                const phone = appt.customers.phone_number;
                const name = appt.customers.name || "Valued Customer";
                const issue = appt.customers.issue_description || "AC HVAC Service";
                const careTip = getCareTips(issue);

                // NOTE: 1 aur 2 minute testing ke liye hain. Production mein review ke liye
                // ~1 din (1440) aur maintenance ke liye ~30 din (43200) rakhna.
                if (diffMinutes >= 1 && !appt.review_sent) {
                    console.log(`💬 Sending Customized Review Ask to ${name} for issue: "${issue}"`);

                    const reviewMsg = `Hello ${name} 🛠️\n\nOur technician recently resolved your HVAC issue regarding: *"${issue}"*. We hope everything is working perfectly now!\n\n${careTip}\n\n🌟 *Did you like our service?* Please reply with a 5-STAR rating (⭐⭐⭐⭐⭐) or tell us how we can improve. Your feedback means the world to us!`;

                    const sentTo = await sendWhatsAppMsg(phone, reviewMsg);
                    if (sentTo) {
                        await supabase.from('appointments').update({ review_sent: true }).eq('id', appt.id);
                    }
                }

                else if (diffMinutes >= 2 && appt.review_sent && !appt.maintenance_sent) {
                    console.log(`🛠️ Fetching Live Calendar Slots & Sending 1-Month Inspection Offer to ${name}...`);

                    const scheduleStatus = await checkFreeSlots(appt.vendor_id || "4c3d0f01-7bd2-4bcd-9130-3752cb68cf7e");
                    const slots = getThreeFreeSlots(scheduleStatus);

                    const maintenanceMsg = `Hi ${name}! It feels like a month has already passed since we fixed your AC! Regular maintenance checks can save you up to 50% on major repair costs and keep your cooling bills low.\n\n📅 *We checked our technician's live availability for tomorrow and have these FREE slots:* \n👉 *[ ${slots.join(', ')} ]*\n\nWould you like me to lock in a routine inspection slot for you right now? Just reply with your preferred time (e.g. *"Book 11:30 AM"*) or call us anytime!`;

                    const sentTo = await sendWhatsAppMsg(phone, maintenanceMsg);

                    if (sentTo) {
                        // Webhook handler isi flag se samajhta hai ke customer ka reply maintenance offer ka jawab hai
                        await supabase.from('appointments').update({ maintenance_sent: true }).eq('id', appt.id);
                    }
                }
            }
            console.log("✅ Cron Cycle Complete!");

        } catch (error) {
            console.error("❌ Cron Job Error:", error);
        }
    });
};