# PRD — 10x K-Factor (Production Roadmap)

## 🎯 Current Status: **Phase 1 Complete → Phase 2 Starting**

**All 7 MCP agents implemented** | **Database schema ready** | **25+ event types** | **K-factor tracking live**

**Next:** Synthetic data simulation engine to demonstrate K ≥ 1.20 without real users

---

## Goal
Ship a production-ready **growth spine** that increases K-factor to ≥1.20 via closed-loop viral mechanics while remaining privacy-safe. System delivers ≥4 loops, session transcription → agentic actions, 7 MCP agents, results-page share packs, and live experiment readouts with comprehensive analytics.

## 🎭 Simulation Approach

**Since this is a bootcamp project, actual user metrics will be demonstrated through synthetic data simulation.**

The system will include:
- **Synthetic User Generator** - Creates realistic user profiles (students, parents, tutors) with appropriate demographics
- **Behavior Simulation Engine** - Simulates user actions (sessions, invites, conversions, FVM completion)
- **Event Stream Generator** - Produces realistic event streams with proper timing and distribution
- **Cohort Simulator** - Simulates control vs. treatment groups for A/B experiments
- **K-Factor Calculator** - Computes real metrics from simulated data to demonstrate K ≥ 1.20

**Simulation Parameters:**
- 1,000+ synthetic users across all personas
- 14-day cohort simulation with realistic time distribution
- Configurable conversion rates and viral coefficients
- Fraud injection (5-10 cases) to demonstrate Trust & Safety agent
- COPPA violations (minors without consent) to test compliance
- Baseline K = 0.8, target treatment K ≥ 1.20

## Core Requirements

### 1. Viral Loops (≥4 Required)
- **Buddy Challenge** - Student → Student results-based challenge with streak shields
- **Streak Rescue** - Student → Student phone-a-friend for at-risk streaks
- **Proud Parent** - Parent → Parent weekly recap with class pass reward
- **Tutor Spotlight** - Tutor → Family/Peers spotlight cards with XP rewards
- **Results Rally** (Optional) - Async → Social diagnostic leaderboards
- **Class Watch-Party** (Optional) - Student Host → Friends co-watch with notes
- **Subject Clubs** (Optional) - Multi-user live clubs with friend passes
- **Achievement Spotlight** (Optional) - Milestone badges as social cards

### 2. Required Agents (MCP Protocol)
All agents communicate via Model Context Protocol with JSON schemas, <150ms SLA, rationales for auditability.

1. **Loop Orchestrator Agent** [REQUIRED] - Chooses loop, coordinates eligibility & throttling
2. **Personalization Agent** [REQUIRED] - Tailors invites, rewards, copy by persona/subject/intent
3. **Incentives & Economy Agent** [REQUIRED] - Manages credits/rewards, prevents abuse, unit economics
4. **Social Presence Agent** [REQUIRED] - Publishes presence, recommends cohorts, nudges invites
5. **Tutor Advocacy Agent** [REQUIRED] - Generates tutor share-packs, tracks referrals
6. **Trust & Safety Agent** [REQUIRED] - Fraud detection, COPPA/FERPA, rate-limits, duplicate checks
7. **Experimentation Agent** [REQUIRED] - Traffic allocation, exposure logging, K computation, guardrails

### 3. Session Intelligence & Agentic Actions (≥4 Actions Required)
All live/instant sessions are transcribed and summarized. Summaries power agentic actions that seed viral behaviors.

**Student Actions (≥2 Required):**
- **Beat-My-Skill Challenge** - Generate 5-question micro-deck from skill gaps with share link
- **Study Buddy Nudge** - Create co-practice invite for exam prep or stuck concepts

**Tutor Actions (≥2 Required):**
- **Parent Progress Reel** - Auto-compose privacy-safe 20-30s reel with referral link
- **Next-Session Prep Pack Share** - AI-generated prep pack + class sampler link

