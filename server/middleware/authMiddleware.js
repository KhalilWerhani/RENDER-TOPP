// Example authMiddleware.js
import jwt from "jsonwebtoken";

// authMiddleware.js
const protect = async (req, res, next) => {
  try {
    console.log("Cookies:", req.cookies); // Check if cookies are received
    console.log("Headers:", req.headers); // Check auth headers
    
    // Your existing auth logic...
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    
    console.log("Authenticated user:", req.user); // Debug user object
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ message: "Not authorized" });
  }
};

export default protect;