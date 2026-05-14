import { prisma } from "../db";
import { injectVariables, defaultPrompts } from "./prompts";
import { getOpenAI } from "./client";
import { GoogleGenAI, Type } from "@google/genai";
import Ajv from "ajv";

const ajv = new Ajv();

interface ExecutionOptions {
  variables: Record<string, any>;
  userId?: string;
  orgId?: string;
}

export const aiFunctionService = {
  /**
   * Loads config from DB or returns defaults
   */
  async getConfig(key: string) {
    const config = await prisma.aiFunctionConfig.findUnique({
      where: { key }
    });

    if (config && config.enabled) {
      return config;
    }

    // Default configurations if not in DB
    const defaults = (defaultPrompts as any)[key];
    if (!defaults) throw new Error(`Unknown AI function: ${key}`);

    return {
      id: "default",
      key,
      name: key.replace(/([A-Z])/g, ' $1').trim(),
      provider: "gemini",
      model: "gemini-3.1-flash-lite",
      temperature: 0.7,
      maxTokens: 2048,
      systemPrompt: defaults.system,
      userPromptTemplate: defaults.user,
      outputSchema: {},
      confidenceThreshold: 0.8,
      retryCount: 3,
      fallbackMode: "none",
      enabled: true
    };
  },

  /**
   * Executes an AI function with dynamic config
   */
  async run(key: string, options: ExecutionOptions) {
    const startTime = Date.now();
    const config = await aiFunctionService.getConfig(key);
    
    const systemPrompt = injectVariables(config.systemPrompt || "", options.variables);
    const userPrompt = injectVariables(config.userPromptTemplate || "", options.variables);

    let result: any = null;
    let tokensUsed = 0;
    let status = "success";
    let error: string | null = null;
    let attempts = 0;
    const maxAttempts = (config.retryCount || 0) + 1;

    while (attempts < maxAttempts) {
      attempts++;
      try {
        if (config.provider === "gemini") {
          const apiKey = process.env.GEMINI_API_KEY || "";
          const ai = new GoogleGenAI({ apiKey });
          
          const response = await ai.models.generateContent({
            model: config.model || "gemini-3.1-flash-lite",
            contents: userPrompt,
            config: {
              systemInstruction: systemPrompt,
              temperature: config.temperature,
              maxOutputTokens: config.maxTokens,
              responseMimeType: "application/json",
            }
          });

          const text = response.text;
          result = text ? JSON.parse(text) : null;
          tokensUsed += (systemPrompt.length + userPrompt.length + (text?.length || 0)) / 4;
        } else if (config.provider === "openai") {
          const openai = getOpenAI();
          if (!openai) throw new Error("OpenAI client not configured");

          const response = await openai.chat.completions.create({
            model: config.model || "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt }
            ],
            temperature: config.temperature,
            max_tokens: config.maxTokens,
            response_format: { type: "json_object" }
          });

          const content = response.choices[0].message.content;
          result = content ? JSON.parse(content) : null;
          tokensUsed += response.usage?.total_tokens || 0;
        }
        
        // Output Schema Validation
        if (config.outputSchema && Object.keys(config.outputSchema).length > 0) {
          try {
            const schema = typeof config.outputSchema === 'string' ? JSON.parse(config.outputSchema) : config.outputSchema;
            const validate = ajv.compile(schema);
            const valid = validate(result);
            if (!valid) {
              const schemaError = validate.errors?.map(e => e.message).join(', ');
              throw new Error(`Output schema validation failed: ${schemaError}`);
            }
          } catch (se: any) {
             console.warn(`Schema validation failed on attempt ${attempts}: ${se.message}`);
             throw se; // Let retry logic handle it
          }
        }
        
        // If we get here, success! 
        error = null;
        status = "success";
        break; 
      } catch (e: any) {
        status = "failure";
        error = e.message;
        console.warn(`AI Function Run [${key}] attempt ${attempts} failed:`, e.message);
        
        if (attempts >= maxAttempts) {
          console.error(`AI Function Run [${key}] globally failed after ${attempts} attempts.`);
        } else {
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 500));
        }
      }
    }

    const latencyMs = Date.now() - startTime;

    // Log the run
    try {
      await prisma.aiFunctionRun.create({
        data: {
          functionKey: key,
          functionConfigId: config.id === "default" ? null : config.id,
          input: options.variables,
          output: result || { error },
          status,
          error,
          tokensUsed: Math.round(tokensUsed),
          latencyMs,
        }
      });
    } catch (logError) {
      console.error("Failed to log AI function run:", logError);
    }

    return {
      result,
      status,
      error,
      tokensUsed,
      latencyMs
    };
  }
};
