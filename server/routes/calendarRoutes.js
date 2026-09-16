import express from 'express';
import { getAuthUrl, googleCallback } from '../controller/calendarController.js';
import { createTestEvent } from '../controller/calendarController.js';
const router = express.Router();

// Get the Google Auth URL
router.get('/google/auth', getAuthUrl);

// Google callback URL (yeh hamesha wahi hoga jo console mein diya tha)
router.get('/google/callback', googleCallback);
router.post('/create-test-event', createTestEvent);
export default router;