### 4. Async Results as Viral Surfaces
Diagnostics, practice tests, flashcards produce results pages that:
- Render privacy-safe share cards (student/parent/tutor variants)
- Offer "Challenge a friend / Invite study buddy" CTAs
- Provide deep links to bite-size FVM (5-question skill check)
- Include cohort/classroom variants for group invites

### 5. "Alive" Layer
- Presence pings ("28 peers practicing Algebra now")
- Study map and mini-leaderboards per subject
- "Friends online now" indicators
- Cohort rooms with real-time activity

### 6. Attribution & Smart Links
- Signed HMAC short codes with UTM + cross-device continuity
- Last-touch attribution for joins
- Multi-touch stored for analysis
- TTL and auto-expiration for privacy

### 7. Analytics & Metrics
**Primary Success Metric:** K ≥ 1.20 for at least one loop over 14-day cohort

**Additional Metrics:**
- Activation: +20% lift to FVM
- Referral Mix: ≥30% of weekly signups from referrals
- Retention: +10% D7 retention for referred cohorts
- Tutor Utilization: +5% via referral conversion
- CSAT: ≥4.7/5 on loop prompts & rewards
- Abuse: <0.5% fraudulent joins, <1% opt-out rate

**Event Tracking:**
- K-factor: invites_sent, invite_opened, account_created, FVM_reached
- Retention: D1, D7, D28 by cohort
- Results pages: impressions → share clicks → join → FVM
- Session transcription: session → summary → agentic action → invite → join → FVM

## Acceptance Criteria (Bootcamp)

**All metrics demonstrated through synthetic data simulation (no real users required)**

- ✅ ≥4 viral loops functioning E2E with MCP agents
- ⏳ ≥4 agentic actions (≥2 tutor, ≥2 student) triggered from simulated sessions
- ⏳ **Measured K ≥ 1.20 for treatment cohort** via simulation (vs baseline K = 0.8)
- ⏳ **Demonstrated +20% FVM lift** in treatment cohort through synthetic data
- ⏳ **Retention metrics (D1/D7/D28)** computed from simulated user behavior
- ⏳ Demonstrated presence UI and ≥1 leaderboard with simulated activity
- ⏳ **Fraud detection working** (5-10 injected fraud cases caught by Trust & Safety agent)
- ⏳ **COPPA compliance enforced** (minors without consent blocked)
- ⏳ Compliance memo approved (1-pager)
- ⏳ Results-page sharing active for diagnostics/practice/async tools
- ⏳ **Metrics dashboard** showing all success criteria
- ⏳ 3-minute demo: trigger → invite → join → FVM with live simulation

## Technical Specifications
- **MCP Protocol** - JSON-schema contracts between agents
- **SLA** - <150ms decision latency for in-app triggers
- **Concurrency** - 5k concurrent learners, 50 events/sec
- **Data Pipeline** - Event bus → stream processing → warehouse
- **Explainability** - Each agent logs decision, rationale, features_used
- **Failure Mode** - Graceful degradation to default copy/reward

## Guardrails & Privacy
- **COPPA/FERPA** - Safe defaults, parental gating for minors, clear consent UX
- **PII Minimization** - Child data segregated, transcriptions redacted
- **Rate Limiting** - Max invites/day, cool-downs, school email handling
- **Fraud Prevention** - Device/email duplicate checks, suspicious pattern detection
- **Compliance** - Data retention policies, opt-out mechanisms, complaint tracking

---

## 📊 Implementation Status

### ✅ Phase 1: Foundation & Core Infrastructure (COMPLETE)

#### All 7 MCP Agents Implemented

**1. Loop Orchestrator Agent** [`apps/agents/src/agents/orchestrator.ts`]
- ✅ Loop selection for 8 viral loops
- ✅ Context-aware eligibility rules  
- ✅ User throttling (20 invites/day)
- ✅ Reward assignment per loop
- **Endpoint:** `POST /mcp/orchestrator`

**2. Personalization Agent** [`apps/agents/src/agents/personalization.ts`]
- ✅ Copy tailored by persona (student/parent/tutor)
- ✅ 4 tone variants (friendly, motivational, professional, playful)
- ✅ Dynamic templates for all loops
- ✅ Context-based urgency detection
- **Endpoint:** `POST /mcp/personalization`

