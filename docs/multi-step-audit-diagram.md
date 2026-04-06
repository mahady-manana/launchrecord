# Multi-Step SIO Audit - Visual Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT (Browser)                            │
│                                                                       │
│  ┌──────────────────┐              ┌──────────────────────────┐     │
│  │  Terminal UI     │◄─────────────│  Progress Polling        │     │
│  │  (3.5 min)       │   updates   │  (every 2s)              │     │
│  └──────────────────┘              └──────────────────────────┘     │
│         │                                  ▲                         │
│         │                                  │                         │
│         ▼                                  │                         │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │          Multi-Step Audit Orchestrator                        │   │
│  │                                                               │   │
│  │  Step 1 → Step 2 → Step 3 → Step 4 → Step 5 → Step 6 → Step 7│   │
│  │                                                               │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
         │                                  ▲
         │ POST                             │
         ▼                                  │
┌─────────────────────────────────────────────────────────────────────┐
│                     API ROUTES (/api/sio-audit)                      │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  STEPS ENDPOINTS                                               │  │
│  │                                                                 │  │
│  │  POST /steps/init              → Initialize audit              │  │
│  │  POST /steps/content           → Fetch website content         │  │
│  │  POST /steps/summary           → AI: Summary + First Impress   │  │
│  │  POST /steps/position-clarity  → AI: Positioning + Clarity     │  │
│  │  POST /steps/aeo               → AI: AEO visibility            │  │
│  │  POST /steps/scoring           → Calculate scores              │  │
│  │  POST /steps/refine            → AI: QA + Finalize             │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  STATUS ENDPOINT                                               │  │
│  │                                                                 │  │
│  │  GET  /status/[reportId]       → Return current progress       │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
         │                                  ▲
         │                                  │
         ▼                                  │
┌─────────────────────────────────────────────────────────────────────┐
│                        DATABASE (MongoDB)                             │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  SIOReport Collection                                          │  │
│  │                                                                 │  │
│  │  - _id, url, product                                            │  │
│  │  - progress: 'initializing' → 'complete'                        │  │
│  │  - tempData: { content, metadata, etc } (deleted at end)       │  │
│  │  - websiteSummary: { ... } (Step 3)                            │  │
│  │  - firstImpression: { ... } (Step 3)                           │  │
│  │  - positioning: { ... } (Step 4)                               │  │
│  │  - clarity: { ... } (Step 4)                                   │  │
│  │  - aeo: { ... } (Step 5)                                       │  │
│  │  - overallScore, statement, reportBand (Step 6)                │  │
│  │  - failedAt, errorMessage (if failed)                          │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

