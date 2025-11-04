/**
 * Copy Kit Service
 * Core logic for template retrieval and personalization
 */

import type {
  ViralLoop,
  Persona,
  Tone,
  TemplateKey,
  TemplateVariant,
  PersonalizationContext,
  PersonalizedCopy,
  TemplateListItem,
} from "./types";
import { TEMPLATES, FALLBACK_TEMPLATE } from "./templates";

export class CopyKit {
  /**
   * Get a specific template by loop, persona, tone, and optional version
   */
  getTemplate(key: TemplateKey): TemplateVariant {
    const loopTemplates = TEMPLATES[key.loop];
    if (!loopTemplates) {
      console.warn(`No templates found for loop: ${key.loop}`);
      return FALLBACK_TEMPLATE;
    }

    const personaTemplates = loopTemplates[key.persona];
    if (!personaTemplates) {
      // Try to find any template for this loop
      const fallbackPersona = Object.values(loopTemplates)[0];
      if (fallbackPersona) {
        const fallbackTone = Object.values(fallbackPersona)[0];
        if (fallbackTone) {
          console.warn(
            `No templates found for persona ${key.persona} in loop ${key.loop}, using fallback`
          );
          return fallbackTone;
        }
      }
      return FALLBACK_TEMPLATE;
    }

    const toneTemplate = personaTemplates[key.tone];
    if (!toneTemplate) {
      // Try to find any tone for this persona
      const fallbackTone = Object.values(personaTemplates)[0];
      if (fallbackTone) {
        console.warn(
          `No template found for tone ${key.tone}, using fallback tone`
        );
        return fallbackTone;
      }
      return FALLBACK_TEMPLATE;
    }

    // Version matching (future: support multiple versions per template)
    if (key.version && toneTemplate.version !== key.version) {
      console.warn(
        `Requested version ${key.version} not found, using ${toneTemplate.version}`
      );
    }

    return toneTemplate;
  }

  /**
   * Personalize copy by replacing placeholders with actual values
   */
  personalizeCopy(
    template: TemplateVariant,
    context: PersonalizationContext
  ): PersonalizedCopy {
    let { headline, body, cta } = template;

    // Build replacements map
    const replacements: Record<string, string> = {
      "{subject}": context.subject || "this subject",
      "{score}": context.score?.toString() || "10",
      "{milestone}": context.milestone || "great progress",
      "{student}": context.studentName || "Your student",
      "{wins}": Array.isArray(context.wins)
        ? context.wins.join(", ")
        : "improved scores",
      "{count}": context.studentCount?.toString() || "many",
    };

    // Replace all placeholders
    for (const [placeholder, value] of Object.entries(replacements)) {
      const regex = new RegExp(placeholder.replace(/[{}]/g, "\\$&"), "g");
      headline = headline.replace(regex, value);
      body = body.replace(regex, value);
      cta = cta.replace(regex, value);
    }

    return {
      headline,
      body,
      cta,
      metadata: {
        loop: "" as ViralLoop, // Will be filled by caller
        persona: "" as Persona,
        tone: "" as Tone,
        version: template.version,
      },
    };
  }

  /**
   * Determine appropriate tone based on persona and context
   */
  determineTone(
    persona: Persona,
    context: PersonalizationContext
  ): Tone {
    if (persona === "parent") return "professional";
    if (persona === "tutor") return "professional";

    // For students, vary based on intent
    if (context.intent === "exam_prep") return "motivational";
    if (context.previousEngagement?.includes("playful")) return "playful";

    return "friendly";
  }

  /**
   * Get template and personalize in one call
   */
  getPersonalizedCopy(
    key: TemplateKey,
    context: PersonalizationContext
  ): PersonalizedCopy {
    const template = this.getTemplate(key);
    const personalized = this.personalizeCopy(template, context);

    // Fill in metadata
    personalized.metadata = {
      loop: key.loop,
      persona: key.persona,
      tone: key.tone,
      version: template.version,
    };

    return personalized;
  }

  /**
   * Validate that all required placeholders have values in context
   */
  validatePlaceholders(
    template: TemplateVariant,
    context: PersonalizationContext
  ): { valid: boolean; missing: string[] } {
    const missing: string[] = [];

    for (const placeholder of template.placeholders) {
      const key = placeholder.replace(/[{}]/g, "");
      
      // Map placeholder names to context keys
      const contextKey =
        key === "student"
          ? "studentName"
          : key === "count"
          ? "studentCount"
          : key;

      if (!(contextKey in context) || context[contextKey] === undefined) {
        missing.push(placeholder);
      }
    }

    return {
      valid: missing.length === 0,
      missing,
    };
  }

  /**
   * List all available templates with filters
   */
  listTemplates(filters?: {
    loop?: ViralLoop;
    persona?: Persona;
    tone?: Tone;
  }): TemplateListItem[] {
    const results: TemplateListItem[] = [];

    for (const [loop, personaTemplates] of Object.entries(TEMPLATES)) {
      if (filters?.loop && loop !== filters.loop) continue;

      for (const [persona, toneTemplates] of Object.entries(personaTemplates)) {
        if (filters?.persona && persona !== filters.persona) continue;

        for (const [tone, template] of Object.entries(toneTemplates || {})) {
          if (filters?.tone && tone !== filters.tone) continue;

          results.push({
            loop: loop as ViralLoop,
            persona: persona as Persona,
            tone: tone as Tone,
            version: template.version,
            placeholders: template.placeholders,
            preview: {
              headline: template.headline,
              body: template.body,
              cta: template.cta,
            },
          });
        }
      }
    }

    return results;
  }
}

// Export singleton instance
export const copyKit = new CopyKit();


