# Phase 4 Testing Guide

## 🎯 Overview

**Status:** Phase 4 UI complete (~75%), simulator updated with new event types  
**Goal:** Test all viral surfaces, tune simulator to hit K=0.8-1.2, verify end-to-end flows

---

## ✅ What's Complete

### 1. Results-Page Share Packs (Deliverable #8)
- ✅ Results page template (`/results/[id]`)
- ✅ Share card component with 3 variants
- ✅ Challenge CTAs (4 types)
- ✅ FVM landing page (`/challenge/[id]`)
- ✅ Invite creation API with signed links

### 2. Real-Time Presence Layer (Deliverable #1)
- ✅ Presence hub with 3 tabs
- ✅ Presence signals component
- ✅ Mini leaderboards component
- ✅ Cohort rooms component

### 3. Simulator Updates
- ✅ Added 8 new event types for Phase 4
- ✅ Challenge creation counts as invite
- ✅ Share/presence/cohort events integrated

---

## 🧪 Testing Checklist

### UI Component Testing (8 items)

#### 1. Results Page UI
**URL:** `http://localhost:3000/results/test-result-1`

**Test:**
- [ ] Score display (big circle with percentage)
- [ ] Skills breakdown with progress bars
- [ ] "Challenge a Friend" button
- [ ] "Share Your Results" button
- [ ] Next steps section

**Expected:** Beautiful gradient layout, all elements visible, clickable

---

#### 2. Share Card Component
**How:** Click "Share Your Results" on results page

**Test:**
- [ ] Student variant shows correct copy
- [ ] Parent variant shows correct copy
- [ ] Tutor variant shows correct copy
- [ ] Copy link button works
- [ ] Twitter/WhatsApp/Email buttons display
- [ ] Close button works

**Expected:** Modal opens, variant switcher works, copy link shows "Copied!" feedback

---

#### 3. Challenge CTAs (All 4 Types)
**URL:** `http://localhost:3000/test-challenges`

**Test All 4 Types:**
- [ ] **Buddy Challenge** - 🎯 icon, "Challenge a Friend" title, "Beat your score" description, "Both get Streak Shields" reward
- [ ] **Streak Rescue** - 🔥 icon, "Phone a Friend" title, streak at risk description, "Both get Streak Shields" reward
- [ ] **Study Buddy** - 👥 icon, "Invite Study Buddy" title, co-practice description, "Get practice power-ups" reward
- [ ] **Tutor Spotlight** - ⭐ icon, "Share with Parents" title, progress sharing description, "Earn class pass rewards" reward

**Test Each One:**
- [ ] Click the challenge button
- [ ] Email input field works
- [ ] Placeholder shows "Friend's email address or @username"
- [ ] "Send Challenge" button enabled when text entered
- [ ] Loading state shows when sending
- [ ] Success confirmation appears (✅ "Challenge Sent!")
- [ ] Reward message displayed correctly

**Expected:** Each challenge type shows unique icon, title, description, and reward messaging

**Note:** Currently only accepts email. @username lookup feature coming in Phase 5.

---

#### 4. Invite API
**How:** Check browser Network tab when sending challenge

**Test:**
- [ ] POST to `/api/invites/create` succeeds (200)
- [ ] Response includes `inviteUrl` and `signedLinkId`
- [ ] Short code is generated (base64url format)
- [ ] Event logged (`invite.sent`)

**Expected:** API returns signed link with HMAC signature

---

#### 4a. 🎯 Funnel Tracking (Attribution Chain) - CRITICAL FOR K-FACTOR
**Purpose:** Verify that the full referral funnel is tracked from invite → signup

**Test Flow (End-to-End):**
1. [ ] Send a challenge (creates `invite.sent` event with `signedLinkId`)
2. [ ] Copy the `inviteUrl` from the Network tab response
3. [ ] **Open URL in incognito window** (simulates new user)
4. [ ] Check Network tab → `invite.opened` event created with `signedLinkId` and `referrerId`
5. [ ] Complete the 5 questions
6. [ ] Check Network tab → `fvm.reached` event created with `signedLinkId`
7. [ ] Click "Sign Up to Continue"
8. [ ] Verify URL has `?ref=[signedLinkId]` parameter
9. [ ] Fill out sign-up form and submit
10. [ ] Check Network tab → `account.created` event has `referrerSignedLinkId` in metadata
11. [ ] Check database → `Attribution` record links referrer to new user

**Expected Full Chain:**
```
invite.sent → invite.opened → fvm.reached → account.created → Attribution
    ↓              ↓               ↓              ↓                ↓
(link ID)      (link ID)       (link ID)      (link ID)     (referrer + referred)
```

