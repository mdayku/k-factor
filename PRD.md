# PRD — 10x K-Factor (Production Roadmap)

## 🎯 Current Status: **Phase 4 UI Complete! K-Factor System Enhanced 🎯**

**All 7 MCP agents** | **Simulation engine live** | **Database deployed (Supabase)** | **1,200+ users seeded** | **21,000+ events** | **6 API endpoints** | **✅ Metrics Dashboard Live** | **✅ Auth System Live** | **✅ Results-Page Share Packs** | **✅ Presence Layer** | **✅ Multi-Session Invite System**

**Latest Milestone:** Multi-session invite system implemented with realistic K-factor mechanics (2-4 invites per activation across 5-10 sessions), corrected K-factor calculation (seed users vs referred users), full funnel attribution tracking, Gaussian variance for Monte Carlo realism  
**Current K-Factor Results:** Control K=0.153 (target: 0.8), Treatment K=0.702 (target: 1.2), Lift: +360%  
**Next Critical:** Fine-tune control group parameters, add loop contribution visualization to dashboard, comprehensive QA

---

## Goal
Ship a production-ready **growth spine** that increases K-factor to ≥1.20 via closed-loop viral mechanics while remaining privacy-safe. System delivers ≥4 loops, session transcription → agentic actions, 7 MCP agents, results-page share packs, and live experiment readouts with comprehensive analytics.

## 🎭 Simulation Approach

**Since this is a bootcamp project, actual user metrics will be demonstrated through synthetic data simulation.**

The system will include:
- **Synthetic User Generator** - Creates realistic user profiles (students, parents, tutors) with appropriate demographics
- **Behavior Simulation Engine** - Simulates user actions across multiple sessions with probabilistic invite opportunities
- **Event Stream Generator** - Produces realistic event streams with proper timing and distribution
- **Cohort Simulator** - Simulates control vs. treatment groups for A/B experiments
- **K-Factor Calculator** - Computes metrics using industry-standard formula: K = (referred users) / (seed users)

**Simulation Parameters:**
- 1,200 synthetic users (600 control + 600 treatment seed users)
- 14-day cohort simulation with realistic time distribution
- **Multi-session invite opportunities:** Users have 5-10 sessions, each with probability of sending invites
- **Realistic invite counts:** 2-4 invites per activation (not massive bursts)
- **Gaussian variance:** Monte Carlo realism with Box-Muller transform for conversion rates
- **Loop-specific metrics:** Each viral loop has distinct open rates, conversion rates, and variances
- Fraud injection (5-10 cases) to demonstrate Trust & Safety agent
- COPPA violations (minors without consent) to test compliance
- Current results: Control K = 0.153, Treatment K = 0.702 (tuning toward targets: 0.8 / 1.2)

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

### ✅ Phase 2: Synthetic Data & Simulation Engine (COMPLETE)

**Goal:** Generate realistic synthetic data to demonstrate all success metrics

**Status: COMPLETE** - All components implemented and tested!

- ✅ **Synthetic User Generator** [`packages/simulation/src/user-generator.ts`]
  - ✅ Create 1,000+ user profiles (students, parents, tutors)
  - ✅ Demographics: age, persona, subjects, device types
  - ✅ COPPA cases: minors with/without parental consent
  - ✅ Fraud patterns: duplicate devices, suspicious IPs
  - ✅ Friendship networks and cohort assignment

- ✅ **Behavior Simulation Engine** [`packages/simulation/src/behavior-engine.ts`]
  - ✅ User journey simulation with multi-session invite opportunities
  - ✅ Realistic timing distributions with Gaussian variance (Box-Muller transform)
  - ✅ Probabilistic invite sending (65% control, 78% treatment per session)
  - ✅ Realistic invite counts (2-4 per activation across 5-10 sessions)
  - ✅ Loop-specific open rates, conversion rates, and variances
  - ✅ Conversion rate modeling: Control (K=0.8 target) vs Treatment (K≥1.20 target)
  - ✅ Retention curves (D1, D7, D28) with cohort-specific rates
  - ✅ Current results: Control K=0.153, Treatment K=0.702 (+360% lift)

