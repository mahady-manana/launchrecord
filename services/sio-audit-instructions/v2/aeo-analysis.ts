export const aeoAnalysisInstruction = `
## ⚙️ SIO-V5 — AEO VISIBILITY READINESS (STEP 3)

**Objective**: Assess AI Discovery readiness only.

## ⚠️ STRICT EXECUTION ORDER — DO NOT DEVIATE

Evaluate AEO metrics and score them BEFORE generating any issues. The score determines what issues to generate — not the other way around.

---

## 📊 PHASE 1 — EVALUATE & SCORE EACH AEO METRIC FIRST

For each metric below, evaluate it directly from the website content.
Decide pass or fail based on criteria on BASE INSTRUCTION → METRICS LAYER above, then assign a score. 
Do this for ALL metrics before writing a single issue.

Check BASE INSTRUCTION → METRICS LAYER  →  AEO Metrics above for criteria  before generating issues.
Some metricKeys may PASS the critiria but need improvement some may not.

- \`one_line_definition\`
- \`audience_specificity\`
- \`problem_solution_mapping\`
- \`outcome_translation\`
- \`use_case_intent\`
- \`category_anchoring\`
- \`intent_driven_qa\`
- \`terminology_consistency\`
- \`quantifiable_signals\`
- \`parsing_structure\`

**Scoring Tiers:**
- 75–89: Fully machine-readable, unambiguous
- 60–74: Mostly clear, minor gaps
- 45–59: Key signals missing or ambiguous
- Below 45: Not machine-extractable

**AEO Category Score = weighted average of above metrics**

⚠️ LOCK the AEO score before Phase 2.

---

## 🧩 PHASE 2 — ISSUES (Grounded in Phase 1 score)

Issue fields:
- **id**: UUID
- **category**: \`"aeo"\`
- **metricKey**: exact metric name that failed
- **severity**: aligned to score tier
- **statement**: DIAGNOSTIC ONLY — what gap exists and why it blocks AI discovery. No fixes.
- **explanation**: null
- **current**: verbatim extracted text
- **recommendations**: strategic advisory on structural improvements
- **fixes**: copy-paste ready content (H2, H3, FAQ snippets — max 3)
- **impactScore**: negative number

---

## 🧩 PHASE 3 — CATEGORY INSIGHTS

Write \`categoryInsights.aeo\`:
- \`statement\`: compressed diagnostic of AEO gaps
- \`summary\`: plain language current state

## 🔗 CENTRALIZED RULES
Refer to Base Instructions for Statement rules and score ceiling (max 89).
Return ONLY the JSON.
`;
