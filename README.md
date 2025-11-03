# VT K-Factor - Production-Ready Growth System

![CI Status](https://github.com/mdayku/k-factor/actions/workflows/ci.yml/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive **10x K-Factor** growth system for Varsity Tutors with viral mechanics, AI-powered agentic actions, and closed-loop attribution. Built to achieve **K ≥ 1.20** with privacy-safe, COPPA/FERPA-compliant defaults.

## 🎯 Project Status

**Phase 1 Complete**: Foundation, MCP Agents, Event Schema, Database Schema  
**Phase 2 Complete**: Simulation engine with synthetic data generation  
**Phase 3 Complete**: Database deployment (Supabase), seeding, 6 API endpoints  
**Phase 3.5 Complete**: Authentication system (NextAuth.js), COPPA compliance, legal pages  
**Phase 4 ~75% Complete**: Results pages, share cards, FVM landing, presence layer, simulator updated  
**Next**: Test all features, tune K-factor to 0.8/1.2, comprehensive QA

See [PRD.md](./PRD.md) for complete requirements and roadmap.

## 🎭 Simulation Approach

**This is a bootcamp project - all metrics are demonstrated through synthetic data simulation (no real users).**

The system includes:
- **Synthetic User Generator** - 1,000+ realistic profiles (students, parents, tutors)
- **Behavior Simulation Engine** - User journeys with realistic conversion rates
- **Event Stream Generator** - 14-day cohort with proper event timing
- **Cohort Simulator** - Control (K = 0.8) vs Treatment (K ≥ 1.20)
- **Metrics Dashboard** - Live K-factor, funnels, cohort comparisons

**Target:** Demonstrate K ≥ 1.20, +20% FVM lift, retention metrics, fraud detection, and COPPA compliance through simulation.

## 🏗 Architecture

### Applications
- **Web App** (Next.js) - Results pages, presence UI, deep links, FVM experiences
- **Agents Service** (Express) - 7 MCP agents for orchestration, personalization, incentives, presence, tutor advocacy, trust & safety, experimentation
- **Attribution Service** (Express) - Signed smart links with HMAC, last-touch attribution

### Packages
- **event-schema** - 25+ event types with Zod validation
- **mcp-protocol** - Model Context Protocol definitions for all agents
- **sdk** - Event emission SDK

## 🤖 7 MCP Agents (All Implemented)

### 1. Loop Orchestrator Agent
Chooses which viral loop to trigger based on context, eligibility, and throttling.
- **Endpoint:** `POST /mcp/orchestrator`
- **Loops:** Buddy Challenge, Streak Rescue, Proud Parent, Tutor Spotlight, Results Rally, Class Watch-Party, Subject Clubs, Achievement Spotlight

### 2. Personalization Agent
Tailors invites, rewards, and copy by persona (student/parent/tutor), subject, and intent.
- **Endpoint:** `POST /mcp/personalization`
- **Tones:** Friendly, Motivational, Professional, Playful

### 3. Incentives & Economy Agent
Manages credits/rewards, prevents abuse, ensures unit economics (LTV > CAC).
- **Endpoint:** `POST /mcp/incentives`
- **Rewards:** AI minutes, class passes, gems, XP boosts, streak shields, power-ups

### 4. Social Presence Agent
Publishes presence ("28 peers practicing Algebra now"), recommends cohorts, nudges invites.
- **Endpoint:** `POST /mcp/social-presence`

### 5. Tutor Advocacy Agent
Generates share-packs for tutors (smart links, thumbnails, one-tap WhatsApp/SMS), tracks referrals.
- **Endpoint:** `POST /mcp/tutor-advocacy`

### 6. Trust & Safety Agent
Fraud detection, COPPA/FERPA compliance, rate-limits, duplicate checks.
- **Endpoint:** `POST /mcp/trust-safety`
- **Checks:** Fraud scoring, COPPA age verification, rate limiting (20/day, 5/hour), duplicate detection

### 7. Experimentation Agent
Traffic allocation, exposure logging, K-factor computation, guardrails.
- **Endpoint:** `POST /mcp/experimentation`
- **Metrics:** K-factor, invites/user, conversion rate, FVM lift

## 📊 Success Metrics

- **Primary:** K ≥ 1.20 for at least one loop over 14-day cohort
- **Activation:** +20% lift to first-value moment (FVM)
- **Referral Mix:** ≥30% of weekly signups from referrals
- **Retention:** +10% D7 retention for referred cohorts
- **CSAT:** ≥4.7/5 on loop prompts & rewards
- **Abuse:** <0.5% fraudulent joins, <1% opt-out rate

Track via: `GET /metrics/k-factor`

## 🔐 Authentication & User Management

**Status:** Core authentication complete (Phase 3.5)

### Features Implemented
- ✅ **NextAuth.js v4.24.5** with Prisma adapter
- ✅ **Email/password authentication** with bcrypt encryption (12 rounds)
- ✅ **JWT-based sessions** (30-day expiry, secure cookies)
- ✅ **COPPA compliance** - Age verification, parental consent workflow
- ✅ **Protected routes** with middleware
- ✅ **Legal pages** - Terms of Service, Privacy Policy, COPPA Policy
- ✅ **Database tables** - Account, AuthSession, VerificationToken, Authenticator, ParentalConsent

### Registration Flow
1. User signs up at `/auth/signup` with email, password, age, role
2. **Age < 13:** Creates `ParentalConsent` record (7-day expiry)
   - In production: Email sent to parent with consent link
   - Parent approves at `/auth/parental-consent?token=...`
   - Child account activated upon approval
3. **Age ≥ 13:** Account created immediately
4. User redirected to `/auth/signin` after successful registration

### Sign-In Flow
- Visit `/auth/signin`
- Email/password authentication
- OAuth providers ready (Google, Apple) - credentials needed

### Environment Setup
**Critical:** `.env.local` must be in `apps/web/` directory (monorepo requirement)

```env
DATABASE_URL="postgresql://postgres:...@...pooler.supabase.com:6543/postgres?pgbouncer=true"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate with: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))">
```

### Advanced Features (Phase 8 - Post-MVP)
- ⏳ Email sending (parental consent, password reset)
- ⏳ Google/Apple OAuth
- ⏳ Password reset flow
- ⏳ Email verification
- ⏳ Multi-factor authentication

## 🎨 Phase 4: Viral Surfaces & Presence Layer

**Status:** UI Complete (~75%), Infrastructure Remaining (WebSocket, Image Gen, Email/SMS)

### Results-Page Share Packs (Deliverable #8)
- ✅ **Results Page** (`/results/[id]`) - Beautiful score visualization, skills breakdown, share CTAs
- ✅ **Share Card Component** - 3 variants (student/parent/tutor), copy link, social buttons
- ✅ **Challenge CTAs** - Buddy Challenge, Streak Rescue, Study Buddy, Tutor Spotlight
- ✅ **FVM Landing Page** (`/challenge/[id]`) - 5-question skill check, pre-start screen, results screen
- ✅ **Invite API** (`/api/invites/create`) - Signed links with HMAC, 7-day expiry, event tracking
- ⏳ **Image Generation** - Canvas API for share cards (Phase 8)
- ⏳ **Email/SMS** - SendGrid/Twilio integration (Phase 8)

### Real-Time Presence Layer (Deliverable #1)
- ✅ **Presence Hub** (`/presence`) - Three-tab interface (Presence / Leaderboards / Cohorts)
- ✅ **Presence Signals** - "X learners online now", friends online, subject activity grid
- ✅ **Mini Leaderboards** - Subject filter, friends toggle, rank badges (🥇🥈🥉)
- ✅ **Cohort Rooms** - Room cards, member counts, activity feeds, level badges
- ⏳ **WebSocket Server** - Replace simulated updates with real-time (Phase 8)

### Simulator Updates
- ✅ Added `challenge.created`, `challenge.completed` events
- ✅ Added `share.clicked`, `share.viewed` events
- ✅ Added `presence.joined`, `presence.left` events
- ✅ Added `cohort.joined`, `cohort.activity` events
- ✅ Challenge creation counts as invite (affects K-factor)
- ⏳ Tune conversion rates to hit K=0.8 (control) and K=1.2 (treatment)

### Testing Checklist
- ⏳ Test all UI components (8 items)
- ⏳ Run simulation with new events
- ⏳ Verify control group K ≥ 0.8
- ⏳ Verify treatment group K ≥ 1.2
- ⏳ Verify dashboard metrics

## 🗄 Database Schema

Comprehensive Prisma schema with 18+ tables:
- **User** - Privacy/compliance fields (COPPA/FERPA), auth fields (name, password, emailVerified)
- **Account** - OAuth provider data (Google, Apple)
- **AuthSession** - Session management
- **VerificationToken** - Email verification tokens
- **Authenticator** - WebAuthn/passkeys
- **ParentalConsent** - COPPA compliance tracking
- **SignedLink** - Smart link attribution
- **Attribution** - Multi-touch tracking
- **Event** - Comprehensive event log
- **Session** - Transcription & summaries
- **AgenticAction** - AI-triggered actions
- **Experiment** - A/B test assignments
- **FraudFlag** - Abuse detection
- **Complaint** - User complaints & opt-outs

See `prisma/schema.prisma`

## 🎲 Simulation Tracking & Multiple Runs

The database supports **multiple simulation runs** while keeping real user data completely safe!

### Schema Fields

**Added to User and Event models:**
- `isSimulated` - Boolean flag (default: `false`)
- `simulationId` - Unique identifier for each simulation run (e.g., `sim-1730665234567`)

### How It Works

1. **Each seed generates a unique ID:**
   ```
   🆔 Simulation ID: sim-1730665234567
   ```

2. **Only simulated data is deleted:**
   ```typescript
   // ✅ SAFE - Only deletes WHERE isSimulated = true
   await prisma.user.deleteMany({ where: { isSimulated: true }});
   ```

3. **Real users are protected:**
   - Real users have `isSimulated: false` (the default)
   - Seed script never touches them

### Query Examples

```typescript
// Get real users only
await prisma.user.findMany({ 
  where: { isSimulated: false } 
});

// Get all simulated users
await prisma.user.findMany({ 
  where: { isSimulated: true } 
});

// Get users from a specific simulation run
await prisma.user.findMany({ 
  where: { simulationId: 'sim-1730665234567' } 
});

// Compare two simulation runs
const run1 = await prisma.event.count({ 
  where: { simulationId: 'sim-1730665234567' } 
});
const run2 = await prisma.event.count({ 
  where: { simulationId: 'sim-1730665789012' } 
});
```

### Benefits

✅ **Production-ready** - Real users are never deleted  
✅ **Compare simulations** - Track how parameters affect K-factor  
✅ **Easy cleanup** - Delete all simulations: `DELETE WHERE isSimulated = true`  
✅ **Code reuse** - Same queries/dashboard work for both real and simulated data

## 📡 API Endpoints

### Agents Service (`:4000`)

**MCP Agents:**
- `POST /mcp/orchestrator` - Loop selection
- `POST /mcp/personalization` - Copy generation
- `POST /mcp/incentives` - Reward validation
- `POST /mcp/social-presence` - Presence & cohorts
- `POST /mcp/tutor-advocacy` - Tutor share packs
- `POST /mcp/trust-safety` - Fraud & compliance
- `POST /mcp/experimentation` - A/B testing

**Metrics:**
- `GET /health` - Service health
- `GET /metrics` - All metrics
- `GET /metrics/k-factor` - K-factor details
- `GET /experiment/:name/stats` - Experiment statistics

**Events:**
- `POST /events` - Event tracking with K computation

### Attribution Service (`:4100`)
- `POST /sign` - Create signed smart link
- `GET /r/:code` - Resolve and redirect smart link

### Web App (`:3000`)

**Pages:**
- `/` - Results page with share functionality
- `/presence` - Live presence & leaderboards
- `/deeplink` - FVM landing page

**API Endpoints:**
- `GET /api/events` - Query events with filters (type, user, cohort, date range, simulationId)
- `GET /api/metrics/k-factor` - Calculate K-factor with cohort breakdown
- `GET /api/metrics/funnel` - Get invite → open → signup → FVM funnel
- `GET /api/metrics/retention` - Get D1/D7/D28 retention rates
- `GET /api/metrics/cohort-comparison` - Compare control vs treatment with lifts
- `GET /api/agents/decisions` - Query agent decision logs with rationales

**Example API Calls:**
```bash
# Get K-factor for latest simulation
curl "http://localhost:3000/api/metrics/k-factor?simulationId=sim-1762196864996"

# Compare control vs treatment cohorts
curl "http://localhost:3000/api/metrics/cohort-comparison"

# Get funnel metrics for treatment group
curl "http://localhost:3000/api/metrics/funnel?cohort=treatment"

# Query recent invite events
curl "http://localhost:3000/api/events?type=invite.sent&limit=10"

# Get D7 retention rates
curl "http://localhost:3000/api/metrics/retention?cohort=control"
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ (or Supabase account)
- pnpm (`npm install -g pnpm`)

### Phase 3 Complete ✅
Database is deployed, seeded with 1,100+ users and 18,000+ events, and all 6 API endpoints are working.

### Installation

1. **Install dependencies:**
```bash
pnpm install
```

2. **Install additional packages:**
```bash
# Root level
pnpm add -D prisma
pnpm add @prisma/client

# Agents service
pnpm --filter @app/agents add @prisma/client dotenv

# Attribution service  
pnpm --filter @app/attribution add @prisma/client dotenv

# Web app
pnpm --filter @app/web add dotenv
```

3. **Setup database:**
```bash
# Create PostgreSQL database (or use Supabase - see env.example)
createdb vt_kfactor

# Copy environment file
cp env.example .env

# Update DATABASE_URL in .env, then run migrations
npx prisma migrate dev --name init
npx prisma generate
```

4. **Seed with simulation data:**
```bash
pnpm prisma:seed
```

This will:
- Generate a unique `simulationId` (e.g., `sim-1730665234567`)
- Create 1,000 simulated users (control + treatment cohorts)
- Generate 14 days of realistic event data
- Delete previous simulated data (real users are NEVER touched!)

**Run it multiple times safely** - each run gets a new ID and old simulated data is removed.

5. **Run all services:**
```bash
pnpm dev
```

Services will start at:
- **Web:** http://localhost:3000
- **Agents:** http://localhost:4000
- **Attribution:** http://localhost:4100

## 🧪 Try the Flow

1. Visit http://localhost:3000 (results page)
2. Click **"Copy Invite"** to mint a smart link
3. Open the printed smart link → redirects to `/deeplink`
4. Watch the Agents terminal update counters and K in real time
5. Visit http://localhost:3000/presence to see the "alive" layer
6. Check metrics at http://localhost:4000/metrics/k-factor

## 🔐 Privacy & Compliance

- **COPPA-safe:** Parental consent required for users < 13
- **FERPA-compliant:** PII minimization, data segregation
- **Rate limiting:** 20 invites/day, 5/hour
- **Fraud detection:** Device/IP/email duplicate checks
- **Opt-out:** Complaint tracking and user preferences

## 📚 Documentation

- **[IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md)** - Detailed implementation status
- **[SETUP.md](./SETUP.md)** - Complete setup guide
- **[PRD.md](./PRD.md)** - Product requirements
- **[mermaid.md](./mermaid.md)** - Architecture diagrams

## 🧪 Event Schema

25+ event types covering:
- Viral loops (invite.sent, invite.opened, account.created, fvm.reached)
- Sessions (started, ended, transcribed, summarized)
- Agentic actions (triggered, executed)
- Results pages (viewed, shared, card_generated)
- Presence/social (joined, left, leaderboard_viewed)
- Experiments (assigned, exposure)
- Fraud/compliance (fraud.detected, complaint.filed, opt_out)
- Retention (D1, D7, D28)
- Satisfaction (CSAT submitted)

## 🛣 Roadmap

### ✅ Phase 1: Foundation (Complete)
- Database schema with Prisma
- All 7 MCP agents
- Comprehensive event schema
- Basic viral loops
- K-factor computation

### 🔄 Phase 2: Session Intelligence (In Progress)
- Session transcription integration
- AI summary generation
- 4 agentic actions (≥2 tutor, ≥2 student)
- Results-page share packs

### ⏳ Phase 3: Enhanced UI & Real-time
- WebSocket presence
- Interactive leaderboards
- Cohort rooms
- Results page redesign

### ⏳ Phase 4: Production Hardening
- PostgreSQL migration
- Authentication & authorization
- Logging & monitoring
- Testing & CI/CD

## 📦 Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript
- **Backend:** Express, Node.js
- **Database:** PostgreSQL with Prisma ORM
- **Validation:** Zod schemas
- **Protocols:** MCP (Model Context Protocol)
- **Attribution:** HMAC-signed short codes

## 🤝 Contributing

See bootcamp requirements in `Platinum_Project_10x_K_Factor_Varsity_Tutors.pdf`

## 📄 License

Internal project for Varsity Tutors bootcamp.
