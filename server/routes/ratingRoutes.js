import express from "express";
import { submitRating, getRatings , getUserRating } from "../controllers/ratingController.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

// POST /api/feedback/rating
router.post("/rating", userAuth, submitRating);

// GET /api/feedback/rating
router.get("/ratingall", userAuth, getRatings);

router.get("/user-rating/:userId", userAuth, getUserRating);


export default router;
