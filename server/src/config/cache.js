import NodeCache from "node-cache";

export const embeddingCache = new NodeCache({ stdTTL: 3600 });
export const answerCache = new NodeCache({ stdTTL: 600 });
