import express from 'express';
import userAuth from '../middleware/userAuth.js';

import { createCheckoutSession , verifySession,getAllPaiements,getStripePayments , getPaiementsByUser} from '../controllers/paiementController.js';


import paiementModel from '../models/paiementModel.js';


const router = express.Router();

router.post('/create-checkout-session', userAuth, createCheckoutSession);



router.get('/verify-session/:sessionId', verifySession);

router.get('/admin', getAllPaiements);
router.get('/stripe-payments', getStripePayments);
router.get('/mes-paiements', userAuth, getPaiementsByUser);



// In your paymentRoutes.js or similar




export default router;
