# SIO-V5 Multi-Step Audit - Instruction Architecture

## Overview

The multi-step audit system uses a **modular instruction architecture** with:
1. **Base instructions** (applies to all steps)
2. **Step-specific instructions** (customized for each AI call)
3. **Context passing** (previous step data flows to subsequent steps)

## File Structure

```
/services/sio-audit-instructions/
├── base-instructions.ts          ← Core rules for all AI calls
├── step3-summary.ts              ← Summary & First Impressions specific
├── step4-positioning-clarity.ts  ← Positioning & Clarity specific
├── step5-aeo.ts                  ← AEO visibility specific
├── step7-refinement.ts           ← Quality assurance specific
└── index.ts                      ← Centralized exports
```

## Architecture

### Base Instructions (`base-instructions.ts`)

Contains **universal rules** that apply to ALL audit steps:
- 3 Golden Rules (extract exact text, no vague feedback, exact rewrites)
- Scoring guidelines (0-100 scale with descriptors)
- Comment standards (positive, negative, suggested formats)
- Output format rules (JSON-only, no markdown wrapping)
- Context awareness guidelines

**Export**: `sioV5BaseInstructions`

---

### Step-Specific Instructions

Each step has its own instruction file that:
1. **Builds on base instructions** (assumes base rules are loaded first)
2. **Defines specific task** for that step only
3. **Specifies return format** (exact JSON structure)
4. **Includes context placeholders** (marked with `{VARIABLE_NAME}`)

#### Step 3: Summary & First Impressions
**File**: `step3-summary.ts`
**Analyzes**:
- Website summary (problems, outcomes, solutions, features)
- First impressions (headline, subheadline, CTA)
**Context**: None (first AI step)

#### Step 4: Positioning & Clarity
**File**: `step4-positioning-clarity.ts`
**Analyzes**:
- 6 positioning dimensions
- 6 clarity dimensions + unclear sentences
**Context**: Receives Step 3 analysis
- `{WEBSITE_SUMMARY_CONTEXT}`
- `{FIRST_IMPRESSION_CONTEXT}`

#### Step 5: AEO
**File**: `step5-aeo.ts`
**Analyzes**:
- AI engine presence
- Structured data readiness
- Answer engine optimization
**Context**: Receives ALL previous analysis
- `{WEBSITE_SUMMARY_CONTEXT}`
- `{FIRST_IMPRESSION_CONTEXT}`
- `{POSITIONING_CONTEXT}`
- `{CLARITY_CONTEXT}`

#### Step 7: Refinement
**File**: `step7-refinement.ts`
**Analyzes**:
- Complete report for consistency
- Cross-validation between sections
- Quality scoring
**Context**: Receives COMPLETE report
- `{COMPLETE_REPORT_CONTEXT}`

---

## Context Flow

### How Context Passes Between Steps

```typescript
// Step 4 Example: Building context from previous steps
const previousContext = {
  websiteSummary: {
    summary: report.websiteSummary?.summary,
    isPositioningClear: report.websiteSummary?.isPositioningClear,
    problems: report.websiteSummary?.problems,
    // ... more fields
  },
  firstImpression: {
    score: report.firstImpression?.score,
    headline: report.firstImpression?.headline,
    // ... more fields
  },
};

// Replace context placeholders in instructions
const stepInstructions = step4PositioningClarityInstructions
  .replace('{WEBSITE_SUMMARY_CONTEXT}', JSON.stringify(previousContext.websiteSummary, null, 2))
  .replace('{FIRST_IMPRESSION_CONTEXT}', JSON.stringify(previousContext.firstImpression, null, 2));
```

### What Context Includes

**Step 4 receives from Step 3:**
- Website summary (what startup does)
- Positioning clarity flags
- Messaging clarity flags
- Hero section analysis (headline, subheadline, CTA)
- Scores and comments

**Step 5 receives from Steps 3-4:**
- Complete website summary
- Complete first impression
- Complete positioning analysis (6 sub-metrics)
- Complete clarity analysis (6 sub-metrics + unclear sentences)

**Step 7 receives from Steps 3-6:**
- Complete report with all sections
- Overall score and band
- All comments and suggestions

---

## API Route Integration

### How Routes Use Instructions

Each route follows this pattern:

