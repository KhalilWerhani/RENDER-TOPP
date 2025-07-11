// routes/ModificationRoutes.js
import express from 'express';
import {
  submitChangementActivite,
  submitChangementPresident,
  submitChangementDenomination,
  submitTransfertSiege,
  submitTransformationSarlSas,
  submitTransformationSasSarl,
 // ajouterPiecesModification,
} from '../controllers/ModificationController.js';
import DossierModification from '../models/dossierModificationModel.js';
//import { getDossierModificationById } from '../controllers/ModificationController.js';
import { getModificationDossierById } from '../controllers/ModificationController.js';
import { uploadModificationDocument } from '../controllers/uploadController.js';
import { addDocumentToModification } from '../controllers/ModificationController.js';
import upload from '../middleware/multerConfig.js';
//import { uploadMultiple } from '../middleware/multer2Config.js';



const router = express.Router();

router.post('/activite/submit', submitChangementActivite);
router.post('/president/submit', submitChangementPresident);
router.post('/changement-denomination', submitChangementDenomination);
router.post('/transfert-siege/submit', submitTransfertSiege);
router.post('/transformation-sarl-sas/submit', submitTransformationSarlSas);
router.post('/transformation-sas-sarl/submit', submitTransformationSasSarl);
//router.get('/dossier/:id', getDossierModificationById);
router.get('/dossier/:id', getModificationDossierById);
//router.post('/upload-documents/:id', uploadMultiple, ajouterPiecesModification);
router.post('/upload-document-modification', 
  upload.single('file'), 
  uploadModificationDocument,
  addDocumentToModification
);


router.get('/modifications/:id', async (req, res) => {
  try {
    const modification = await DossierModification.findById(req.params.id)
      .populate('user', 'name email')           // récupère name et email du client
      .populate('boAffecte', 'name email')
      .populate('fichiers' ,  'filename url');
         // récupère name et email du BO
    if (!modification) return res.status(404).json({ message: "Modification non trouvée" });
    res.status(200).json(modification);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.put('/:id/update-status', async (req, res) => {
  try {
    const modification = await DossierModification.findById(req.params.id);
    if (!modification) return res.status(404).json({ message: "Modification introuvable." });

    if (req.body.etatAvancement) {
      modification.etatAvancement = req.body.etatAvancement;
    }
    if (req.body.statut) {
      modification.statut = req.body.statut;
    }

    await modification.save();

    res.status(200).json({
      message: "Statut de modification mis à jour",
      modification: {
        _id: modification._id,
        statut: modification.statut,
        etatAvancement: modification.etatAvancement
      }
    });
  } catch (err) {
    console.error("Erreur mise à jour statut modification :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


export default router;
