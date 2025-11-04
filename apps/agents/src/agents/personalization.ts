/**
 * Personalization Agent
 * Tailors invites, rewards, and copy by persona, subject, and intent
 * 
 * Now powered by OpenAI GPT-4o-mini for dynamic, contextual copy generation
 * Falls back to Copy Kit templates if AI unavailable
 */

import type { PersonalizationRequest, PersonalizationResponse } from "mcp-protocol";
import { copyKit } from "copy-kit";
import type { ViralLoop, Persona } from "copy-kit";
import { generateCompletion, parseAIJsonResponse, isAIAvailable, checkAIRateLimit } from "../lib/ai.js";

export async function handlePersonalizationRequest(
  request: PersonalizationRequest
): Promise<PersonalizationResponse> {
  const startTime = Date.now();
  const { persona, loop, contextData, userId } = request.context as any;

  // Normalize loop name (convert underscore to hyphen format)
  const normalizedLoop = loop.replace(/_/g, "-") as ViralLoop;

  // Select tone based on context and persona
  const tone = copyKit.determineTone(persona as Persona, contextData);

  // Determine urgency
  const urgency = determineUrgency(loop, contextData);

  let personalizedCopy: any;
  let copySource = "copy-kit";
  let aiGenerated = false;

  // Try AI-generated copy first if available
  if (isAIAvailable() && userId && checkAIRateLimit(userId, 10)) {
    try {
      personalizedCopy = await generateAICopy({
        persona,
        loop: normalizedLoop,
        tone,
        contextData,
      });
      copySource = "openai-gpt4o-mini";
      aiGenerated = true;
    } catch (error: any) {
      console.warn("AI copy generation failed, falling back to templates:", error.message);
      // Fall through to copy-kit fallback
    }
  }

  // Fallback to Copy Kit templates if AI not available or failed
  if (!personalizedCopy) {
    const copyKitResult = copyKit.getPersonalizedCopy(
      {
        loop: normalizedLoop,
        persona: persona as Persona,
        tone,
      },
      contextData
    );
    personalizedCopy = {
      headline: copyKitResult.headline,
      body: copyKitResult.body,
      cta: copyKitResult.cta,
    };
  }

  const latencyMs = Date.now() - startTime;

  return {
    decision: {
      copy: {
        headline: personalizedCopy.headline,
        body: personalizedCopy.body,
        cta: personalizedCopy.cta,
      },
      tone,
      urgency,
      personalizationTags: extractPersonalizationTags(contextData),
      aiGenerated, // Flag indicating if AI was used
    },
    rationale: aiGenerated 
      ? `Generated dynamic copy via OpenAI GPT-4o-mini for ${persona} persona on ${loop} loop. Tone: ${tone}. Context: ${Object.keys(contextData).join(", ")}`
      : `Selected ${tone} tone for ${persona} persona on ${loop} loop (via Copy Kit fallback). Context includes: ${Object.keys(contextData).join(", ")}`,
    featuresUsed: aiGenerated 
      ? ["persona", "loop", "subject", "intent", "previousEngagement", "openai", "dynamic-generation"]
      : ["persona", "loop", "subject", "intent", "previousEngagement", "copyKit"],
    confidence: aiGenerated ? 0.92 : 0.85,
    latencyMs,
    version: "v2.0-ai",
    timestamp: new Date().toISOString(),
    requestId: request.requestId,
  };
}

/**
 * Generate personalized copy using OpenAI GPT-4o-mini
 */
async function generateAICopy(params: {
  persona: string;
  loop: ViralLoop;
  tone: string;
  contextData: any;
}): Promise<{ headline: string; body: string; cta: string }> {
  const { persona, loop, tone, contextData } = params;

  // Build context string
  const contextString = Object.entries(contextData)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `- ${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
    .join("\n");

  const toneGuidance = getToneGuidance(tone, loop);

  const prompt = `You are an expert growth copywriter for an education platform. Generate a personalized invite message that will maximize conversion while feeling authentic and helpful.

Context:
- Persona: ${persona} (${persona === "student" ? "ages 10-18, casual tone" : persona === "parent" ? "caring, wants best for child" : "professional educator"})
- Loop type: ${loop} (${getLoopDescription(loop)})
- Tone: ${tone}
${contextString}

${toneGuidance}

Generate a JSON response with exactly these fields:
{
  "headline": "Short, attention-grabbing (40-60 chars max)",
  "body": "Personal, compelling message (120-160 chars max)",
  "cta": "Action-oriented button text (15-20 chars max)"
}

Requirements:
- Use natural, conversational language
- Include relevant context (subject, score, etc.) naturally
- Make it feel personal, not generic
- ${loop === "streak-rescue" ? "Create urgency but stay playful" : "Be encouraging and positive"}
- ${persona === "parent" ? "NO emojis" : "Use 1-2 relevant emojis"}
- Keep within character limits (this is crucial for UI)`;

  const response = await generateCompletion(
    [
      { role: "system", content: "You are a growth copywriting expert specializing in education platforms. You create messages that convert while maintaining authenticity." },
      { role: "user", content: prompt },
    ],
    {
      model: "fast", // GPT-4o-mini
      temperature: 0.8, // Higher for creativity
      responseFormat: "json",
    }
  );

  const copy = parseAIJsonResponse<{ headline: string; body: string; cta: string }>(response);

  // Validate and trim if needed
  return {
    headline: copy.headline.substring(0, 60),
    body: copy.body.substring(0, 160),
    cta: copy.cta.substring(0, 20),
  };
}

/**
 * Get tone-specific guidance for the AI
 */
function getToneGuidance(tone: string, loop: string): string {
  const guidance = {
    friendly: "Be warm and casual, like talking to a friend. Use 'you' and 'we'.",
    motivational: "Be energizing and inspiring. Focus on achievement and progress.",
    professional: "Be respectful and informative. Avoid slang or emojis.",
    playful: "Be fun and lighthearted. Use wordplay if appropriate.",
  };

  return guidance[tone as keyof typeof guidance] || guidance.friendly;
}

/**
 * Get description of what each loop does (for AI context)
 */
function getLoopDescription(loop: string): string {
  const descriptions = {
    "buddy-challenge": "Invite friend to beat your score in a friendly competition",
    "streak-rescue": "Urgent: Help friend save their learning streak before it breaks",
    "proud-parent": "Share child's progress and achievements with other parents",
    "tutor-spotlight": "Share teaching success and invite families to try lessons",
  };

  return descriptions[loop as keyof typeof descriptions] || "Share learning experience";
}

function determineUrgency(loop: string, contextData: any): "low" | "medium" | "high" {
  if (loop === "streak_rescue") return "high";
  if (contextData.intent === "exam_prep" && contextData.daysUntilExam < 7) return "high";
  if (loop === "buddy_challenge" || loop === "results_rally") return "medium";
  return "low";
}

function extractPersonalizationTags(contextData: any): string[] {
  const tags: string[] = [];
  
  if (contextData.subject) tags.push(`subject:${contextData.subject}`);
  if (contextData.intent) tags.push(`intent:${contextData.intent}`);
  if (contextData.score !== undefined) tags.push(`score:${contextData.score > 70 ? "high" : "medium"}`);
  
  return tags;
}

