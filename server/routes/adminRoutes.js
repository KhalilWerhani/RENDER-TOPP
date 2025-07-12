import express from 'express';
import { 
  createBO, 
  getAllBO,
  getBOById, 
  deleteBO,
  getAdminStats,
  updateBO,
  updateBOPassword,
  assignDossierToBO,
  getProjetsByClient,
  // New imports for dossier management
  getCombinedDossiers,
  updateDossier,
  
  updateModification,
  updateFermeture,
  
} from '../controllers/adminController.js';
import { getAllDossiers, getDossierById, getDossiersByBO, searchDossiers } from "../controllers/adminKanbanController.js";
import userAuth, { verifyAdmin } from '../middleware/userAuth.js';

const adminRouter = express.Router();

// Existing routes remain the same...
adminRouter.get('/dashboard', userAuth, verifyAdmin, (req, res) => {
  res.json({
    success: true,
    message: `Bienvenue sur le tableau de bord admin, ${req.user.id}`
  });
});
adminRouter.post('/create-bo', userAuth, verifyAdmin, createBO);
adminRouter.get('/liste-bo', userAuth, getAllBO);
adminRouter.get('/liste-bo/:id', userAuth, getBOById);
adminRouter.delete('/delete-bo/:id', userAuth, verifyAdmin, deleteBO);
adminRouter.get("/stats", userAuth, getAdminStats);
adminRouter.put("/update-bo/:id", userAuth, verifyAdmin, updateBO);
adminRouter.put("/update-bo-password/:id", userAuth, verifyAdmin, updateBOPassword);
adminRouter.get('/search', searchDossiers);
adminRouter.get("/kanban", getAllDossiers);
adminRouter.get("/dossier/:id", getDossierById);
adminRouter.put("/assign-dossier", userAuth, verifyAdmin, assignDossierToBO);
adminRouter.get("/dossiers/:clientId", userAuth, verifyAdmin, getProjetsByClient);
adminRouter.get("/dossiers/bo/:boId", userAuth, verifyAdmin, getDossiersByBO);

// New routes for dossier management
adminRouter.get("/combined-dossiers", userAuth, verifyAdmin, getCombinedDossiers);
adminRouter.put("/dossiers/:id/update-status", userAuth, verifyAdmin, updateDossier);
adminRouter.put("/modification/:id/update-status", userAuth, verifyAdmin, updateModification);
adminRouter.put("/fermeture/:id/update-status", userAuth, verifyAdmin, updateFermeture);
adminRouter.put("/dossiers/:id", userAuth, verifyAdmin, updateDossier);
adminRouter.put("/modifications/:id", userAuth, verifyAdmin, updateModification);
adminRouter.put("/fermetures/:id", userAuth, verifyAdmin, updateFermeture);


export default adminRouter;