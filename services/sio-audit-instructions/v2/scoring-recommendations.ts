export const scoringAndFixesInstruction = `
## ⚙️ SIO-V5 — POSITIONING & MESSAGING (STEP 2)

Objective:
Analyze positioning and messaging only.
Use the previous step report as the base state.
Do not change first impression findings except to preserve consistency.
Check the positioning and clarity checklist one metric at a time.
Do not force a universal SaaS template. Judge the page by how clearly its category, audience, and value are communicated in context, even if some of that is only implied.

---

## 📊 SCORING (MANDATORY)

1. Score only positioning and clarity here.
2. Do not recalculate first impression score.
3. Do not treat issue count or issue severity as a direct score formula.
4. Two critical issues can still coexist with a reasonably strong layer score if the rest of the message is coherent.
5. Use this calibration:
- 85–100 when the product is clearly positioned, differentiated, and easy to understand
- 70–84 when the message is clear but still has some generic or incomplete areas
- 60–69 when the positioning is understandable but not yet sharp or distinctive
- 45–59 when the core message is materially vague or muddled
- Below 45 only when the layer is broadly broken

---

## 🧩 ISSUE ENRICHMENT

1. Total Issues:
- Generate 6–8 positioning and messaging issues
- Remove duplicates, overlaps, and low-signal items
- Keep the first impression issues from the previous step intact
- If the layer is short, add distinct low-severity positioning/messaging issues to reach the minimum
- Only use these metrics:
  - category_ownership
  - unique_value_proposition
  - competitive_differentiation
  - target_audience
  - problem_solution_fit
  - messaging_consistency
  - headline_clarity
  - value_proposition
  - feature_benefit_mapping
  - visual_hierarchy
  - cta_clarity
  - proof_placement
  - unclear_sentences
- Each issue must map to one metric key from this checklist
- Review the metrics one by one and surface only the issues that actually exist
- If a metric is clearly implied by the page, do not mark it broken just because it is not spelled out in a generic SaaS way

2. Statement:
- Keep diagnostic only (WHAT + WHY)
- Keep it short, direct, and specific
- Use short sentences instead of long explanations
- No fixes, no suggestions

3. Explanation:
- Keep explanation to 1 short sentence
- Stay factual and specific
- Do not restate the statement
- Do not expand into a paragraph
4. Recommendations:
- Strategic direction (what should change)
- No vague advice

5. Fixes:
- Must be concrete and copy-paste ready
- Specific to the context (no generic templates)
- Prefer rewritten headlines, CTAs, or sentences when relevant

6. Priority:
- Positioning and messaging issues take precedence
- Positioning metrics answer what it is, who it is for, why it matters, and why it wins
- Clarity metrics answer how clearly the value is communicated and understood

7. Low-severity:
- Keep only if distinct and useful
- Use them to reach the layer-specific issue count if needed
- Low-severity issues are acceptable here only when they are concrete and distinct

---

## 🔗 CONSISTENCY

- Scores must stay aligned with the step 1 report for first impression
- Positioning and clarity scores belong to this step
- impactScore must justify penalty applied
- Score is a holistic judgment, not a simple sum of issue penalties
- No contradiction between scoring and issues
- Keep the score anchored to clarity and differentiation, not the raw number of findings
- A few severe issues should not automatically collapse a mostly understandable product into the 40s
- Strong product stories with some weaknesses should still land in the 60s or low 70s

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
