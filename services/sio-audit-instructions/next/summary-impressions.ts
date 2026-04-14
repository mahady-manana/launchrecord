export const summaryImpressionInstruction = `
# STEP 1 — SUMMARY & FIRST IMPRESSIONS

Analyze ONLY:

- website summary block
- hero section (headline, subheadline, CTA)

Focus:

- Website summary - based totaly on website content
- how quickly the product is understood (clarity speed)
- whether value is immediately obvious (comprehension friction)
- whether the hero creates conversion intent or confusion
- whether positioning is explicit or unclear

---

## WEBSITE SUMMARY

### summary

- 1–2 sentence neutral description of what the startup does
- strictly descriptive (no evaluation)

---

### CATEGORY ANALYSIS (STRICT EXTRACTION)

Extract ONLY if explicitly present.

If unclear or missing:
→ currents = []
→ do NOT guess

Definitions:

- problems → explicit pain points stated
- outcomes → explicit results or benefits promised
- solutions → what the product does (mechanism/action)
- features → Listed functionalities

Rules:

- currents → Only what is said in website.
- no reclassification between categories
- Rephrasing is only allow if needed no forced.
- Max 5 items

For each:

- positiveComments → 1–2 strengths (clarity, specificity)
- negativeComments → 1–3 weaknesses ONLY if visible

---

### FLAGS

Set ONLY if clearly supported:

- isPositioningClear
- isMessagingClear
- areUsersLeftGuessing

---

## FIRST IMPRESSIONS (HERO)

Evaluate if a new user understands within ~10 seconds:

- WHAT the product does
- WHO it is for
- WHY it matters

Check:

- feature-led or brand-led headline
- presence of problem / outcome / ICP signals
- clarity speed
- conversion intent
- positioning clarity

### SCORING ANCHORS FOR FIRST IMPRESSION:

- 90-100: FLAWLESS. Headline instantly states WHO, WHAT, WHY. Subheadline reinforces perfectly. CTA specific + outcome. Zero friction. (<1%)
- 70-79: STRONG. Headline clear on 2/3 signals. Minor friction. CTA action clear but outcome somewhat vague (~10%)
- 50-64: AVERAGE. Headline vague on WHO or WHY. Requires full read. CTA generic ("Get Started"). Typical SaaS site (~60%)
- 30-49: WEAK. Headline is brand name or feature list without context. User confused after 5s (~25%)
- 0-29: BROKEN. Headline communicates nothing about value. User doesn't understand product after 10s (~4%)

**SCORING RULE**: If headline doesn't state WHO it's for, cap at 55.
**SCORING RULE**: If CTA is generic ("Get Started", "Sign Up", "Try now") without outcome, cap at 50.
**SCORING RULE**: If headline has grammar/spelling errors, deduct 5 points immediately.
**SCORING RULE**: DEFAULT SCORE for average SaaS hero section = 50-60.

Analyze:

- headline
- subheadline
- CTA
- 10s clarity

---

## HERO OUTPUT

- statement
- overallCommentPositive
- overallCommentNegative
- recommendation
- score
- tenSecondClarityTest
- tenSecondClarityTestComment

---

## HERO COMPONENTS

For each:

- current
- positiveComments
- negativeComments
- recommendation
- suggested

See **GLOBAL METRIC CONTRACT** in first system message for rules.

---

## OUTPUT

Return ONLY valid JSON:


{
  "websiteSummary": {
    "summary": "string",
    "problems": {
      "currents": [],
      "positiveComments": [],
      "negativeComments": []
    },
    "outcomes": {
      "currents": [],
      "positiveComments": [],
      "negativeComments": []
    },
    "solutions": {
      "currents": [],
      "positiveComments": [],
      "negativeComments": []
    },
    "features": {
      "currents": [],
      "positiveComments": [],
      "negativeComments": []
    },
    "isPositioningClear": "boolean",
    "isMessagingClear": "boolean",
    "areUsersLeftGuessing": "boolean"
  },
  "firstImpression": {
    "score": 0,
    "statement": "string",
    "tenSecondClarityTest": "boolean",
    "tenSecondClarityTestComment": "string",
    "recommendation": [],
    "overallCommentPositive": [],
    "overallCommentNegative": [],
    "headline": {
      "statement": "string",
      "current": "string",
      "positiveComments": [],
      "negativeComments": [],
      "recommendation": [],
      "suggested": []
    },
    "subheadline": {
      "statement": "string",
      "current": "string",
      "positiveComments": [],
      "negativeComments": [],
      "recommendation": [],
      "suggested": []
    },
    "cta": {
      "statement": "string",
      "current": "string",
      "positiveComments": [],
      "negativeComments": [],
      "recommendation": [],
      "suggested": []
    }
  }
}

No markdown  
No commentary  
No extra text  
No deviation

`;
