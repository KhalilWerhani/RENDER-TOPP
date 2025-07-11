import express from 'express';
import multer from 'multer';
import userAuth from '../middleware/userAuth.js';
import {
  uploadDocument,
  getReceivedDocuments,
  getSentDocuments
} from '../controllers/documentController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // stockage local

// POST - Upload d’un document
router.post('/upload', userAuth, upload.single('fichier'), uploadDocument);

// GET - Documents reçus
router.get('/received', userAuth, getReceivedDocuments);

// GET - Documents envoyés
router.get('/sent', userAuth, getSentDocuments);

export default router;