- ✅ **Event Stream Generator** [`packages/simulation/src/event-generator.ts`]
  - ✅ Generate all 25+ event types with proper context
  - ✅ Time-series event generation (14-day cohort)
  - ✅ Inter-event dependencies (proper ordering)
  - ✅ Events ready for agent processing and analytics

- ✅ **Cohort & Experiment Simulator** [`packages/simulation/src/cohort-simulator.ts`]
  - ✅ Control cohort (K = 0.8, baseline behavior)
  - ✅ Treatment cohort (K ≥ 1.20, enhanced loops active)
  - ✅ A/B test assignment with viral spread simulation
  - ✅ Statistical significance calculation
  - ✅ Full metrics: K-factor, FVM lift, retention, referral mix

- ✅ **CLI Simulation Runner** [`packages/simulation/src/runner.ts`]
  - ✅ Full experiment execution (`pnpm --filter simulation run simulate`)
  - ✅ Comprehensive metrics report with success indicators
  - ✅ Control vs Treatment comparison
  - ✅ K-factor readout with ✅/❌ target validation
  - ✅ Fraud detection and COPPA compliance demonstration

### ✅ Phase 3: Database Deployment & Setup - COMPLETE

**Goal:** Deploy database and populate with simulation data - foundation for UI and features

**Rationale:** UI needs database to read from, features need database to write to

**Database Deployment:**
- ✅ PostgreSQL database provisioning (Supabase)
- ✅ Environment configuration with production DATABASE_URL
- ✅ Run Prisma migrations (`prisma migrate deploy`)
- ✅ Seed database with simulation data from Phase 2 (batch inserts for speed)
- ✅ Simulation tracking system (isSimulated, simulationId fields)
- ✅ Database supports multiple simulation runs without affecting real users

**Prisma Integration:**
- ✅ Prisma client integration in all services
- ✅ Create database seed script using simulation package
- ✅ Write simulation events to Event table (18,000+ events)
- ✅ Write simulation users to User table (1,100+ users)
- ✅ Optimized batch inserts (~15-20 seconds for full seed, was 5-10 minutes)
- ✅ `pnpm prisma:seed` - Safe to run multiple times

**API Endpoints for Data Access:**
- ✅ GET /api/events - Query events with filters (time range, type, user, cohort)
- ✅ GET /api/metrics/k-factor - Calculate K-factor from database events
- ✅ GET /api/metrics/funnel - Get invite → open → signup → FVM funnel
- ✅ GET /api/metrics/retention - Get D1/D7/D28 retention by cohort
- ✅ GET /api/metrics/cohort-comparison - Compare control vs treatment
- ✅ GET /api/agents/decisions - Query agent decision logs

### ✅ Phase 3.5: Authentication & User Management - COMPLETE

**Goal:** Implement user authentication, registration, and account management

**Rationale:** Required before UI can have user-specific features, COPPA compliance needs verified accounts

**Status:** Core authentication complete. Advanced features deferred to Phase 8.

**Authentication System:**
- ✅ NextAuth.js v4.24.5 integration with Prisma adapter
- ✅ Email/password authentication with bcrypt encryption
- ✅ Session management with JWT (30-day expiry)
- ✅ Protected routes and middleware
- ✅ Database schema with auth tables (Account, AuthSession, VerificationToken, Authenticator)
- 🔄 OAuth providers (Google, Apple) → **Phase 8**
- 🔄 Password reset flow via email → **Phase 8**

**Registration Flow:**
- ✅ Sign-up form (`/auth/signup`)
- ✅ Age verification (COPPA compliance)
- ✅ Parental consent workflow for users < 13
  - ✅ Collect parent email
  - ✅ Generate consent tokens (7-day expiry)
  - ✅ Consent verification page (`/auth/parental-consent`)
  - 🔄 Send verification email to parent → **Phase 8**
- ✅ Role selection (student/parent/tutor)
- ✅ Password strength requirements
- ✅ Terms & Privacy acceptance
- ⏳ Profile setup (name, grade level, subjects) - **Optional/Phase 4**

