/**
 * AI Test Endpoint - Verify OpenAI integration
 * GET /ai/test - Test AI-powered copy generation
 */

import { Router } from "express";
import { isAIAvailable, generateCompletion, parseAIJsonResponse } from "../lib/ai.js";
import { handlePersonalizationRequest } from "../agents/personalization.js";

const router = Router();

/**
 * Test endpoint to verify OpenAI API is working
 */
router.get("/test", async (req, res) => {
  try {
    if (!isAIAvailable()) {
      return res.status(503).json({
        status: "unavailable",
        message: "OpenAI API key not configured. Set OPENAI_API_KEY environment variable.",
        fallback: "Agents will use Copy Kit templates as fallback",
      });
    }

    // Test simple completion
    const testPrompt = "Say 'Hello from OpenAI!' in JSON format with a 'message' field.";
    const response = await generateCompletion(
      [{ role: "user", content: testPrompt }],
      { model: "fast", responseFormat: "json" }
    );

    const parsed = parseAIJsonResponse<{ message: string }>(response);

    res.json({
      status: "success",
      message: "OpenAI API is working!",
      testResponse: parsed,
      info: {
        model: "gpt-4o-mini",
        rateLimit: "10 calls/minute per user",
        cost: "~$0.002 per invite",
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
      fallback: "Agents will use Copy Kit templates as fallback",
    });
  }
});

/**
 * Test personalization agent with AI
 */
router.post("/test-personalization", async (req, res) => {
  try {
    const { persona, loop, subject, score } = req.body;

    if (!persona || !loop) {
      return res.status(400).json({
        error: "Missing required fields: persona, loop",
      });
    }

    // Call personalization agent
    const result = await handlePersonalizationRequest({
      requestId: `test_${Date.now()}`,
      timestamp: new Date().toISOString(),
      context: {
        persona,
        loop,
        userId: "test_user",
        contextData: {
          subject: subject || "Geography",
          score: score || 9,
          studentName: "Alex",
        },
      },
    } as any);

    res.json({
      status: "success",
      aiGenerated: result.decision.aiGenerated || false,
      copy: result.decision.copy,
      tone: result.decision.tone,
      urgency: result.decision.urgency,
      rationale: result.rationale,
      latency: `${result.latencyMs}ms`,
      version: result.version,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

export default router;