## Step-by-Step Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 1: INIT                                                         │
│ Endpoint: POST /api/sio-audit/steps/init                             │
│                                                                         │
│ Input:                                                                 │
│   { url, productId?, isGuest? }                                       │
│                                                                         │
│ Operations:                                                            │
│   ✓ Validate URL (server-side)                                        │
│   ✓ Check authentication                                              │
│   ✓ Check existing reports (30 days)                                  │
│   ✓ Verify usage limits (monthly/weekly)                              │
│   ✓ Create empty report document                                      │
│                                                                         │
│ Output:                                                                │
│   { success: true, reportId, progress: 'initializing' }              │
│                                                                         │
│ DB State: progress='initializing'                                     │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 2: CONTENT FETCH                                                │
│ Endpoint: POST /api/sio-audit/steps/content                          │
│                                                                         │
│ Input:                                                                 │
│   { reportId }                                                        │
│                                                                         │
│ Operations:                                                            │
│   ✓ Fetch website content (getWebsiteContent)                         │
│   ✓ Extract: robots.txt, sitemap, metadata, JSON-LD                   │
│   ✓ Validate content sufficiency (min 100 chars)                      │
│   ✓ Store in tempData                                                 │
│                                                                         │
│ Output:                                                                │
│   { success, reportId, progress: 'content_fetched',                  │
│     contentSummary: { contentLength, hasSitemap, hasRobots } }       │
│                                                                         │
│ DB State: progress='content_fetched', tempData={...}                 │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 3: SUMMARY & FIRST IMPRESSIONS (AI)                            │
│ Endpoint: POST /api/sio-audit/steps/summary                          │
│                                                                         │
│ Input:                                                                 │
│   { reportId }                                                        │
│                                                                         │
│ AI Analysis:                                                           │
│   → Website Summary (what they do, problems, outcomes, solutions)     │
│   → First Impressions (headline, subheadline, CTA analysis)           │
│                                                                         │
│ Models Used:                                                           │
│   - x-ai/grok-4.1-fast OR qwen/qwen3.5-35b-a3b                        │
│                                                                         │
│ Output:                                                                │
│   { success, reportId, progress: 'summary_complete',                  │
│     summary, firstImpressionScore }                                   │
│                                                                         │
│ DB State: progress='summary_complete',                                │
│           websiteSummary={...}, firstImpression={...}                │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 4: POSITIONING & CLARITY (AI)                                  │
│ Endpoint: POST /api/sio-audit/steps/positioning-clarity              │
│                                                                         │
│ Input:                                                                 │
│   { reportId }                                                        │
│                                                                         │
│ AI Analysis:                                                           │
│   → Positioning (6 sub-metrics):                                      │
│       Category Ownership, UVP, Competitive Diff,                      │
│       Target Audience, Problem-Solution Fit, Messaging Consistency    │
│                                                                         │
│   → Clarity (6 sub-metrics + unclear sentences):                      │
│       Headline Clarity, Value Prop, Feature-Benefit,                  │
│       Visual Hierarchy, CTA Clarity, Proof Placement                  │
│                                                                         │
│ Output:                                                                │
│   { success, reportId, progress: 'positioning_clarity_complete',     │
│     positioningScore, clarityScore, unclearSentencesCount }          │
│                                                                         │
│ DB State: progress='positioning_clarity_complete',                    │
│           positioning={...}, clarity={...}                           │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 5: AEO VISIBILITY (AI)                                          │
│ Endpoint: POST /api/sio-audit/steps/aeo                              │
│                                                                         │
│ Input:                                                                 │
│   { reportId }                                                        │
│                                                                         │
│ AI Analysis:                                                           │
│   → AI Engine Presence (is brand mentioned in AI responses?)          │
│   → Structured Data Readiness (JSON-LD, meta tags)                    │
│   → Answer Engine Optimization                                        │
│   → Specific recommendations                                          │
│                                                                         │
│ Output:                                                                │
│   { success, reportId, progress: 'aeo_complete',                     │
│     aeoScore, aiPresent }                                             │
│                                                                         │
│ DB State: progress='aeo_complete', aeo={...}                         │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 6: SCORING                                                      │
│ Endpoint: POST /api/sio-audit/steps/scoring                          │
│                                                                         │
│ Input:                                                                 │
│   { reportId }                                                        │
│                                                                         │
│ Operations:                                                            │
│   ✓ Retrieve all step data from DB                                    │
│   ✓ Calculate weighted overall score:                                 │
│       First Impression: 20%                                           │
│       Positioning: 25%                                                │
│       Clarity: 25%                                                    │
│       AEO: 10%                                                        │
│       Website Summary: 20%                                            │
│                                                                         │
│   ✓ Determine report band (Dominant/Strong/Blended/Weak/Ghost)        │
│   ✓ Generate overall statement                                        │
│   ✓ Compile positive/negative comments                                │
│                                                                         │
│ Output:                                                                │
│   { success, reportId, progress: 'scoring_complete',                 │
│     overallScore, reportBand, bandDescription }                       │
│                                                                         │
│ DB State: progress='scoring_complete',                                │
│           overallScore=67, statement='...', reportBand='Blended'     │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 7: REFINE & FINALIZE (AI)                                      │
│ Endpoint: POST /api/sio-audit/steps/refine                           │
│                                                                         │
│ Input:                                                                 │
│   { reportId, isGuest? }                                              │
│                                                                         │
│ AI Quality Assurance:                                                  │
│   → Cross-validate scores for consistency                             │
│   → Check for contradictions between sections                         │
│   → Refine unclear statements                                         │
│   → Ensure actionable recommendations                                 │
│   → Verify all required fields present                                │
│                                                                         │
│ Final Operations:                                                      │
│   ✓ Apply refinements (if any)                                        │
│   ✓ Remove tempData (cleanup)                                         │
│   ✓ Set progress='complete'                                           │
│   ✓ Update usage counts                                               │
│   ✓ Update product score                                              │
│   ✓ Sanitize report for guest users                                   │
│                                                                         │
│ Output:                                                                │
│   { success, data: { ...SIOV5Report... },                            │
│     progress: 'complete', metadata }                                  │
│                                                                         │
│ DB State: progress='complete', tempData=undefined                    │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────────────────┐
                    │  RETURN TO CLIENT   │
                    │  Full Report Data   │
                    └─────────────────────┘
