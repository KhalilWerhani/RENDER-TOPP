import express from 'express';
import { getDashboardStats } from '../controllers/adminStatsController.js';
import { verifyAdmin } from '../middleware/userAuth.js';

const adminStatsRouter  = express.Router();

// Protect all admin routes


// Dashboard statistics
adminStatsRouter .get('/stats' ,getDashboardStats);

export default adminStatsRouter ;