# Copy Kit - Dynamic Copy Templates

A centralized copy template service for all viral loops with personalization, versioning, and A/B testing support.

## Overview

The Copy Kit provides dynamic copy templates organized by:
- **Viral Loop** (buddy-challenge, streak-rescue, proud-parent, tutor-spotlight)
- **Persona** (student, parent, tutor)
- **Tone** (friendly, motivational, professional, playful)
- **Version** (v1.0, v1.1, etc. for A/B testing)

## Installation

```bash
# In monorepo
pnpm install
pnpm --filter copy-kit build
```

## Usage

### Direct Import

```typescript
import { copyKit } from "copy-kit";

// Get a specific template
const template = copyKit.getTemplate({
  loop: "buddy-challenge",
  persona: "student",
  tone: "friendly",
});

// Personalize with context
const personalized = copyKit.personalizeCopy(template, {
  subject: "Algebra",
  score: 8,
});

console.log(personalized.headline); // "Think you can beat my Algebra score?"
```

### One-Step Personalization

```typescript
import { copyKit } from "copy-kit";

const copy = copyKit.getPersonalizedCopy(
  {
    loop: "streak-rescue",
    persona: "student",
    tone: "playful",
  },
  {
    subject: "Chemistry",
  }
);

console.log(copy);
// {
//   headline: "Streak SOS! 🆘",
//   body: "Need a practice buddy ASAP for Chemistry...",
//   cta: "Rescue Mission",
//   metadata: { loop: "streak-rescue", persona: "student", tone: "playful", version: "v1.0" }
// }
```

### Auto-Determine Tone

```typescript
const tone = copyKit.determineTone("student", {
  intent: "exam_prep",
});
// Returns: "motivational"
```

### List All Templates

```typescript
const allTemplates = copyKit.listTemplates();
// Returns array of all available templates

const studentTemplates = copyKit.listTemplates({ persona: "student" });
// Returns only student templates
```

## API Endpoints

When running the agents service, copy kit is available via REST API:

### GET /copy-kit/template

Get a specific template with optional personalization.

**Query Parameters:**
- `loop` (required): buddy-challenge | streak-rescue | proud-parent | tutor-spotlight
- `persona` (required): student | parent | tutor
- `tone` (optional): friendly | motivational | professional | playful
- `version` (optional): template version (defaults to latest)
- `context` (optional): JSON string with contextData for personalization

**Example:**
```bash
curl "http://localhost:4000/copy-kit/template?loop=buddy-challenge&persona=student&tone=friendly&context=%7B%22subject%22%3A%22Algebra%22%2C%22score%22%3A8%7D"
```

**Response:**
```json
{
  "template": {
    "headline": "Think you can beat my Algebra score?",
    "body": "I just scored 8/10 on Algebra. Take the challenge and let's see who's better! 🎯",
    "cta": "Accept Challenge"
  },
  "metadata": {
    "loop": "buddy-challenge",
    "persona": "student",
    "tone": "friendly",
    "version": "v1.0",
    "personalized": true
  }
}
```

### GET /copy-kit/templates

List all available templates with optional filters.

**Query Parameters:**
- `loop` (optional): filter by loop
- `persona` (optional): filter by persona
- `tone` (optional): filter by tone

**Example:**
```bash
curl "http://localhost:4000/copy-kit/templates?persona=student"
```

## Available Templates

### Buddy Challenge

**Personas:** student, parent  
**Tones:** friendly, motivational (student), professional (parent)

**Student - Friendly:**
- Headline: "Think you can beat my {subject} score?"
- Body: "I just scored {score}/10 on {subject}. Take the challenge and let's see who's better! 🎯"
- CTA: "Accept Challenge"
- Placeholders: `{subject}`, `{score}`

**Student - Motivational:**
- Headline: "Level up together in {subject}!"
- Body: "I'm crushing {subject} right now. Join me and we both get streak shields! 💪"
- CTA: "Let's Do This"
- Placeholders: `{subject}`

**Parent - Professional:**
- Headline: "Your child's {subject} progress"
- Body: "See how your student is improving in {subject}. Join to track their learning journey."
- CTA: "View Progress"
- Placeholders: `{subject}`

### Streak Rescue

**Personas:** student  
**Tones:** friendly, playful

**Student - Friendly:**
- Headline: "Help! My streak is at risk! 😱"
- Body: "Quick practice session in {subject}? If you join, we both save our streaks!"
- CTA: "Save Our Streaks"
- Placeholders: `{subject}`

**Student - Playful:**
- Headline: "Streak SOS! 🆘"
- Body: "Need a practice buddy ASAP for {subject}. Join me and we'll both get streak shields!"
- CTA: "Rescue Mission"
- Placeholders: `{subject}`

### Proud Parent

