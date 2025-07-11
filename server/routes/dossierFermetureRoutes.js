import express from "express";
import { 
  submitDossierFermeture,
  getDossierFermetureById,
 // ajouterPiecesFermeture,
  updateFermetureStatus
} from "../controllers/DossierFermetureController.js";
//import { uploadMultiple } from '../middleware/multer3Config.js';
import { uploadFermetureDocument } from '../controllers/uploadController.js';
import { addDocumentToFermeture } from "../controllers/DossierFermetureController.js"; 
import upload from '../middleware/multerConfig.js';


const router = express.Router();

router.post("/submit", submitDossierFermeture);
router.get('/:id', getDossierFermetureById);
// In your fermeture router file
//router.post('/upload-documents/:id', uploadMultiple, ajouterPiecesFermeture);
router.put('/:id/update-status', updateFermetureStatus);
router.post(
  '/upload-documents/:id', 
  upload.single('file'),
  uploadFermetureDocument,  // Changed from .array() to .single()
  addDocumentToFermeture
);


export default router;