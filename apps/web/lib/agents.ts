/**
 * Agent Decision Logging
 * Logs MCP agent decisions for dashboard visibility
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface AgentDecision {
  type: string; // "orchestrator", "personalization", "incentives", etc.
  userId: string;
  action: string;
  rationale: string;
  confidence: number;
  context: Record<string, any>;
  result?: Record<string, any>;
}

/**
 * Log an agent decision event
 */
export async function logAgentDecision(decision: AgentDecision): Promise<void> {
  try {
    await prisma.event.create({
      data: {
        type: `agent.${decision.type}`,
        userId: decision.userId,
        surface: decision.context.surface || "agent_decision",
        metadata: {
          action: decision.action,
          rationale: decision.rationale,
          confidence: decision.confidence,
          context: decision.context,
          result: decision.result || null,
          timestamp: new Date().toISOString(),
        },
      },
    });
  } catch (error) {
    console.error("Failed to log agent decision:", error);
  }
}

/**
 * Orchestrator Agent: Decides which viral loop to activate
 */
export async function logOrchestratorDecision(
  userId: string,
  context: {
    surface: string;
    score?: number;
    streak?: number;
    sessionCount?: number;
  }
): Promise<string> {
  // Simple rule-based orchestration
  let selectedLoop = "buddy_challenge";
  let rationale = "Default: Buddy Challenge for score sharing";
  let confidence = 0.7;

  if (context.score && context.score >= 80) {
    selectedLoop = "buddy_challenge";
    rationale = "High score detected (≥80%). Activating Buddy Challenge for social proof.";
    confidence = 0.92;
  } else if (context.streak && context.streak >= 3) {
    selectedLoop = "streak_rescue";
    rationale = `Active streak detected (${context.streak} days). Activating Streak Rescue to incentivize invite.`;
    confidence = 0.88;
  } else if (context.sessionCount && context.sessionCount >= 5) {
    selectedLoop = "study_buddy";
    rationale = `Engaged user (${context.sessionCount} sessions). Activating Study Buddy for collaborative learning.`;
    confidence = 0.85;
  }

  await logAgentDecision({
    type: "orchestrator",
    userId,
    action: `activate_loop:${selectedLoop}`,
    rationale,
    confidence,
    context: {
      surface: context.surface,
      score: context.score,
      streak: context.streak,
      sessionCount: context.sessionCount,
    },
    result: {
      selectedLoop,
      alternativeLoops: ["buddy_challenge", "streak_rescue", "study_buddy"].filter(
        (l) => l !== selectedLoop
      ),
    },
  });

  return selectedLoop;
}

/**
 * Incentives Agent: Determines reward/incentive for viral action
 */
export async function logIncentivesDecision(
  userId: string,
  context: {
    loop: string;
    previousInvites?: number;
  }
): Promise<string> {
  let incentive = "streak_shield";
  let rationale = "Default: Streak shield for both users on completion";
  let confidence = 0.75;

  if (context.previousInvites && context.previousInvites >= 3) {
    incentive = "bonus_points_100";
    rationale = `Power user (${context.previousInvites} invites sent). Offering bonus points to maintain engagement.`;
    confidence = 0.9;
  } else if (context.loop === "streak_rescue") {
    incentive = "streak_shield_double";
    rationale = "Streak Rescue loop active. Double streak shield to maximize urgency.";
    confidence = 0.88;
  }

  await logAgentDecision({
    type: "incentives",
    userId,
    action: `offer_incentive:${incentive}`,
    rationale,
    confidence,
    context: {
      loop: context.loop,
      previousInvites: context.previousInvites,
    },
    result: {
      incentive,
      estimatedValue: incentive.includes("double") ? "$0.20" : "$0.10",
    },
  });

  return incentive;
}

/**
 * Trust & Safety Agent: Monitors for spam/fraud
 */
export async function logTrustSafetyCheck(
  userId: string,
  context: {
    action: string;
    metadata: Record<string, any>;
  }
): Promise<boolean> {
  // Simple fraud detection rules
  let flagged = false;
  let rationale = "No anomalies detected. Action approved.";
  let confidence = 0.95;

  // Example: Check for rapid invite sending
  if (context.action === "send_invite" && context.metadata.recentInviteCount > 10) {
    flagged = true;
    rationale = `Unusual activity: ${context.metadata.recentInviteCount} invites in short period. Flagged for review.`;
    confidence = 0.82;
  }

  // Log only if flagged (to reduce noise)
  if (flagged) {
    await logAgentDecision({
      type: "trust_safety",
      userId,
      action: `flag_activity:${context.action}`,
      rationale,
      confidence,
      context,
      result: {
        flagged,
        action: "manual_review_required",
      },
    });
  }

  return !flagged; // Return true if safe to proceed
}

