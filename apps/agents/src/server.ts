/**
 * Agents Service - All 7 MCP Agents
 * Handles orchestration, personalization, incentives, social presence,
 * tutor advocacy, trust & safety, and experimentation
 */

import express from "express";
import bodyParser from "body-parser";
import { handleOrchestratorRequest, incrementThrottle } from "./agents/orchestrator";
import { handlePersonalizationRequest } from "./agents/personalization";
import { handleIncentivesRequest } from "./agents/incentives";
import { handleSocialPresenceRequest } from "./agents/social-presence";
import { handleTutorAdvocacyRequest } from "./agents/tutor-advocacy";
import { handleTrustSafetyRequest, registerDevice, registerEmail, registerIP, incrementInviteCount } from "./agents/trust-safety";
import { handleExperimentationRequest, recordMetric, getExperimentStats } from "./agents/experimentation";

const app = express();
app.use(bodyParser.json());

// Enable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// ============================================================================
// MCP AGENT ENDPOINTS
// ============================================================================

// 1. Loop Orchestrator Agent
app.post("/mcp/orchestrator", async (req, res) => {
  try {
    const request = {
      context: req.body,
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    
    const response = await handleOrchestratorRequest(request as any);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Personalization Agent
app.post("/mcp/personalization", async (req, res) => {
  try {
    const request = {
      context: req.body,
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    
    const response = await handlePersonalizationRequest(request as any);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Incentives & Economy Agent
app.post("/mcp/incentives", async (req, res) => {
  try {
    const request = {
      context: req.body,
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    
    const response = await handleIncentivesRequest(request as any);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Social Presence Agent
app.post("/mcp/social-presence", async (req, res) => {
  try {
    const request = {
      context: req.body,
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    
    const response = await handleSocialPresenceRequest(request as any);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Tutor Advocacy Agent
app.post("/mcp/tutor-advocacy", async (req, res) => {
  try {
    const request = {
      context: req.body,
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    
    const response = await handleTutorAdvocacyRequest(request as any);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Trust & Safety Agent
app.post("/mcp/trust-safety", async (req, res) => {
  try {
    const request = {
      context: req.body,
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    
    const response = await handleTrustSafetyRequest(request as any);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Experimentation Agent
app.post("/mcp/experimentation", async (req, res) => {
  try {
    const request = {
      context: req.body,
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    
    const response = await handleExperimentationRequest(request as any);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// SIMPLIFIED ORCHESTRATION ENDPOINT (Backward Compatible)
// ============================================================================

app.post("/mcp/orchestrate", async (req, res) => {
  try {
    const { trigger, persona, userId, contextData } = req.body;
    
    const request = {
      context: { trigger, persona, userId, contextData },
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    
    const response = await handleOrchestratorRequest(request as any);
    
    // Simplified response for backward compatibility
    res.json({
      decision: response.decision,
      rationale: response.rationale,
      version: response.version,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// EXPERIMENT ENDPOINTS (Backward Compatible)
// ============================================================================

app.post("/experiment/assign", async (req, res) => {
  try {
    const { userId, experimentName } = req.body;
    
    const request = {
      context: { userId, experimentName: experimentName || "k-factor-loops-v1", action: "assign" },
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    
    const response = await handleExperimentationRequest(request as any);
    res.json({ cohort: response.decision.cohort });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/experiment/:name/stats", (req, res) => {
  try {
    const { name } = req.params;
    const stats = getExperimentStats(name);
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// EVENTS ENDPOINT - Enhanced with agent integration
// ============================================================================

const counters = { invites: 0, opens: 0, joins: 0, fvms: 0 };

app.post("/events", async (req, res) => {
  try {
    const event = req.body;
    const eventType = event?.type;

    // Update counters
    if (eventType === "invite.sent") {
      counters.invites++;
      if (event.userId) {
        incrementThrottle(event.userId);
        incrementInviteCount(event.userId);
      }
      // Record for experiment
      if (event.loop) {
        recordMetric("k-factor-loops-v1", event.cohort || "control", "invite");
      }
    }
    
    if (eventType === "invite.opened") {
      counters.opens++;
      if (event.deviceId || event.ipAddress) {
        // Track for fraud detection
      }
      recordMetric("k-factor-loops-v1", event.cohort || "control", "open");
    }
    
    if (eventType === "account.created") {
      counters.joins++;
      if (event.userId) {
        // Register for fraud tracking
        if (event.deviceId) registerDevice(event.userId, event.deviceId);
        if (event.email) registerEmail(event.userId, event.email);
        if (event.ipAddress) registerIP(event.userId, event.ipAddress);
      }
      recordMetric("k-factor-loops-v1", event.cohort || "control", "join");
    }
    
    if (eventType === "fvm.reached") {
      counters.fvms++;
      recordMetric("k-factor-loops-v1", event.cohort || "control", "fvm");
    }

    // Compute K-factor
    const k = computeK(counters);

    console.log("[EVENTS]", {
      type: eventType,
      counters: { ...counters, k },
      userId: event.userId,
      loop: event.loop,
    });

    res.json({
      ok: true,
      counters: { ...counters, k },
      k,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// METRICS & MONITORING ENDPOINTS
// ============================================================================

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "agents",
    timestamp: new Date().toISOString(),
    agents: [
      "orchestrator",
      "personalization",
      "incentives",
      "social_presence",
      "tutor_advocacy",
      "trust_safety",
      "experimentation",
    ],
  });
});

app.get("/metrics", (req, res) => {
  const k = computeK(counters);
  res.json({
    counters: { ...counters, k },
    experiments: {
      "k-factor-loops-v1": getExperimentStats("k-factor-loops-v1"),
    },
  });
});

app.get("/metrics/k-factor", (req, res) => {
  const k = computeK(counters);
  const success = k >= 1.20; // Target K-factor

  res.json({
    k,
    target: 1.20,
    success,
    invitesPerUser: counters.joins > 0 ? counters.invites / counters.joins : 0,
    conversionRate: counters.opens > 0 ? counters.joins / counters.opens : 0,
    fvmRate: counters.joins > 0 ? counters.fvms / counters.joins : 0,
    timestamp: new Date().toISOString(),
  });
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function computeK({ invites, opens, joins, fvms }: { invites: number; opens: number; joins: number; fvms: number }) {
  if (joins === 0) return 0;
  
  const invitesPerUser = invites / joins;
  const conversionRate = joins / Math.max(opens, 1);
  
  return Number((invitesPerUser * conversionRate).toFixed(3));
}

// ============================================================================
// START SERVER
// ============================================================================

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Agents Service listening on :${PORT}`);
  console.log(`📊 Available agents:`);
  console.log(`   - /mcp/orchestrator`);
  console.log(`   - /mcp/personalization`);
  console.log(`   - /mcp/incentives`);
  console.log(`   - /mcp/social-presence`);
  console.log(`   - /mcp/tutor-advocacy`);
  console.log(`   - /mcp/trust-safety`);
  console.log(`   - /mcp/experimentation`);
  console.log(`📈 Metrics: /metrics, /metrics/k-factor`);
  console.log(`💚 Health: /health`);
});
