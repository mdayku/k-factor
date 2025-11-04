# Real AI Agents - Future Implementation

## Current State vs. Real AI

### What We Have Now (Simulation/Demo)
- **Rule-based "agents"**: TypeScript functions with if/else logic
- **No LLM integration**: No OpenAI, Anthropic, or other AI APIs
- **Static copy**: Templates with placeholder replacement via Copy Kit
- **Deterministic**: Same inputs → same outputs
- **Purpose**: Demo the architecture, show K-factor metrics with synthetic data

### What Real AI Agents Would Be

Real AI agents would use Large Language Models (LLMs) to generate dynamic, contextual responses and make intelligent decisions in real-time.

---

## Phase: Real AI Agent Integration

### Goal
Transform rule-based "agents" into true AI agents that can interact with users, generate personalized content, and make contextual decisions using LLMs.

### Priority Agents for AI Integration

#### 1. **Personalization Agent** (HIGHEST PRIORITY)
**Current**: Selects pre-written copy templates based on persona/tone rules
**With AI**: Dynamically generates personalized invite messages

**Implementation:**
```typescript
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generatePersonalizedInvite(context: {
  persona: "student" | "parent" | "tutor";
  loop: string;
  subject: string;
  score?: number;
  studentName?: string;
}): Promise<{ headline: string; body: string; cta: string }> {
  const prompt = `
You are a growth copywriter for an education platform. Generate a personalized invite message.

Context:
- Persona: ${context.persona}
- Loop type: ${context.loop}
- Subject: ${context.subject}
- Score: ${context.score || "N/A"}
${context.studentName ? `- Student name: ${context.studentName}` : ""}

Generate a JSON response with:
- headline: Short, attention-grabbing (max 60 chars)
- body: Personal, motivating message (max 160 chars)
- cta: Action-oriented button text (max 20 chars)

