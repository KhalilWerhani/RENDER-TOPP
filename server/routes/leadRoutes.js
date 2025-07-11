// routes/leadRoutes.js
import express from "express";
import { getAllLeads, recevoirLead } from "../controllers/leadController.js";

const router = express.Router();
router.post("/", recevoirLead);
router.get("/all", getAllLeads);
export default router;
