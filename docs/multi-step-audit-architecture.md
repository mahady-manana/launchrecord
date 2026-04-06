# Multi-Step SIO Audit Architecture

## Overview
The SIO-V5 audit has been refactored from a single monolithic API call into a **7-step progressive pipeline**. Each step:
1. Performs a specific analysis
2. Stores results in the database
3. Returns progress updates to the client
4. Feeds data to subsequent steps for better accuracy

## Architecture Principles

### Why Multi-Step?
- **Better Accuracy**: Each step builds on previous analysis
- **Progress Tracking**: Real-time progress updates to users
- **Error Recovery**: If one step fails, previous data is preserved
- **Resource Management**: Better token usage per call
- **Debugging**: Easier to identify which step failed

### Data Flow
```
Client → Step 1 (Init) → DB → Step 2 (Content) → DB → Step 3 (Summary) → DB → 
Step 4 (First Impression) → DB → Step 5 (Positioning & Clarity) → DB → 
Step 6 (AEO) → DB → Step 7 (Scoring & Refinement) → DB → Return Report
```

## Step Breakdown

### Step 1: `/api/sio-audit/steps/init`
**Purpose**: Pre-audit validation and report initialization

**Input**:
```json
{
  "url": "https://example.com",
  "productId": "optional",
  "isGuest": true
}
```

**Operations**:
- URL validation (server-side)
- Authentication check
- Check for existing recent reports (30 days)
- Usage limits verification (monthly/weekly)
- Create empty report document with `progress: 'initializing'`
- Return `reportId` for subsequent steps

**Output**:
```json
{
  "success": true,
  "reportId": "mongo_id",
  "progress": "initializing",
  "nextStep": "/api/sio-audit/steps/content"
}
```

---

### Step 2: `/api/sio-audit/steps/content`
**Purpose**: Fetch and analyze website content

**Input**:
```json
{
  "reportId": "mongo_id"
}
```

**Operations**:
- Fetch website content using `getWebsiteContent()`
- Extract: robots.txt, sitemap, metadata, JSON-LD
- Simplify content for AI processing
- Validate content sufficiency (min 100 chars)
- Store raw content in `tempData` field
- Update progress to `content_fetched`

**Output**:
```json
{
  "success": true,
  "reportId": "mongo_id",
  "progress": "content_fetched",
  "contentSummary": {
    "contentLength": 5420,
    "hasSitemap": true,
    "hasRobots": true,
    "metadataCount": 12
  },
  "nextStep": "/api/sio-audit/steps/summary"
}
```

---

### Step 3: `/api/sio-audit/steps/summary`
**Purpose**: AI-powered website understanding and first impressions

**Input**:
```json
{
  "reportId": "mongo_id"
}
```

**AI Operations**:
1. **Website Summary**:
   - What the startup does
   - Problems they solve
   - Outcomes they promise
   - Solutions they offer
   - Features they have

2. **First Impressions**:
   - Headline analysis
   - Subheadline analysis
   - CTA analysis
   - Overall hero section score

**Store in DB**:
```json
{
  "websiteSummary": { ... },
  "firstImpression": { ... },
  "progress": "summary_complete"
}
```

**Output**:
```json
{
  "success": true,
  "reportId": "mongo_id",
  "progress": "summary_complete",
  "summary": "1-2 sentence overview",
  "nextStep": "/api/sio-audit/steps/positioning-clarity"
}
```

---

### Step 4: `/api/sio-audit/steps/positioning-clarity`
**Purpose**: Deep positioning and clarity analysis

**Input**:
```json
{
  "reportId": "mongo_id"
}
```

**AI Operations**:

**Positioning Analysis**:
- Category Ownership
- Unique Value Proposition
- Competitive Differentiation
- Target Audience Clarity
- Problem-Solution Fit
- Messaging Consistency

Each sub-metric includes:
- Score (0-100)
- Current state
- Positive comments
- Negative comments
- Suggested fixes

**Clarity Analysis**:
- Headline Clarity
- Value Proposition
- Feature-Benefit Mapping
- Visual Hierarchy
- CTA Clarity
- Proof Placement

Each includes:
- Score (0-100)
- Unclear sentences with fixes
- Specific rewrites

