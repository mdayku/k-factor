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

- ⏳ **Metrics Dashboard (Deliverable #5)**
  - Live K-factor readout with success flag (K ≥ 1.20)
  - Funnel visualizations (invite → open → join → FVM)
  - Cohort comparison charts (control vs treatment)
  - Agent decision logs and rationales
  - Retention curves (D1/D7/D28) with cohort comparison
  - Fraud detection events timeline
  - CSAT and opt-out metrics
  - Export functionality (CSV/JSON for analysis)

### ⏳ Phase 3: Session Intelligence & Agentic Actions (Deliverable #3)

**Goal:** Implement transcription → summary → agentic actions → viral loops pipeline

- ⏳ **Session Transcription Service**
  - Mock transcription service for demo (simulated transcripts)
  - WebSocket connection for real-time transcription updates
  - Transcription storage in `Session.transcription` field
  - Privacy-safe transcription (PII redaction for minors)

- ⏳ **AI Summary Generation**
  - Extract key moments, skill gaps, wins from transcripts
  - Store structured summaries in `Session.summary` JSON field
  - Identify triggers for agentic actions (stuck concepts, exam prep, milestones)
  - Parent-safe summaries (FERPA compliant)

- ⏳ **Agentic Action Implementations (≥4 required)**
  - **Beat-My-Skill Challenge** (student → student)
    - Generate 5-question micro-deck from skill gaps
    - Create share link with deep link to challenge
    - Award streak shields to both users on FVM completion
  - **Study Buddy Nudge** (student → student)
    - Detect exam prep or stuck concepts from summary
    - Create co-practice invite tied to specific deck
    - Show presence "friend joined" signal
  - **Parent Progress Reel** (tutor → parent)
    - Auto-compose 20-30s privacy-safe reel from key moments
    - Include referral link with class pass reward
    - Track reel views and conversions
  - **Next-Session Prep Pack Share** (tutor → peers/parents)
    - Generate AI prep pack from session summary
    - Create class sampler link for tutor to share
    - Credit tutor's referral XP on joins

- ⏳ **Integration with Viral Loops**
  - Connect agentic actions to Orchestrator agent
  - Track agentic action → invite → join → FVM funnel
  - Simulate agentic actions in Phase 2 simulation data
  - Store all actions in `AgenticAction` table

### ⏳ Phase 4: Enhanced UI & Real-time (Deliverables #1, #8)

**Goal:** Complete thin-slice prototype with real-time features and results-page share packs

- ⏳ **Results-Page Share Packs (Deliverable #8)**
  - **Share Card Generation**
    - Privacy-safe cards for diagnostics, practice tests, flashcards
    - Three variants: student, parent, tutor
    - Include score, skills heatmap (redacted if needed)
    - Social media friendly dimensions (1200x630 for OG)
  - **Challenge CTAs**
    - "Challenge a friend" button with personalized copy
    - "Invite study buddy" for co-practice
    - "Share progress" for parents
  - **Deep Links to FVM**
    - 5-question skill check landing page
    - Pre-filled context from share origin
    - Track deep link → FVM completion
  - **Cohort/Classroom Variants**
    - Bulk invite for teachers
    - Group challenge creation
    - Classroom leaderboard integration
  - **Results Page Redesign**
    - Integrate share functionality into existing results pages
    - Show "X friends challenged" social proof
    - Results-page impressions → share clicks tracking

- ⏳ **Real-Time Presence Layer (Deliverable #1 completion)**
  - **WebSocket Infrastructure**
    - WebSocket server for presence updates
    - Connection pooling and scaling considerations
    - Heartbeat/keepalive mechanism
  - **Presence Signals**
    - "28 peers practicing Algebra now" live count
    - "Friends online now" indicators
    - Subject-specific activity streams
  - **Interactive Leaderboards**
    - Real-time rank updates with simulated data
    - Per-subject leaderboards
    - Friend leaderboards (filtered view)
    - Animations for rank changes
  - **Cohort Rooms**
    - Live cohort activity feed
    - Co-practice session initiation
    - Shared practice goals and progress
  - **Integration with Simulation**
    - Feed simulated presence data to WebSocket
    - Realistic presence patterns (peak hours)
    - Demo mode with accelerated activity

### ⏳ Phase 5: Database & Production Hardening

**Database Deployment:**
- ⏳ PostgreSQL database provisioning (local or cloud)
- ⏳ Environment configuration with production DATABASE_URL
- ⏳ Run Prisma migrations (`prisma migrate deploy`)
- ⏳ Seed database with initial data
- ⏳ Database backup and recovery procedures
- ⏳ Connection pooling setup (PgBouncer recommended)

**Production Features:**
- ⏳ Prisma client integration in all services
- ⏳ JWT-based authentication & authorization
- ⏳ Rate limiting & DDoS protection
- ⏳ Logging & monitoring (structured logs)
- ⏳ Error tracking (Sentry or similar)
- ⏳ Performance monitoring & APM
- ⏳ Testing & CI/CD enhancements
- ⏳ API documentation (Swagger/OpenAPI)

### ⏳ Phase 6: Final Deliverables & Demo (Deliverables #6, #7, #9)

**Goal:** Complete all documentation, polish, and create demo

- ⏳ **Copy Kit Extraction (Deliverable #6)**
  - Extract copy templates from personalization agent to separate service
  - Organize templates by loop, persona, tone
  - **Templates needed:**
    - Buddy Challenge (student: friendly, motivational)
    - Streak Rescue (student: friendly, playful)
    - Proud Parent (parent: professional, friendly)
    - Tutor Spotlight (tutor: professional)
    - Results Rally, Class Watch-Party, Subject Clubs, Achievement Spotlight
  - Localization structure (English + extensible for i18n)
  - Version control for copy A/B testing
  - API endpoint for copy retrieval
  - Documentation of available placeholders and personalization variables

- ⏳ **Risk & Compliance Memo (Deliverable #7 - 1 pager)**
  - **Data Flows Section:**
    - Event pipeline architecture diagram
    - PII handling and minimization strategy
    - Data retention policies (child data segregation)
    - Cross-service data flow (web → agents → attribution)
  - **Consent Mechanisms:**
    - COPPA gating flow for minors (< 13)
    - Parental consent workflow
    - FERPA compliance for education records
    - Opt-in/opt-out mechanisms
  - **Privacy Guardrails:**
    - Age verification at registration
    - Parental email validation
    - Privacy-safe transcription (PII redaction)
    - Share card privacy controls
  - **Fraud Prevention:**
    - Device/IP/email duplicate detection
    - Rate limiting (20/day, 5/hour)
    - Suspicious pattern detection
    - Manual review triggers
  - **Opt-Out Procedures:**
    - Growth communications opt-out
    - Data deletion requests (GDPR/CCPA ready)
    - Complaint handling workflow

- ⏳ **3-Minute Demo Video (Deliverable #9)**
  - **Script & Storyboard:**
    - 0:00-0:30 - Problem statement & K-factor goal
    - 0:30-1:00 - Trigger → Invite flow with agent decisions
    - 1:00-1:30 - Join → FVM journey with deep links
    - 1:30-2:15 - Live metrics dashboard (K ≥ 1.20, cohort comparison)
    - 2:15-2:45 - Fraud detection & COPPA enforcement demos
    - 2:45-3:00 - Results summary & next steps
  - **Demo Environment Setup:**
    - Seeded simulation data (14-day cohort)
    - Pre-configured user journeys for smooth flow
    - Dashboard with live metrics updating
    - Multiple browser windows for sender/receiver views
  - **Recording & Editing:**
    - Screen recording with voiceover
    - Callout annotations for key features
    - Background music (optional)
    - Subtitles/captions
  - **Demo Deliverables:**
    - Video file (MP4, 1080p)
    - Demo script document
    - Screenshots of key moments

- ⏳ **Final Polish**
  - Code cleanup and linting
  - Remove console.logs and debug code
  - Update all documentation with final state
  - Verify all acceptance criteria met
  - Performance optimization
  - Security audit of exposed endpoints
  - Final CI/CD run validation

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

---

## 📋 Bootcamp Deliverables Checklist

**Required deliverables from bootcamp brief:**

### 1. ✅ Thin-Slice Prototype (Web/Mobile)
- ✅ **Status:** Phase 1 Complete  
- **Details:** Next.js web app with results pages, presence UI, deep links
- **Working loops:** Buddy Challenge, Streak Rescue, Proud Parent, Tutor Spotlight (+ 4 more defined)
- **Live presence:** Stub UI ready, needs WebSockets + simulation data (Phase 4)

### 2. ✅ MCP Agent Code for All 7 Agents
- ✅ **Status:** Phase 1 Complete
- **Agents:** Orchestrator, Personalization, Incentives, Social Presence, Tutor Advocacy, Trust & Safety, Experimentation
- **Details:** Full implementations in `apps/agents/src/agents/`, all with MCP protocol, rationales, and auditability
- **Endpoints:** 7 dedicated `/mcp/*` endpoints + health/metrics

### 3. ⏳ Session Transcription + Summary Hooks → Agentic Actions
- ⏳ **Status:** Phase 3 (Schema ready)
- **Requirements:** ≥4 agentic actions (≥2 tutor, ≥2 student) feeding viral loops
- **Defined actions:**
  - Beat-My-Skill Challenge (student → student)
  - Study Buddy Nudge (student → student)
  - Parent Progress Reel (tutor → parent)
  - Next-Session Prep Pack Share (tutor → peers/parents)
- **Database:** `Session` and `AgenticAction` tables ready

### 4. ✅ Signed Smart Links + Attribution Service
- ✅ **Status:** Working from MVP
- **Details:** HMAC-signed short codes with UTM parameters
- **Service:** `apps/attribution/src/server.ts`
- **Database:** `SignedLink` and `Attribution` tables
- **Features:** Last-touch attribution, multi-touch tracking, cross-device continuity

### 5. ⏳ Event Spec & Dashboards
- 🟢 **Event Spec:** Complete (25+ event types in `packages/event-schema/`)
- 🟡 **K-factor tracking:** Implemented, needs simulation data
- ⏳ **Dashboards:** Phase 2 (need visualization + live readouts)
- **Metrics:** K, invites/user, conversion, FVM, retention (D1/D7/D28), guardrails

### 6. 🟡 Copy Kit: Dynamic Templates by Persona
- 🟡 **Status:** Partially implemented
- **Location:** `apps/agents/src/agents/personalization.ts`
- **Templates:** Buddy Challenge, Streak Rescue, Proud Parent, Tutor Spotlight
- **Tones:** Friendly, motivational, professional, playful
- **Personas:** Student, parent, tutor
- **Localization:** English only (extensible for i18n)
- **TODO:** Extract to separate copy kit file/service

### 7. ⏳ Risk & Compliance Memo (1-Pager)
- ⏳ **Status:** Phase 6
- **Content required:**
  - Data flows (event pipeline, PII handling)
  - Consent mechanisms (COPPA/FERPA gating)
  - Privacy guardrails (age checks, parental consent)
  - Fraud prevention measures
  - Opt-out procedures
- **Schema support:** `User.coppaCompliant`, `User.parentalConsent`, `FraudFlag`, `Complaint` tables

### 8. ⏳ Results-Page Share Packs
- ⏳ **Status:** Phase 4
- **Tools:** Diagnostics, practice tests, flashcards, async tools
- **Components needed:**
  - Privacy-safe share cards (student/parent/tutor variants)
  - "Challenge a friend / Invite study buddy" CTAs
  - Deep links to bite-size FVM (5-question skill check)
  - Cohort/classroom group invite variants
- **Database:** `ResultsPage` table ready
- **Backend:** Personalization agent ready for copy generation

### 9. ⏳ Run-of-Show Demo (3-Minute Journey)
- ⏳ **Status:** Phase 6
- **Flow:** Trigger → Invite → Join → FVM
- **Requirements:**
  - Live simulation running
  - All metrics visible on dashboard
  - Real-time K-factor readout (K ≥ 1.20)
  - Fraud detection demonstration
  - COPPA compliance enforcement
  - Cohort comparison (control vs treatment)

---

## 🎯 Deliverables Summary

| Deliverable | Status | Phase | Notes |
|-------------|--------|-------|-------|
| 1. Thin-slice prototype | ✅ Complete | Phase 1 | Web app functional, needs real-time layer |
| 2. MCP agents (7 total) | ✅ Complete | Phase 1 | All implemented with rationales |
| 3. Session transcription → agentic actions | ⏳ Pending | Phase 3 | Schema ready, need implementation |
| 4. Signed smart links + attribution | ✅ Complete | MVP | Working end-to-end |
| 5. Event spec & dashboards | 🟡 Partial | Phases 1-2 | Events done, dashboards in Phase 2 |
| 6. Copy kit | 🟡 Partial | Phase 1 | Core templates done, need extraction |
| 7. Compliance memo | ⏳ Pending | Phase 6 | Schema supports all requirements |
| 8. Results-page share packs | ⏳ Pending | Phase 4 | Backend ready, UI needed |
| 9. 3-minute demo | ⏳ Pending | Phase 6 | Requires all above + simulation |

**Overall Progress:** 2/9 complete ✅ | 2/9 partial 🟡 | 5/9 pending ⏳
