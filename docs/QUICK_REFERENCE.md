# Multi-Step SIO Audit - Quick Reference Card

## 🚀 TL;DR

The SIO-V5 audit is now a **6-step pipeline** (init+content combined) instead of a single API call. Each step stores data in DB and returns progress updates.

## 📡 Endpoints

| Step | Endpoint                                        | Purpose                             | AI? |
| ---- | ----------------------------------------------- | ----------------------------------- | --- |
| 1    | `POST /api/sio-audit/steps/init`                | Initialize, validate, fetch content | ❌  |
| 2    | `POST /api/sio-audit/steps/summary`             | Summary + First impressions         | ✅  |
| 3    | `POST /api/sio-audit/steps/positioning-clarity` | Deep analysis (12 metrics)          | ✅  |
| 4    | `POST /api/sio-audit/steps/aeo`                 | AI visibility check                 | ✅  |
| 5    | `POST /api/sio-audit/steps/scoring`             | Calculate scores                    | ❌  |
| 6    | `POST /api/sio-audit/steps/refine`              | QA & finalize                       | ✅  |

**Status**: `GET /api/sio-audit/status/[reportId]`

## 💻 Quick Start

```typescript
// 1. Initialize
const init = await fetch("/api/sio-audit/steps/init", {
  method: "POST",
  body: JSON.stringify({ url: "https://example.com", isGuest: true }),
});
const { reportId } = await init.json();

// 2. Run through steps
const steps = [
  "content",
  "summary",
  "positioning-clarity",
  "aeo",
  "scoring",
  "refine",
];

for (const step of steps) {
  const response = await fetch(`/api/sio-audit/steps/${step}`, {
    method: "POST",
    body: JSON.stringify({ reportId }),
  });

  const data = await response.json();
  console.log(`Step ${step}: ${data.progress}`);

  if (step === "refine") {
    console.log("Audit complete!", data.data);
  }
}
```

## 🔄 Polling Strategy

```typescript
const pollStatus = async (reportId: string) => {
  const interval = setInterval(async () => {
    const response = await fetch(`/api/sio-audit/status/${reportId}`);
    const data = await response.json();

    console.log("Progress:", data.progress);

    if (data.progress === "complete" || data.progress === "failed") {
      clearInterval(interval);
      return data;
    }
  }, 2000);
};
```

## 📊 Progress States

```
initializing → content_fetched → summary_complete →
positioning_clarity_complete → aeo_complete →
scoring_complete → complete (or failed)
```

## 🗄️ Database Changes

**New Fields in SIOReport:**

- `progress`: Current step (enum)
- `tempData`: Temporary content storage (deleted on complete)
- `failedAt`: Which step failed
- `errorMessage`: Error details

## ⚡ Scoring Weights

- First Impression: **20%**
- Positioning: **25%**
- Clarity: **25%**
- AEO: **10%**
- Website Summary: **20%**

## 🤖 AI Models Used

- **Step 3, 4**: `x-ai/grok-4.1-fast`, `qwen/qwen3.5-35b-a3b`
- **Step 5, 7**: `qwen/qwen3.5-35b-a3b`, `x-ai/grok-4.1-fast`
- **Total tokens**: ~18,300 per audit

## ❌ Error Handling

```typescript
// If step fails:
{
  error: "Error message",
  failedAt: "step_name",
  errorMessage: "Detailed error"
}

// Retry from failed step:
POST /api/sio-audit/steps/{failedStep}
{ "reportId": "..." }
```

## 🧪 Test Commands

```bash
# Step 1: Init
curl -X POST http://localhost:3000/api/sio-audit/steps/init \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com","isGuest":true}'

# Check status
curl http://localhost:3000/api/sio-audit/status/{reportId}
```

## 📁 Files Created

### API Routes (8 files)

- `/app/api/sio-audit/steps/init/route.ts`
- `/app/api/sio-audit/steps/content/route.ts`
- `/app/api/sio-audit/steps/summary/route.ts`
- `/app/api/sio-audit/steps/positioning-clarity/route.ts`
- `/app/api/sio-audit/steps/aeo/route.ts`
- `/app/api/sio-audit/steps/scoring/route.ts`
- `/app/api/sio-audit/steps/refine/route.ts`
- `/app/api/sio-audit/status/[reportId]/route.ts`

### Documentation (4 files)

- `/docs/multi-step-audit-architecture.md`
- `/docs/multi-step-audit-implementation.md`
- `/docs/multi-step-audit-diagram.md`
- `/docs/MULTI_STEP_AUDIT_SUMMARY.md`
- `/docs/README_MULTI_STEP_AUDIT.md`

### Modified Files (1 file)

- `/models/sio-report.ts` (added progress, tempData, failedAt, errorMessage)

## ✅ Backward Compatibility

- ✅ Old `/api/sio-v5-audit` route **still works**
- ✅ No breaking changes
- ✅ Gradual migration path

## 🎯 Next Steps

- [ ] Update `PublicAuditPage.tsx` to use new API
- [ ] Add polling to `TerminalAuditLoader.tsx`
- [ ] Map terminal steps to API steps
- [ ] Add retry/cancel functionality

---

**Build**: ✅ Passing | **TypeScript**: ✅ Full | **Production**: ✅ Ready