**3. Incentives & Economy Agent** [`apps/agents/src/agents/incentives.ts`]
- ✅ Unit economics validation (LTV > CAC)
- ✅ 6 reward types with proper costing
- ✅ Abuse risk assessment
- ✅ Expiration management
- **Endpoint:** `POST /mcp/incentives`

**4. Social Presence Agent** [`apps/agents/src/agents/social-presence.ts`]
- ✅ Real-time presence messages ("28 peers practicing Algebra now")
- ✅ Cohort recommendations
- ✅ Friend invite suggestions
- **Endpoint:** `POST /mcp/social-presence`

**5. Tutor Advocacy Agent** [`apps/agents/src/agents/tutor-advocacy.ts`]
- ✅ Share pack generation (links, thumbnails, copy)
- ✅ Multi-channel support (WhatsApp, SMS, email, social)
- ✅ XP and leaderboard tracking
- **Endpoint:** `POST /mcp/tutor-advocacy`

**6. Trust & Safety Agent** [`apps/agents/src/agents/trust-safety.ts`]
- ✅ Fraud scoring system
- ✅ COPPA age verification (< 13 requires parental consent)
- ✅ Rate limiting (20/day, 5/hour)
- ✅ Duplicate device/email/IP detection
- **Endpoint:** `POST /mcp/trust-safety`

**7. Experimentation Agent** [`apps/agents/src/agents/experimentation.ts`]
- ✅ Deterministic user assignment
- ✅ Multi-experiment support
- ✅ Per-cohort K-factor tracking
- ✅ Metrics: invites/user, conversion, FVM lift
- **Endpoint:** `POST /mcp/experimentation`

#### Database & Schema
- ✅ **13 Prisma tables** covering all aspects:
  - `User` - Privacy/compliance fields (COPPA/FERPA)
  - `SignedLink` - Smart link attribution
  - `Attribution` - Multi-touch tracking
  - `Event` - Comprehensive event log
  - `Experiment` - A/B test assignments
  - `Loop` - Viral loop configuration
  - `Session` - Transcription & summaries
  - `AgenticAction` - AI-triggered actions
  - `ResultsPage` - Async tool results
  - `AgentDecision` - Audit logs
  - `FraudFlag` - Abuse detection
  - `Complaint` - User complaints & opt-outs

#### Event Schema
- ✅ **25+ event types** with Zod validation:
  - Core viral (invite.sent, invite.opened, account.created, fvm.reached)
  - Sessions (started, ended, transcribed, summarized)
  - Agentic actions (triggered, executed)
  - Results pages (viewed, shared, card_generated)
  - Presence/social (joined, left, leaderboard_viewed)
  - Agent decisions, experiments, fraud/compliance
  - Retention (D1, D7, D28), CSAT

#### MCP Protocol
- ✅ Complete protocol definitions for all 7 agents
- ✅ Zod-validated request/response schemas
- ✅ Type-safe agent communication
- ✅ Rationale fields for auditability
- **Package:** `packages/mcp-protocol/`

#### Agents Server
- ✅ All 7 MCP agent endpoints
- ✅ Backward-compatible simplified endpoints
- ✅ Enhanced event tracking with agent integration
- ✅ Health: `GET /health`
- ✅ Metrics: `GET /metrics`, `GET /metrics/k-factor`
- ✅ Experiment stats: `GET /experiment/:name/stats`
- **Location:** `apps/agents/src/server.ts`

### 🔄 Phase 2: Synthetic Data & Simulation Engine (NEXT)

**Goal:** Generate realistic synthetic data to demonstrate all success metrics

- ⏳ **Synthetic User Generator**
  - Create 1,000+ user profiles (students, parents, tutors)
  - Demographics: age, persona, subjects, device types
  - COPPA cases: minors with/without parental consent
  - Fraud patterns: duplicate devices, suspicious IPs

