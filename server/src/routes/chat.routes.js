import express from "express";
import auth from "../middleware/auth.js";
import { chat } from "../controller/chat.controller.js";

const router = express.Router();

// Ask a question (protected)
router.post("/", auth, chat);

export default router;
