import express from "express";
import { getDossiersAttribues , getAllDossiersBO,getDashboardStats } from "../controllers/boController.js";
import userAuth, {  verifyBO} from "../middleware/userAuth.js";

const router = express.Router();

router.get("/dossiers-attribues", userAuth, verifyBO, getDossiersAttribues);
// Dashboard global
router.get('/dossiers',userAuth, verifyBO, getAllDossiersBO);
//statistique pour le dashbord  // In your routes file (e.g., boRoutes.js)

router.get('/dashboard', userAuth, verifyBO, getDashboardStats);



// Changer le statut
//router.put('/dossiers/:id/statut', verifyBO, updateStatutDossierBO);

// Prise en charge
//router.put('/dossiers/:id/assign',userAuth, verifyBO, assignerDossierBO);

// Ajouter pièce jointe
//router.post('/dossiers/:id/piece',userAuth, verifyBO, uploadPieceBO);

// Générer facture PDF
//router.get('/dossiers/:id/facture',userAuth, verifyBO, genererFacturePDF);

export default router;
