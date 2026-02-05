import mongoose from "mongoose";

export default mongoose.model(
  "User",
  new mongoose.Schema({
    email: { type: String, unique: true },
    password: String
  })
);