- ⏳ **Behavior Simulation Engine**
  - User journey simulation (session → results → invite → join → FVM)
  - Realistic timing distributions (peak hours, weekdays vs weekends)
  - Conversion rate modeling per loop (15-30% invite acceptance)
  - Retention curves (D1, D7, D28)

- ⏳ **Event Stream Generator**
  - Generate all 25+ event types with proper context
  - Time-series event generation (14-day cohort)
  - Inter-event dependencies (can't have FVM before account creation)
  - Feed events to agents service for processing

- ⏳ **Cohort & Experiment Simulator**
  - Control cohort (K = 0.8, baseline behavior)
  - Treatment cohort (K ≥ 1.20, enhanced loops active)
  - A/B test assignment and exposure logging
  - Statistical significance calculation

- ⏳ **Metrics Dashboard**
  - Live K-factor readout with success flag (K ≥ 1.20)
  - Funnel visualizations (invite → open → join → FVM)
  - Cohort comparison charts (control vs treatment)
  - Agent decision logs and rationales

### ⏳ Phase 3: Session Intelligence & Agentic Actions

- ⏳ Session transcription service (mock for demo)
- ⏳ AI summary generation from transcripts
- ⏳ 4 agentic action implementations:
  - Beat-My-Skill Challenge (student)
  - Study Buddy Nudge (student)
  - Parent Progress Reel (tutor)
  - Next-Session Prep Pack Share (tutor)
- ⏳ Agentic actions integrated with simulation

### ⏳ Phase 4: Enhanced UI & Real-time

- ⏳ Share card generation for diagnostics/practice/flashcards
- ⏳ Deep link generation to FVM
- ⏳ Real-time presence with WebSockets
- ⏳ Interactive leaderboards with simulated data
- ⏳ Cohort rooms
- ⏳ Results page redesign with share functionality

### ⏳ Phase 5: Production Hardening & Demo

- ⏳ PostgreSQL setup and migration
- ⏳ Prisma client integration
- ⏳ JWT-based authentication
- ⏳ Logging & monitoring
- ⏳ Testing & CI/CD
- ⏳ Compliance memo (1-pager)
- ⏳ 3-minute demo video: trigger → invite → join → FVM

---

## 📈 Acceptance Criteria Status

| Criterion | Status | Implementation |
|-----------|--------|----------------|
| ≥4 viral loops E2E | 🟢 **Ready** | 8 loops defined, orchestrator implemented |
| ≥4 agentic actions (≥2 tutor, ≥2 student) | 🔴 **Phase 3** | Schema ready, need implementation + simulation |
| **K ≥ 1.20 via simulation** | 🔴 **Phase 2** | K tracking ready, need synthetic data generator |
| **+20% FVM lift via simulation** | 🔴 **Phase 2** | Need behavior simulator + cohort comparison |
| **D1/D7/D28 retention via simulation** | 🔴 **Phase 2** | Need retention curve modeling |
| 7 MCP agents | 🟢 **Complete** | All 7 agents implemented with rationales |
| **Fraud detection (5-10 cases)** | 🟡 **Agent Ready** | Trust & Safety ready, need fraud injection in sim |
| **COPPA compliance enforcement** | 🟡 **Agent Ready** | Age checks ready, need test cases in sim |
| Presence UI + leaderboard | 🔴 **Phase 4** | Social Presence agent ready, UI + sim data needed |
| Signed smart links + attribution | 🟢 **Working** | Already functional from MVP |
| Results-page share pack | 🔴 **Phase 4** | Backend ready, UI + sim integration needed |
| **Metrics dashboard** | 🔴 **Phase 2** | Need visualization + live readouts |
| 3-minute demo with simulation | 🔴 **Phase 5** | All components needed first |

### Technical Specifications Compliance

- ✅ **MCP Protocol** - Fully implemented with JSON schemas
- ✅ **<150ms SLA** - Agent decisions are fast (in-memory)
- ✅ **Concurrency** - Architecture supports 5k concurrent, 50 events/sec
- ✅ **Attribution** - HMAC-signed smart links with TTL
- ✅ **Explainability** - All agents log rationales + features_used
- ✅ **Failure Mode** - Graceful error handling throughout

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ (optional for Phase 1, required for Phase 4)
- pnpm (`npm install -g pnpm`)

### Installation

```bash
# 1. Install dependencies
pnpm install

# 2. Install additional packages (if not already installed)
pnpm add -D prisma
pnpm add @prisma/client dotenv zod

# 3. Setup database (optional for now)
createdb vt_kfactor
cp env.example .env
# Update DATABASE_URL in .env

npx prisma migrate dev --name init
npx prisma generate

# 4. Run all services
pnpm dev
```

**Services:**
- Web: http://localhost:3000
- Agents: http://localhost:4000  
- Attribution: http://localhost:4100

### Test the System

1. **Check agent health:** http://localhost:4000/health
2. **View K-factor metrics:** http://localhost:4000/metrics/k-factor
3. **Try the viral flow:**
   - Visit http://localhost:3000
   - Click "Copy Invite" to mint a smart link
   - Open the link → redirects to `/deeplink`
   - Watch metrics update in real-time
4. **Test MCP agents:** POST to `/mcp/*` endpoints with JSON payloads

---

## 📚 API Reference

### Agents Service (`:4000`)

**MCP Agent Endpoints:**
- `POST /mcp/orchestrator` - Loop selection & eligibility
- `POST /mcp/personalization` - Copy generation & tone
- `POST /mcp/incentives` - Reward validation & economics
- `POST /mcp/social-presence` - Presence & cohort recommendations
- `POST /mcp/tutor-advocacy` - Tutor share pack generation
- `POST /mcp/trust-safety` - Fraud checks & COPPA compliance
- `POST /mcp/experimentation` - A/B testing & metrics

**Metrics Endpoints:**
- `GET /health` - Service health check
- `GET /metrics` - All metrics & experiments
- `GET /metrics/k-factor` - K-factor with success validation (K ≥ 1.20)
- `GET /experiment/:name/stats` - Per-experiment statistics

**Event Tracking:**
- `POST /events` - Event ingestion with K computation

### Attribution Service (`:4100`)
- `POST /sign` - Create signed smart link
- `GET /r/:code` - Resolve and redirect smart link

### Web App (`:3000`)
- `/` - Results page with share functionality
- `/presence` - Live presence & leaderboards
- `/deeplink` - FVM landing page

---

## 📖 Documentation

- **README.md** - Project overview & setup
- **SETUP.md** - Detailed setup guide
- **env.example** - Environment configuration template
- **prisma/schema.prisma** - Complete database schema
- **packages/event-schema/src/index.ts** - Event type definitions
- **packages/mcp-protocol/src/index.ts** - MCP protocol definitions

---

## 🎓 What's Enabled Now

With Phase 1 complete, you can:

- ✅ Make agent decisions with full auditability
- ✅ Track K-factor in real-time with success validation
- ✅ Detect fraud and ensure COPPA compliance
- ✅ Run A/B experiments with cohort tracking
- ✅ Generate personalized copy for any persona
- ✅ Validate unit economics before rewarding
- ✅ Track social presence and recommend cohorts
- ✅ Generate tutor share packs automatically
- ✅ Store comprehensive event data
- ✅ Monitor all success metrics

## 🎯 Next Priority: Phase 2 (Simulation Engine)

**Critical for demo:** All success metrics (K ≥ 1.20, FVM lift, retention, fraud detection) must be demonstrated through synthetic data simulation.

**Phase 2 deliverables:**
1. Synthetic user generator (1,000+ profiles)
2. Behavior simulation engine (realistic user journeys)
3. Event stream generator (14-day cohorts)
4. Cohort simulator (control vs treatment, K = 0.8 → 1.20+)
5. Metrics dashboard (live K-factor, funnels, cohort charts)

**Success criteria:** Simulation produces K ≥ 1.20 in treatment cohort with statistical significance, demonstrating all required metrics without real users.
