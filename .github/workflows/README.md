# GitHub Actions CI/CD

This repository uses GitHub Actions for continuous integration and deployment.

## Workflows

### CI/CD Pipeline (`ci.yml`)

Runs on every push to `main` and `develop` branches, and on all pull requests.

#### Jobs

1. **Lint & Type Check**
   - Runs TypeScript type checking on all packages and apps
   - Uses pnpm caching for faster builds
   - Fails if any type errors are found

2. **Prisma Validate**
   - Validates Prisma schema syntax
   - Checks Prisma formatting
   - Ensures database schema is valid

3. **Build**
   - Builds all packages (event-schema, mcp-protocol, sdk)
   - Builds all apps (agents, attribution, web)
   - Generates Prisma client
   - Depends on lint and Prisma validation passing

4. **Test**
   - Runs all test suites across packages and apps
   - Currently placeholder (tests TBD)
   - Runs in parallel with build after type checking

5. **Agent Health Check (Smoke Test)**
   - Starts the agents service
   - Tests health and metrics endpoints
   - Ensures agents boot correctly
   - Runs after successful build

6. **Security Scan**
   - Runs `pnpm audit` to check for vulnerabilities
   - Checks for outdated dependencies
   - Runs independently of other jobs

## Local CI Simulation

Run the same checks locally before pushing:

```bash
# Run full CI pipeline locally
pnpm ci

# Or run individual steps
pnpm typecheck      # Type check all packages
pnpm build          # Build all packages
pnpm test           # Run tests
pnpm prisma:validate  # Validate Prisma schema
```

## Status Badge

Add this to your README to show CI status:

```markdown
![CI Status](https://github.com/mdayku/k-factor/actions/workflows/ci.yml/badge.svg)
```

## Caching Strategy

The workflow uses GitHub Actions caching for:
- pnpm store directory
- node_modules (implicit via pnpm)

This significantly speeds up subsequent runs.

## Required Secrets

Currently no secrets are required. When deploying to production, you may need to add:
- `DATABASE_URL` - PostgreSQL connection string
- `HMAC_SECRET` - For signed smart links
- Deployment credentials (Vercel, AWS, etc.)

## Failure Handling

If a job fails:
1. Check the specific job logs in GitHub Actions
2. Reproduce locally using the command listed above
3. Fix the issue and push again
4. PR cannot be merged until all checks pass

## Adding New Checks

To add new checks:
1. Edit `.github/workflows/ci.yml`
2. Add a new job or step
3. Test locally first
4. Commit and push to see it run

