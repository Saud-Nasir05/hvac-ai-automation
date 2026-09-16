import supabase from '../db/supabase.js';

// 1. Fetch 4 Core Dashboard Metrics
export const getDashboardStats = async (req, res) => {
    try {
        const { vendorId } = req.query; // Frontend se aayega: /api/dashboard/stats?vendorId=...

        if (!vendorId) {
            return res.status(400).json({ success: false, error: "Vendor ID is required" });
        }

        console.log(`📊 Fetching stats for Vendor: ${vendorId}`);

        // A. Total Leads (Customers table ka count)
        const { count: totalLeads, error: leadsError } = await supabase
            .from('customers')
            .select('*', { count: 'exact', head: true })
            .eq('vendor_id', vendorId);

        if (leadsError) throw leadsError;

        // B. Total Bookings (Appointments table ka count)
        const { count: totalBookings, error: bookingsError } = await supabase
            .from('appointments')
            .select('*', { count: 'exact', head: true })
            .eq('vendor_id', vendorId);

        if (bookingsError) throw bookingsError;

        // C. Math & Math Calculations
        const leadsCount = totalLeads || 0;
        const bookingsCount = totalBookings || 0;

        // Conversion Rate: (Booked ÷ Total Leads) * 100
        const conversionRate = leadsCount > 0 
            ? Math.round((bookingsCount / leadsCount) * 100) 
            : 0;

        // Revenue Recovered: Booked Jobs * $350 Avg US HVAC Ticket Size
        const AVG_JOB_VALUE = 350;
        const revenueRecovered = bookingsCount * AVG_JOB_VALUE;

        // D. Send Clean JSON to Frontend
        return res.status(200).json({
            success: true,
            stats: {
                totalLeads: leadsCount,
                totalBookings: bookingsCount,
                conversionRate: `${conversionRate}%`,
                revenueRecovered: `$${revenueRecovered.toLocaleString()}`
            }
        });

    } catch (error) {
        console.error("❌ Dashboard Stats Error:", error);
        return res.status(500).json({ success: false, error: "Failed to calculate dashboard statistics" });
    }
};

// 2. Fetch Leads List for the CRM Table
export const getVendorLeads = async (req, res) => {
    try {
        const { vendorId } = req.query;

        if (!vendorId) {
            return res.status(400).json({ success: false, error: "Vendor ID is required" });
        }

        console.log(`📋 Fetching CRM leads table for Vendor: ${vendorId}`);

        // A. Customers uthao (latest pehle)
        const { data: customers, error: customersError } = await supabase
            .from('customers')
            .select('*')
            .eq('vendor_id', vendorId)
            .order('created_at', { ascending: false });

        if (customersError) throw customersError;

        // B. Appointments uthao taake pata chale kis ne booking ki hai
        const { data: appointments, error: apptError } = await supabase
            .from('appointments')
            .select('customer_id, slot_time, status')
            .eq('vendor_id', vendorId);

        if (apptError) throw apptError;

        // C. Dono tables ko merge karo taake table me proper status dikhe
        const formattedLeads = customers.map((customer) => {
            // Check karo ke kya is customer ki koi appointment hai
            const matchedAppt = appointments.find(a => a.customer_id === customer.id);

            // Date format karo (e.g., "Jul 19, 2026")
            const dateObj = new Date(customer.created_at || Date.now());
            const formattedDate = dateObj.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });

            return {
                id: customer.id,
                name: customer.name || "Unknown Caller",
                phone: customer.phone_number || "No Phone",
                address: customer.address || "No Address Provided",
                issue: customer.issue_description || "General HVAC Inquiry",
                date: formattedDate,
                // Agar appointment mil gayi to 'booked', warna 'in_progress' ya 'abandoned'
                status: matchedAppt ? 'booked' : 'in_progress',
                channel: 'voice' // Default voice AI lead
            };
        });

        return res.status(200).json({
            success: true,
            leads: formattedLeads
        });

    } catch (error) {
        console.error("❌ Dashboard Leads Error:", error);
        return res.status(500).json({ success: false, error: "Failed to fetch vendor leads" });
    }
};