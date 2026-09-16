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
// CORS Configuration for Local & Vercel Production
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL // Agar custom domain hua toh yahan aayega
];

app.use(cors({
  origin: function (origin, callback) {
    // Postman ya server-to-server requests ke liye jahan origin nahi hota
    if (!origin) return callback(null, true);
    
    // Agar request localhost se ho ya kisi bhi vercel.app domain se ho
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,             // 👈 IMPORTANT: Cookie / Token exchange ke liye
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