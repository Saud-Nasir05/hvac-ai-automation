  // server.js
  import 'dotenv/config';
  import dashboardRoutes from './routes/dashboardRoutes.js';
  import express from 'express';
  import cors from 'cors';
  import userRoutes from './routes/userRoutes.js'; // Humara naya route file import ho raha hai
  import aiRoutes from './routes/aiRoutes.js';
  import calendarRoutes from './routes/calendarRoutes.js';
  import cookieParser from 'cookie-parser';
  import voiceRoutes from './routes/voiceRoutes.js';
  import { startCronJobs } from './utils/cronJobs.js';
  const app = express();
  app.use(cookieParser());
  // Middleware
  app.use(cors({
  origin: 'http://localhost:5173', // 👈 Aap ke React Vite app ka exact URL (trailing slash ke bina)
  credentials: true,               // 👈 IMPORTANT: Yeh true hoga tabhi JWT cookies exchange hongi!
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
  app.use(express.json());
app.use(express.urlencoded({ extended: true }));
  // Routes Mount Karna
  app.use('/api/v1/user', userRoutes); 
  app.use('/api/v1/ai', aiRoutes);
  app.use('/api/v1/calendar', calendarRoutes);
  app.use('/api/v1/voice', voiceRoutes);
  app.use('/api/v1/dashboard', dashboardRoutes);
  startCronJobs();
console.log("⏰ Automated Cron Jobs initialized.");
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });