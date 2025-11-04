/**
 * AI Infrastructure - OpenAI Integration
 * Provides centralized access to LLM capabilities
 */

import OpenAI from "openai";

// Lazy-initialize OpenAI client (only when first used)
let _openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!_openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }
    _openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return _openaiClient;
}

// Model selection for different use cases
export const MODELS = {
  creative: "gpt-4o", // For high-quality copy generation
  fast: "gpt-4o-mini", // For simple tasks (cost-effective)
  reasoning: "gpt-4o", // For complex decisions
} as const;

// Default parameters
export const DEFAULT_PARAMS = {
  temperature: 0.7,
  max_tokens: 500,
} as const;

/**
 * Check if AI is available (API key configured)
 */
export function isAIAvailable(): boolean {
  const apiKey = process.env.OPENAI_API_KEY;
  return !!apiKey && apiKey !== "your-openai-api-key-here" && apiKey.startsWith("sk-");
}

/**
 * Generate AI completion with error handling and fallback
 */
export async function generateCompletion(
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  options?: {
    model?: keyof typeof MODELS;
    temperature?: number;
    responseFormat?: "json" | "text";
  }
): Promise<string> {
  if (!isAIAvailable()) {
    throw new Error("OpenAI API key not configured");
  }

  const model = options?.model ? MODELS[options.model] : MODELS.fast;

  try {
    const client = getOpenAIClient();
    const response = await client.chat.completions.create({
      model,
      messages,
      temperature: options?.temperature ?? DEFAULT_PARAMS.temperature,
      max_tokens: DEFAULT_PARAMS.max_tokens,
      ...(options?.responseFormat === "json" && {
        response_format: { type: "json_object" },
      }),
    });

    return response.choices[0].message.content || "";
  } catch (error: any) {
    console.error("OpenAI API error:", error.message);
    throw new Error(`AI generation failed: ${error.message}`);
  }
}

/**
 * Parse JSON response from AI with validation
 */
export function parseAIJsonResponse<T>(content: string): T {
  try {
    return JSON.parse(content) as T;
  } catch (error) {
    console.error("Failed to parse AI JSON response:", content);
    throw new Error("Invalid JSON response from AI");
  }
}

/**
 * Rate limiter for AI calls (simple in-memory implementation)
 * In production, use Redis or similar
 */
const aiCallTimestamps = new Map<string, number[]>();

export function checkAIRateLimit(
  userId: string,
  maxCallsPerMinute: number = 10
): boolean {
  const now = Date.now();
  const userCalls = aiCallTimestamps.get(userId) || [];
  
  // Remove calls older than 1 minute
  const recentCalls = userCalls.filter(timestamp => now - timestamp < 60000);
  
  if (recentCalls.length >= maxCallsPerMinute) {
    return false; // Rate limit exceeded
  }
  
  // Add current call
  recentCalls.push(now);
  aiCallTimestamps.set(userId, recentCalls);
  
  return true;
}


