/**
 * Personalization Agent
 * Tailors invites, rewards, and copy by persona, subject, and intent
 */

import type { PersonalizationRequest, PersonalizationResponse } from "mcp-protocol";

const COPY_TEMPLATES = {
  buddy_challenge: {
    student: {
      friendly: {
        headline: "Think you can beat my {subject} score?",
        body: "I just scored {score}/10 on {subject}. Take the challenge and let's see who's better! 🎯",
        cta: "Accept Challenge",
      },
      motivational: {
        headline: "Level up together in {subject}!",
        body: "I'm crushing {subject} right now. Join me and we both get streak shields! 💪",
        cta: "Let's Do This",
      },
    },
    parent: {
      professional: {
        headline: "Your child's {subject} progress",
        body: "See how your student is improving in {subject}. Join to track their learning journey.",
        cta: "View Progress",
      },
    },
  },
  streak_rescue: {
    student: {
      friendly: {
        headline: "Help! My streak is at risk! 😱",
        body: "Quick practice session in {subject}? If you join, we both save our streaks!",
        cta: "Save Our Streaks",
      },
      playful: {
        headline: "Streak SOS! 🆘",
        body: "Need a practice buddy ASAP for {subject}. Join me and we'll both get streak shields!",
        cta: "Rescue Mission",
      },
    },
  },
  proud_parent: {
    parent: {
      professional: {
        headline: "Your child achieved {milestone} in {subject}",
        body: "Weekly progress: {wins}. Invite another parent to get a free class pass.",
        cta: "Share Progress",
      },
      friendly: {
        headline: "{student} is crushing it! 🌟",
        body: "This week: {wins}. Know another parent? Share this and both get a class pass!",
        cta: "Invite a Parent",
      },
    },
  },
  tutor_spotlight: {
    tutor: {
      professional: {
        headline: "Share your teaching success",
        body: "You've helped {count} students improve in {subject}. Share your profile and earn XP!",
        cta: "Share My Profile",
      },
    },
  },
};

export async function handlePersonalizationRequest(
  request: PersonalizationRequest
): Promise<PersonalizationResponse> {
  const startTime = Date.now();
  const { persona, loop, contextData } = request.context as any;

  // Select tone based on context and persona
  const tone = determineTone(persona, contextData);

  // Get copy template
  const copyTemplate = getCopyTemplate(loop, persona, tone);

  // Personalize with context data
  const personalizedCopy = personalizeCopy(copyTemplate, contextData);

  // Determine urgency
  const urgency = determineUrgency(loop, contextData);

  const latencyMs = Date.now() - startTime;

  return {
    decision: {
      copy: personalizedCopy,
      tone,
      urgency,
      personalizationTags: extractPersonalizationTags(contextData),
    },
    rationale: `Selected ${tone} tone for ${persona} persona on ${loop} loop. Context includes: ${Object.keys(contextData).join(", ")}`,
    featuresUsed: ["persona", "loop", "subject", "intent", "previousEngagement"],
    confidence: 0.85,
    latencyMs,
    version: "v1.0",
    timestamp: new Date().toISOString(),
    requestId: request.requestId,
  };
}

function determineTone(
  persona: string,
  contextData: any
): "friendly" | "motivational" | "professional" | "playful" {
  if (persona === "parent") return "professional";
  if (persona === "tutor") return "professional";
  
  // For students, vary based on intent
  if (contextData.intent === "exam_prep") return "motivational";
  if (contextData.previousEngagement?.includes("playful")) return "playful";
  
  return "friendly";
}

function getCopyTemplate(loop: string, persona: string, tone: string): any {
  const templates = COPY_TEMPLATES[loop as keyof typeof COPY_TEMPLATES] || COPY_TEMPLATES.buddy_challenge;
  const personaTemplates = templates[persona as keyof typeof templates] || templates.student;
  const toneTemplate = (personaTemplates as any)[tone] || (personaTemplates as any).friendly;
  
  return toneTemplate || {
    headline: "Join me on Varsity Tutors!",
    body: "Let's learn together",
    cta: "Get Started",
  };
}

function personalizeCopy(template: any, contextData: any): any {
  let { headline, body, cta } = template;

  // Replace placeholders
  const replacements: Record<string, string> = {
    "{subject}": contextData.subject || "this subject",
    "{score}": contextData.score?.toString() || "10",
    "{milestone}": contextData.milestone || "great progress",
    "{student}": contextData.studentName || "Your student",
    "{wins}": contextData.wins?.join(", ") || "improved scores",
    "{count}": contextData.studentCount?.toString() || "many",
  };

  for (const [placeholder, value] of Object.entries(replacements)) {
    headline = headline.replace(new RegExp(placeholder, "g"), value);
    body = body.replace(new RegExp(placeholder, "g"), value);
    cta = cta.replace(new RegExp(placeholder, "g"), value);
  }

  return { headline, body, cta };
}

function determineUrgency(loop: string, contextData: any): "low" | "medium" | "high" {
  if (loop === "streak_rescue") return "high";
  if (contextData.intent === "exam_prep" && contextData.daysUntilExam < 7) return "high";
  if (loop === "buddy_challenge" || loop === "results_rally") return "medium";
  return "low";
}

function extractPersonalizationTags(contextData: any): string[] {
  const tags: string[] = [];
  
  if (contextData.subject) tags.push(`subject:${contextData.subject}`);
  if (contextData.intent) tags.push(`intent:${contextData.intent}`);
  if (contextData.score !== undefined) tags.push(`score:${contextData.score > 70 ? "high" : "medium"}`);
  
  return tags;
}

