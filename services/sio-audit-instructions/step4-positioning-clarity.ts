/**
 * Step 4: Positioning & Clarity - Specific Instructions
 *
 * Use with: base-instructions.ts
 * Analyzes: 6 positioning metrics + 6 clarity metrics
 * Context: Receives summary and first impression from Step 3
 */

export const step4PositioningClarityInstructions = `
## CONTEXT FROM PREVIOUS STEPS

Your task is to analyze a startup's website and generate brutally honest, specific, actionable reports.

Now, you have access to analysis from Step 3 (Summary & First Impressions):

**Website Summary Context: Audited**
{WEBSITE_SUMMARY_CONTEXT}

**First Impression Context: Audited**
{FIRST_IMPRESSION_CONTEXT}

Use this context to:
- Build on the summary findings about what the startup claims to do
- Reference hero section analysis when evaluating messaging clarity
- Maintain consistency with positioning clarity assessment
- Avoid contradicting earlier analysis

---

## YOUR SPECIFIC TASK: Positioning & Clarity

### Part 1: Positioning Analysis (6 Dimensions)

Analyze market positioning across these dimensions:

1. **Category Ownership** - Do they own a specific category?
2. **Unique Value Proposition** - What makes them uniquely valuable?
3. **Competitive Differentiation** - How are they different from alternatives?
4. **Target Audience Clarity** - Is their ICP specific and clear?
5. **Problem-Solution Fit** - Does their solution match the problem?
6. **Messaging Consistency** - Is messaging consistent across pages?

**For EACH sub-metric, provide:**
- **name**: Sub-metric name
- **score**: 0-100
- **current**: Their exact positioning statement (or "Not clearly stated" if absent)
- **positiveComments**: 1-2 positives (1-2 items)
- **negativeComments**: 2-3 issues (be brutally honest)
- **suggested**: 2-3 exact positioning rewrites. Copy-paste ready.

**Overall positioning:**
- **score**: 0-100 weighted average
- **statement**: 2-3 sentence overall assessment
- **overallCommentPositive**: 2-3 things working well
- **overallCommentNegative**: 3-4 critical issues
- **summary**: {
    **current**: Overall positioning statement from website
    **positiveComments**: 1-2 positives
    **negativeComments**: 2-3 issues
    **suggested**: 2-3 improved positioning statements
  }

---

### Part 2: Clarity Analysis (6 Dimensions)

Analyze message clarity across these dimensions:

1. **Headline Clarity** - Is the main headline instantly understandable?
2. **Value Proposition** - Is the value prop clear in 5 seconds?
3. **Feature-Benefit Mapping** - Do features explain benefits clearly?
4. **Visual Hierarchy** - Is information presented in logical order?
5. **CTA Clarity** - Are calls-to-action specific and action-oriented?
6. **Proof Placement** - Are testimonials/social proof well-positioned?

**For EACH sub-metric, provide:**
- **name**: Sub-metric name
- **score**: 0-100
- **current**: Their exact text (or "Not present" if absent)
- **positiveComments**: 1-2 positives (1-2 items)
- **negativeComments**: 2-3 issues (be brutally honest)
- **suggested**: 2-3 exact rewrites. Copy-paste ready.
- **unclearTexts**: [
    **text**: Specific unclear sentence/phrase from website
    **issue**: Why it's unclear
    **fix**: Exact rewrite (copy-paste ready)
  ]

**Overall clarity:**
- **score**: 0-100 weighted average
- **statement**: 2-3 sentence overall assessment
- **overallCommentPositive**: 2-3 things working well
- **overallCommentNegative**: 3-4 critical issues
- **summary**: {
    **current**: Overall messaging state
    **positiveComments**: 1-2 positives
    **negativeComments**: 2-3 issues
    **suggested**: 2-3 improved messaging examples
  }
- **unclearSentences**: [Aggregated unclear sentences from all sub-metrics]

---

## RETURN FORMAT

Return ONLY valid JSON matching this structure:

{
  "positioning": {
    "score": number,
    "statement": "string",
    "overallCommentPositive": string[],
    "overallCommentNegative": string[],
    "summary": { "current": "string", "positiveComments": string[], "negativeComments": string[], "suggested": string[] },
    "subMetrics": {
      "categoryOwnership": { "name": "string", "score": number, "current": "string", "positiveComments": string[], "negativeComments": string[], "suggested": string[] },
      "uniqueValueProp": { "name": "string", "score": number, "current": "string", "positiveComments": string[], "negativeComments": string[], "suggested": string[] },
      "competitiveDiff": { "name": "string", "score": number, "current": "string", "positiveComments": string[], "negativeComments": string[], "suggested": string[] },
      "targetAudience": { "name": "string", "score": number, "current": "string", "positiveComments": string[], "negativeComments": string[], "suggested": string[] },
      "problemSolutionFit": { "name": "string", "score": number, "current": "string", "positiveComments": string[], "negativeComments": string[], "suggested": string[] },
      "messagingConsistency": { "name": "string", "score": number, "current": "string", "positiveComments": string[], "negativeComments": string[], "suggested": string[] }
    }
  },
  "clarity": {
    "score": number,
    "statement": "string",
    "overallCommentPositive": string[],
    "overallCommentNegative": string[],
    "summary": { "current": "string", "positiveComments": string[], "negativeComments": string[], "suggested": string[] },
    "unclearSentences": [{ "text": "string", "issue": "string", "fix": "string" }],
    "subMetrics": {
      "headlineClarity": { "name": "string", "score": number, "current": "string", "positiveComments": string[], "negativeComments": string[], "suggested": string[], "unclearTexts": [{ "text": "string", "issue": "string", "fix": "string" }] },
      "valueProposition": { "name": "string", "score": number, "current": "string", "positiveComments": string[], "negativeComments": string[], "suggested": string[], "unclearTexts": [{ "text": "string", "issue": "string", "fix": "string" }] },
      "featureBenefitMapping": { "name": "string", "score": number, "current": "string", "positiveComments": string[], "negativeComments": string[], "suggested": string[], "unclearTexts": [{ "text": "string", "issue": "string", "fix": "string" }] },
      "visualHierarchy": { "name": "string", "score": number, "current": "string", "positiveComments": string[], "negativeComments": string[], "suggested": string[], "unclearTexts": [{ "text": "string", "issue": "string", "fix": "string" }] },
      "ctaClarity": { "name": "string", "score": number, "current": "string", "positiveComments": string[], "negativeComments": string[], "suggested": string[], "unclearTexts": [{ "text": "string", "issue": "string", "fix": "string" }] },
      "proofPlacement": { "name": "string", "score": number, "current": "string", "positiveComments": string[], "negativeComments": string[], "suggested": string[], "unclearTexts": [{ "text": "string", "issue": "string", "fix": "string" }] }
    }
  }
}

---

## IMPORTANT

- Extract EXACT text from the website (no summarizing)
- Reference the summary and first impression context provided
- Suggested rewrites must be copy-paste ready
- Be brutally honest in negative comments
- If positioning isn't clearly stated, create suggestions based on available content
- Every unclear sentence must have a specific fix
- Aggregate unclear sentences across sub-metrics for the overall unclearSentences array

ANY ERROR, INCONSISTENCY, NO ICP, VAGUENESS OR NEED OPTIMIZATION WILL RESULT IN A LOW SCORE.

`;