```typescript
import { 
  sioV5BaseInstructions, 
  stepXInstructions 
} from "@/services/sio-audit-instructions";

// 1. Get report with previous step data
const report = await SIOReport.findById(reportId);

// 2. Build context from previous steps
const context = {
  // ... extract relevant fields from report
};

// 3. Replace context placeholders
const finalInstructions = stepXInstructions
  .replace('{CONTEXT_VAR}', JSON.stringify(context, null, 2));

// 4. Call AI with base + step instructions
const aiResponse = await client.chat.send({
  messages: [
    { role: "system", content: sioV5BaseInstructions },      // Base rules
    { role: "system", content: finalInstructions },           // Step-specific
    { role: "user", content: websiteContent },                // Data to analyze
  ],
  // ... other params
});
```

---

## Benefits of This Architecture

### 1. **Maintainability**
- Change base rules in ONE place
- Update step instructions independently
- Clear separation of concerns

### 2. **Context Awareness**
- Each step builds on previous analysis
- AI has full context from earlier steps
- Avoids contradictions between sections

### 3. **Accuracy**
- AI references earlier findings
- Maintains consistency across sections
- Better scoring alignment

### 4. **Debugging**
- Easy to test individual steps
- Clear instruction files to review
- Isolated changes don't affect other steps

### 5. **Scalability**
- Add new steps easily
- Modify existing steps independently
- Reuse instruction components

---

## Example: Full Context Flow

### Step 5 (AEO) Context Assembly

```typescript
// What AI sees when analyzing AEO:

SYSTEM: [Base Instructions - Universal rules]
SYSTEM: [Step 5 Instructions - AEO specific]
         WITH context from previous steps:
         
         Website Summary:
         {
           "summary": "AI-powered CRM for startups",
           "isPositioningClear": true,
           "problems": { ... },
           // ...
         }
         
         First Impression:
         {
           "score": 65,
           "headline": { ... },
           // ...
         }
         
         Positioning:
         {
           "score": 72,
           "subMetrics": { ... },
           // ...
         }
         
         Clarity:
         {
           "score": 58,
           "unclearSentences": [ ... ],
           // ...
         }

USER: [Website content to analyze]
USER: [Generate AEO section]
```

This gives AI **complete context** to make informed decisions about AEO based on:
- What the startup claims to do (summary)
- How clear their messaging is (clarity)
- How well they're positioned (positioning)
- What their hero section says (first impression)

---

## Testing Instructions

### Test Individual Steps

```bash
# Test Step 3 (Summary)
curl -X POST http://localhost:3000/api/sio-audit/steps/summary \
  -H "Content-Type: application/json" \
  -d '{"reportId":"YOUR_REPORT_ID"}'

# Test Step 4 (Positioning/Clarity) - Has context from Step 3
curl -X POST http://localhost:3000/api/sio-audit/steps/positioning-clarity \
  -H "Content-Type: application/json" \
  -d '{"reportId":"YOUR_REPORT_ID"}'
```

### Verify Context is Passed

Check the AI logs to see context in the request:
- Context should include previous step data
- Placeholders should be replaced with actual JSON
- Instructions should be complete and self-contained

---

## Files Modified

### Created (6 files):
- `/services/sio-audit-instructions/base-instructions.ts`
- `/services/sio-audit-instructions/step3-summary.ts`
- `/services/sio-audit-instructions/step4-positioning-clarity.ts`
- `/services/sio-audit-instructions/step5-aeo.ts`
- `/services/sio-audit-instructions/step7-refinement.ts`
- `/services/sio-audit-instructions/index.ts`

### Updated (4 files):
- `/app/api/sio-audit/steps/summary/route.ts`
- `/app/api/sio-audit/steps/positioning-clarity/route.ts`
- `/app/api/sio-audit/steps/aeo/route.ts`
- `/app/api/sio-audit/steps/refine/route.ts`

---

## Summary

✅ **Base instructions** - Universal rules for all AI calls
✅ **Step-specific instructions** - Customized for each step
✅ **Context passing** - Previous data flows to subsequent steps
✅ **Modular architecture** - Easy to maintain and extend
✅ **Build status** - Passing
✅ **Type safety** - Full TypeScript

The AI now has **complete context** from all previous steps, enabling better analysis, consistency, and accuracy!
