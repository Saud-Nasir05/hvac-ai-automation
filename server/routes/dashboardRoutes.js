import express from 'express';
// Controller se dono functions import kar rahe hain
import { getDashboardStats, getVendorLeads } from '../controller/dashboardController.js'; 

const router = express.Router();

// Route 1: Top 4 Stats (Revenue Recovered, Total Leads, etc.) ke liye
// End Point: GET http://localhost:5000/api/v1/dashboard/stats?vendorId=...
router.get('/stats', getDashboardStats);

// Route 2: CRM Table me saari leads aur appointments dikhane ke liye
// End Point: GET http://localhost:5000/api/v1/dashboard/leads?vendorId=...
router.get('/leads', getVendorLeads);

export default router;