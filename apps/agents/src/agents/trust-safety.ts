/**
 * Trust & Safety Agent
 * Fraud detection, COPPA/FERPA compliance, rate limiting, duplicate checks
 */

import type { TrustSafetyRequest, TrustSafetyResponse } from "mcp-protocol";

// In-memory fraud tracking (should use Redis/DB in production)
const deviceRegistry = new Map<string, { userId: string; firstSeen: number; accountCount: number }>();
const emailRegistry = new Map<string, { userId: string; firstSeen: number }>();
const ipRegistry = new Map<string, { userIds: Set<string>; firstSeen: number }>();
const rateLimits = new Map<string, { invitesSent: number; resetAt: number }>();

const MAX_INVITES_PER_DAY = 20;
const MAX_INVITES_PER_HOUR = 5;
const COPPA_AGE_THRESHOLD = 13;

export async function handleTrustSafetyRequest(
  request: TrustSafetyRequest
): Promise<TrustSafetyResponse> {
  const startTime = Date.now();
  const { userId, action, contextData } = request.context as any;

  let decision: any = {
    allowed: true,
    requiresParentalGate: false,
    rateLimitHit: false,
    recommendations: [],
  };

  switch (action) {
    case "check_fraud":
      decision = await checkFraud(userId, contextData);
      break;
    case "check_coppa":
      decision = await checkCOPPA(userId, contextData);
      break;
    case "check_rate_limit":
      decision = await checkRateLimit(userId, contextData);
      break;
    case "check_duplicate":
      decision = await checkDuplicate(userId, contextData);
      break;
  }

  const latencyMs = Date.now() - startTime;

  return {
    decision,
    rationale: generateRationale(action, userId, contextData, decision),
    featuresUsed: ["deviceId", "ipAddress", "email", "age", "parentalConsent", "recentInvites"],
    confidence: 0.95,
    latencyMs,
    version: "v1.0",
    timestamp: new Date().toISOString(),
    requestId: request.requestId,
  };
}

async function checkFraud(userId: string, contextData: any): Promise<any> {
  const { deviceId, ipAddress, email } = contextData;
  let fraudScore = 0.0;
  const reasons: string[] = [];

  // Check device fingerprint
  if (deviceId && deviceRegistry.has(deviceId)) {
    const device = deviceRegistry.get(deviceId)!;
    if (device.accountCount > 3) {
      fraudScore += 0.4;
      reasons.push("Multiple accounts from same device");
    }
  }

  // Check IP address
  if (ipAddress && ipRegistry.has(ipAddress)) {
    const ip = ipRegistry.get(ipAddress)!;
    if (ip.userIds.size > 5) {
      fraudScore += 0.3;
      reasons.push("Multiple accounts from same IP");
    }
  }

  // Check email patterns
  if (email) {
    if (email.includes("+") || email.includes("temp") || email.includes("disposable")) {
      fraudScore += 0.2;
      reasons.push("Suspicious email pattern");
    }
  }

  // Check rapid account creation
  if (deviceId && deviceRegistry.has(deviceId)) {
    const device = deviceRegistry.get(deviceId)!;
    const hoursSinceFirst = (Date.now() - device.firstSeen) / (1000 * 60 * 60);
    if (hoursSinceFirst < 24 && device.accountCount > 2) {
      fraudScore += 0.3;
      reasons.push("Rapid account creation");
    }
  }

  const allowed = fraudScore < 0.7;

  return {
    allowed,
    reason: reasons.length > 0 ? reasons.join("; ") : undefined,
    fraudScore,
    requiresParentalGate: false,
    rateLimitHit: false,
    recommendations: !allowed ? ["Require email verification", "Manual review"] : [],
  };
}

async function checkCOPPA(userId: string, contextData: any): Promise<any> {
  const { age, parentalConsent } = contextData;

  // Check if user is a minor
  const isMinor = age && age < COPPA_AGE_THRESHOLD;

  // Require parental gate if minor without consent
  const requiresParentalGate = isMinor && !parentalConsent;

  // Block if minor without consent
  const allowed = !isMinor || parentalConsent || false;

  return {
    allowed,
    reason: requiresParentalGate ? "Parental consent required for users under 13" : undefined,
    fraudScore: 0.0,
    requiresParentalGate,
    rateLimitHit: false,
    recommendations: requiresParentalGate
      ? ["Display parental consent form", "Request parent email"]
      : [],
  };
}

