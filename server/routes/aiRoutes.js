// routes/aiRoutes.js
import express from 'express';
import { qualifyLead } from '../controller/aiController.js';

// 🔥 Dono functions import karein (GET verify ke liye, aur POST messages ke liye)
import { verifyMetaWebhook, handleWhatsAppMessage } from '../controller/messageController.js'; 

const router = express.Router();

// Pehle se mojood route (Website Lead Qualification ke liye)
// Route banega: POST http://localhost:5000/api/v1/ai/qualify
router.post('/qualify', qualifyLead);

// 🔥 Naya Meta WhatsApp Webhook Routes
// Route banega: GET & POST http://localhost:5000/api/v1/ai/whatsapp-webhook

// 1. GET Route (Sirf Meta ki verification ke liye)
router.get('/whatsapp-webhook', verifyMetaWebhook);

// 2. POST Route (Jab customer WhatsApp par message bhejega)
router.post('/whatsapp-webhook', handleWhatsAppMessage);

export default router;