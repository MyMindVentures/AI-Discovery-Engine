import { getOpenAI } from "./client";

export async function generateEmbedding(text: string) {
  const openai = getOpenAI();
  if (!openai) return null;

  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    return {
      embedding: response.data[0].embedding,
      usage: {
        totalTokens: response.usage.total_tokens
      }
    };
  } catch (error) {
    console.error("Embedding Error:", error);
    return null;
  }
}
