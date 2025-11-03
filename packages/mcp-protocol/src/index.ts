/**
 * Model Context Protocol (MCP) for Agent Communication
 * All agent decisions must include rationale for auditability
 */

import { z } from "zod";

// Base MCP request/response schemas
export const MCPRequest = z.object({
  context: z.record(z.any()), // Context data for decision
  timestamp: z.string(), // ISO timestamp
  requestId: z.string(), // Unique request ID for tracking
});

export const MCPResponse = z.object({
  decision: z.record(z.any()), // The decision made by the agent
  rationale: z.string(), // Human-readable explanation
  featuresUsed: z.array(z.string()), // Features/signals used in decision
  confidence: z.number().min(0).max(1), // Confidence score
  latencyMs: z.number(), // Decision latency
  version: z.string(), // Agent version
  timestamp: z.string(), // ISO timestamp
  requestId: z.string(), // Matches request ID
});

// Agent-specific request/response schemas

// 1. Loop Orchestrator Agent
export const OrchestratorRequest = MCPRequest.extend({
  trigger: z.enum(["post_session", "results_page", "streak_risk", "badge_earned", "milestone", "cohort_join"]),
  persona: z.enum(["student", "parent", "tutor"]),
  userId: z.string(),
  contextData: z.object({
    sessionId: z.string().optional(),
    subject: z.string().optional(),
    score: z.number().optional(),
    streakDays: z.number().optional(),
    recentActivity: z.array(z.string()).optional(),
  }),
});

export const OrchestratorResponse = MCPResponse.extend({
  decision: z.object({
    loop: z.enum([
      "buddy_challenge",
      "streak_rescue",
      "proud_parent",
      "tutor_spotlight",
      "results_rally",
      "class_watch_party",
      "subject_clubs",
      "achievement_spotlight"
    ]),
    trigger: z.boolean(), // Whether to trigger the loop
    throttled: z.boolean(), // Whether user is throttled
    reward: z.string().optional(), // Reward to offer
  }),
});

// 2. Personalization Agent
export const PersonalizationRequest = MCPRequest.extend({
  persona: z.enum(["student", "parent", "tutor"]),
  userId: z.string(),
  loop: z.string(),
  contextData: z.object({
    subject: z.string().optional(),
    intent: z.string().optional(), // learning_goal, exam_prep, exploration, etc.
    previousEngagement: z.array(z.string()).optional(),
    preferences: z.record(z.any()).optional(),
  }),
});

export const PersonalizationResponse = MCPResponse.extend({
  decision: z.object({
    copy: z.object({
      headline: z.string(),
      body: z.string(),
      cta: z.string(),
    }),
    tone: z.enum(["friendly", "motivational", "professional", "playful"]),
    urgency: z.enum(["low", "medium", "high"]),
    personalizationTags: z.array(z.string()),
  }),
});

// 3. Incentives & Economy Agent
export const IncentivesRequest = MCPRequest.extend({
  persona: z.enum(["student", "parent", "tutor"]),
  userId: z.string(),
  loop: z.string(),
  contextData: z.object({
    currentBalance: z.object({
      aiMinutes: z.number().optional(),
      gems: z.number().optional(),
      xp: z.number().optional(),
    }).optional(),
    ltv: z.number().optional(), // Lifetime value
    cac: z.number().optional(), // Customer acquisition cost
    conversionProbability: z.number().optional(),
  }),
});

export const IncentivesResponse = MCPResponse.extend({
  decision: z.object({
    reward: z.object({
      type: z.enum(["ai_minutes", "class_pass", "gems", "xp_boost", "streak_shield", "power_up"]),
      amount: z.number(),
      expiresIn: z.number().optional(), // seconds
    }),
    requiresFriendCompletion: z.boolean(),
    economicsValid: z.boolean(), // Unit economics check passed
    abuseRisk: z.enum(["low", "medium", "high"]),
  }),
});

// 4. Social Presence Agent
export const SocialPresenceRequest = MCPRequest.extend({
  userId: z.string(),
  action: z.enum(["get_presence", "recommend_cohort", "suggest_invite"]),
  contextData: z.object({
    subject: z.string().optional(),
    currentCohort: z.string().optional(),
    friendsOnline: z.array(z.string()).optional(),
  }),
});

