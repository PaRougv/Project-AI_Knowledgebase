import { embed } from "../services/embeddings.js";
import { retrieve } from "../services/retrieval.js";
import { answer } from "../services/llm.js";
import { answerCache } from "../config/cache.js";

export async function chat(req, res) {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ message: "Question is required" });
    }

    if (answerCache.has(question)) {
      return res.json(answerCache.get(question));
    }

    const qEmbedding = await embed(question);
    const chunks = await retrieve(qEmbedding);

    const context = chunks.map(c => c.text).join("\n");
    const answerText = context.trim()
      ? await answer(context, question)
      : "I don't know";

    const response = {
      answer: answerText,
      sources: chunks.map(c => c.source)
    };

    answerCache.set(question, response);
    res.json(response);
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ message: "Failed to generate answer" });
  }
}
