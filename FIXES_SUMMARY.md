# SIO-V5 Audit Fixes Summary

## 1. Score Inflation Fixed ✅

### Problem:
AI was scoring 70-90 for average startups because scoring guidelines were too lenient.

### Changes Made:

**Scoring Distribution Shifted -10 points:**
```
OLD (too lenient)          NEW (strict)
90-100 → Strong (30%)      90-100 → FLAWLESS (<1%)
70-89  → Strong (45%)      70-89  → STRONG (~10%)
50-69  → Average (15%)     50-69  → AVERAGE (~60%) ← Most startups here
30-49  → Weak (8%)         30-49  → WEAK (~25%)
0-29   → Ghost (2%)        0-29   → BROKEN (~4%)
```

**Files Modified:**
- `services/sio-audit-instructions/next/base-instructions.ts`
- `services/sio-audit-instructions/next/positioning-clarity.ts`
- `services/sio-audit-instructions/next/summary-impressions.ts`
- `services/sio-audit-instructions/next/refinement.ts`
- `app/api/sio-audit/steps/scoring/route.ts`

**Automatic Penalty Enforcement:**
- Unclear messages: -2 points each (max -10)
- Negative issues identified: -2 points each (max -12)
- Weak positioning (flags false): -10 points
- Users left guessing: -8 points
- Weak first impression (<50): -5 points
- Commodity risk (similar high scores): -5 points

**Website Summary Score Baseline:**
- Changed from `score = 50` to `score = 25`
- Requires BOTH positioning AND messaging clear for significant bonus
- Penalty if users left guessing

**Sub-Metric Caps:**
- 3+ negative comments → cap section at 55
- 2+ unclear sentences → cap clarity at 60
- Generic CTA → cap at 50
- No WHO in headline → cap at 55

---

## 2. Audit Loading Flow Fixed ✅

### Problem:
`useAudit` hook was initialized with mock data and `progress: "complete"`, breaking terminal loader.

### Changes Made:

**File:** `components/audit/useAudit.ts`

**Before:**
```typescript
const [status, setStatus] = useState<AuditStatus>({
  progress: "complete",
  reportId: "6979",
  overallScore: 65,
  data: newmock,
  ...
});

isComplete: true, // hardcoded
```

**After:**
```typescript
const [status, setStatus] = useState<AuditStatus>({
  progress: "idle",
  reportId: null,
  overallScore: null,
  data: null,
  ...
});

isComplete: status.progress === "complete",
```

---

## 3. One-Time Payment Users Blocked Fixed ✅

### Problem:
Subscription lookup failing, falling through to free plan logic (1 audit limit).

### Changes Made:

**File:** `app/api/sio-audit/steps/init/route.ts`

- Multi-strategy subscription lookup (exact productId → broader search)
- Dual tracking for one-time payments (subscription.auditsUsed + Usage model)
- Comprehensive logging for debugging

**File:** `app/api/sio-audit/steps/refine/route.ts`

- Now increments `subscription.auditsUsed` for one-time payments
- Ensures both Usage model AND Subscription stay in sync

---

## 4. Audit Usage Logic Redesigned ✅

### Problem:
Complex Usage model with period tracking for ALL users, causing confusion and bugs.

### New Simple Logic:

| Plan Type | Limit Tracking | What's Checked |
|-----------|---------------|----------------|
| **Guest** | N/A | URL has recent report (30 days)? |
| **Free** | N/A | Product has ANY report? (1 lifetime) |
| **One-Time** | `subscription.auditsUsed` | `auditsUsed < totalAuditLimit` (lifetime counter) |
| **Subscription** | `Usage` model | Monthly + weekly period tracking |

### Key Changes:

