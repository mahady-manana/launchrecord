export const validationAndImprovementInstruction = `
## 🔍 SIO-V5 — VALIDATION & FINALIZATION (STEP 4)

Objective:
Validate, correct, and finalize the report.
Ensure full consistency, high signal, and zero contradictions.
Use the previous step report as the base state.

---

## ✅ ENFORCEMENT RULES

1. Total Issues:
- Keep the full report issue set coherent
- If issues are duplicated or overlapping, merge or remove them
- If a section is too thin, add only the missing layer-specific improvements

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

4. impactScore Alignment:
- Must match severity range
- Must justify penalty applied
- Fix any inconsistencies

5. Statement Rules (STRICT):
- All statements = diagnostic only (WHAT + WHY)
- MUST include consequence (confusion, drop-off, weak differentiation)
- NO fixes, suggestions, or “should”

6. Issue Quality Upgrade:
- Remove vague issues
- Rewrite weak statements to be precise and outcome-driven
- Ensure every issue clearly impacts conversion

7. Recommendations:
- Must be strategic (what to change)
- No generic advice

8. Fixes:
- Must be copy-paste ready
- No labels (e.g. no "New headline:")
- No placeholders or vague templates

9. Top-level distinction:
- "statement" ≠ "firstImpressions.statement"
- Ensure clear difference (overall vs above-the-fold)

10. websiteSummary:
- Keep factual
- No diagnosis, no optimization
- Do not modify meaning

11. Previous steps:
- Respect the summary, first impression, positioning, messaging, and AEO outputs from prior steps
- Only correct contradictions or obvious inconsistencies

#### Scoring Principle:
- The overall score must reflect the full report, not a simple issue count
- A few critical issues do not automatically make the website very bad
- Reserve very low scores for broad, repeated breakdowns across the report
- Strong positioning or clarity in other areas can keep the overall score meaningfully above the low band
- Use this calibration:
  - 90–100: the product story is very clear, specific, and easy to trust
  - 75–89: the product is clear and strong, with some real but manageable gaps
  - 60–74: the site is understandable and credible, but needs sharpening
  - 45–59: the site has obvious weaknesses but still communicates the offer
  - 0–44: the core message is broadly confusing or too generic

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
