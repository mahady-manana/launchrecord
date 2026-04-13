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

- currents → verbatim text only
- no reclassification between categories
- no inference

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
¯

```json
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
      "current": "string",
      "positiveComments": [],
      "negativeComments": [],
      "recommendation": [],
      "suggested": []
    },
    "subheadline": {
      "current": "string",
      "positiveComments": [],
      "negativeComments": [],
      "recommendation": [],
      "suggested": []
    },
    "cta": {
      "current": "string",
      "positiveComments": [],
      "negativeComments": [],
      "recommendation": [],
      "suggested": []
    }
  }
}
```

No markdown  
No commentary  
No extra text  
No deviation

`;
