import express from "express";
import multer from "multer";
import auth from "../middleware/auth.js";
import {
  uploadDocument,
  seedDocuments,
  listSources
} from "../controller/document.controller.js";

const router = express.Router();

// File upload config
const upload = multer({ dest: "uploads/" });

// Upload document (protected)
router.post("/upload", auth, upload.single("file"), uploadDocument);

// Seed mock documents (protected)
router.post("/seed", auth, seedDocuments);

// List available sources (protected)
router.get("/sources", auth, listSources);

export default router;
