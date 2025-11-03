/**
 * Tutor Advocacy Agent
 * Generates share-packs for tutors, tracks referrals, manages XP
 */

import type { TutorAdvocacyRequest, TutorAdvocacyResponse } from "mcp-protocol";

// Mock tutor data (should come from database in production)
const tutorData = new Map<string, { xp: number; referrals: number; rating: number }>();

export async function handleTutorAdvocacyRequest(
  request: TutorAdvocacyRequest
): Promise<TutorAdvocacyResponse> {
  const startTime = Date.now();
  const { tutorId, action, contextData } = request.context as any;

  let response: any = {};

  switch (action) {
    case "generate_share_pack":
      response = await generateSharePack(tutorId, contextData);
      break;
    case "track_referral":
      response = await trackReferral(tutorId, contextData);
      break;
    case "calculate_xp":
      response = await calculateXP(tutorId, contextData);
      break;
  }

  const latencyMs = Date.now() - startTime;

  return {
    decision: response,
    rationale: generateRationale(action, tutorId, contextData, response),
    featuresUsed: ["tutorId", "sessionId", "rating", "milestoneAchieved", "referralCount"],
    confidence: 0.90,
    latencyMs,
    version: "v1.0",
    timestamp: new Date().toISOString(),
    requestId: request.requestId,
  };
}

async function generateSharePack(tutorId: string, contextData: any): Promise<any> {
  const { sessionId, rating, milestoneAchieved } = contextData;

  // Only generate share pack for high-rated sessions or milestones
  if (!milestoneAchieved && (!rating || rating < 4.5)) {
    return {};
  }

  const smartLink = `https://varsitytutors.com/r/tutor-${tutorId}-${Date.now()}`;
  
  const copy = milestoneAchieved
    ? `🌟 Proud moment! I just ${milestoneAchieved}. Join me on Varsity Tutors and get a free class!`
    : `Just finished an amazing tutoring session! Join me on Varsity Tutors and let's learn together. 📚`;

  return {
    sharePack: {
      smartLink,
      thumbnail: `https://api.varsitytutors.com/tutor-cards/${tutorId}.png`,
      copy,
      channels: ["whatsapp", "sms", "email", "social"],
    },
  };
}

async function trackReferral(tutorId: string, contextData: any): Promise<any> {
  // Get or create tutor record
  const tutor = tutorData.get(tutorId) || { xp: 0, referrals: 0, rating: 5.0 };
  
  // Increment referral count
  tutor.referrals += 1;
  
  // Award XP for referral (50 XP per referral)
  const referralXP = 50;
  tutor.xp += referralXP;
  
  tutorData.set(tutorId, tutor);

  // Calculate leaderboard rank (mock)
  const rank = calculateLeaderboardRank(tutor.xp);

  return {
    referralXp: referralXP,
    leaderboardRank: rank,
  };
}

async function calculateXP(tutorId: string, contextData: any): Promise<any> {
  const tutor = tutorData.get(tutorId) || { xp: 0, referrals: 0, rating: 5.0 };
  
  let xpToAward = 0;

  // XP for milestones
  if (contextData.milestoneAchieved) {
    xpToAward += 100;
  }

  // XP for referrals
  if (contextData.referralCount) {
    xpToAward += contextData.referralCount * 50;
  }

  // Bonus XP for high ratings
  if (contextData.rating >= 4.8) {
    xpToAward += 25;
  }

  tutor.xp += xpToAward;
  tutorData.set(tutorId, tutor);

  const rank = calculateLeaderboardRank(tutor.xp);

  return {
    referralXp: xpToAward,
    leaderboardRank: rank,
  };
}

function calculateLeaderboardRank(xp: number): number {
  // Simple rank calculation (should query actual leaderboard in production)
  if (xp > 5000) return Math.floor(Math.random() * 10) + 1;
  if (xp > 2000) return Math.floor(Math.random() * 50) + 11;
  if (xp > 500) return Math.floor(Math.random() * 200) + 51;
  return Math.floor(Math.random() * 1000) + 251;
}

function generateRationale(action: string, tutorId: string, contextData: any, response: any): string {
  switch (action) {
    case "generate_share_pack":
      return response.sharePack
        ? `Generated share pack for tutor ${tutorId}. ${contextData.milestoneAchieved ? `Milestone: ${contextData.milestoneAchieved}` : `High rating: ${contextData.rating}/5`}`
        : "Share pack not generated (criteria not met)";
    case "track_referral":
      return `Tracked referral for tutor ${tutorId}. Awarded ${response.referralXp} XP. New rank: #${response.leaderboardRank}`;
    case "calculate_xp":
      return `Calculated ${response.referralXp} XP for tutor ${tutorId}. Current rank: #${response.leaderboardRank}`;
    default:
      return `Processed ${action} for tutor ${tutorId}`;
  }
}

export function getTutorStats(tutorId: string) {
  return tutorData.get(tutorId) || { xp: 0, referrals: 0, rating: 5.0 };
}

