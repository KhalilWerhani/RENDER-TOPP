import express from "express";
import Stripe from 'stripe';
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from './config/mongodb.js';
import path from "path";
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

// Import routes
import authRouter from './routes/authRoutes.js';
import userRouter from "./routes/userRoutes.js";
import adminRoutes from './routes/adminRoutes.js';
import entrepriseRoutes from './routes/entrepriseRoutes.js';
import dossierRouter from "./routes/dossierRoutes.js";
import paiementRoutes from './routes/paiementRoutes.js';
import statistiquesRoutes from "./routes/statistiques.js";
import modificationRoutes from './routes/ModificationRoutes.js';
import fermetureRoutes from './routes/dossierFermetureRoutes.js';
import boRoutes from "./routes/boRoutes.js";
import demarcheRoutes from './routes/demarcheRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import appointmentsRoutes from './routes/appointmentsRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';
import adminStatsRouter from "./routes/adminStatsRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import leadRoutes from './routes/leadRoutes.js';

// Initialize app
const app = express();
dotenv.config();

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
  'https://render-top-juridiquea.onrender.com',
  '*'
];

// Middleware setup
app.use('/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Socket.io setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const port = process.env.PORT || 4005;

// API routes
app.get('/', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    // In production, redirect to the frontend's homepage
    res.redirect('/home');
  } else {
    // In development, you might want to keep the API message or redirect
    res.send("API Working - Redirect to homepage in production");
  }
});
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/stats', adminStatsRouter);
app.use('/api/entreprise', entrepriseRoutes);
app.use('/api/modification', modificationRoutes);
app.use('/api/fermeture', fermetureRoutes);
app.use('/api/dossier', dossierRouter);
app.use('/api/dossiers', dossierRouter);
app.use('/api/notifications', notificationRoutes);
app.use("/api/feedback", ratingRoutes);
app.use('/api/paiement', paiementRoutes);
app.use('/api/bo', boRoutes);
app.use('/api/statistiques', statistiquesRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/progress', demarcheRoutes)

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(process.cwd(), 'client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'client/dist', 'index.html'));
  });
}

// Request logger
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Socket.IO setup
const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  socket.on("register", (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log(`🔗 User ${userId} registered`);
  });

  socket.on("sendMessage", ({ senderId, receiverId, content }) => {
    const receiverSocketId = connectedUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", {
        senderId,
        content,
        timestamp: new Date()
      });
    }
  });

  socket.on("disconnect", () => {
    for (let [key, value] of connectedUsers.entries()) {
      if (value === socket.id) {
        connectedUsers.delete(key);
        break;
      }
    }
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// Database connection and server start
connectDB()
  .then(() => {
    server.listen(port, () => {
      console.log(`🚀 Server started on PORT: ${port}`);
      console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
    });
  })
  .catch(err => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });

export { io, connectedUsers };