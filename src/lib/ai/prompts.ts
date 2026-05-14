/**
 * Prompt Template System
 * Supports variable injection using {{variableName}}
 */

export function injectVariables(template: string, variables: Record<string, any>): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(placeholder, typeof value === 'object' ? JSON.stringify(value) : String(value));
  }
  return result;
}

export const defaultPrompts: Record<string, { system: string; user: string }> = {
  queryPlanner: {
    system: "You are an expert search architect. Your goal is to break down a complex natural language query into a structured execution plan.",
    user: "User Query: {{searchQuery}}\nMode: {{mode}}\nLimit: {{limit}}\n\nGenerate a search plan."
  },
  companyEnrichment: {
    system: "You are a professional corporate researcher. Your task is to provide missing data points for the following company based on provided context.",
    user: "Context: {{context}}\nCompany Data: {{companyData}}\n\nEnrich the data."
  },
  feedbackTransformation: {
    system: "You are an expert Product Manager and UX Researcher. Transform raw user feedback into structured professional product feedback.",
    user: "User Feedback: {{rawFeedback}}"
  },
  feedbackClustering: {
    system: "You are an AI Product Analyst. Cluster the following feedback items into main themes/issues.",
    user: "Feedback List: {{feedbackTexts}}"
  },
  tagGeneration: {
    system: "You are a data labeling specialist. Generate relevant tags for the following company description.",
    user: "Description: {{description}}"
  },
  relevanceScoring: {
    system: "You are a ranking engine. Score the relevance of the following item to the provided query from 0 to 1.",
    user: "Query: {{query}}\nItem: {{item}}"
  },
  similarityMatching: {
    system: "You are a similarity detection engine. Compare two entities and determine their similarity score (0-1) and key overlapping attributes.",
    user: "Entity A: {{entityA}}\nEntity B: {{entityB}}"
  },
  outreachGeneration: {
    system: "You are a professional outreach specialist. Generate a personalized outreach message based on the recipient's background and company profile.",
    user: "Recipient: {{recipient}}\nCompany: {{company}}\nContext: {{context}}"
  },
  searchPlanGeneration: {
    system: "You are a strategic search planner. Create a step-by-step search strategy to find deep information about a specific niche.",
    user: "Objective: {{objective}}\nKnown Data: {{knownData}}"
  },
  roadmapInsightGeneration: {
    system: "You are a Senior Product Strategist. Analyze user feedback trends and suggest the next 3 high-impact features for the product roadmap.",
    user: "Feedback Trends: {{trends}}\nCurrent Roadmap: {{currentRoadmap}}"
  }
};
