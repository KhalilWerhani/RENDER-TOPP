import express from "express";
import Stripe from 'stripe';
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from './config/mongodb.js';
import path from "path";
import multer from 'multer';
import http from 'http'; // 👈 pour socket.io
import { Server } from 'socket.io';
// Routes
import authRouter from './routes/authRoutes.js';
import userRouter from "./routes/userRoutes.js";
import adminRoutes from './routes/adminRoutes.js';
import entrepriseRoutes from './routes/entrepriseRoutes.js';
import dossierRouter from "./routes/dossierRoutes.js";
import paiementRoutes from './routes/paiementRoutes.js';
//import uploadRoutes from './routes/uploadRoutes.js';
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
import dotenv from 'dotenv';

//import datadocumentRoutes from "./routes/datadocumentRoutes.js"

// Initialize app first
// App setup
const app = express();
dotenv.config();
const server = http.createServer(app); // Pour socket.io
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const port = process.env.PORT || 4005;

// Middleware
app.use('/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL, // Add your production frontend URL
  'https://localhost:5173.onrender.com' // Your actual frontend URL
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
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


// API routes first
// ... all your existing API routes ...

// Then static files
app.use('/uploads', express.static('uploads'));

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
  });
}

// Routes API
app.get('/', (req, res) => res.send("API Working"));
app.use('/uploads', express.static('public/uploading'));

/*app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')), uploadRoutes);
app.use('/upload', express.static(path.join(process.cwd(), 'public', 'upload')), uploadRoutes);  //workingfine
app.use('/api/upload', express.static(path.join(process.cwd(), 'public', 'upload')) ,uploadRoutes); */
//app.use("/api/documents", datadocumentRoutes);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/stats', adminStatsRouter);
app.use('/api/entreprise', entrepriseRoutes);
app.use('/api/dossiers/modifications', modificationRoutes);
app.use('/api/dossiers/fermetures', fermetureRoutes);
app.use('/api/dossier', dossierRouter);
app.use('/api/dossiers', dossierRouter);
app.use('/api/notifications', notificationRoutes);
app.use('/api', dossierRouter);
app.use('/api', modificationRoutes);
app.use('/api', fermetureRoutes);
app.use("/api/feedback", ratingRoutes);
app.use('/api/paiement', paiementRoutes);
app.use('/api/bo', boRoutes);
app.use('/api/statistiques', statistiquesRoutes);
app.use('/api/gerer', statistiquesRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/paiement', paiementRoutes);
app.use("/api/bo", boRoutes);
app.use("/api/statistiques", statistiquesRoutes);
app.use("/api/gerer", statistiquesRoutes);
app.use('/api/modification', modificationRoutes);
app.use('/api/dossiers/fermetures', fermetureRoutes);
app.use('/api/fermeture', fermetureRoutes);
app.use('/api', fermetureRoutes);
app.use('/api', demarcheRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/contact',contactRoutes)
app.use('/api/leads', leadRoutes); 
app.use('/api/files', fileRoutes);


app.get("/api/socket/status/:userId", (req, res) => {
  const userId = req.params.userId;
  const isOnline = connectedUsers.has(userId);
  res.json({ online: isOnline });
});

// Socket.IO - Messagerie en temps réel
const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log("✅ Socket connecté :", socket.id);

  socket.on("register", (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log(`🔗 Utilisateur ${userId} enregistré`);
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
    console.log("❌ Déconnexion socket :", socket.id);
  });
});

// Connexion base de données
connectDB();

// Lancement serveur
server.listen(port, () => console.log(`🚀 Server started on PORT: ${port}`));

export { io,connectedUsers  };
