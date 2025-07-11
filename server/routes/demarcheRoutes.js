// routes/demarcheRoutes.js
import express from 'express';
import {
  saveProgress,
  getProgress,
  getAllProgressByUser,
  completeProgress,
  resetProgress,
} from '../controllers/demarcheProgressController.js';

const router = express.Router();

// Sauvegarder ou mettre à jour une progression
router.post('/progress/save', saveProgress);



// Récupérer toutes les démarches en cours pour un utilisateur
router.get('/progress/user/:userId', getAllProgressByUser);

// Récupérer la progression d’une démarche spécifique
router.get('/progress/:userId/:typeDemarche', getProgress);

// Marquer une démarche comme terminée
router.post('/progress/complete', completeProgress);

router.post('/progress/reset', resetProgress);


export default router;
