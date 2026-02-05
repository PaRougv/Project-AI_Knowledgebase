import DocumentChunk from "../models/documentchunk.models.js";

function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] ** 2;
    nb += b[i] ** 2;
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export async function retrieve(queryEmbedding, k = 3) {
  const docs = await DocumentChunk.find();
  return docs
    .map(d => ({ ...d._doc, score: cosine(queryEmbedding, d.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
