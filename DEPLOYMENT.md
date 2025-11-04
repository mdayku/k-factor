# 🚀 Deployment Guide - Vercel

## Prerequisites
- [ ] GitHub repository with latest code
- [ ] Supabase project (database already configured)
- [ ] Vercel account (free tier works)
- [ ] Environment variables ready

---

## Step 1: Prepare Environment Variables

You'll need these in Vercel:

```bash
# Database (Supabase)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-us-east-2.pooler.supabase.com:6432/postgres"

# NextAuth.js (CRITICAL - Generate new secret for production!)
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="<GENERATE_NEW_SECRET_FOR_PRODUCTION>"

# OAuth (Optional for now)
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Signed Links (Optional - uses random secret if not set)
SIGNED_LINK_SECRET="<GENERATE_NEW_SECRET_FOR_PRODUCTION>"
```

**Generate secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## Step 2: Deploy to Vercel

### Option A: Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   pnpm add -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from project root**
   ```bash
   cd C:\Users\marcu\vt-kfactor
   vercel
   ```

4. **Follow prompts:**
   - Link to existing project? → No (first time)
   - Project name? → `vt-kfactor` (or custom name)
   - Framework? → Next.js
   - Root directory? → `./apps/web`
   - Build command? → `pnpm run build` (Vercel detects pnpm workspace)
   - Output directory? → `.next` (default)

5. **Add environment variables**
   ```bash
   vercel env add DATABASE_URL production
   # Paste your DATABASE_URL when prompted
   
   vercel env add DIRECT_URL production
   # Paste your DIRECT_URL when prompted
   
   vercel env add NEXTAUTH_URL production
   # Paste your production URL (e.g., https://vt-kfactor.vercel.app)
   
   vercel env add NEXTAUTH_SECRET production
   # Paste your generated secret
   ```

6. **Deploy to production**
   ```bash
   vercel --prod
   ```

### Option B: Vercel Dashboard (GUI)

1. **Go to [vercel.com](https://vercel.com)**
2. Click **"New Project"**
3. **Import your GitHub repository**
   - Connect GitHub account
   - Select `vt-kfactor` repository
   - Click **Import**

4. **Configure Project**
   - **Framework Preset:** Next.js
   - **Root Directory:** `apps/web` ⚠️ CRITICAL!
   - **Build Command:** `cd ../.. && pnpm run build --filter @app/web`
   - **Output Directory:** `.next` (default)
   - **Install Command:** `cd ../.. && pnpm install`

5. **Environment Variables**
   Add all env vars from Step 1 above

6. Click **"Deploy"**

---

## Step 3: Post-Deployment Setup

### 1. Update NextAuth URL
After first deployment, update `NEXTAUTH_URL` in Vercel:
```bash
vercel env rm NEXTAUTH_URL production
vercel env add NEXTAUTH_URL production
# Enter: https://your-actual-domain.vercel.app
```

### 2. Run Database Migrations (if needed)
If schema changed since last migration:
```bash
# From local machine (with updated .env)
npx prisma migrate deploy
```

Or run SQL directly in Supabase SQL Editor.

### 3. Test Authentication
- Visit `https://your-app.vercel.app/auth/signin`
- Try signing up
- Verify database records created

### 4. Verify API Routes
- Test: `https://your-app.vercel.app/api/metrics/k-factor`
- Test: `https://your-app.vercel.app/api/events`

### 5. Run Simulation (Optional)
```bash
# From local, pointing to production DB
pnpm run simulate
```

Or deploy simulation as a cron job/scheduled task.

---

## Step 4: CI/CD (GitHub Actions)

**Good news:** Your `.github/workflows/ci.yml` is already configured!

### What it does:
- ✅ Linting on every push
- ✅ Type checking
- ✅ Build verification
- ✅ Prisma schema validation

### Auto-deploy on push to `main`:
Vercel automatically redeploys when you push to `main` (if connected via GitHub integration).

---

## Step 5: Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain (e.g., `kfactor.yoursite.com`)
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` environment variable to match custom domain

---

## Troubleshooting

### Build fails: "Cannot find module '@app/web'"
**Fix:** Ensure root directory is set to `apps/web` and build command includes workspace filter.

### Database connection fails
**Fix:** 
- Verify `DATABASE_URL` uses Session Pooler (port 6543) with `?pgbouncer=true`
- Verify `DIRECT_URL` uses Transaction Pooler (port 6432) or Direct Connection (port 5432)
- Check Supabase IP restrictions (allow Vercel IPs if restricted)

### NextAuth error: "NO_SECRET"
**Fix:** Ensure `NEXTAUTH_SECRET` is set in Vercel environment variables.

### "Module not found" errors
**Fix:** Run `pnpm install` locally and commit `pnpm-lock.yaml`.

### Prisma Client not generated
**Fix:** Add `postinstall` script to `apps/web/package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

---

## Monitoring & Logs

### Vercel Dashboard
- **Deployments:** View all deployments, rollback if needed
- **Functions:** See serverless function logs (API routes)
- **Analytics:** Page views, performance metrics
- **Logs:** Real-time logs for debugging

### Access logs:
```bash
vercel logs <deployment-url>
```

Or view in Vercel Dashboard → Project → Deployments → [Select Deployment] → Logs

---

## Performance Optimization

### 1. Enable Edge Runtime (Optional)
For API routes that don't need Prisma:
```typescript
// apps/web/app/api/some-route/route.ts
export const runtime = 'edge';
```

### 2. Enable ISR (Incremental Static Regeneration)
For pages that change infrequently:
```typescript
// apps/web/app/some-page/page.tsx
export const revalidate = 3600; // Revalidate every hour
```

### 3. Database Connection Pooling
Already configured via Supabase Session Pooler (port 6543).

---

## Security Checklist

- [ ] Use **NEW** `NEXTAUTH_SECRET` for production (don't reuse dev secret)
- [ ] Use **NEW** `SIGNED_LINK_SECRET` for production
- [ ] Set `NEXTAUTH_URL` to actual production URL
- [ ] Enable Vercel Authentication if needed (protects preview deployments)
- [ ] Review Supabase IP restrictions
- [ ] Enable HTTPS only (Vercel does this by default)
- [ ] Set `Secure` cookie flag in NextAuth (automatic in production)

---

## Cost Estimates

### Vercel (Free Tier)
- ✅ 100 GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Serverless functions (100k invocations/month)
- ❌ Hobby projects can't use commercial domains

**Upgrade to Pro ($20/month):**
- ✅ 1 TB bandwidth/month
- ✅ Commercial use allowed
- ✅ Team collaboration
- ✅ Analytics & monitoring

### Supabase (Free Tier - Current)
- ✅ 500 MB database
- ✅ 1 GB file storage
- ✅ 2 GB bandwidth/month
- ✅ 50k monthly active users

**Total for MVP:** $0 (free tiers) or $20/month (Vercel Pro)

---

## Next Steps

1. Deploy to Vercel
2. Test all functionality
3. Run simulation against production DB
4. Share URL with instructors/peers
5. Monitor logs for errors
6. Iterate and improve!

---

**Need help?** Check Vercel docs: https://vercel.com/docs

