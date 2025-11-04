/**
 * Copy Kit Type Definitions
 */

export type ViralLoop =
  | "buddy-challenge"
  | "streak-rescue"
  | "proud-parent"
  | "tutor-spotlight";

export type Persona = "student" | "parent" | "tutor";

export type Tone = "friendly" | "motivational" | "professional" | "playful";

export type TemplateVersion = string; // e.g., "v1.0", "v1.1", "v2.0"

export interface CopyTemplate {
  headline: string;
  body: string;
  cta: string;
}

export interface TemplateVariant extends CopyTemplate {
  version: TemplateVersion;
  placeholders: string[];
  metadata?: {
    characterLimit?: {
      headline: number;
      body: number;
      cta: number;
    };
    hasEmoji?: boolean;
    urgency?: "low" | "medium" | "high";
  };
}

export interface TemplateKey {
  loop: ViralLoop;
  persona: Persona;
  tone: Tone;
  version?: TemplateVersion;
}

export interface PersonalizationContext {
  subject?: string;
  score?: number;
  milestone?: string;
  studentName?: string;
  wins?: string[];
  studentCount?: number;
  intent?: string;
  daysUntilExam?: number;
  previousEngagement?: string[];
  [key: string]: any;
}

export interface PersonalizedCopy extends CopyTemplate {
  metadata: {
    loop: ViralLoop;
    persona: Persona;
    tone: Tone;
    version: TemplateVersion;
  };
}

export interface TemplateListItem {
  loop: ViralLoop;
  persona: Persona;
  tone: Tone;
  version: TemplateVersion;
  placeholders: string[];
  preview: CopyTemplate;
}


