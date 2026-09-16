
import { checkFreeSlots, createEventFromAI } from './calendarController.js';
import supabase from '../db/supabase.js'; 

// 1. Tool: Check Free Slots (Yeh bilkul theek tha)
export const voiceCheckSlots = async (req, res) => {
    try {
        console.log("\n==================================================");
        console.log("📞 [VAPI HIT] Action: CHECK FREE SLOTS");
        console.log("==================================================");

        const args = req.body.message?.toolCalls?.[0]?.function?.arguments || req.body;
        const vendorId = "4c3d0f01-7bd2-4bcd-9130-3752cb68cf7e"; 

        console.log(`🔍 Checking calendar slots for Vendor ID: ${vendorId}...`);
        const scheduleStatus = await checkFreeSlots(vendorId);
        console.log(`✅ Schedule Result: "${scheduleStatus}"`);

        res.status(200).json({
            success: true,
            message: scheduleStatus 
        });

    } catch (error) {
        console.error("❌ Voice Check Slots Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// 2. Tool: Book Appointment (🔥 FULLY FIXED & SECURED)
export const voiceBookAppointment = async (req, res) => {
    try {
        console.log("\n==================================================");
        console.log("📞 [VAPI HIT] Action: BOOK APPOINTMENT");
        console.log("==================================================");

        const args = req.body.message?.toolCalls?.[0]?.function?.arguments || req.body;
        const vendorId = "4c3d0f01-7bd2-4bcd-9130-3752cb68cf7e"; 

        // 🔥 SMART SPREAD: Vapi snake_case (start_time) bheje ya camelCase, sab aage jayega!
        const aiData = {
            ...args,
            issue: args.issue || "HVAC Service Call",
            address: args.address || "No Address Provided",
            name: args.name || "Customer",
            phone: args.phone || null,
            preferredTime: args.preferredTime || args.preferred_time || args.time || "12:00 PM",
            isEmergency: args.isEmergency || false
        };

        console.log("📝 Extracted Booking Data:", aiData);
        console.log(`🚀 Sending booking request to Google Calendar for Vendor: ${vendorId}...`);

        // 🔥 FIXED: Isay 'bookingResult' mein store karenge kyunke yeh ek Object hai!
        const bookingResult = await createEventFromAI(vendorId, aiData);

        if (bookingResult) {
            console.log(`✅ SUCCESS! Event created on Google Calendar: ${bookingResult.link}`);

            // 🔥 SUPABASE SAVE (Now Crash-Free!)
            if (aiData.phone) {
                try {
                    let customerId;

                    // 1. Check existing customer
                    const { data: existingCustomer, error: searchError } = await supabase
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
                        const { data: newCustomer, error: customerInsertError } = await supabase
                            .from('customers')
                            .insert([{ 
                                vendor_id: vendorId,
                                name: aiData.name, 
                                phone_number: aiData.phone,
                                address: aiData.address,
                                issue_description: aiData.issue
                            }])
                            .select('id')
                            .single();

                        if (customerInsertError) throw customerInsertError;
                        customerId = newCustomer.id;
                    }

                    // 2. Insert Appointment
                    if (customerId) {
                        const { error: appointmentError } = await supabase
                            .from('appointments')
                            .insert([{
                                customer_id: customerId,
                                vendor_id: vendorId,
                                // 🔥 CRITICAL FIX: Direct calendar wala ISO string use kiya, koi JS Date math nahi!
                                slot_time: bookingResult.startTimeISO, 
                                google_calendar_event_id: bookingResult.link, // 🔥 Exact URL link dala
                                status: 'Pending'
                            }]);

                        if (appointmentError) throw appointmentError;
                        console.log("✅ Voice Lead aur Appointment successfully Supabase mein save ho gaye!");
                    }
                } catch (dbError) {
                    console.error("❌ Voice Supabase DB Error:", dbError);
                }
            }

            res.status(200).json({
                success: true,
                message: `Appointment successfully booked for ${aiData.name} on ${aiData.preferredTime} at ${aiData.address}. Do not ask to confirm again. Politely end the call.`,
                link: bookingResult.link
            });
        } else {
            console.log("⚠️ FAILED! Slot might be occupied or calendar rejected the insertion.");
            res.status(400).json({
                success: false,
                message: "Failed to book. That slot is already occupied. Please ask the customer for another time."
            });
        }

    } catch (error) {
        console.error("❌ Voice Booking Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};