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
router.post('/save', saveProgress);



// Récupérer toutes les démarches en cours pour un utilisateur
router.get('/user/:userId', getAllProgressByUser);

// Récupérer la progression d’une démarche spécifique
router.get('/:userId/:typeDemarche', getProgress);

// Marquer une démarche comme terminée
router.post('/complete', completeProgress);

router.post('/reset', resetProgress);


export default router;