async function checkRateLimit(userId: string, contextData: any): Promise<any> {
  const now = Date.now();
  const userLimit = rateLimits.get(userId);

  // Initialize or reset if expired
  if (!userLimit || userLimit.resetAt < now) {
    rateLimits.set(userId, {
      invitesSent: 0,
      resetAt: now + 24 * 60 * 60 * 1000, // 24 hours
    });
    return {
      allowed: true,
      fraudScore: 0.0,
      requiresParentalGate: false,
      rateLimitHit: false,
      recommendations: [],
    };
  }

  // Check daily limit
  const dailyLimitHit = userLimit.invitesSent >= MAX_INVITES_PER_DAY;

  // Check hourly limit (simple approximation)
  const hourlyLimitHit = userLimit.invitesSent >= MAX_INVITES_PER_HOUR &&
    (now - (userLimit.resetAt - 24 * 60 * 60 * 1000)) < 60 * 60 * 1000;

  const rateLimitHit = dailyLimitHit || hourlyLimitHit;

  return {
    allowed: !rateLimitHit,
    reason: rateLimitHit
      ? `Rate limit exceeded (${userLimit.invitesSent}/${MAX_INVITES_PER_DAY} invites sent)`
      : undefined,
    fraudScore: rateLimitHit ? 0.3 : 0.0,
    requiresParentalGate: false,
    rateLimitHit,
    recommendations: rateLimitHit
      ? ["Wait 24 hours", "Premium users get higher limits"]
      : [],
  };
}

async function checkDuplicate(userId: string, contextData: any): Promise<any> {
  const { deviceId, email, ipAddress } = contextData;
  const duplicates: string[] = [];

  // Check device duplicates
  if (deviceId && deviceRegistry.has(deviceId)) {
    const device = deviceRegistry.get(deviceId)!;
    if (device.userId !== userId) {
      duplicates.push("Device already registered to another account");
    }
  }

  // Check email duplicates
  if (email && emailRegistry.has(email)) {
    const emailRecord = emailRegistry.get(email)!;
    if (emailRecord.userId !== userId) {
      duplicates.push("Email already registered");
    }
  }

  const isDuplicate = duplicates.length > 0;

  return {
    allowed: !isDuplicate,
    reason: isDuplicate ? duplicates.join("; ") : undefined,
    fraudScore: isDuplicate ? 0.8 : 0.0,
    requiresParentalGate: false,
    rateLimitHit: false,
    recommendations: isDuplicate ? ["Require unique email", "Contact support"] : [],
  };
}

function generateRationale(action: string, userId: string, contextData: any, decision: any): string {
  const status = decision.allowed ? "ALLOWED" : "BLOCKED";
  
  switch (action) {
    case "check_fraud":
      return `Fraud check for user ${userId}: ${status}. Fraud score: ${decision.fraudScore?.toFixed(2)}. ${decision.reason || "No issues detected"}`;
    case "check_coppa":
      return `COPPA check for user ${userId}: ${status}. ${decision.requiresParentalGate ? "Parental consent required" : "Compliant"}`;
    case "check_rate_limit":
      return `Rate limit check for user ${userId}: ${status}. ${decision.rateLimitHit ? "Limit exceeded" : "Within limits"}`;
    case "check_duplicate":
      return `Duplicate check for user ${userId}: ${status}. ${decision.reason || "No duplicates found"}`;
    default:
      return `${action} check for user ${userId}: ${status}`;
  }
}

// Helper functions to update registries
export function registerDevice(userId: string, deviceId: string): void {
  const existing = deviceRegistry.get(deviceId);
  if (existing) {
    existing.accountCount++;
  } else {
    deviceRegistry.set(deviceId, { userId, firstSeen: Date.now(), accountCount: 1 });
  }
}

export function registerEmail(userId: string, email: string): void {
  emailRegistry.set(email, { userId, firstSeen: Date.now() });
}

export function registerIP(userId: string, ipAddress: string): void {
  const existing = ipRegistry.get(ipAddress);
  if (existing) {
    existing.userIds.add(userId);
  } else {
    ipRegistry.set(ipAddress, { userIds: new Set([userId]), firstSeen: Date.now() });
  }
}

export function incrementInviteCount(userId: string): void {
  const now = Date.now();
  const userLimit = rateLimits.get(userId);

  if (!userLimit || userLimit.resetAt < now) {
    rateLimits.set(userId, {
      invitesSent: 1,
      resetAt: now + 24 * 60 * 60 * 1000,
    });
  } else {
    userLimit.invitesSent++;
  }
}

