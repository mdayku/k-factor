/**
 * Copy Templates Database
 * All copy templates organized by loop, persona, and tone
 */

import type { ViralLoop, Persona, Tone, TemplateVariant } from "./types";

export const TEMPLATES: Record<
  ViralLoop,
  Partial<Record<Persona, Partial<Record<Tone, TemplateVariant>>>>
> = {
  "buddy-challenge": {
    student: {
      friendly: {
        version: "v1.0",
        headline: "Think you can beat my {subject} score?",
        body: "I just scored {score}/10 on {subject}. Take the challenge and let's see who's better! 🎯",
        cta: "Accept Challenge",
        placeholders: ["{subject}", "{score}"],
        metadata: {
          characterLimit: {
            headline: 60,
            body: 160,
            cta: 20,
          },
          hasEmoji: true,
          urgency: "medium",
        },
      },
      motivational: {
        version: "v1.0",
        headline: "Level up together in {subject}!",
        body: "I'm crushing {subject} right now. Join me and we both get streak shields! 💪",
        cta: "Let's Do This",
        placeholders: ["{subject}"],
        metadata: {
          characterLimit: {
            headline: 60,
            body: 160,
            cta: 20,
          },
          hasEmoji: true,
          urgency: "medium",
        },
      },
    },
    parent: {
      professional: {
        version: "v1.0",
        headline: "Your child's {subject} progress",
        body: "See how your student is improving in {subject}. Join to track their learning journey.",
        cta: "View Progress",
        placeholders: ["{subject}"],
        metadata: {
          characterLimit: {
            headline: 60,
            body: 160,
            cta: 20,
          },
          hasEmoji: false,
          urgency: "low",
        },
      },
    },
  },

  "streak-rescue": {
    student: {
      friendly: {
        version: "v1.0",
        headline: "Help! My streak is at risk! 😱",
        body: "Quick practice session in {subject}? If you join, we both save our streaks!",
        cta: "Save Our Streaks",
        placeholders: ["{subject}"],
        metadata: {
          characterLimit: {
            headline: 60,
            body: 160,
            cta: 20,
          },
          hasEmoji: true,
          urgency: "high",
        },
      },
      playful: {
        version: "v1.0",
        headline: "Streak SOS! 🆘",
        body: "Need a practice buddy ASAP for {subject}. Join me and we'll both get streak shields!",
        cta: "Rescue Mission",
        placeholders: ["{subject}"],
        metadata: {
          characterLimit: {
            headline: 60,
            body: 160,
            cta: 20,
          },
          hasEmoji: true,
          urgency: "high",
        },
      },
    },
  },

  "proud-parent": {
    parent: {
      professional: {
        version: "v1.0",
        headline: "Your child achieved {milestone} in {subject}",
        body: "Weekly progress: {wins}. Invite another parent to get a free class pass.",
        cta: "Share Progress",
        placeholders: ["{milestone}", "{subject}", "{wins}"],
        metadata: {
          characterLimit: {
            headline: 60,
            body: 160,
            cta: 20,
          },
          hasEmoji: false,
          urgency: "low",
        },
      },
      friendly: {
        version: "v1.0",
        headline: "{student} is crushing it! 🌟",
        body: "This week: {wins}. Know another parent? Share this and both get a class pass!",
        cta: "Invite a Parent",
        placeholders: ["{student}", "{wins}"],
        metadata: {
          characterLimit: {
            headline: 60,
            body: 160,
            cta: 20,
          },
          hasEmoji: true,
          urgency: "low",
        },
      },
    },
  },

  "tutor-spotlight": {
    tutor: {
      professional: {
        version: "v1.0",
        headline: "Share your teaching success",
        body: "You've helped {count} students improve in {subject}. Share your profile and earn XP!",
        cta: "Share My Profile",
        placeholders: ["{count}", "{subject}"],
        metadata: {
          characterLimit: {
            headline: 60,
            body: 160,
            cta: 20,
          },
          hasEmoji: false,
          urgency: "low",
        },
      },
    },
  },
};

/**
 * Fallback template when specific variant not found
 */
export const FALLBACK_TEMPLATE: TemplateVariant = {
  version: "v1.0",
  headline: "Join me on Varsity Tutors!",
  body: "Let's learn together and achieve our goals.",
  cta: "Get Started",
  placeholders: [],
  metadata: {
    hasEmoji: false,
    urgency: "low",
  },
};


