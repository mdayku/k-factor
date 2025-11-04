/**
 * Copy Kit API Routes
 * Exposes copy templates via REST API
 */

import { Router } from "express";
import { copyKit } from "copy-kit";
import type { ViralLoop, Persona, Tone, PersonalizationContext } from "copy-kit";

const router = Router();

/**
 * GET /copy-kit/template
 * Get a specific template with optional personalization
 * 
 * Query params:
 * - loop: buddy-challenge | streak-rescue | proud-parent | tutor-spotlight
 * - persona: student | parent | tutor
 * - tone?: friendly | motivational | professional | playful (auto-determined if not provided)
 * - version?: template version (defaults to latest)
 * - context?: JSON string with contextData for personalization
 */
router.get("/template", (req, res) => {
  try {
    const { loop, persona, tone, version, context } = req.query;

    // Validate required params
    if (!loop || !persona) {
      return res.status(400).json({
        error: "Missing required parameters: loop and persona",
        example: "/copy-kit/template?loop=buddy-challenge&persona=student&tone=friendly"
      });
    }

    // Parse context if provided
    let contextData: PersonalizationContext = {};
    if (context && typeof context === "string") {
      try {
        contextData = JSON.parse(context);
      } catch (e) {
        return res.status(400).json({
          error: "Invalid context JSON",
          details: (e as Error).message
        });
      }
    }

    // Determine tone if not provided
    const finalTone = tone 
      ? (tone as Tone)
      : copyKit.determineTone(persona as Persona, contextData);

    // Get template
    const template = copyKit.getTemplate({
      loop: loop as ViralLoop,
      persona: persona as Persona,
      tone: finalTone,
      version: version as string | undefined,
    });

    // Personalize if context provided
    if (Object.keys(contextData).length > 0) {
      const personalized = copyKit.personalizeCopy(template, contextData);
      return res.json({
        template: {
          headline: personalized.headline,
          body: personalized.body,
          cta: personalized.cta,
        },
        metadata: {
          loop,
          persona,
          tone: finalTone,
          version: template.version,
          personalized: true,
        },
      });
    }

    // Return unpersonalized template
    res.json({
      template: {
        headline: template.headline,
        body: template.body,
        cta: template.cta,
      },
      metadata: {
        loop,
        persona,
        tone: finalTone,
        version: template.version,
        placeholders: template.placeholders,
        personalized: false,
      },
    });
  } catch (error) {
    console.error("Copy kit error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: (error as Error).message
    });
  }
});

/**
 * GET /copy-kit/templates
 * List all available templates with optional filters
 * 
 * Query params:
 * - loop?: filter by loop
 * - persona?: filter by persona
 * - tone?: filter by tone
 */
router.get("/templates", (req, res) => {
  try {
    const { loop, persona, tone } = req.query;

    const filters: any = {};
    if (loop) filters.loop = loop;
    if (persona) filters.persona = persona;
    if (tone) filters.tone = tone;

    const templates = copyKit.listTemplates(filters);

    res.json({
      count: templates.length,
      filters: filters,
      templates: templates.map(t => ({
        loop: t.loop,
        persona: t.persona,
        tone: t.tone,
        version: t.version,
        placeholders: t.placeholders,
        preview: t.preview,
      })),
    });
  } catch (error) {
    console.error("Copy kit list error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: (error as Error).message
    });
  }
});

export default router;