**Store in DB**:
```json
{
  "positioning": { ... },
  "clarity": { ... },
  "progress": "positioning_clarity_complete"
}
```

---

### Step 5: `/api/sio-audit/steps/aeo`
**Purpose**: AI Engine Optimization visibility

**Input**:
```json
{
  "reportId": "mongo_id"
}
```

**AI Operations**:
- Check AI engine presence (ChatGPT, Claude, etc.)
- Analyze structured data for AI readability
- Answer engine readiness assessment
- Featured snippet optimization
- Knowledge graph signals

**Store in DB**:
```json
{
  "aeo": {
    "score": 45,
    "statement": "...",
    "aiPresence": {
      "isPresent": false,
      "engines": [],
      "comment": "..."
    },
    "recommendations": [...]
  },
  "progress": "aeo_complete"
}
```

---

### Step 6: `/api/sio-audit/steps/scoring`
**Purpose**: Calculate final scores and generate report

**Input**:
```json
{
  "reportId": "mongo_id"
}
```

**Operations**:
- Retrieve all step data from DB
- Calculate weighted overall score:
  - First Impression: 20%
  - Positioning: 25%
  - Clarity: 25%
  - AEO: 10%
  - Website Summary: 20%
- Determine report band (Dominant/Strong/Blended/Weak/Ghost)
- Generate overall statement
- Compile positive/negative comments

**Store in DB**:
```json
{
  "overallScore": 67,
  "statement": "...",
  "reportBand": "Blended",
  "overallCommentPositive": [...],
  "overallCommentNegative": [...],
  "progress": "scoring_complete"
}
```

---

### Step 7: `/api/sio-audit/steps/refine`
**Purpose**: Quality assurance and report finalization

**Input**:
```json
{
  "reportId": "mongo_id"
}
```

**AI Operations**:
- Cross-validate scores for consistency
- Check for contradictions between sections
- Refine unclear statements
- Ensure actionable recommendations
- Verify all required fields present
- Generate final report

**Operations**:
- Remove `tempData` field (cleanup)
- Set `progress: 'complete'`
- Update usage counts
- Return final sanitized report

**Output**:
```json
{
  "success": true,
  "data": { ... SIOV5Report ... },
  "progress": "complete",
  "metadata": {
    "reportId": "...",
    "reportGeneratedAt": "...",
    "cached": false,
    "stepsCompleted": 7
  }
}
```

---

## Database Schema Extensions

### New Fields in SIOReport Model

```typescript
{
  // Progress tracking
  progress: 'initializing' | 
            'content_fetched' | 
            'summary_complete' | 
            'positioning_clarity_complete' | 
            'aeo_complete' | 
            'scoring_complete' | 
            'complete' |
            'failed',
  
  // Temporary storage (deleted on completion)
  tempData?: {
    rawWebsiteContent?: string;
    simplifiedContent?: string;
    metadata?: any;
    ldJson?: any;
    robotsTxt?: string;
    sitemap?: string;
  },
  
  // Error tracking
  failedAt?: string;
  errorMessage?: string;
}
```

---

## Client Integration

### Polling Strategy
The client polls a status endpoint:

```typescript
// Poll every 2 seconds
const pollInterval = setInterval(async () => {
  const response = await fetch(`/api/sio-audit/status/${reportId}`);
  const data = await response.json();
  
  updateTerminalProgress(data.progress);
  
  if (data.progress === 'complete' || data.progress === 'failed') {
    clearInterval(pollInterval);
    handleCompletion(data);
  }
}, 2000);
```

### Error Handling
- If any step fails, client receives error with `failedAt` step
- User can retry from failed step
- All previous step data preserved in DB

---

## Benefits

1. **Transparency**: Users see real progress
2. **Reliability**: Partial data saved on failure
3. **Accuracy**: Each step informs the next
4. **Scalability**: Easy to add new steps
5. **Debugging**: Clear error localization
6. **Cost Control**: Token usage per step tracked

---

## Migration Plan

- Old `/api/sio-v5-audit` route preserved for backward compatibility
- New routes use `/api/sio-audit/steps/*`
- Frontend gradually migrated to new pipeline
- Old route deprecated after full migration
