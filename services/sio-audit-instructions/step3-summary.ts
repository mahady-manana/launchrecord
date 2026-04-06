/**
 * Step 3: Summary & First Impressions - Specific Instructions
 *
 * Use with: base-instructions.ts
 * Analyzes: Website summary, hero section, headline, subheadline, CTA
 */

export const step3SummaryInstructions = `
## YOUR SPECIFIC TASK: Summary & First Impressions

Analyze ONLY the following sections:

### 1. Website Summary
Extract and judge:

- **summary**: 1-2 sentence overview of what this startup does
- **summaryComment**: Comment on the summary quality

**For each of these 4 areas:**
- Problems they claim to solve
- Outcomes they promise
- Solutions they offer
- Features they highlight

Extract:
- **currents**: Their exact claims (verbatim from website)
- **positiveComments**: 1-2 positive observations
- **negativeComments**: 2-3 issues (vagueness, no metrics, etc.)

Then flag:
- **isPositioningClear**: boolean - Is their positioning clear?
- **isMessagingClear**: boolean - Is their messaging clear?
- **areUsersLeftGuessing**: boolean - Are users left guessing what they do?

### 2. First Impression (Hero Section)

This is the MOST critical conversion factor. 80% of visitors never scroll past this.

**For each element (headline, subheadline, CTA):**
- **current**: Their exact text (verbatim)
- **positiveComments**: 1-2 positives (1-2 items)
- **negativeComments**: 2-3 issues (be brutally honest)
- **suggested**: 2-3 exact rewrites. Copy-paste ready. Be creative. Mind content length.

**Overall hero section:**
- **score**: 0-100 based on scoring guidelines
- **statement**: 2-3 sentence overall assessment
- **overallCommentPositive**: 2-3 things working well
- **overallCommentNegative**: 3-4 critical issues

---

## RETURN FORMAT

Return ONLY valid JSON matching this structure:

{
  "websiteSummary": {
    "summary": "string",
    "summaryComment": "string",
    "problems": { "currents": string[], "positiveComments": string[], "negativeComments": string[] },
    "outcomes": { "currents": string[], "positiveComments": string[], "negativeComments": string[] },
    "solutions": { "currents": string[], "positiveComments": string[], "negativeComments": string[] },
    "features": { "currents": string[], "positiveComments": string[], "negativeComments": string[] },
    "isPositioningClear": boolean,
    "isMessagingClear": boolean,
    "areUsersLeftGuessing": boolean
  },
  "firstImpression": {
    "score": number,
    "statement": "string",
    "overallCommentPositive": string[],
    "overallCommentNegative": string[],
    "headline": { "current": "string", "positiveComments": string[], "negativeComments": string[], "suggested": string[] },
    "subheadline": { "current": "string", "positiveComments": string[], "negativeComments": string[], "suggested": string[] },
    "cta": { "current": "string", "positiveComments": string[], "negativeComments": string[], "suggested": string[] }
  }
}

---

## IMPORTANT

- Extract EXACT text from the website (no summarizing)
- Suggested rewrites must be copy-paste ready
- Be brutally honest in negative comments
- Score based on specificity, ICP clarity, and conversion optimization
`;