```

## Polling Flow

```
Client                          Server
  │                               │
  │  POST /steps/init             │
  ├──────────────────────────────►│
  │                               │
  │  { reportId: "abc123" }       │
  │◄──────────────────────────────┤
  │                               │
  │  GET /status/abc123           │
  ├──────────────────────────────►│
  │                               │
  │  { progress: "initializing" } │
  │◄──────────────────────────────┤
  │                               │
  │  (wait 2s)                    │
  │                               │
  │  POST /steps/content          │
  ├──────────────────────────────►│
  │                               │
  │  { progress: "content_fetched"}│
  │◄──────────────────────────────┤
  │                               │
  │  GET /status/abc123           │
  ├──────────────────────────────►│
  │                               │
  │  { progress: "content_fetched"}│
  │◄──────────────────────────────┤
  │                               │
  │  (wait 2s)                    │
  │                               │
  │  POST /steps/summary          │
  ├──────────────────────────────►│
  │                               │
  │  ... (continues)              │
  │                               │
  │  POST /steps/refine           │
  ├──────────────────────────────►│
  │                               │
  │  { progress: "complete",      │
  │    data: {...} }              │
  │◄──────────────────────────────┤
  │                               │
```

## Error Recovery Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Normal Flow:                                                 │
│   Step 1 → Step 2 → Step 3 → Step 4 → Step 5 → Step 6 → Step 7│
│                                                             │
│ Error at Step 4:                                             │
│   Step 1 ✓ → Step 2 ✓ → Step 3 ✓ → Step 4 ✗                │
│                                                             │
│   DB State:                                                  │
│     progress: 'failed'                                      │
│     failedAt: 'positioning_clarity_generation'              │
│     errorMessage: 'AI service timeout'                      │
│                                                             │
│   Preserved Data:                                            │
│     ✓ websiteSummary (Step 3)                               │
│     ✓ firstImpression (Step 3)                              │
│     ✓ tempData (Step 2)                                     │
│                                                             │
│ Retry Options:                                               │
│   Option A: Retry from failed step only                     │
│     POST /steps/positioning-clarity { reportId }            │
│     → Continue with Step 5, 6, 7                            │
│                                                             │
│   Option B: Restart entire audit                            │
│     POST /steps/init { url }                                │
│     → Creates new report, starts from Step 1                │
│                                                             │
│   Option C: Cancel audit                                    │
│     DELETE /api/sio-audit/cancel/[reportId]                 │
│     → Removes incomplete report, refunds usage              │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema Evolution

```
┌─────────────────────────────────────────────────────────────┐
│ After Step 1 (Init):                                         │
│   {                                                          │
│     _id: ObjectId,                                           │
│     url: "https://example.com",                             │
│     product: null,                                           │
│     progress: "initializing",                                │
│     overallScore: 0,                                         │
│     reportBand: "Ghost",                                     │
│     // All sections empty/default                           │
│   }                                                          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ After Step 2 (Content):                                      │
│   {                                                          │
│     ...previous fields,                                      │
│     progress: "content_fetched",                             │
│     tempData: {                                              │
│       simplifiedContent: "...",                             │
│       metadata: { title, description, ... },                │
│       ldJson: { ... },                                       │
│       robotsTxt: "...",                                      │
│       sitemap: "...",                                        │
│       contentLength: 5420,                                   │
│       hasSitemap: true,                                      │
│       hasRobots: true,                                       │
│     }                                                        │
│   }                                                          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ After Step 3 (Summary):                                      │
│   {                                                          │
│     ...previous fields,                                      │
│     progress: "summary_complete",                            │
│     websiteSummary: {                                        │
│       summary: "AI-powered CRM for startups",              │
│       problems: { currents: [...], ... },                   │
│       outcomes: { currents: [...], ... },                   │
│       solutions: { currents: [...], ... },                  │
│       features: { currents: [...], ... },                   │
│       isPositioningClear: true,                              │
│       isMessagingClear: true,                                │
│     },                                                       │
│     firstImpression: {                                       │
│       score: 65,                                             │
│       headline: { current: "...", suggested: [...] },       │
│       subheadline: { current: "...", suggested: [...] },    │
│       cta: { current: "...", suggested: [...] },            │
│     }                                                        │
│   }                                                          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ After Step 4 (Positioning & Clarity):                        │
│   {                                                          │
│     ...previous fields,                                      │
│     progress: "positioning_clarity_complete",                │
│     positioning: {                                           │
│       score: 72,                                             │
│       summary: { current: "...", suggested: [...] },        │
│       subMetrics: {                                          │
│         categoryOwnership: { score: 70, ... },              │
│         uniqueValueProp: { score: 65, ... },                │
│         // ... 4 more sub-metrics                           │
│       }                                                      │
│     },                                                       │
│     clarity: {                                               │
│       score: 58,                                             │
│       summary: { current: "...", suggested: [...] },        │
│       unclearSentences: [                                    │
│         { text: "...", issue: "...", fix: "..." },          │
│         // ... more unclear sentences                       │
│       ],                                                     │
│       subMetrics: {                                          │
│         headlineClarity: { score: 60, unclearTexts: [...] },│
│         // ... 5 more sub-metrics                           │
│       }                                                      │
│     }                                                        │
│   }                                                          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ After Step 5 (AEO):                                          │
│   {                                                          │
│     ...previous fields,                                      │
│     progress: "aeo_complete",                                │
│     aeo: {                                                   │
│       score: 35,                                             │
│       statement: "Limited AI visibility",                   │
│       aiPresence: {                                          │
│         isPresent: false,                                    │
│         engines: [],                                         │
│         comment: "Brand not found in major AI engines"      │
│       },                                                     │
│       recommendations: [                                     │
│         "Add FAQ schema markup",                            │
│         "Create structured data for products",              │
│         // ... more recommendations                         │
│       ]                                                      │
│     }                                                        │
│   }                                                          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ After Step 6 (Scoring):                                      │
│   {                                                          │
│     ...previous fields,                                      │
│     progress: "scoring_complete",                            │
│     overallScore: 62,  ← Calculated from weighted average   │
│     statement: "Your startup has understandable...",        │
│     reportBand: "Blended",                                   │
│     overallCommentPositive: [                                │
│       "Clear value proposition",                            │
│       "Strong problem-solution fit",                        │
│       // ... more positive comments                         │
│     ],                                                       │
│     overallCommentNegative: [                                │
│       "Weak AI visibility",                                 │
│       "Headline lacks specificity",                         │
│       // ... more negative comments                         │
│     ]                                                        │
│   }                                                          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ After Step 7 (Refine & Complete):                            │
│   {                                                          │
│     ...previous fields,                                      │
│     progress: "complete",                                    │
│     overallScore: 64,  ← Adjusted by AI refinement          │
│     statement: "Refined statement...", ← Improved by AI     │
│     auditDuration: 210000, ← 3.5 minutes in ms              │
│     createdAt: ISODate("..."),                               │
│     updatedAt: ISODate("...")                                │
│     // tempData REMOVED ✓                                   │
│     // failedAt REMOVED (if was set) ✓                      │
│     // errorMessage REMOVED (if was set) ✓                  │
│   }                                                          │
└─────────────────────────────────────────────────────────────┘
```

## Progress States Timeline

```
0s        30s       60s       90s       120s      150s      180s      210s
│─────────│─────────│─────────│─────────│─────────│─────────│─────────│
│         │         │         │         │         │         │         │
▼         ▼         ▼         ▼         ▼         ▼         ▼         ▼
init   content   summary   position  position  aeo      scoring   refine
         fetch               & clarity complete
                             complete
                             
