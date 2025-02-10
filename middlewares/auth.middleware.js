import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRouteWithCookies = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log(decoded);
    next();
  } catch (error) {
    res.status(401).json({ message: `Invalid token`, error });
  }
};

export const protectRouteWithToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  //   console.log(token);
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const exists = await User.findById(decoded.id);
    if (!exists) return res.status(404).json({ message: "User not found" });
    else {
      req.user = exists;
      next();
    }
  } catch (error) {
    res.status(401).json({ message: `Invalid token`, error });
  }
};
