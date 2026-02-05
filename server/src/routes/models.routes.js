import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "GEMINI_API_KEY is missing" });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        message: "Failed to list models",
        details: data
      });
    }

    const models = (data.models || []).map((m) => ({
      name: m.name,
      supportedGenerationMethods: m.supportedGenerationMethods || []
    }));

    res.json({ models });
  } catch (error) {
    console.error("List models error:", error);
    res.status(500).json({ message: "Failed to list models" });
  }
});

export default router;
