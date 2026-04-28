export const scoringAndFixesInstruction = `
## ⚙️ SIO-V5 — POSITIONING & MESSAGING (STEP 2)

Objective:
Analyze positioning and messaging only.
Use the previous step report as the base state.
Do not change first impression findings except to preserve consistency.

---

## 📊 SCORING (MANDATORY)

1. Score only positioning and clarity here.
2. Do not recalculate first impression score.
3. Do not treat issue count or issue severity as a direct score formula.
4. Two critical issues can still coexist with a reasonably strong layer score if the rest of the message is coherent.
5. Use this calibration:
- 85–100 when the product is clearly positioned, differentiated, and easy to understand
- 70–84 when the message is clear but still has some generic or incomplete areas
- 55–69 when the positioning is understandable but not yet sharp or distinctive
- 40–54 when the core message is materially vague or muddled
- Below 40 only when the layer is broadly broken

---

## 🧩 ISSUE ENRICHMENT

1. Total Issues:
- Generate only positioning and messaging issues
- Remove duplicates, overlaps, and low-signal items
- Keep the first impression issues from the previous step intact

2. Statement:
- Keep diagnostic only (WHAT + WHY)
- No fixes, no suggestions

3. Recommendations:
- Strategic direction (what should change)
- No vague advice

4. Fixes:
- Must be concrete and copy-paste ready
- Specific to the context (no generic templates)
- Prefer rewritten headlines, CTAs, or sentences when relevant

5. Priority:
- Positioning and messaging issues take precedence

6. Low-severity:
- Keep only if distinct and useful
- Use them to reach the layer-specific issue count if needed

---

## 🔗 CONSISTENCY

- Scores must stay aligned with the step 1 report for first impression
- Positioning and clarity scores belong to this step
- impactScore must justify penalty applied
- Score is a holistic judgment, not a simple sum of issue penalties
- No contradiction between scoring and issues
- Keep the score anchored to clarity and differentiation, not the raw number of findings
- A few severe issues should not automatically collapse a mostly understandable product into the 40s

---

## websiteSummary

- Keep unchanged
- Factual only (no diagnosis)

---

## ⚡ OUTPUT

{
  "scoring": {
    "positioning": 0,
    "clarity": 0
  },
  "issues": [...],
  "categoryInsights": {
    "positioning": { "summary": "...", "statement": "..." },
    "clarity": { "summary": "...", "statement": "..." }
  }
}

RETURN ONLY JSON
`;
