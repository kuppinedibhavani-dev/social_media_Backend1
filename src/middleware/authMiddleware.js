import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Not authorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED TOKEN = ", decoded);
    console.log("REQ.USER SET AS = ", decoded.id);

    req.user = decoded.id;  // MUST BE ONLY UUID

    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Token failed" });
  }
};