**Database Verification:**
```sql
-- View full funnel for a specific signed link (replace [YOUR_LINK_ID])
SELECT 
  e.type, 
  e."userId", 
  e.metadata->>'signedLinkId' as link_id,
  e.metadata->>'referrerSignedLinkId' as ref_link_id,
  e.ts
FROM "Event" e
WHERE 
  e.metadata->>'signedLinkId' = '[YOUR_LINK_ID]' OR
  e.metadata->>'referrerSignedLinkId' = '[YOUR_LINK_ID]'
ORDER BY e.ts;

-- Check Attribution table
SELECT 
  a.*,
  u1.email as referrer_email,
  u2.email as referred_email
FROM "Attribution" a
JOIN "User" u1 ON a."referrerId" = u1.id
JOIN "User" u2 ON a."referredUserId" = u2.id
ORDER BY a."convertedAt" DESC
LIMIT 5;
```

**Success Criteria:**
- [ ] All 4 events link back to same `signedLinkId`
- [ ] Attribution record created with correct referrer and referred user IDs
- [ ] Channel is set to "email"
- [ ] Loop matches challenge type (buddy-challenge, etc.)
- [ ] K-factor can be calculated: `K = (referred users) / (total active users)`

**Why This Matters:** This is how we measure viral growth! Without proper attribution, we can't calculate K-factor or prove the product's viral mechanics work.

---

#### 5. FVM Landing Page (Challenge)
**URL:** `http://localhost:3000/challenge/test-challenge-1`

**Test:**
- [ ] Pre-start screen shows referrer info
- [ ] "Start Challenge" button works
- [ ] Question 1 displays with 4 options
- [ ] Progress bar updates after each answer
- [ ] All 5 questions appear
- [ ] Results screen shows score and comparison
- [ ] "Sign Up to Continue" CTA works

**Expected:** Smooth flow from start → questions → results, no errors

---

#### 6. Presence UI
**URL:** `http://localhost:3000/presence`

**Test:**
- [ ] Tab navigation works (Presence / Leaderboards / Cohorts)
- [ ] Total online count displays
- [ ] Friends online section shows mock friends
- [ ] Subject activity grid displays all subjects
- [ ] Trend indicators show (📈📉➡️)
- [ ] Numbers update every ~5 seconds

**Expected:** Beautiful layout, smooth tab switching, simulated real-time updates

---

#### 7. Mini Leaderboards
**How:** Go to `/presence` and click "Leaderboards" tab

**Test:**
- [ ] Subject dropdown works
- [ ] Friends filter checkbox works
- [ ] Top 3 show medal badges (🥇🥈🥉)
- [ ] Current user row highlighted in blue
- [ ] Score and streak display correctly
- [ ] Friend indicator (👥) shows for friends

**Expected:** Interactive filtering, current user stands out

---

#### 8. Cohort Rooms
**How:** Go to `/presence` and click "Cohort Rooms" tab

**Test:**
- [ ] Room cards display with stats
- [ ] Click a room to see details
- [ ] Room detail shows member count, online count
- [ ] Activity feed displays
- [ ] "Start Co-Practice" button visible
- [ ] "Back" button returns to room list
- [ ] "Create Cohort Room" CTA displays

**Expected:** Room cards have hover effects, detail view shows more info

---

## 🔧 Simulator Testing

### Rebuild Simulator
```bash
cd C:\Users\marcu\vt-kfactor
pnpm --filter simulation build
```

### Run Fresh Simulation
```bash
pnpm prisma:seed
```

**Watch for:**
- [ ] New event types appear in console output
- [ ] `challenge.created` events logged
- [ ] `share.clicked` events logged
- [ ] `presence.joined/left` events logged
- [ ] `cohort.joined/activity` events logged
- [ ] K-factor output at end of seed

**Expected:** Should see new event types, K-factor displayed

---

## 📊 Dashboard Verification

### View Dashboard
**URL:** `http://localhost:3000/dashboard`

**Test:**
- [ ] K-factor card shows non-zero value
- [ ] Viral funnel shows all 4 steps
- [ ] Step 3 (`account.created`) is NOT >100%
- [ ] Retention cohort curves display
- [ ] Cohort comparison shows control vs treatment
- [ ] Agent logs display
- [ ] Fraud monitoring shows events (if any)

**Expected:** Dashboard loads with data from simulation, no crashes

---

## 🎯 K-Factor Target Testing

### Goal: Control = 0.8, Treatment = 1.2

### Current Simulator Parameters
**File:** `packages/simulation/src/cohort-simulator.ts`

#### Control Group (cohort_control):
```typescript
viralBoost: 0.95           // Slightly below baseline
fvmToInviteRate: 0.15      // 15% of FVM users send invites
avgInvitesPerUser: 1.8     // Average invites per sender
inviteToSignupRate: 0.35   // 35% invite conversion
```

#### Treatment Group (cohort_treatment):
```typescript
viralBoost: 1.35           // Strong viral boost
fvmToInviteRate: 0.25      // 25% of FVM users send invites
avgInvitesPerUser: 2.5     // More invites per sender
inviteToSignupRate: 0.40   // 40% invite conversion
```

