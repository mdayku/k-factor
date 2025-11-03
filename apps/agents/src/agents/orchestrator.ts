/**
 * Loop Orchestrator Agent
 * Chooses which viral loop to trigger based on context, eligibility, and throttling
 */

import type { OrchestratoreRequest, OrchestratorResponse } from "mcp-protocol";

const LOOP_ELIGIBILITY_RULES = {
  buddy_challenge: (ctx: any) => ctx.persona === "student" && ctx.trigger === "results_page",
  streak_rescue: (ctx: any) => ctx.persona === "student" && ctx.trigger === "streak_risk",
  proud_parent: (ctx: any) => ctx.persona === "parent" && ctx.trigger === "post_session",
  tutor_spotlight: (ctx: any) => ctx.persona === "tutor" && ctx.trigger === "milestone",
  results_rally: (ctx: any) => ctx.persona === "student" && ctx.trigger === "results_page" && ctx.score > 70,
  class_watch_party: (ctx: any) => ctx.persona === "student" && ctx.trigger === "cohort_join",
  subject_clubs: (ctx: any) => ctx.trigger === "badge_earned",
  achievement_spotlight: (ctx: any) => ctx.trigger === "badge_earned" || ctx.trigger === "milestone",
};

// In-memory throttling (should be moved to Redis/DB in production)
const userThrottle = new Map<string, { count: number; resetAt: number }>();

export async function handleOrchestratorRequest(
  request: OrchestratoreRequest
): Promise<OrchestratorResponse> {
  const startTime = Date.now();
  const { trigger, persona, userId, contextData } = request.context as any;

  // Check throttling
  const throttled = checkThrottling(userId);
  
  // Find eligible loops
  const eligibleLoops = Object.entries(LOOP_ELIGIBILITY_RULES)
    .filter(([_, rule]) => rule({ trigger, persona, ...contextData }))
    .map(([loop]) => loop);

  // Select best loop (simple priority for now)
  const selectedLoop = eligibleLoops[0] || "buddy_challenge";

  // Determine reward based on loop
  const reward = getRewardForLoop(selectedLoop);

  const latencyMs = Date.now() - startTime;

  return {
    decision: {
      loop: selectedLoop as any,
      trigger: !throttled && eligibleLoops.length > 0,
      throttled,
      reward,
    },
    rationale: throttled
      ? `User ${userId} is throttled (max invites reached)`
      : eligibleLoops.length > 0
      ? `Selected ${selectedLoop} loop for ${persona} on ${trigger} trigger. Eligible loops: ${eligibleLoops.join(", ")}`
      : `No eligible loops found. Defaulting to ${selectedLoop}.`,
    featuresUsed: ["trigger", "persona", "userId", "contextData", "throttling_status"],
    confidence: eligibleLoops.length > 0 ? 0.9 : 0.5,
    latencyMs,
    version: "v1.0",
    timestamp: new Date().toISOString(),
    requestId: request.requestId,
  };
}

function checkThrottling(userId: string): boolean {
  const now = Date.now();
  const userRecord = userThrottle.get(userId);

  if (!userRecord || userRecord.resetAt < now) {
    // Reset counter (24 hour window)
    userThrottle.set(userId, { count: 0, resetAt: now + 24 * 60 * 60 * 1000 });
    return false;
  }

  // Check if over limit (20 invites per day)
  if (userRecord.count >= 20) {
    return true;
  }

  return false;
}

function getRewardForLoop(loop: string): string {
  const rewards: Record<string, string> = {
    buddy_challenge: "streak_shield",
    streak_rescue: "streak_shield",
    proud_parent: "class_pass",
    tutor_spotlight: "xp_boost",
    results_rally: "gem_boost",
    class_watch_party: "class_sampler",
    subject_clubs: "friend_pass",
    achievement_spotlight: "badge_showcase",
  };
  return rewards[loop] || "streak_shield";
}

export function incrementThrottle(userId: string): void {
  const now = Date.now();
  const userRecord = userThrottle.get(userId);

  if (!userRecord || userRecord.resetAt < now) {
    userThrottle.set(userId, { count: 1, resetAt: now + 24 * 60 * 60 * 1000 });
  } else {
    userRecord.count++;
  }
}

