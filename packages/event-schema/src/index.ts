import { z } from "zod";

// Base event schema
export const EventBase = z.object({
  ts: z.string(), // ISO timestamp
  userId: z.string().nullable(),
  sessionId: z.string(),
  surface: z.enum(["results","practice","ai_tutor","cohort_room","email","sms","push","web","diagnostic","flashcards"]),
});

// Viral loop events
export const LoopEnum = z.enum([
  "buddy_challenge",
  "streak_rescue",
  "proud_parent",
  "tutor_spotlight",
  "results_rally",
  "class_watch_party",
  "subject_clubs",
  "achievement_spotlight"
]);

export const InviteSent = EventBase.extend({
  type: z.literal("invite.sent"),
  loop: LoopEnum,
  signedLinkId: z.string(),
  referrerId: z.string(),
});

export const InviteOpened = EventBase.extend({
  type: z.literal("invite.opened"),
  signedLinkId: z.string(),
  deviceId: z.string().optional(),
  ipAddress: z.string().optional(),
});

export const AccountCreated = EventBase.extend({
  type: z.literal("account.created"),
  referrerSignedLinkId: z.string().nullable(),
  persona: z.enum(["student", "parent", "tutor"]),
});

export const FVMReached = EventBase.extend({
  type: z.literal("fvm.reached"),
  context: z.enum(["micro_deck","class_sampler","ai_minute","practice_set","diagnostic"]),
  durationSeconds: z.number().optional(),
});

// Session events
export const SessionStarted = EventBase.extend({
  type: z.literal("session.started"),
  sessionType: z.enum(["live_1on1", "instant", "ai_tutor", "class"]),
  tutorId: z.string().optional(),
  subject: z.string(),
});

export const SessionEnded = EventBase.extend({
  type: z.literal("session.ended"),
  sessionType: z.enum(["live_1on1", "instant", "ai_tutor", "class"]),
  durationSeconds: z.number(),
  rating: z.number().min(1).max(5).optional(),
});

export const SessionTranscribed = EventBase.extend({
  type: z.literal("session.transcribed"),
  transcriptionId: z.string(),
});

export const SessionSummarized = EventBase.extend({
  type: z.literal("session.summarized"),
  summaryId: z.string(),
  skillGaps: z.array(z.string()),
  wins: z.array(z.string()),
});

// Agentic action events
export const AgenticActionTriggered = EventBase.extend({
  type: z.literal("agentic_action.triggered"),
  actionType: z.enum([
    "beat_my_skill",
    "study_buddy_nudge",
    "parent_progress_reel",
    "prep_pack_share"
  ]),
  targetPersona: z.enum(["student", "parent", "tutor"]),
  actionId: z.string(),
});

export const AgenticActionExecuted = EventBase.extend({
  type: z.literal("agentic_action.executed"),
  actionId: z.string(),
  outcome: z.enum(["success", "failure", "skipped"]),
});

// Results page events
export const ResultsPageViewed = EventBase.extend({
  type: z.literal("results_page.viewed"),
  resultType: z.enum(["diagnostic", "practice_test", "flashcards", "skill_check"]),
  score: z.number(),
  subject: z.string(),
});

export const ResultsShared = EventBase.extend({
  type: z.literal("results.shared"),
  resultType: z.enum(["diagnostic", "practice_test", "flashcards", "skill_check"]),
  shareMethod: z.enum(["link", "social", "email", "sms"]),
  signedLinkId: z.string(),
});

export const ShareCardGenerated = EventBase.extend({
  type: z.literal("share_card.generated"),
  cardType: z.enum(["score", "progress", "achievement", "challenge"]),
  persona: z.enum(["student", "parent", "tutor"]),
});

// Presence and social events
export const PresenceJoined = EventBase.extend({
  type: z.literal("presence.joined"),
  cohort: z.string().optional(),
  subject: z.string().optional(),
});

export const PresenceLeft = EventBase.extend({
  type: z.literal("presence.left"),
  durationSeconds: z.number(),
});

