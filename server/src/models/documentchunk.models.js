import mongoose from "mongoose";

export default mongoose.model(
  "DocumentChunk",
  new mongoose.Schema({
    text: String,
    embedding: [Number],
    source: String
  })
);
