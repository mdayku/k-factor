# Setup Instructions for VT K-Factor

## Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- pnpm (install via `npm install -g pnpm`)

## Initial Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Install Additional Packages for Phase 1

```bash
# Root level
pnpm add -D prisma
pnpm add @prisma/client

# Add to agents service
pnpm --filter @app/agents add @prisma/client dotenv zod

# Add to attribution service
pnpm --filter @app/attribution add @prisma/client dotenv

# Add to web app
pnpm --filter @app/web add dotenv
```

### 3. Database Setup

1. Create a PostgreSQL database:
```bash
createdb vt_kfactor
```

2. Copy the environment file:
```bash
cp env.example .env
```

3. Update `DATABASE_URL` in `.env` with your PostgreSQL credentials

4. Run Prisma migrations:
```bash
npx prisma migrate dev --name init
```

5. Generate Prisma Client:
```bash
npx prisma generate
```

### 4. Verify Setup

```bash
# Run all services
pnpm dev
```

You should see:
- Web: http://localhost:3000
- Agents: http://localhost:4000
- Attribution: http://localhost:4100

## Phase 1 Completion Checklist

- [ ] PostgreSQL database created and running
- [ ] Prisma schema created with all tables
- [ ] Environment variables configured
- [ ] Prisma Client generated
- [ ] All services start without errors
- [ ] Basic error handling added to endpoints
- [ ] In-memory stores migrated to database

## Next Steps

After Phase 1 is complete, proceed to Phase 2: Security & Authentication

## Database Schema

The schema includes:
- **User**: User profiles with privacy/compliance fields
- **SignedLink**: Signed smart links for attribution
- **Attribution**: Multi-touch attribution tracking
- **Event**: Comprehensive event tracking
- **Experiment**: A/B test assignments
- **Loop**: Viral loop configuration
- **Session**: Session transcription and summaries
- **AgenticAction**: Actions triggered from sessions
- **ResultsPage**: Async tool results for sharing
- **AgentDecision**: Agent decision logs for auditability
- **FraudFlag**: Fraud detection and prevention
- **Complaint**: User complaints and opt-outs

## Troubleshooting

### Prisma Issues

If you encounter Prisma errors, try:
```bash
npx prisma generate --force
```

### Database Connection Issues

Check your DATABASE_URL format:
```
postgresql://username:password@localhost:5432/database_name
```

### Port Conflicts

If ports 3000, 4000, or 4100 are in use, update the port numbers in:
- `apps/web/package.json` (dev script)
- `apps/agents/src/server.ts` (line 52)
- `apps/attribution/src/server.ts` (line 28)

