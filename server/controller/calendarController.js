

import { google } from 'googleapis';
import { DateTime } from 'luxon';
import dotenv from 'dotenv';
import supabase from '../db/supabase.js';
dotenv.config();
 
// Business ka actual local timezone — San Antonio, TX. Server jahan bhi chale
// (Pakistan ho ya kahin aur), calendar math hamesha isi zone mein hona chahiye,
// server ke apne local clock ke hisaab se nahi.
const BUSINESS_TIMEZONE = 'Asia/Karachi';
 
// Google API client setup
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:5000/api/v1/calendar/google/callback'
);
 
// 1. Vendor ko Google Login page par bhejne wala URL
export const getAuthUrl = (req, res) => {
    const userId = req.query.userId;
    const scopes = ['https://www.googleapis.com/auth/calendar'];
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: scopes,
        state: userId
    });
    res.status(200).json({ url });
};
 
// 2. Callback jahan Google token wapas bhejega
export const googleCallback = async (req, res) => {
    try {
        const { code, state } = req.query;
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        console.log("Google Tokens Mil Gaye:", tokens);
 
        const { data, error } = await supabase
            .from('vendors')
            .update({
                google_refresh_token: tokens.refresh_token,
                is_calendar_connected: true
            })
            .eq('id', state);
 
        if (error) throw error;
        console.log("Token database mein successfully save ho gaya user:", state);
        res.redirect('http://localhost:5173/dashboard?calendar=success');
    } catch (error) {
        console.error("Google Auth Error:", error);
        res.redirect('http://localhost:5173/dashboard?calendar=failed');
    }
};
 
// Helper function: Vendor ka Google OAuth Client prepare karna
const getVendorCalendarClient = async (userId) => {
    const { data: vendor, error } = await supabase
        .from('vendors')
        .select('google_refresh_token')
        .eq('id', userId)
        .single();
 
    if (error || !vendor || !vendor.google_refresh_token) return null;
    oauth2Client.setCredentials({ refresh_token: vendor.google_refresh_token });
    return google.calendar({ version: 'v3', auth: oauth2Client });
};
 
// 3. Purana Test Event Function
export const createTestEvent = async (req, res) => {
    try {
        const { userId } = req.body;
        const calendar = await getVendorCalendarClient(userId);
        if (!calendar) {
            return res.status(400).json({ success: false, message: "Vendor ka token database mein nahi mila!" });
        }
 
        const start = DateTime.now().setZone(BUSINESS_TIMEZONE).plus({ hours: 24 });
        const end = start.plus({ hours: 1 });
 
        const event = {
            summary: 'HVAC Repair Test Booking',
            description: 'Yeh ek test appointment hai jo hamare naye system ne automatically create ki hai!',
            start: {
                dateTime: start.toUTC().toISO(),
                timeZone: BUSINESS_TIMEZONE,
            },
            end: {
                dateTime: end.toUTC().toISO(),
                timeZone: BUSINESS_TIMEZONE,
            },
        };
 
        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
        });
 
        res.status(200).json({
            success: true,
            message: "Mubarak ho! Event successfully create ho gaya.",
            link: response.data.htmlLink
        });
    } catch (error) {
        console.error("Event Create Error:", error);
        res.status(500).json({ success: false, message: "Calendar par event create nahi ho saka." });
    }
};
 
// 4. Vendor ke Free Slots check karna (AI use karega) — ab BUSINESS_TIMEZONE mein
export const checkFreeSlots = async (userId) => {
    try {
        const calendar = await getVendorCalendarClient(userId);
        if (!calendar) return "Working hours: 9:00 AM to 6:00 PM.";
 
        // "Kal" ka poora din BUSINESS ke local timezone mein — server ke apne
        // system clock timezone mein nahi (yehi asal bug tha pehle)
        const tomorrowStart = DateTime.now().setZone(BUSINESS_TIMEZONE).plus({ days: 1 }).startOf('day');
        const tomorrowEnd = tomorrowStart.endOf('day');
 
        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: tomorrowStart.toUTC().toISO(),
            timeMax: tomorrowEnd.toUTC().toISO(),
            singleEvents: true,
            orderBy: 'startTime',
            timeZone: BUSINESS_TIMEZONE
        });
 
       // console.log("📅 Google Calendar API Response Items:", response.data.items);
 
        const events = response.data.items || [];
        if (events.length === 0) {
            return "Tomorrow is COMPLETELY FREE between 9:00 AM and 6:00 PM. Morning (9 AM - 12 PM) and Afternoon (1 PM - 6 PM) slots are fully open.";
        }
 
        // Busy slots ko BUSINESS timezone mein hi format karo, taake AI aur
        // customer dono ko sahi (Texas) waqt dikhe, Karachi time nahi
        const busySlots = events.map(event => {
            const start = DateTime.fromISO(event.start.dateTime || event.start.date).setZone(BUSINESS_TIMEZONE);
            const end = DateTime.fromISO(event.end.dateTime || event.end.date).setZone(BUSINESS_TIMEZONE);
            return `${start.toFormat('h:mm a')} to ${end.toFormat('h:mm a')}`;
        });
 
        return `Tomorrow's ALREADY BOOKED & BUSY SLOTS: [ ${busySlots.join(', ')} ]. DO NOT OFFER OR BOOK THESE TIMES! Our working hours are 9:00 AM to 6:00 PM. Only offer free slots outside these busy periods.`;
    } catch (error) {
        console.error("Error checking free slots:", error);
        return "Working hours: 9:00 AM to 6:00 PM.";
    }
};
 
