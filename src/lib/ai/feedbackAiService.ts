import { GoogleGenAI, Type } from "@google/genai";

export interface StructuredFeedback {
  aiTitle: string;
  aiSummary: string;
  aiCategory: string;
  aiPriority: string;
  aiTags: string[];
  aiSuggestedAction: string;
  aiFeatureArea: string;
  aiSentiment: string;
  aiComplexityEstimate: string;
  aiRoadmapFit: string;
  aiReproductionHints: string;
  aiUserIntent: string;
}

export const feedbackAiService = {
  async transformFeedback(rawFeedback: string): Promise<StructuredFeedback | null> {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are an expert Product Manager and UX Researcher.
Transform the following raw user feedback into a structured professional product feedback format.

User Feedback: "${rawFeedback}"

Rules:
- Category should be one of: Bug, Feature Request, UX Improvement, Performance, General Praise, Other.
- Priority should be: Critical, High, Medium, Low.
- Sentiment should be: Frustrated, Neutral, Positive, Excited.
- Roadmap Fit should be: Strategic, Tactical, Nice to Have, Out of Scope.
- Keep it professional but retain the original raw intent.

Return a JSON object matching the requested schema.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              aiTitle: { type: Type.STRING },
              aiSummary: { type: Type.STRING },
              aiCategory: { type: Type.STRING },
              aiPriority: { type: Type.STRING },
              aiTags: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              aiSuggestedAction: { type: Type.STRING },
              aiFeatureArea: { type: Type.STRING },
              aiSentiment: { type: Type.STRING },
              aiComplexityEstimate: { type: Type.STRING, description: "e.g. Simple, Medium, Complex" },
              aiRoadmapFit: { type: Type.STRING },
              aiReproductionHints: { type: Type.STRING },
              aiUserIntent: { type: Type.STRING }
            },
            required: ["aiTitle", "aiSummary", "aiCategory", "aiPriority", "aiTags"]
          }
        }
      });

      if (response && response.text) {
        return JSON.parse(response.text) as StructuredFeedback;
      }
    } catch (error) {
      console.error("Gemini Feedback Error:", error);
    }
    return null;
  }
};
