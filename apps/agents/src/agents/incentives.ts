/**
 * Incentives & Economy Agent
 * Manages credits/rewards, prevents abuse, ensures unit economics
 */

import type { IncentivesRequest, IncentivesResponse } from "mcp-protocol";

const REWARD_CONFIG = {
  buddy_challenge: {
    type: "streak_shield" as const,
    amount: 1,
    requiresFriendCompletion: true,
    cost: 0.50, // USD equivalent cost to business
    avgLTV: 15.00, // Average LTV of referred user
  },
  streak_rescue: {
    type: "streak_shield" as const,
    amount: 1,
    requiresFriendCompletion: true,
    cost: 0.50,
    avgLTV: 12.00,
  },
  proud_parent: {
    type: "class_pass" as const,
    amount: 1,
    requiresFriendCompletion: true,
    cost: 5.00,
    avgLTV: 45.00,
  },
  tutor_spotlight: {
    type: "xp_boost" as const,
    amount: 100,
    requiresFriendCompletion: false,
    cost: 0.25,
    avgLTV: 30.00,
  },
  results_rally: {
    type: "gems" as const,
    amount: 50,
    requiresFriendCompletion: false,
    cost: 0.10,
    avgLTV: 10.00,
  },
};

const CAC_THRESHOLD = 8.00; // Max customer acquisition cost

export async function handleIncentivesRequest(
  request: IncentivesRequest
): Promise<IncentivesResponse> {
  const startTime = Date.now();
  const { persona, loop, contextData } = request.context as any;

  // Get reward config for loop
  const config = REWARD_CONFIG[loop as keyof typeof REWARD_CONFIG] || REWARD_CONFIG.buddy_challenge;

  // Check unit economics
  const economicsValid = checkUnitEconomics(config, contextData);

  // Assess abuse risk
  const abuseRisk = assessAbuseRisk(contextData);

  // Calculate expiration (48 hours for most rewards)
  const expiresIn = determineExpiration(loop);

  const latencyMs = Date.now() - startTime;

  return {
    decision: {
      reward: {
        type: config.type,
        amount: config.amount,
        expiresIn,
      },
      requiresFriendCompletion: config.requiresFriendCompletion,
      economicsValid,
      abuseRisk,
    },
    rationale: economicsValid
      ? `Reward approved for ${loop}. LTV (${config.avgLTV}) > CAC (${config.cost}). Abuse risk: ${abuseRisk}`
      : `Reward rejected for ${loop}. Economics check failed (cost: ${config.cost}, LTV: ${config.avgLTV}, CAC threshold: ${CAC_THRESHOLD})`,
    featuresUsed: ["loop", "ltv", "cac", "currentBalance", "conversionProbability"],
    confidence: 0.92,
    latencyMs,
    version: "v1.0",
    timestamp: new Date().toISOString(),
    requestId: request.requestId,
  };
}

function checkUnitEconomics(config: any, contextData: any): boolean {
  const cost = config.cost;
  const expectedLTV = contextData.conversionProbability
    ? config.avgLTV * contextData.conversionProbability
    : config.avgLTV * 0.3; // Default 30% conversion

  // LTV should be at least 2x the reward cost for healthy economics
  const minLTV = cost * 2;
  
  // Also check against CAC threshold
  return expectedLTV >= minLTV && cost <= CAC_THRESHOLD;
}

function assessAbuseRisk(contextData: any): "low" | "medium" | "high" {
  const { currentBalance, ltv, cac } = contextData;

  // High risk if user has very high balance with low LTV
  if (currentBalance?.aiMinutes > 1000 && (ltv || 0) < 5) {
    return "high";
  }

  // High risk if CAC is very high
  if ((cac || 0) > 15) {
    return "high";
  }

  // Medium risk if user has moderate balance
  if (currentBalance?.aiMinutes > 500) {
    return "medium";
  }

  return "low";
}

function determineExpiration(loop: string): number {
  // Urgent loops have shorter expiration
  if (loop === "streak_rescue") {
    return 12 * 60 * 60; // 12 hours
  }
  
  // Most loops have 48 hour expiration
  return 48 * 60 * 60; // 48 hours
}

export function calculateRewardValue(rewardType: string, amount: number): number {
  const values: Record<string, number> = {
    ai_minutes: 0.10, // $0.10 per minute
    class_pass: 5.00, // $5 per class
    gems: 0.002, // $0.002 per gem
    xp_boost: 0.001, // $0.001 per XP
    streak_shield: 0.50, // $0.50 value
    power_up: 0.25, // $0.25 value
  };

  return (values[rewardType] || 0) * amount;
}

