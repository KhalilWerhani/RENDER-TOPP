import Rating from "../models/Rating.js";

// controllers/ratingController.js
// In your ratingController.js
export const submitRating = async (req, res) => {
  try {
    const { value, userId } = req.body; // or 'rating' if you changed the schema
    
    // Check if user already rated
    const existingRating = await Rating.findOne({ user: userId });
    if (existingRating) {
      return res.status(400).json({ 
        success: false,
        message: "User has already submitted a rating",
        existingRating
      });
    }
    
    // Create new rating
    const newRating = new Rating({
      user: userId,
      rating: value // or 'rating' if you changed the schema
    });
    
    await newRating.save();
    
    res.status(201).json({ 
      success: true,
      message: "Rating submitted successfully"
    });
    
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getRatings = async (req, res) => {
  try {
    const ratings = await Rating.find().populate("user", "name email");
    res.status(200).json({ success: true, ratings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// controllers/ratingController.js
export const getUserRating = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user has already rated
    const existingRating = await Rating.findOne({ user: userId });
    
    if (existingRating) {
      return res.status(200).json({
        rating: {
          value: existingRating.rating,
          createdAt: existingRating.createdAt
        }
      });
    }
    
    return res.status(200).json({ rating: null });
    
  } catch (error) {
    console.error("Error fetching user rating:", error);
    res.status(500).json({ message: "Server error" });
  }
};
