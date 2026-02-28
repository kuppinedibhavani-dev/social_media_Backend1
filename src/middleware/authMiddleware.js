import jwt from "jsonwebtoken";
export const verifyToken = (req, res, next) => {
  try {
    // your logic
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.decode(token); // Supabase tokens are NOT signed with your secret

    if (!decoded || !decoded.sub) {
      return res.status(400).json({ message: "Invalid token payload" });
    }

    req.user = decoded.sub; // USER ID
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};