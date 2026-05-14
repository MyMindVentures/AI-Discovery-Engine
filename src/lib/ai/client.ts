import OpenAI from "openai";

let openaiClient: OpenAI | null = null;

export function getOpenAI() {
  if (openaiClient) return openaiClient;
  
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  
  openaiClient = new OpenAI({ apiKey });
  return openaiClient;
}

export async function callAI(options: {
  systemPrompt: string;
  userPrompt: string;
  jsonMode?: boolean;
}) {
  const openai = getOpenAI();
  
  if (openai) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Efficient and high quality for these tasks
        messages: [
          { role: "system", content: options.systemPrompt },
          { role: "user", content: options.userPrompt }
        ],
        response_format: options.jsonMode ? { type: "json_object" } : undefined,
      });
      
      const content = response.choices[0].message.content;
      return {
        content,
        usage: {
          promptTokens: response.usage?.prompt_tokens,
          completionTokens: response.usage?.completion_tokens,
          totalTokens: response.usage?.total_tokens
        }
      };
    } catch (error) {
      console.error("OpenAI Error:", error);
    }
  }

  // Fallback to deterministic/mock if no OpenAI or if it fails
  return null;
}
