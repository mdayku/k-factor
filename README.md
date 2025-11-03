# VT K-Factor - Production-Ready Growth System

A comprehensive **10x K-Factor** growth system for Varsity Tutors with viral mechanics, AI-powered agentic actions, and closed-loop attribution. Built to achieve **K ≥ 1.20** with privacy-safe, COPPA/FERPA-compliant defaults.

## 🎯 Project Status

**Phase 1 Complete**: Foundation, MCP Agents, Event Schema, Database Schema

See [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) for detailed status.

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

## 🗄 Database Schema

Comprehensive Prisma schema with 13+ tables:
- **User** - Privacy/compliance fields (COPPA/FERPA)
- **SignedLink** - Smart link attribution
- **Attribution** - Multi-touch tracking
- **Event** - Comprehensive event log
- **Session** - Transcription & summaries
- **AgenticAction** - AI-triggered actions
- **Experiment** - A/B test assignments
- **FraudFlag** - Abuse detection
- **Complaint** - User complaints & opt-outs

See `prisma/schema.prisma`

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
- `/` - Results page with share functionality
- `/presence` - Live presence & leaderboards
- `/deeplink` - FVM landing page

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- pnpm (`npm install -g pnpm`)

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
# Create PostgreSQL database
createdb vt_kfactor

# Copy environment file
cp env.example .env

# Update DATABASE_URL in .env, then run migrations
npx prisma migrate dev --name init
npx prisma generate
```

4. **Run all services:**
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
