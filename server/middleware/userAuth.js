import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.json({ success: false, message: "Not Authorized, Login Again" });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode.id) {
       req.body.userId = tokenDecode.id; // ← utile pour les POST
      req.userId = tokenDecode.id;  
      req.user = {
        id: tokenDecode.id,
        role: tokenDecode.role 
      };
      next();
    } else {
      return res.json({ success: false, message: "Not Authorized, Login Again" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
export const verifyAdmin = (req, res, next) => {
  if (req.user?.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Accès réservé à l'admin" });
  }
};

export const verifyBO = (req, res, next) => {
  if (req.user?.role === "BO") {
    next();
  } else {
    res.status(403).json({ message: "Accès réservé au BO" });
  }
};


export default userAuth;