import genAI from "../config/gemini.js";

export async function embed(text) {
  const modelName = process.env.GEMINI_EMBEDDING_MODEL || "text-embedding-004";
  const model = genAI.getGenerativeModel({ model: modelName });

  const result = await model.embedContent(text);
  return result.embedding.values;
}