**Personas:** parent  
**Tones:** professional, friendly

**Parent - Professional:**
- Headline: "Your child achieved {milestone} in {subject}"
- Body: "Weekly progress: {wins}. Invite another parent to get a free class pass."
- CTA: "Share Progress"
- Placeholders: `{milestone}`, `{subject}`, `{wins}`

**Parent - Friendly:**
- Headline: "{student} is crushing it! 🌟"
- Body: "This week: {wins}. Know another parent? Share this and both get a class pass!"
- CTA: "Invite a Parent"
- Placeholders: `{student}`, `{wins}`

### Tutor Spotlight

**Personas:** tutor  
**Tones:** professional

**Tutor - Professional:**
- Headline: "Share your teaching success"
- Body: "You've helped {count} students improve in {subject}. Share your profile and earn XP!"
- CTA: "Share My Profile"
- Placeholders: `{count}`, `{subject}`

## Placeholder Reference

### Available Placeholders

| Placeholder | Context Key | Default Value | Example |
|-------------|-------------|---------------|---------|
| `{subject}` | `subject` | "this subject" | "Algebra" |
| `{score}` | `score` | "10" | "8" |
| `{milestone}` | `milestone` | "great progress" | "Level 5" |
| `{student}` | `studentName` | "Your student" | "Emma" |
| `{wins}` | `wins` | "improved scores" | "5 lessons, 90% avg" |
| `{count}` | `studentCount` | "many" | "12" |

### Context Data Structure

```typescript
interface PersonalizationContext {
  subject?: string;           // e.g., "Algebra", "Chemistry"
  score?: number;             // e.g., 8, 10
  milestone?: string;         // e.g., "Level 5", "10-day streak"
  studentName?: string;       // e.g., "Emma", "John"
  wins?: string[];            // e.g., ["5 lessons", "90% avg"]
  studentCount?: number;      // e.g., 12
  intent?: string;            // e.g., "exam_prep", "casual"
  daysUntilExam?: number;     // e.g., 3
  previousEngagement?: string[]; // e.g., ["playful", "competitive"]
}
```

## Versioning & A/B Testing

The copy kit supports versioning for A/B testing:

```typescript
// Get specific version
const v1Template = copyKit.getTemplate({
  loop: "buddy-challenge",
  persona: "student",
  tone: "friendly",
  version: "v1.0",
});

// Future: Add v1.1, v2.0 variants for A/B testing
```

### Adding New Versions

1. Edit `packages/copy-kit/src/templates.ts`
2. Add new variant with different version number
3. Deploy and track performance
4. Keep winning version, remove losing variants

## Tone Selection Logic

Tone is auto-determined based on persona and context:

- **Parent**: Always `professional`
- **Tutor**: Always `professional`
- **Student**:
  - `motivational` if `intent === "exam_prep"`
  - `playful` if `previousEngagement` includes "playful"
  - `friendly` (default)

Override by specifying tone explicitly:

```typescript
copyKit.getTemplate({
  loop: "buddy-challenge",
  persona: "student",
  tone: "motivational", // explicit override
});
```

## Extensibility

### Adding New Loops

1. Add loop type to `src/types.ts`:
   ```typescript
   export type ViralLoop = "buddy-challenge" | "streak-rescue" | "proud-parent" | "tutor-spotlight" | "new-loop";
   ```

2. Add templates to `src/templates.ts`:
   ```typescript
   "new-loop": {
     student: {
       friendly: {
         version: "v1.0",
         headline: "...",
         body: "...",
         cta: "...",
         placeholders: [...],
       },
     },
   },
   ```

3. Rebuild and deploy:
   ```bash
   pnpm --filter copy-kit build
   ```

### Localization (Future)

Structure supports i18n:

```typescript
// Future structure:
{
  "buddy-challenge": {
    en: { student: { friendly: {...} } },
    es: { student: { friendly: {...} } },
    fr: { student: { friendly: {...} } },
  }
}
```

## Testing

### Validate Placeholders

```typescript
const template = copyKit.getTemplate({
  loop: "buddy-challenge",
  persona: "student",
  tone: "friendly",
});

const validation = copyKit.validatePlaceholders(template, {
  subject: "Algebra",
  // Missing: score
});

console.log(validation);
// { valid: false, missing: ["{score}"] }
```

## Integration

### Used By

- **Personalization Agent** (`apps/agents/src/agents/personalization.ts`)
- **Simulation Engine** (future: for realistic invite messages)
- **Web UI** (future: for inline copy rendering)

### Dependencies

- None! Pure TypeScript, no external dependencies

## Development

```bash
# Watch mode
pnpm --filter copy-kit dev

# Build
pnpm --filter copy-kit build

# Type check
cd packages/copy-kit && tsc --noEmit
```

## License

MIT


