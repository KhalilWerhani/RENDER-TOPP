import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import File from '../models/File.js';
import DossierFermeture from '../models/DossierFermetureModel.js';
import Dossier from '../models/dossierModel.js';
import DossierModification from '../models/dossierModificationModel.js';

const router = express.Router();
router.post('/upload', upload.single('file'), async (req, res) => {
  const { userId, dossierId, typeDossier } = req.body;

  if (!userId || !dossierId || !typeDossier) {
    return res.status(400).json({ message: 'Données manquantes (userId, dossierId, typeDossier)' });
  }
console.log(userId , dossierId ,typeDossier)
  try {
    const file = new File({
      filename: req.file.originalname,
      url: req.file.path,
      public_id: req.file.filename,
      user: userId,
    });

    const savedFile = await file.save();

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
        return res.status(400).json({ message: 'Type de dossier invalide' });
    }

    await targetModel.findByIdAndUpdate(dossierId, {
      $push: { fichiers: savedFile._id }
    });

    res.status(200).json({
      success: true,
      message: 'Fichier uploadé et lié au dossier',
      file: savedFile,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'upload" });
  }
});

router.get('/', async (req, res) => {
  try {
    const files = await File.find().sort({ uploadedAt: -1 });
    res.json(files);
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

export default router;
