import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import Document from '../models/Document.js';
import DossierFermeture from '../models/DossierFermetureModel.js';
import Dossier from '../models/dossierModel.js';
import DossierModification from '../models/dossierModificationModel.js';

const router = express.Router();

// Upload document for BO/Admin
router.post('/upload', upload.single('file'), async (req, res) => {
  const { userId, dossierId, typeDossier, destinataireId } = req.body;

  if (!userId || !dossierId || !typeDossier || !destinataireId) {
    return res.status(400).json({ 
      message: 'Missing data (userId, dossierId, typeDossier, destinataireId)' 
    });
  }

  try {
    // Create new document
    const document = new Document({
      titre: req.file.originalname,
      fichier: req.file.path,
      public_id: req.file.filename,
      uploader: userId,
      destinataire: destinataireId,
      roleUploader: 'admin', // or 'collaborateur' depending on who's uploading
      roleDestinataire: 'client',
      statut: 'valide', // BO documents are automatically validated
      dossier: dossierId,
      dossierModel: typeDossier === 'standard' ? 'Dossier' : 
                   typeDossier === 'modification' ? 'DossierModification' : 'DossierFermeture'
    });

    const savedDocument = await document.save();

    // Update the corresponding dossier
    let targetModel;
    switch (typeDossier) {
      case 'standard':
        targetModel = Dossier;
        break;
      case 'fermeture':
        targetModel = DossierFermeture;
        break;
      case 'modification':
        targetModel = DossierModification;
        break;
      default:
        return res.status(400).json({ message: 'Invalid dossier type' });
    }

    await targetModel.findByIdAndUpdate(dossierId, {
      $push: { fichiersbo: savedDocument._id }
    });

    res.status(200).json({
      success: true,
      message: 'Document uploaded and linked to dossier',
      document: savedDocument,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: "Error during upload",
      error: error.message 
    });
  }
});

// Get all BO documents
router.get('/', async (req, res) => {
  try {
    const documents = await Document.find({
      roleUploader: { $in: ['admin', 'collaborateur'] }
    }).sort({ createdAt: -1 })
      .populate('uploader destinataire', 'name email');
      
    res.json(documents);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

export default router;