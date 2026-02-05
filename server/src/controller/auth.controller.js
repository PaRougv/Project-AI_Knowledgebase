import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function register(req, res) {
  const existing = await User.findOne({ email: req.body.email });
  if (existing) return res.status(409).json({ message: "User already exists" });

  const hashed = await bcrypt.hash(req.body.password, 10);
  const user = await User.create({ email: req.body.email, password: hashed });
  res.json({
    message: "Registered",
    token: jwt.sign({ id: user._id }, process.env.JWT_SECRET)
  });
}

export async function login(req, res) {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ message: "USER_NOT_FOUND" });

  const ok = await bcrypt.compare(req.body.password, user.password);
  if (!ok) return res.status(401).json({ message: "Invalid" });

  res.json({
    token: jwt.sign({ id: user._id }, process.env.JWT_SECRET)
  });
}
