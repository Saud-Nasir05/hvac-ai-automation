// routes/voiceRoutes.js
import express from 'express';
import { voiceCheckSlots, voiceBookAppointment } from '../controller/voiceController.js';

const router = express.Router();

// Voice AI in URLs par POST request marega
router.post('/check-slots', voiceCheckSlots);
router.post('/book-appointment', voiceBookAppointment);

export default router;