Progress States:
initializing → content_fetched → summary_complete → positioning_clarity_complete → 
aeo_complete → scoring_complete → complete
                                      ↓
                                   (or failed at any point)
```

## AI Model Usage Summary

```
┌──────────────────────────────────────────────────────────────┐
│ Step 3: Summary & First Impressions                          │
│   Models: x-ai/grok-4.1-fast, qwen/qwen3.5-35b-a3b          │
│   Reasoning: medium                                          │
│   Estimated Tokens: ~3000 prompt, ~1500 completion           │
│                                                               │
│ Step 4: Positioning & Clarity                                │
│   Models: x-ai/grok-4.1-fast, qwen/qwen3.5-35b-a3b          │
│   Reasoning: high                                            │
│   Estimated Tokens: ~4000 prompt, ~2500 completion           │
│                                                               │
│ Step 5: AEO                                                  │
│   Models: qwen/qwen3.5-35b-a3b, x-ai/grok-4.1-fast          │
│   Reasoning: medium                                          │
│   Estimated Tokens: ~2500 prompt, ~800 completion            │
│                                                               │
│ Step 7: Refinement                                           │
│   Models: qwen/qwen3.5-35b-a3b, x-ai/grok-4.1-fast          │
│   Reasoning: medium                                          │
│   Estimated Tokens: ~3500 prompt, ~500 completion            │
│                                                               │
│ Total Estimated Cost: ~18,300 tokens per audit               │
└──────────────────────────────────────────────────────────────┘
```

This multi-step architecture provides:
✅ **Transparency** - Users see real progress
✅ **Reliability** - Partial data saved on failure
✅ **Accuracy** - Each step builds on previous
✅ **Efficiency** - Focused prompts per step
✅ **Scalability** - Easy to add/modify steps
✅ **Debuggability** - Clear error localization