Tone should be ${context.persona === "parent" ? "professional" : context.loop === "streak_rescue" ? "urgent and playful" : "friendly and motivating"}.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a growth copywriting expert." },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content);
}
```

**Benefits:**
- Every invite is unique and contextual
- Can incorporate recent events, trends, cultural moments
- A/B testing happens naturally (different generations)
- Adapts to user's language, emoji usage, writing style

**Cost**: ~$0.001-0.003 per invite (GPT-4o-mini)

---

#### 2. **Study Buddy Agent** (HIGH PRIORITY)
**New Agent**: AI tutor that helps students in real-time

**Purpose:**
- Answer homework questions
- Explain concepts when students are stuck
- Encourage students to invite friends for group study
- Generate practice problems

**Implementation:**
```typescript
async function handleStudentQuestion(
  userId: string,
  question: string,
  subject: string
): Promise<{
  answer: string;
  encouragement: string;
  suggestInvite?: {
    message: string;
    cta: string;
  };
}> {
  const conversationHistory = await getConversationHistory(userId);
  
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are a friendly AI tutor for ${subject}. 
        - Answer questions clearly and helpfully
        - Use the Socratic method when appropriate
        - If the student is stuck on multiple questions, suggest inviting a study buddy
        - Be encouraging and positive`,
      },
      ...conversationHistory,
      { role: "user", content: question },
    ],
  });

  // Detect struggle → trigger viral loop
  if (isStudentStruggling(conversationHistory)) {
    return {
      answer: response.choices[0].message.content,
      encouragement: "You're working hard! Sometimes studying with a friend helps.",
      suggestInvite: {
        message: "Want to invite a friend to tackle this together? You'll both get streak shields!",
        cta: "Invite Study Buddy",
      },
    };
  }

  return {
    answer: response.choices[0].message.content,
    encouragement: "Great question! Keep it up!",
  };
}
```

**Viral Integration:**
- Detects when students are struggling
- Suggests "Study Buddy" invite (viral loop)
- Makes invites feel helpful, not spammy

**Cost**: ~$0.01-0.03 per conversation (GPT-4o)

---

#### 3. **Parent Progress Agent** (MEDIUM PRIORITY)
**Current**: Static progress summaries
**With AI**: Natural language progress reports

**Purpose:**
- Generate personalized weekly progress reports for parents
- Highlight wins, areas for improvement
- Encourage parent → parent sharing

**Implementation:**
```typescript
async function generateProgressReport(
  studentId: string,
  parentId: string,
  weekData: {
    sessionsCompleted: number;
    avgScore: number;
    subjects: string[];
    milestones: string[];
  }
): Promise<{
  report: string; // Natural language summary
  shareMessage: string; // Encourage parent to share
}> {
  const prompt = `
Generate a warm, encouraging weekly progress report for a parent about their child.

Data:
- Sessions: ${weekData.sessionsCompleted}
- Average score: ${weekData.avgScore}%
- Subjects: ${weekData.subjects.join(", ")}
- Milestones: ${weekData.milestones.join(", ")}

Write a 2-3 sentence summary that:
1. Celebrates wins
2. Notes areas of growth
3. Is encouraging and specific

Then suggest a natural way for the parent to share this with other parents (viral loop).
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a supportive education advisor." },
      { role: "user", content: prompt },
    ],
    temperature: 0.6,
  });

  const content = response.choices[0].message.content;
  // Parse report and share message
  // ...
  
  return { report, shareMessage };
}
```

**Viral Integration:**
- Parents naturally want to share good news
- AI makes reports shareable and brag-worthy
- Includes subtle invite CTA: "Know another parent who'd love this?"

---

#### 4. **Loop Orchestrator Agent** (MEDIUM PRIORITY)
**Current**: Deterministic loop selection based on context
**With AI**: Intelligent loop selection based on user psychology

**Purpose:**
- Analyze user behavior, mood, timing
- Select optimal viral loop and timing
- Maximize conversion while maintaining user trust

**Implementation:**
```typescript
async function selectOptimalLoop(context: {
  userId: string;
  recentActions: string[];
  currentSession: SessionData;
  timeOfDay: string;
  dayOfWeek: string;
}): Promise<{
  loop: string;
  reasoning: string;
  timing: "now" | "end-of-session" | "tomorrow";
}> {
  const userProfile = await getUserProfile(context.userId);
  
  const prompt = `
You are a growth strategist. Select the best viral loop to show this user.

User context:
${JSON.stringify(context, null, 2)}

User profile:
${JSON.stringify(userProfile, null, 2)}

Available loops:
- buddy-challenge: "Beat my score" competition (works when user just did well)
- streak-rescue: Help save streaks (works when user or friend at risk)
- proud-parent: Share progress (works after milestones)
- tutor-spotlight: Share tutor success (works for tutors with wins)

Select the loop most likely to convert, explain why, and suggest timing.
Return JSON: { loop, reasoning, timing }
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content);
}
```

**Benefits:**
- Smarter loop selection = higher K-factor
- Respects user intent (not spammy)
- Learns from historical data

---

## Infrastructure Requirements

### 1. **LLM Provider Setup**
```typescript
// lib/ai.ts
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// For cost optimization: use different models for different tasks
export const MODELS = {
  creative: "gpt-4o", // For copy generation
  fast: "gpt-4o-mini", // For simple tasks
  reasoning: "claude-3-5-sonnet-20241022", // For complex decisions
};
```

### 2. **Prompt Management**
- Store prompts in database or config files
- Version control for A/B testing
- Monitor prompt performance (conversion rate per prompt)

### 3. **Caching & Rate Limiting**
- Cache common responses (e.g., subject explanations)
- Rate limit per user (prevent abuse)
- Fallback to templates if AI unavailable

### 4. **Monitoring & Logging**
- Log all AI requests/responses (for improvement)
- Track costs per agent
- Monitor latency (keep under 2s)
- A/B test AI-generated vs template copy

### 5. **Safety & Compliance**
- Content moderation (OpenAI Moderation API)
- COPPA compliance: No PII in prompts for minors
- Parent approval for AI interactions with children
- Clear disclosure: "AI-generated content"

---

## Cost Estimates (Monthly)

Assuming **10,000 active users**:

| Agent | Usage per User | Cost per Call | Monthly Cost |
|-------|----------------|---------------|--------------|
| Personalization (GPT-4o-mini) | 5 invites/month | $0.002 | $100 |
| Study Buddy (GPT-4o) | 10 questions/month | $0.02 | $2,000 |
| Parent Reports (GPT-4o-mini) | 4 reports/month | $0.003 | $120 |
| Loop Orchestrator (GPT-4o-mini) | 20 decisions/month | $0.001 | $200 |
| **Total** | | | **~$2,500/month** |

**For 100K users**: ~$25K/month
**For 1M users**: ~$250K/month (negotiate enterprise pricing)

---

## Implementation Plan

### Phase 1: Proof of Concept (1-2 weeks)
- Integrate OpenAI API
- Build Personalization Agent with AI
- A/B test AI-generated vs template copy
- Measure K-factor lift

### Phase 2: Study Buddy Agent (2-3 weeks)
- Build conversational AI tutor
- Integrate with viral loops
- Add safety guardrails (content moderation)
- Test with small user group

### Phase 3: Parent Reports (1 week)
- AI-generated progress summaries
- Natural language sharing prompts
- Track parent → parent conversion

### Phase 4: Scale & Optimize (Ongoing)
- Monitor costs and latency
- Optimize prompts for conversion
- Add caching for common queries
- Fine-tune models on user data (if enough volume)

---

## Key Decisions

### When to Use AI vs. Templates?

**Use AI when:**
- Personalization matters (names, recent events, context)
- User is engaging with content (asking questions, interacting)
- High-value moments (invite send, milestone celebration)

**Use Templates when:**
- Low-stakes notifications
- Cost must be minimal
- Latency must be < 100ms
- User hasn't opted into AI features

### Which LLM Provider?

- **OpenAI (GPT-4o-mini)**: Best cost/quality for most tasks
- **Anthropic (Claude)**: Better reasoning, longer context windows
- **Open Source (Llama 3.1)**: Self-hosted, lowest cost, but more work

### Privacy & Trust

- **Transparency**: Tell users when AI is involved
- **Opt-in**: Let users choose AI vs. template experience
- **Data minimization**: Don't send PII to LLMs
- **Human oversight**: Review AI outputs for quality

---

## Alternative: Hybrid Approach

Instead of full AI agents, use **AI-augmented templates**:

```typescript
// Generate template variations with AI, then cache them
async function generateTemplateVariations(baseTemplate: string): Promise<string[]> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{
      role: "user",
      content: `Generate 10 variations of this template: "${baseTemplate}"`,
    }],
  });
  
  // Cache these variations for 24 hours
  return parseVariations(response.choices[0].message.content);
}

// At runtime, pick a random variation (no API call)
function getInviteCopy(loop: string, persona: string): string {
  const variations = getCachedVariations(loop, persona);
  return variations[Math.floor(Math.random() * variations.length)];
}
```

**Benefits:**
- AI quality at template cost
- Fresh copy every day
- Zero latency at runtime

---

## Summary

**Current System**: Good for demo, shows architecture, proves K-factor concept

**With Real AI**: 
- Study Buddy Agent creates real value (not just viral mechanics)
- Personalization Agent 10x's conversion rates
- Parent Reports drive parent → parent growth
- System becomes genuinely helpful, not just growth-hacking

**Next Step**: 
1. Add OpenAI API key to environment
2. Implement Personalization Agent with AI
3. A/B test vs. current templates
4. Measure K-factor lift before scaling

**Estimated Impact**: AI agents could increase K-factor by **30-50%** (industry benchmarks for AI-personalized growth campaigns)

---

*Document created: December 2024*  
*Context: Copy Kit extraction complete, simulation integrated, ready for real AI when needed*


