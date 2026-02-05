import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import DocumentChunk from "../models/documentchunk.models.js";
import { chunkText } from "../utils/chuncktext.js";
import { embed } from "../services/embeddings.js";

// Needed because ES modules don't have __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function ingestText(text, source) {
  const chunks = chunkText(text);
  if (chunks.length === 0) return 0;

  for (const chunk of chunks) {
    const embedding = await embed(chunk);
    await DocumentChunk.create({
      text: chunk,
      embedding,
      source
    });
  }

  return chunks.length;
}

export async function uploadDocument(req, res) {
  try {
    // multer puts file info on req.file
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Read file content
    const filePath = path.join(__dirname, "../../uploads", req.file.filename);
    const rawText = fs.readFileSync(filePath, "utf-8");

    // Replace any existing chunks from the same source
    await DocumentChunk.deleteMany({ source: req.file.originalname });

    // Split into chunks and store with embeddings
    const chunksStored = await ingestText(rawText, req.file.originalname);

    // Optional: delete file after processing
    fs.unlinkSync(filePath);

    res.json({
      message: "Document uploaded and indexed successfully",
      chunksStored
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Document processing failed" });
  }
}

export async function seedDocuments(req, res) {
  try {
    const dataDir = path.join(__dirname, "../data/mock_docs");
    if (!fs.existsSync(dataDir)) {
      return res.status(500).json({ message: "Seed data folder missing" });
    }

    const files = fs.readdirSync(dataDir).filter((f) => f.endsWith(".txt"));
    if (files.length === 0) {
      return res.status(400).json({ message: "No seed documents found" });
    }

    let totalChunks = 0;
    for (const file of files) {
      const fullPath = path.join(dataDir, file);
      const rawText = fs.readFileSync(fullPath, "utf-8");

      await DocumentChunk.deleteMany({ source: file });
      totalChunks += await ingestText(rawText, file);
    }

    res.json({
      message: "Seed documents indexed successfully",
      documents: files.length,
      chunksStored: totalChunks
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Seed indexing failed" });
  }
}

export async function listSources(req, res) {
  try {
    const sources = await DocumentChunk.distinct("source");
    res.json({ sources });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load sources" });
  }
}