**User Profile & Settings:**
- ⏳ Profile management page - **Optional/Phase 4**
- ⏳ Account settings (email, password change) - **Optional/Phase 4**
- ⏳ Notification preferences (email, push, SMS) - **Optional/Phase 4**
- ⏳ Privacy settings - **Optional/Phase 4**
- ⏳ Opt-out UI for growth communications - **Optional/Phase 4**
- ⏳ Account deletion (GDPR right to be forgotten) - **Optional/Phase 4**

**Legal & Compliance Pages:**
- ✅ Terms of Service page (`/legal/terms`)
- ✅ Privacy Policy page (`/legal/privacy`)
- ✅ COPPA Policy page (`/legal/coppa`)
- ⏳ Cookie consent banner - **Optional/Phase 4**

**Onboarding Flow:**
- ⏳ First-time user welcome wizard - **Optional/Phase 4**
- ⏳ Product tour / tutorial - **Optional/Phase 4**
- ⏳ Initial preferences setup - **Optional/Phase 4**
- ⏳ Sample FVM experience (try before committing) - **Optional/Phase 4**
- ⏳ Friend import/invite from onboarding - **Optional/Phase 4**

**Technical Highlights:**
- Bcrypt password hashing (12 rounds)
- JWT-based sessions with secure cookies
- CSRF protection (NextAuth built-in)
- SQL injection prevention (Prisma)
- ParentalConsent table with audit trail (IP, user agent)
- Database fields: emailNotifications, pushNotifications, smsNotifications, hasCompletedOnboarding
- Custom NextAuth callbacks for role-based access
- Middleware for automatic redirect to `/onboarding` if profile incomplete
- Environment setup: `.env.local` in `apps/web/` (monorepo requirement)
- Manual migration via Supabase SQL Editor (network restrictions workaround)

### 🔄 Phase 4: Enhanced UI & Real-time (Deliverables #1, #5, #8) - ~75% COMPLETE

**Goal:** Build UI that reads from database - dashboard, results pages, presence layer

**Rationale:** Database is now live, users are authenticated, UI can show personalized data

**Status:** Results pages, share cards, challenge CTAs, FVM landing, presence layer all complete! Remaining: WebSocket, image generation, email/SMS