// 5. Event Create karne se pehle STRICT OVERLAP CHECK — ab BUSINESS_TIMEZONE mein
// 5. Event Create karne se pehle STRICT OVERLAP CHECK — ab BUSINESS_TIMEZONE mein
export const createEventFromAI = async (userId, aiData) => {
    try {
        const calendar = await getVendorCalendarClient(userId);
        if (!calendar) return null;

        // 🔥 DEBUG LOG: Pata chalega AI ne variable ka exact naam kya bheja hai!
        console.log("🤖 AI se Aaya Payload:", JSON.stringify(aiData, null, 2));

        // Default: kal dopeher 12 baje
        let startDT = DateTime.now().setZone(BUSINESS_TIMEZONE).plus({ days: 1 })
            .set({ hour: 12, minute: 0, second: 0, millisecond: 0 });

        // 🔥 SMART CHECK: AI snake_case bheje ya camelCase, sab catch karega!
        const rawTime = aiData.isoStartTime || aiData.start_time || aiData.startTime || aiData.time;
        const rawPreferred = aiData.preferredTime || aiData.preferred_time || aiData.preferred;

        if (rawTime) {
            // ISO string se UTC marker (Z ya +00:00) hata kar direct Chicago time par lock karo
            const naiveDatePart = rawTime.replace(/(Z|[+-]\d{2}:?\d{2})$/, '');
            const parsed = DateTime.fromISO(naiveDatePart, { zone: BUSINESS_TIMEZONE });
            if (parsed.isValid) {
                startDT = parsed;
                console.log("✅ Successfully parsed ISO Time:", startDT.toFormat('yyyy-MM-dd h:mm a'));
            }
        } else if (rawPreferred) {
            // "2 PM", "2:00 PM", ya "14:00" jaise strings ko handle karne ke liye
            const match = rawPreferred.match(/(\d+)(?::(\d+))?\s*(AM|PM|am|pm)?/i);
            if (match) {
                let hours = parseInt(match[1]);
                const minutes = match[2] ? parseInt(match[2]) : 0;
                const ampm = match[3] ? match[3].toUpperCase() : null;

                if (ampm === 'PM' && hours < 12) hours += 12;
                if (ampm === 'AM' && hours === 12) hours = 0;

                startDT = startDT.set({ hour: hours, minute: minutes, second: 0, millisecond: 0 });
                console.log("✅ Successfully parsed Preferred Time:", startDT.toFormat('yyyy-MM-dd h:mm a'));
            }
        }

        const endDT = startDT.plus({ hours: 1 });

        // STRICT CHECK: kya is time par pehle se koi event hai?
        const overlapCheck = await calendar.events.list({
            calendarId: 'primary',
            timeMin: startDT.toUTC().toISO(),
            timeMax: endDT.toUTC().toISO(),
            singleEvents: true,
            timeZone: BUSINESS_TIMEZONE
        });

        if (overlapCheck.data.items && overlapCheck.data.items.length > 0) {
            console.log("🚨 STOPPED DOUBLE BOOKING! Slot already occupied in Google Calendar.");
            return null;
        }

        const event = {
            summary: `HVAC Repair: ${aiData.issue || 'Service Call'} | ${aiData.address || 'Address N/A'}`,
            description: `Customer Name: ${aiData.name || 'N/A'}\nPhone: ${aiData.phone || 'N/A'}\nAddress: ${aiData.address || 'N/A'}\nEmergency: ${aiData.isEmergency ? 'YES 🚨' : 'No'}\nTime Requested: ${rawPreferred || rawTime || '12:00 PM'}`,
            start: {
                dateTime: startDT.toUTC().toISO(),
                timeZone: BUSINESS_TIMEZONE,
            },
            end: {
                dateTime: endDT.toUTC().toISO(),
                timeZone: BUSINESS_TIMEZONE,
            },
        };

        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
        });

        console.log("✅ Actual Calendar Event Created:", response.data.htmlLink);
        return { link: response.data.htmlLink, startTimeISO: startDT.toUTC().toISO() };
    } catch (err) {
        console.error("Auto Event Create Error:", err);
        return null;
    }
};
 