### How to Tune

1. **If control K-factor is too low (<0.8):**
   - Increase `fvmToInviteRate` (e.g., 0.15 → 0.18)
   - OR increase `avgInvitesPerUser` (e.g., 1.8 → 2.0)

2. **If control K-factor is too high (>0.8):**
   - Decrease `viralBoost` (e.g., 0.95 → 0.90)
   - OR decrease `inviteToSignupRate` (e.g., 0.35 → 0.30)

3. **If treatment K-factor is too low (<1.2):**
   - Increase `viralBoost` (e.g., 1.35 → 1.45)
   - OR increase `fvmToInviteRate` (e.g., 0.25 → 0.30)

4. **If treatment K-factor is too high:**
   - That's a good problem! Celebrate 🎉

### Verification Process
1. Edit `packages/simulation/src/cohort-simulator.ts`
2. Rebuild: `pnpm --filter simulation build`
3. Reseed: `pnpm prisma:seed`
4. Check console output for K-factor
5. Verify in dashboard: `http://localhost:3000/dashboard`
6. Repeat until targets hit

---

## 🐛 Known Issues / Limitations

### Not Yet Implemented (Phase 8)
- ⚠️ **Email sending** - Invite emails won't actually send (API returns success but doesn't email)
- ⚠️ **Image generation** - Share cards don't generate actual images (just preview in modal)
- ⚠️ **WebSocket** - Real-time updates are simulated with `setInterval` (not true WebSocket)
- ⚠️ **OAuth** - Google/Apple login not set up yet
- ⚠️ **Password reset** - Flow not implemented

### Expected Behaviors
- Challenge links use mock data (not reading from database)
- Results pages use mock data (not reading from database)
- Presence data is simulated (not from actual user activity)
- Friend data is hardcoded (not real friends)

### What SHOULD Work
- ✅ All UI rendering and interactions
- ✅ Form validation and state management
- ✅ Invite API signed link generation
- ✅ Event tracking (logs to database)
- ✅ Simulator generating all event types
- ✅ Dashboard reading from database

---

## 📝 Testing Notes Template

Use this template to document your testing:

```markdown
## Test Session: [Date]

### Results Page
- ✅/❌ Score display: [notes]
- ✅/❌ Skills breakdown: [notes]
- ✅/❌ Share button: [notes]
- ✅/❌ Challenge CTA: [notes]

### Share Card
- ✅/❌ Variants: [notes]
- ✅/❌ Copy link: [notes]
- ✅/❌ Social buttons: [notes]

### Challenge Landing
- ✅/❌ Pre-start: [notes]
- ✅/❌ Questions: [notes]
- ✅/❌ Results: [notes]

### Presence
- ✅/❌ Online count: [notes]
- ✅/❌ Friends: [notes]
- ✅/❌ Subject activity: [notes]

### Leaderboards
- ✅/❌ Filters: [notes]
- ✅/❌ Ranks: [notes]

### Cohort Rooms
- ✅/❌ Room cards: [notes]
- ✅/❌ Detail view: [notes]

### Simulation
- Control K-factor: [value]
- Treatment K-factor: [value]
- Notes: [observations]

### Dashboard
- ✅/❌ K-factor card: [notes]
- ✅/❌ Funnel: [notes]
- ✅/❌ Retention: [notes]
- ✅/❌ Cohort comparison: [notes]

### Issues Found
1. [Issue description]
2. [Issue description]
```

---

## 🚀 Quick Start Testing Flow

```bash
# 1. Start dev server
pnpm dev

# 2. In new terminal, rebuild simulator
pnpm --filter simulation build

# 3. Reseed database
pnpm prisma:seed

# 4. Open browser and test URLs:
http://localhost:3000/results/test-result-1
http://localhost:3000/challenge/test-challenge-1
http://localhost:3000/presence
http://localhost:3000/dashboard

# 5. For each page:
- Click all buttons
- Test all interactions
- Check browser console for errors
- Check Network tab for API calls

# 6. Take notes on what works / what doesn't
```

---

## 🎓 Success Criteria

### Minimum to Pass Testing
- [ ] All 8 UI components load without errors
- [ ] All interactive elements are clickable
- [ ] Simulator generates new event types
- [ ] Dashboard shows data from simulation
- [ ] Control K-factor is between 0.7-0.9
- [ ] Treatment K-factor is between 1.1-1.3

### Bonus Points
- [ ] All visual designs look polished
- [ ] Animations are smooth
- [ ] No console errors
- [ ] Mobile-responsive layouts work
- [ ] Real-time updates feel natural

---

## 💬 Questions?

If you encounter any issues or have questions:
1. Check browser console for errors
2. Check terminal for server errors
3. Verify database connection (Supabase)
4. Try rebuilding: `pnpm install && pnpm --filter simulation build`
5. Try fresh seed: `pnpm prisma:seed`

**Good luck testing! 🎉**


