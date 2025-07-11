import express from 'express';
import { createEntreprise , getAllEntreprises } from '../controllers/entrepriseController.js';
import userAuth from '../middleware/userAuth.js';
import { searchEntreprise } from '../controllers/entrepriseController.js';

const router = express.Router();

// Route protégée
router.post('/', userAuth, createEntreprise);
router.get('/', getAllEntreprises);
router.get('/rechercher', searchEntreprise);




export default router;