- ✅ **Metrics Dashboard (Deliverable #5)** - **UNIVERSAL for simulation & real users**
  - **Event-Driven Architecture**
    - Reads from Event table (database) or event stream
    - Works with both simulated and real user events
    - Real-time updates via WebSocket or polling
  - **K-Factor Tracking**
    - Live K-factor calculation from invite events
    - **Industry-standard formula:** K = (referred users) / (seed users)
    - **Seed users:** Initial cohort (not referred by anyone) - baseline population
    - **Referred users:** New users acquired through invites (tracked via Attribution table)
    - **Weighted K-factor by loop usage:** Each viral loop (Buddy Challenge, Streak Rescue, Study Buddy, Tutor Spotlight) contributes proportionally to how often it's used, not by hardcoded assumptions
    - Formula: K_weighted = Σ(K_loop × weight_loop) where weight_loop = invites_loop / total_invites
    - Per-loop breakdown showing invites sent, conversions, conversion rate, and individual K-factor
    - Current results: Overall K=0.559 (Control K=0.153, Treatment K=0.702, Lift: +360%)
    - ⏳ **Loop Contribution Visualization (Treatment Group):** Bar/pie chart showing how much each loop contributed to the final K-factor (weight × K-factor per loop) - helps identify which loops are driving growth
    - Funnel visualization: invite → open → signup → FVM
    - Historical trends and current rate
    - Success indicator (K ≥ 1.20)
  - **Cohort Comparison**
    - Side-by-side control vs treatment metrics
    - Statistical significance indicators
    - Lift percentages for all key metrics
  - **Retention Curves**
    - D1, D7, D28 retention visualization
    - Cohort-specific curves
    - Retention funnel breakdown
  - **Agent Decision Logs**
    - View all agent decisions with rationales
    - Filter by agent type, user, time range
    - Auditability for all MCP calls
  - **Fraud & Compliance Monitoring**
    - Fraud detection event timeline
    - COPPA compliance violations
    - Trust & Safety agent actions
  - **Built in Next.js**
    - Integrated with existing web app
    - Uses event schema for type safety
    - Chart library (Recharts or similar)
    - Export functionality (CSV/JSON)

- 🔄 **Results-Page Share Packs (Deliverable #8)** - UI COMPLETE, Infrastructure Remaining
  - ⏳ **Image Generation & Storage** ⭐ Phase 8
    - Dynamic image generation for share cards (Canvas API or Puppeteer)
    - Cloud storage for generated images (S3, Cloudinary, or similar)
    - CDN for fast image delivery
    - Image optimization (compression, format conversion)
    - Template system for different card types
  - ⏳ **Email & SMS Infrastructure** ⭐ Phase 8
    - Email service provider integration (SendGrid, Postmark, AWS SES)
    - SMS provider integration (Twilio, etc.)
    - Email templates for all invite types
    - SMS templates for urgent invites (Streak Rescue)
    - Delivery tracking and bounce handling
    - Unsubscribe management
  - ✅ **Share Card Component** (`/app/components/ShareCard.tsx`)
    - Privacy-safe cards for diagnostics, practice tests, flashcards
    - Three variants implemented: student, parent, tutor
    - Score display, skills heatmap
    - Social media friendly preview card
    - Copy link functionality
    - Social share buttons (Twitter, WhatsApp, Email)
  - ✅ **Challenge CTAs** (`/app/components/ChallengeCTA.tsx`)
    - "Buddy Challenge" - Beat my score with streak shields
    - "Streak Rescue" - Phone-a-friend for at-risk streaks
    - "Study Buddy" - Co-practice invites
    - "Tutor Spotlight" - Share with parents
    - Email invite form with success states
    - Reward messaging for both parties
  - ✅ **Deep Links to FVM** (`/app/challenge/[id]/page.tsx`)
    - 5-question skill check landing page
    - Pre-start screen with referrer details
    - Question screen with progress bar
    - Results screen with win/loss comparison
    - Sign-up CTA to claim rewards
    - Event tracking (invite.opened, fvm.reached)
  - ✅ **Invite Creation API** (`/app/api/invites/create/route.ts`)
    - Signed link generation with HMAC signatures
    - Short code generation (base64url)
    - 7-day expiration
    - Tracks invite.sent events
    - Ready for email integration
  - ⏳ **Cohort/Classroom Variants** - Phase 8
    - Bulk invite for teachers
    - Group challenge creation
    - Classroom leaderboard integration
  - ✅ **Results Page Template** (`/app/results/[id]/page.tsx`)
    - Beautiful score visualization
    - Skills breakdown with progress bars
    - Share card integrated
    - Challenge CTAs prominently featured
    - "What's Next?" section with clear CTAs
  - ✅ **Funnel Tracking & Attribution** (K-Factor Measurement)
    - Complete attribution chain: `invite.sent → invite.opened → fvm.reached → account.created → Attribution`
    - All events link back to `signedLinkId` for funnel analysis
    - Attribution table tracks referrer → referred user relationships
    - Challenge page fetches signed link data for proper tracking
    - Signup captures `ref` parameter and creates attribution records
    - K-factor calculable from real user data (not just simulation)

- 🔄 **Real-Time Presence Layer (Deliverable #1 completion)** - UI COMPLETE, WebSocket Remaining
  - ⏳ **WebSocket Infrastructure** ⭐ Phase 8
    - WebSocket server for presence updates
    - Connection pooling and scaling considerations
    - Heartbeat/keepalive mechanism
  - ✅ **Presence Hub** (`/app/presence/page.tsx`)
    - Three-tab interface: Presence / Leaderboards / Cohorts
    - Beautiful gradient design with tab navigation
    - Responsive layout, smooth transitions
  - ✅ **Presence Signals Component** (`/app/components/PresenceSignals.tsx`)
    - "X learners online now" with live badge
    - "Friends online" section with join buttons
    - Subject activity grid with trend indicators (📈📉➡️)
    - Real-time updates (simulated every 5 seconds)
    - "Join the action!" CTA
  - ✅ **Mini Leaderboard Component** (`/app/components/MiniLeaderboard.tsx`)
    - Subject selector dropdown (Algebra, Geometry, Chemistry, etc.)
    - Friends filter checkbox
    - Rank badges (🥇🥈🥉) for top 3
    - User highlighting with blue border
    - Score, streak (🔥), and friend indicators (👥)
    - "Challenge top players" CTA
  - ✅ **Cohort Rooms Component** (`/app/components/CohortRooms.tsx`)
    - Room cards with name, subject, level badge
    - Member count and online count (🟢 live)
    - Room goals and recent activity
    - Level color coding (beginner/intermediate/advanced)
    - Detailed room view with activity feed
    - "Start Co-Practice" and "Invite Friends" buttons
    - "Create Cohort Room" CTA
  - ✅ **Simulator Integration**
    - Added presence.joined, presence.left events
    - Added cohort.joined, cohort.activity events
    - 50% of sessions generate presence events
    - 30% of sessions generate cohort activity

**Phase 4 Simulator Updates (All Complete):**
- ✅ Added `challenge.created` event (20% of results views by engaged users)
- ✅ Added `challenge.completed` event (for FVM completion tracking)
- ✅ Added `share.clicked` event (30% of results views × shareability)
- ✅ Added `share.viewed` event (for share link tracking)
- ✅ Added `presence.joined/left` events (50% of sessions)
- ✅ Added `cohort.joined/activity` events (30% of sessions)
- ✅ Challenge creation counts as an invite (affects K-factor)
- ⏳ **Next:** Tune conversion rates to hit K=0.8 (control) and K=1.2 (treatment)

**Testing Plan:**
- ⏳ Test all UI components (results, share cards, challenges, FVM, presence, leaderboards, cohorts)
- ⏳ Run simulation with new events and verify data flows to dashboard
- ⏳ Tune simulator parameters to achieve target K-factors (0.8 / 1.2)
- ⏳ Verify all 4 viral loops are functioning end-to-end

### ⏳ Phase 5: Session Intelligence & Agentic Actions (Deliverable #3)

**Goal:** Implement transcription → summary → agentic actions → viral loops pipeline

**Requires Phase 3 Database + Phase 4 UI:** Writes to database, renders in UI

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
  - Simulate agentic actions in simulation data
  - Store all actions in `AgenticAction` table
  - Render in UI components built in Phase 3

### ⏳ Phase 6: Production Hardening & Security

**Goal:** Production-ready features - monitoring, rate limiting, security, compliance

**Error Tracking & Monitoring:** ⭐ ENHANCED
- ⏳ Error tracking service (Sentry, Rollbar, or similar)
  - Frontend error capture (React errors, network failures)
  - Backend error capture (API errors, database errors)
  - Source map upload for stack traces
  - Error grouping and deduplication
  - Slack/email alerts for critical errors
- ⏳ Application Performance Monitoring (APM)
  - Request/response time tracking
  - Database query performance
  - API endpoint latency
  - Real user monitoring (RUM)
  - Custom performance metrics
- ⏳ Logging Infrastructure
  - Structured JSON logs
  - Log aggregation (CloudWatch, Datadog, Loggly)
  - Log retention policies
  - Searchable log interface
  - PII redaction in logs
- ⏳ Uptime Monitoring
  - Health check endpoints for all services
  - External uptime monitoring (Pingdom, UptimeRobot)
  - Status page for users
  - Incident response procedures
- ⏳ Analytics & Business Metrics
  - Beyond K-factor: user engagement, feature adoption
  - Funnel analytics (registration → FVM → retention)
  - Revenue tracking (if applicable)
  - Custom dashboards for stakeholders

**Rate Limiting & Security:**
- ⏳ API rate limiting (per user, per IP)
- ⏳ DDoS protection (Cloudflare or similar)
- ⏳ CSRF protection
- ⏳ XSS prevention
- ⏳ SQL injection prevention (Prisma handles this)
- ⏳ Security headers (CSP, HSTS, etc.)
- ⏳ Input validation and sanitization
- ⏳ Secret management (environment variables, vault)

**Testing & Quality:**
- ⏳ Unit tests for critical functions
- ⏳ Integration tests for API endpoints
- ⏳ E2E tests for key user flows
- ⏳ Load testing (k6, Artillery)
- ⏳ Security audit and penetration testing
- ⏳ Accessibility testing (WCAG compliance)
- ⏳ CI/CD pipeline enhancements

**Documentation & Compliance:**
- ⏳ API documentation (Swagger/OpenAPI)
- ⏳ Developer onboarding guide
- ⏳ Runbook for common operations
- ⏳ Disaster recovery plan
- ⏳ Data retention and deletion policies
- ⏳ GDPR compliance (right to access, right to be forgotten)
- ⏳ SOC 2 preparation (if required)

### ⏳ Phase 6.5: Production Deployment (Vercel)

**Goal:** Deploy application to Vercel for live demo

**Rationale:** Need production URL for demo, testing with peers, and portfolio

**Deployment Platform:** Vercel (Next.js optimized, free tier available)

**Prerequisites:**
- ✅ Database deployed (Supabase)
- ✅ Authentication configured (NextAuth.js)
- ✅ Environment variables ready
- ✅ CI/CD pipeline configured (GitHub Actions)

**Steps:**
1. ⏳ Generate production secrets (`NEXTAUTH_SECRET`, `SIGNED_LINK_SECRET`)
2. ⏳ Deploy via Vercel CLI or Dashboard
3. ⏳ Configure environment variables in Vercel
4. ⏳ Set root directory to `apps/web`
5. ⏳ Update `NEXTAUTH_URL` to production domain
6. ⏳ Test authentication flow
7. ⏳ Test API endpoints
8. ⏳ Run simulation (optional)
9. ⏳ Configure custom domain (optional)

**See:** `DEPLOYMENT.md` for detailed step-by-step instructions

**Cost:** Free tier or $20/month (Vercel Pro for commercial use)

---

### ⏳ Phase 7: Final Deliverables & Demo (Deliverables #6, #7, #9)

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

### ⏳ Phase 8: Advanced Auth & Communications (Post-MVP)

**Goal:** Implement advanced authentication features and email/SMS infrastructure

**Rationale:** Core auth is functional for MVP. These features enhance UX but aren't blocking for demo.

**Priority:** Post-MVP / Production Hardening

**Email & SMS Infrastructure:**
- ⏳ Email service provider setup (SendGrid, Postmark, or AWS SES)
- ⏳ SMTP configuration and testing
- ⏳ Email templates system
- ⏳ SMS provider integration (Twilio)
- ⏳ Delivery tracking and bounce handling
- ⏳ Unsubscribe management

**Parental Consent Email Flow:**
- ⏳ Send verification email when child account is created
- ⏳ Email template with consent link
- ⏳ Resend consent email functionality
- ⏳ Email confirmation upon parent approval
- ⏳ Reminder emails for pending consents

**Password Reset Flow:**
- ⏳ "Forgot password" page
- ⏳ Password reset email generation
- ⏳ Token-based reset link (uses existing VerificationToken table)
- ⏳ Password update endpoint with bcrypt
- ⏳ Success confirmation email

**OAuth Providers:**
- ⏳ Google OAuth setup
  - Create Google Cloud project
  - Configure OAuth 2.0 credentials
  - Add authorized redirect URIs
  - Test sign-in flow
- ⏳ Apple Sign In setup
  - Apple Developer account
  - Configure services ID
  - Generate client secret
  - Test sign-in flow
- ⏳ OAuth account linking (merge email accounts)

**Email Verification:**
- ⏳ Send verification email on signup
- ⏳ Verification link handling
- ⏳ Mark email as verified in database
- ⏳ Resend verification email

**Advanced Features:**
- ⏳ Remember me functionality
- ⏳ Session renewal/refresh logic
- ⏳ Multi-factor authentication (Authenticator table ready)
- ⏳ Magic link authentication
- ⏳ Account recovery options

**Dependencies:**
- Nodemailer 7.0.10 (already installed)
- Email service provider API keys
- SMS service provider API keys
- OAuth client credentials

---

## 📈 Acceptance Criteria Status

| Criterion | Status | Implementation |
|-----------|--------|----------------|
| ≥4 viral loops E2E | 🟢 **Ready** | 8 loops defined, orchestrator implemented |
| ≥4 agentic actions (≥2 tutor, ≥2 student) | 🔴 **Phase 3** | Schema ready, need implementation + simulation |
| **K ≥ 1.20 via simulation** | 🟢 **Complete** | Treatment cohort achieves K=1.20+, run `pnpm --filter simulation run simulate` |
| **+20% FVM lift via simulation** | 🟢 **Complete** | Treatment shows +20% FVM lift over control |
| **D1/D7/D28 retention via simulation** | 🟢 **Complete** | Full retention curves with cohort comparison |
| 7 MCP agents | 🟢 **Complete** | All 7 agents implemented with rationales |
| **Fraud detection (5-10 cases)** | 🟢 **Complete** | Fraud patterns injected in user generator |
| **COPPA compliance enforcement** | 🟢 **Complete** | Minors with/without consent in simulation |
| Presence UI + leaderboard | 🔴 **Phase 4** | Social Presence agent ready, UI + sim data needed |
| Signed smart links + attribution | 🟢 **Working** | Already functional from MVP |
| Results-page share pack | 🔴 **Phase 4** | Backend ready, UI + sim integration needed |
| **Metrics dashboard** | 🟡 **CLI Ready** | CLI provides all metrics, visual dashboard optional |
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

### 5. ✅ Event Spec & Dashboards
- ✅ **Event Spec:** Complete (25+ event types in `packages/event-schema/`)
- ✅ **K-factor tracking:** Implemented with full simulation (`packages/simulation/`)
- ✅ **Simulation Engine:** Complete - generates 1,000+ users, 14-day cohorts, A/B experiments
- ✅ **CLI Runner:** `pnpm --filter simulation run simulate` produces full metrics report
- ⏳ **Visual Dashboard:** Pending (CLI output currently provides all metrics)
- **Metrics:** K, invites/user, conversion, FVM, retention (D1/D7/D28), guardrails, fraud detection, COPPA compliance

### 6. 🟡 Copy Kit: Dynamic Templates by Persona
- 🟡 **Status:** Core templates implemented in Personalization Agent, extraction scheduled for Phase 7
- **Current Location:** `apps/agents/src/agents/personalization.ts`
- **Templates:** Buddy Challenge, Streak Rescue, Proud Parent, Tutor Spotlight, Results Rally, Class Watch-Party, Subject Clubs, Achievement Spotlight
- **Tones:** Friendly, motivational, professional, playful
- **Personas:** Student, parent, tutor
- **Localization:** English only (extensible for i18n)
- **Phase 7 Task:** Extract templates to standalone copy kit service with API endpoint, versioning for A/B testing, and documentation

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
| 1. Thin-slice prototype | ✅ Complete | Phases 1-3 | Web app, auth, dashboard functional |
| 2. MCP agents (7 total) | ✅ Complete | Phase 1 | All implemented with rationales |
| 3. Session transcription → agentic actions | ⏳ Pending | Phase 5 | Schema ready, need implementation |
| 4. Signed smart links + attribution | ✅ Complete | MVP | Working end-to-end |
| 5. Event spec & dashboards | ✅ Complete | Phases 1-3 | Events done, simulation complete, dashboard live |
| 6. Copy kit | 🟡 Partial | Phase 7 | Templates in agent, extraction pending |
| 7. Compliance memo | ⏳ Pending | Phase 7 | Schema supports all requirements |
| 8. Results-page share packs | ⏳ Pending | Phase 4 | Backend ready, UI + image gen needed |
| 9. 3-minute demo | ⏳ Pending | Phase 7 | Requires all components complete |

**Overall Progress:** 3/9 complete ✅ | 1/9 partial 🟡 | 5/9 pending ⏳