export const LeaderboardViewed = EventBase.extend({
  type: z.literal("leaderboard.viewed"),
  leaderboardType: z.enum(["subject", "cohort", "global"]),
  subject: z.string().optional(),
});

// Agent decision events
export const AgentDecisionMade = EventBase.extend({
  type: z.literal("agent.decision"),
  agent: z.enum([
    "orchestrator",
    "personalization",
    "incentives",
    "social_presence",
    "tutor_advocacy",
    "trust_safety",
    "experimentation"
  ]),
  decision: z.record(z.any()),
  rationale: z.string(),
  latencyMs: z.number(),
});

// Experiment events
export const ExperimentAssigned = EventBase.extend({
  type: z.literal("experiment.assigned"),
  experimentName: z.string(),
  cohort: z.string(),
  variant: z.string().optional(),
});

export const ExperimentExposure = EventBase.extend({
  type: z.literal("experiment.exposure"),
  experimentName: z.string(),
  cohort: z.string(),
});

// Fraud and compliance events
export const FraudDetected = EventBase.extend({
  type: z.literal("fraud.detected"),
  reason: z.string(),
  severity: z.enum(["low", "medium", "high", "critical"]),
  deviceId: z.string().optional(),
  ipAddress: z.string().optional(),
});

export const ComplaintFiled = EventBase.extend({
  type: z.literal("complaint.filed"),
  complaintType: z.enum(["spam", "privacy", "harassment", "other"]),
  description: z.string().optional(),
});

export const OptOut = EventBase.extend({
  type: z.literal("opt_out"),
  category: z.enum(["growth_comms", "all_comms", "data_sharing"]),
});

// Retention events
export const RetentionD1 = EventBase.extend({
  type: z.literal("retention.d1"),
  returned: z.boolean(),
  cohort: z.string().optional(),
});

export const RetentionD7 = EventBase.extend({
  type: z.literal("retention.d7"),
  returned: z.boolean(),
  cohort: z.string().optional(),
});

export const RetentionD28 = EventBase.extend({
  type: z.literal("retention.d28"),
  returned: z.boolean(),
  cohort: z.string().optional(),
});

// Satisfaction events
export const CSATSubmitted = EventBase.extend({
  type: z.literal("csat.submitted"),
  rating: z.number().min(1).max(5),
  category: z.enum(["loop_prompt", "reward", "overall"]),
  feedback: z.string().optional(),
});

// Union type of all events
export type AnyEvent =
  // Core viral events
  | z.infer<typeof InviteSent>
  | z.infer<typeof InviteOpened>
  | z.infer<typeof AccountCreated>
  | z.infer<typeof FVMReached>
  // Session events
  | z.infer<typeof SessionStarted>
  | z.infer<typeof SessionEnded>
  | z.infer<typeof SessionTranscribed>
  | z.infer<typeof SessionSummarized>
  // Agentic action events
  | z.infer<typeof AgenticActionTriggered>
  | z.infer<typeof AgenticActionExecuted>
  // Results page events
  | z.infer<typeof ResultsPageViewed>
  | z.infer<typeof ResultsShared>
  | z.infer<typeof ShareCardGenerated>
  // Presence and social events
  | z.infer<typeof PresenceJoined>
  | z.infer<typeof PresenceLeft>
  | z.infer<typeof LeaderboardViewed>
  // Agent decision events
  | z.infer<typeof AgentDecisionMade>
  // Experiment events
  | z.infer<typeof ExperimentAssigned>
  | z.infer<typeof ExperimentExposure>
  // Fraud and compliance events
  | z.infer<typeof FraudDetected>
  | z.infer<typeof ComplaintFiled>
  | z.infer<typeof OptOut>
  // Retention events
  | z.infer<typeof RetentionD1>
  | z.infer<typeof RetentionD7>
  | z.infer<typeof RetentionD28>
  // Satisfaction events
  | z.infer<typeof CSATSubmitted>;

// Helper types
export type LoopType = z.infer<typeof LoopEnum>;
export type Persona = "student" | "parent" | "tutor";
export type AgentType = "orchestrator" | "personalization" | "incentives" | "social_presence" | "tutor_advocacy" | "trust_safety" | "experimentation";
