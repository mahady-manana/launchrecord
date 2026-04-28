export const validationAndImprovementInstruction = `
## 🔍 SIO-V5 — VALIDATION & FINALIZATION (STEP 4)

Objective:
Validate, correct, and finalize the report.
Ensure full consistency, high signal, and zero contradictions.
Use the previous step report as the base state.
Validate that every issue still maps back to the approved metric checklist from the earlier steps.
Keep the audit category-aware. Do not downgrade the report simply because the site does not follow a generic SaaS template if the category and audience are still clear.

---

## ✅ ENFORCEMENT RULES

1. Total Issues:
- Keep the full report issue set coherent
- If issues are duplicated or overlapping, merge or remove them
- If a section is too thin, add only the missing layer-specific improvements
- Final report should end at 12–15 total issues
- If below 12, add distinct low-severity issues where the report is still missing coverage
- If above 15, remove the weakest duplicates or near-duplicates
- Do not add issues outside the approved metric groups

2. De-duplication:
- Merge or remove overlapping issues
- Keep the most conversion-impactful version
- Positioning and first_impression take priority over cosmetic issues

3. Scores:
- Preserve the step 1, step 2, and step 3 scores
- Do not recalculate layer scores here unless they are missing or clearly invalid
- Set the overall score only in this step
- Do not reduce scores just because there are a few critical issues
- Score must stay holistic and reflect the full website picture
- The overall score should be generous when the product is understandable and commercially coherent
- A few critical issues should usually keep the report in the 60s or 70s unless the whole message is broadly unclear
- Do not anchor the overall score to the raw number of issues

4. impactScore Alignment:
- Must match severity range
- Must justify penalty applied
- Fix any inconsistencies
- Keep impactScore tied to the actual metric loss, not the number of issues

5. Statement Rules (STRICT):
- All statements = diagnostic only (WHAT + WHY)
- Keep statements short, direct, and specific
- Prefer plain language over long explanations
- MUST include consequence (confusion, drop-off, weak differentiation)
- NO fixes, suggestions, or “should”

6. Explanation Rules:
- Keep explanation to 1 short sentence
- Make it concrete and factual
- Do not restate the statement
- Do not add extra detail or new ideas

7. Issue Quality Upgrade:
- Remove vague issues
- Rewrite weak statements to be precise and outcome-driven
- Ensure every issue clearly impacts conversion

8. Recommendations:
- Must be strategic (what to change)
- No generic advice

9. Fixes:
- Must be copy-paste ready
- No labels (e.g. no "New headline:")
- No placeholders or vague templates

10. Top-level distinction:
- "statement" ≠ "firstImpressions.statement"
- Ensure clear difference (overall vs above-the-fold)

11. websiteSummary:
- Keep factual
- No diagnosis, no optimization
- Do not modify meaning
- Keep the same factual checklist structure from earlier steps
- Preserve implicit audience or outcome signals when they are clearly supported by the page

12. Previous steps:
- Respect the summary, first impression, positioning, messaging, and AEO outputs from prior steps
- Only correct contradictions or obvious inconsistencies
- Preserve metric mapping from earlier steps unless it is clearly wrong
- Do not overwrite a clear category-specific reading with a generic SaaS template reading

#### Scoring Principle:
- The overall score must reflect the full report, not a simple issue count
- A few critical issues do not automatically make the website very bad
- Reserve very low scores for broad, repeated breakdowns across the report
- Strong positioning or clarity in other areas can keep the overall score meaningfully above the low band
- Use this calibration:
  - 90–100: the product story is very clear, specific, and easy to trust
  - 75–89: the product is clear and strong, with some real but manageable gaps
  - 65–74: the site is understandable and credible, but needs sharpening
  - 50–64: the site has obvious weaknesses but still communicates the offer
  - 0–49: the core message is broadly confusing or too generic
- If the site clearly communicates what it is, who it is for, and why it matters, the overall score should usually stay above 60 even with notable issues

---

## ⚡ OUTPUT

{
  "statement": "...",
  "issues": [...],
  "scoring": {
    "overall": 0
  },
  "firstImpressions": {...},
  "categoryInsights": {...},
  "websiteSummary": {...}
}

RETURN ONLY JSON
`;
