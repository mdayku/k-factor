/**
 * Social Presence Agent
 * Publishes presence, recommends cohorts, nudges invites
 */

import type { SocialPresenceRequest, SocialPresenceResponse } from "mcp-protocol";

// Mock presence data (should come from real-time system in production)
const mockPresence: Record<string, number> = {
  algebra: 28,
  geometry: 15,
  calculus: 42,
  chemistry: 19,
  physics: 31,
  biology: 22,
};

const mockCohorts = [
  { id: "algebra-warriors", name: "Algebra Warriors", subject: "algebra", memberCount: 156, activityLevel: "high" as const },
  { id: "calc-masters", name: "Calculus Masters", subject: "calculus", memberCount: 89, activityLevel: "medium" as const },
  { id: "chem-lab", name: "Chemistry Lab", subject: "chemistry", memberCount: 112, activityLevel: "high" as const },
];

export async function handleSocialPresenceRequest(
  request: SocialPresenceRequest
): Promise<SocialPresenceResponse> {
  const startTime = Date.now();
  const { userId, action, contextData } = request.context as any;

  let response: any = {};

  switch (action) {
    case "get_presence":
      response = await getPresence(contextData);
      break;
    case "recommend_cohort":
      response = await recommendCohort(contextData);
      break;
    case "suggest_invite":
      response = await suggestInvite(contextData);
      break;
  }

  const latencyMs = Date.now() - startTime;

  return {
    decision: response,
    rationale: generateRationale(action, contextData, response),
    featuresUsed: ["subject", "currentCohort", "friendsOnline", "activityLevel"],
    confidence: 0.88,
    latencyMs,
    version: "v1.0",
    timestamp: new Date().toISOString(),
    requestId: request.requestId,
  };
}

async function getPresence(contextData: any): Promise<any> {
  const subject = contextData.subject?.toLowerCase() || "algebra";
  const count = mockPresence[subject] || Math.floor(Math.random() * 50) + 10;

  const presenceMessage = `${count} peers practicing ${contextData.subject || "this subject"} now`;

  return { presenceMessage };
}

async function recommendCohort(contextData: any): Promise<any> {
  const subject = contextData.subject?.toLowerCase() || "algebra";
  
  // Find cohorts matching the subject
  const matchingCohorts = mockCohorts.filter(
    (c) => c.subject === subject
  );

  // Recommend the most active cohort
  const recommended = matchingCohorts.sort(
    (a, b) => b.memberCount - a.memberCount
  )[0];

  if (!recommended) {
    return {};
  }

  return {
    cohortRecommendation: {
      cohortId: recommended.id,
      cohortName: recommended.name,
      memberCount: recommended.memberCount,
      activityLevel: recommended.activityLevel,
    },
  };
}

async function suggestInvite(contextData: any): Promise<any> {
  const friendsOnline = contextData.friendsOnline?.length || 0;
  const subject = contextData.subject;

  // Suggest invite if there are friends online or if studying a popular subject
  const shouldSuggest = friendsOnline > 0 || (mockPresence[subject?.toLowerCase()] || 0) > 30;

  return {
    inviteSuggestion: {
      suggested: shouldSuggest,
      reason: friendsOnline > 0
        ? `${friendsOnline} of your friends are online. Invite them to study together!`
        : shouldSuggest
        ? `${mockPresence[subject?.toLowerCase()] || 0} peers are studying ${subject}. Invite a friend to join!`
        : "No active study groups at the moment",
    },
  };
}

function generateRationale(action: string, contextData: any, response: any): string {
  switch (action) {
    case "get_presence":
      return `Retrieved presence count for ${contextData.subject || "subject"}. ${response.presenceMessage}`;
    case "recommend_cohort":
      return response.cohortRecommendation
        ? `Recommended cohort "${response.cohortRecommendation.cohortName}" with ${response.cohortRecommendation.memberCount} members`
        : "No matching cohorts found";
    case "suggest_invite":
      return response.inviteSuggestion?.suggested
        ? `Suggested invite: ${response.inviteSuggestion.reason}`
        : "Invite not suggested at this time";
    default:
      return `Processed ${action} action`;
  }
}

