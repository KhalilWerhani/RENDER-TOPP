import express from 'express';
import { envoyerMessageContact } from '../controllers/contactController.js';

const router = express.Router();

router.post('/send', envoyerMessageContact);

export default router;