**Init Route (`app/api/sio-audit/steps/init/route.ts`):**
- Completely rewritten with clear sections per plan type
- Removed complex `getOrCreateSioUsage` for free/one-time users
- Free users: Simple report count check (no Usage doc)
- One-time: Direct `subscription.auditsUsed` check (no period search)
- Subscription: Usage model with monthly/weekly tracking only
- Added `findSubscription()` helper with multi-strategy lookup
- Added `getOrCreateUsage()` helper (only for subscription plans)

**Refine Route (`app/api/sio-audit/steps/refine/route.ts`):**
- Rewritten `updateUsage()` function with clear plan-type branches
- Free users: No tracking (return immediately)
- One-time: Only increments `subscription.auditsUsed`
- Subscription: Only increments Usage model counters

### Before vs After:

**Before (Confusing):**
```typescript
// Used Usage model for EVERYONE
usage = await getOrCreateSioUsage(productId, totalLimit, 0);
if (usage.sioAuditsUsed >= totalLimit) { block }

// Complex period tracking for one-time (unnecessary)
// Fallback to free plan logic if subscription not found
// Multiple nested if-else blocks
```

**After (Clean):**
```typescript
// Free users
const existingReports = await SIOReport.countDocuments({ product: productId });
if (existingReports >= 1) { block }

// One-time pass
if (subscription.auditsUsed >= subscription.totalAuditLimit) { block }

// Subscription
const usage = await getOrCreateUsage(productId);
if (usage.sioAuditsUsed >= monthlyLimit) { block }
if (usage.sioWeeklyAuditUsed >= weeklyLimit) { block }
```

---

## 5. Dashboard Preview API Data Structure Fixed ✅

### Problem:
API changed to return `pillars` (flat scores) instead of full report objects, but hook was creating minimal reports missing required fields.

### Changes Made:

**File:** `hooks/use-products.ts`

- Now constructs complete `SIOV5Report` objects from preview data
- Maps `pillars.firstImpression` → `firstImpression.score`
- Maps `pillars.positioning` → `positioning.score`
- Maps `pillars.clarity` → `clarity.score`
- Maps `pillars.aeo` → `aeo.score`
- Creates all required nested structures (summary, subMetrics, comments, etc.)

---

## Expected Score Distribution After All Fixes:

```
90-100: ██ <1%    (Truly exceptional, world-class)
70-89:  ████ 10%  (Strong differentiation, minimal friction)
50-69:  ████████████████ 60%  (Most startups - understandable but friction)
30-49:  ██████ 25%  (Significant issues, conversion breaking)
0-29:   █ 4%    (Invisible, users don't understand)
```

---

## Files Changed:

| File | Change |
|------|--------|
| `components/sio-report/DashboardSIOReport.tsx` | Added sticky tabs, Recommendations view |
| `components/sio-report/DashboardSIOReport/components/RecommendationsView.tsx` | NEW: Extracts all negatives, recommendations, suggestions |
| `components/sio-report/DashboardSIOReport/constants/navigation.ts` | Added Recommendations to sidebar |
| `components/sio-report/DashboardSIOReport/components/index.ts` | Exported RecommendationsView |
| `components/audit/useAudit.ts` | Fixed initial state, isComplete calculation |
| `hooks/use-products.ts` | Fixed preview data transformation |
| `app/api/sio-audit/steps/init/route.ts` | Completely redesigned usage logic |
| `app/api/sio-audit/steps/scoring/route.ts` | Added penalty enforcement, fixed baseline |
| `app/api/sio-audit/steps/refine/route.ts` | Rewrote updateUsage(), strict scoring instructions |
| `services/sio-audit-instructions/next/base-instructions.ts` | Strict scoring distribution, mandatory penalties |
| `services/sio-audit-instructions/next/positioning-clarity.ts` | Scoring anchors shifted -10 points |
| `services/sio-audit-instructions/next/summary-impressions.ts` | First impression anchors shifted -10 points |
| `services/sio-audit-instructions/next/refinement.ts` | Strict scoring validation, score caps |
| `research/mocks/report.ts` | Fixed TypeScript type errors |
