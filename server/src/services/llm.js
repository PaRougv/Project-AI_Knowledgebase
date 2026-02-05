import genAI from "../config/gemini.js";

export async function answer(context, question) {
  const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  const model = genAI.getGenerativeModel({
    model: modelName
  });

  const prompt = `
Answer ONLY using the context below.
If not found, say "I don't know".

Context:
${context}

Question:
${question}
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
 }
