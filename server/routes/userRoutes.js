// routes/testRoutes.js
import express from 'express';
import { getHome, testDbConnection } from '../controller/userController.js';
import { register, login, logout ,getMyProfile } from '../controller/userController.js';
import { isAuth } from '../middlewares/authMiddleware.js';
const router = express.Router();

// Root route
router.get('/', getHome);

// Test DB route
router.get('/test-db', testDbConnection);
    
// Auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', isAuth, getMyProfile);
export default router;