export const SocialPresenceResponse = MCPResponse.extend({
  decision: z.object({
    presenceMessage: z.string().optional(), // e.g., "28 peers practicing Algebra now"
    cohortRecommendation: z.object({
      cohortId: z.string(),
      cohortName: z.string(),
      memberCount: z.number(),
      activityLevel: z.enum(["low", "medium", "high"]),
    }).optional(),
    inviteSuggestion: z.object({
      suggested: z.boolean(),
      reason: z.string(),
    }).optional(),
  }),
});

// 5. Tutor Advocacy Agent
export const TutorAdvocacyRequest = MCPRequest.extend({
  tutorId: z.string(),
  action: z.enum(["generate_share_pack", "track_referral", "calculate_xp"]),
  contextData: z.object({
    sessionId: z.string().optional(),
    rating: z.number().optional(),
    milestoneAchieved: z.string().optional(),
    referralCount: z.number().optional(),
  }),
});

export const TutorAdvocacyResponse = MCPResponse.extend({
  decision: z.object({
    sharePack: z.object({
      smartLink: z.string(),
      thumbnail: z.string().optional(),
      copy: z.string(),
      channels: z.array(z.enum(["whatsapp", "sms", "email", "social"])),
    }).optional(),
    referralXp: z.number().optional(),
    leaderboardRank: z.number().optional(),
  }),
});

// 6. Trust & Safety Agent
export const TrustSafetyRequest = MCPRequest.extend({
  userId: z.string().optional(),
  action: z.enum(["check_fraud", "check_coppa", "check_rate_limit", "check_duplicate"]),
  contextData: z.object({
    deviceId: z.string().optional(),
    ipAddress: z.string().optional(),
    email: z.string().optional(),
    age: z.number().optional(),
    parentalConsent: z.boolean().optional(),
    recentInvites: z.number().optional(),
  }),
});

export const TrustSafetyResponse = MCPResponse.extend({
  decision: z.object({
    allowed: z.boolean(),
    reason: z.string().optional(),
    fraudScore: z.number().min(0).max(1).optional(),
    requiresParentalGate: z.boolean(),
    rateLimitHit: z.boolean(),
    recommendations: z.array(z.string()),
  }),
});

// 7. Experimentation Agent
export const ExperimentationRequest = MCPRequest.extend({
  userId: z.string(),
  experimentName: z.string().optional(),
  action: z.enum(["assign", "get_variant", "log_exposure", "compute_metrics"]),
  contextData: z.object({
    currentCohort: z.string().optional(),
  }),
});

export const ExperimentationResponse = MCPResponse.extend({
  decision: z.object({
    cohort: z.string(), // A, B, control, variant_1, etc.
    variant: z.string().optional(),
    experimentName: z.string().optional(),
    metrics: z.object({
      k: z.number().optional(), // K-factor
      invitesPerUser: z.number().optional(),
      conversionRate: z.number().optional(),
      fvmLift: z.number().optional(),
    }).optional(),
  }),
});

// Type exports
export type OrchestratorRequest = z.infer<typeof OrchestratorRequest>;
export type OrchestratorResponse = z.infer<typeof OrchestratorResponse>;
export type PersonalizationRequest = z.infer<typeof PersonalizationRequest>;
export type PersonalizationResponse = z.infer<typeof PersonalizationResponse>;
export type IncentivesRequest = z.infer<typeof IncentivesRequest>;
export type IncentivesResponse = z.infer<typeof IncentivesResponse>;
export type SocialPresenceRequest = z.infer<typeof SocialPresenceRequest>;
export type SocialPresenceResponse = z.infer<typeof SocialPresenceResponse>;
export type TutorAdvocacyRequest = z.infer<typeof TutorAdvocacyRequest>;
export type TutorAdvocacyResponse = z.infer<typeof TutorAdvocacyResponse>;
export type TrustSafetyRequest = z.infer<typeof TrustSafetyRequest>;
export type TrustSafetyResponse = z.infer<typeof TrustSafetyResponse>;
export type ExperimentationRequest = z.infer<typeof ExperimentationRequest>;
export type ExperimentationResponse = z.infer<typeof ExperimentationResponse>;

// Agent registry
export const AGENT_TYPES = [
  "orchestrator",
  "personalization",
  "incentives",
  "social_presence",
  "tutor_advocacy",
  "trust_safety",
  "experimentation",
] as const;

export type AgentType = typeof AGENT_TYPES[number];

// MCP Server interface
export interface MCPServer {
  agent: AgentType;
  handleRequest: (request: z.infer<typeof MCPRequest>) => Promise<z.infer<typeof MCPResponse>>;
  health: () => Promise<{ status: "ok" | "degraded" | "down"; latencyMs: number }>;
}

