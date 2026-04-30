export const positioningClarityInstruction = `
# SIO-v5 Audit Engine - Step 2: Positioning & Clarity

## ⚠️ STRICT EXECUTION ORDER — DO NOT DEVIATE

You MUST score each metric before generating any issues. Scoring is not derived from issues. Issues are derived from scores.

---

## 📊 PHASE 1 — SCORE EACH METRIC FIRST

For each metric below, evaluate it directly from the website content.
Decide pass or fail based on criteria on BASE INSTRUCTION → METRICS LAYER above, then assign a score. 
Do this for ALL metrics before writing a single issue.

**Positioning Metrics (score each 0–89)**

Check BASE INSTRUCTION → METRICS LAYER  → Positioning Metrics above for criteria  before generating issues.
Some metricKeys may PASS the critiria but need improvement some may not.

- \`category_ownership\`
- \`unique_value_proposition\`
- \`competitive_differentiation\`
- \`target_audience\`
- \`problem_solution_fit\`
- \`messaging_consistency\`


**Clarity Metrics (score each 0–89)**

Check BASE INSTRUCTION → METRICS LAYER  → Positioning Metrics above for criteria  before generating issues.
Some metricKeys may PASS the critiria but need improvement some may not.

- \`headline_clarity\`
- \`value_proposition\`
- \`feature_benefit_mapping\`
- \`visual_hierarchy\`
- \`cta_clarity\`
- \`proof_placement\`
- \`unclear_sentences\`

**Scoring Tiers (use per-metric)**
- 75–89: Excellent, zero friction on this dimension
- 60–74: Good, minor gaps that don't break understanding
- 45–59: Weak, user must work to understand this
- Below 45: Broken, actively misleads or confuses

**Category Score = weighted average of sub-metric scores**

⚠️ LOCK category scores for \`positioning\` and \`clarity\` before Phase 2.

---

## 🧩 PHASE 2 — GENERATE ISSUES (Grounded in Phase 1 scores)

Now generate issues for categories \`"positioning"\` and \`"clarity"\` only.
Do NOT generate issues to hit a quota. Stop when real blockers are exhausted.

Issue fields:
- **id**: UUID
- **category**: \`"positioning"\` or \`"clarity"\`
- **metricKey**: exact metric name that failed
- **severity**: must align to score tier (low for 75+, medium for 60-74, high/critical below 60)
- **statement**: DIAGNOSTIC ONLY — what is broken and why it matters. No fixes.
- **explanation**: null
- **current**: verbatim extracted text from the website
- **recommendations**: strategic HOW-TO guidance
- **fixes**: copy-paste ready rewrites (max 3)
- **impactScore**: negative number

---

## 🧩 PHASE 3 — CATEGORY INSIGHTS

Write \`categoryInsights\` for \`positioning\` and \`clarity\`:
- \`statement\`: compressed diagnostic from the issues
- \`summary\`: current state plain language summary

## 🔗 CENTRALIZED RULES
Refer to Base Instructions for Statement rules and score ceiling (max 89).
Return ONLY the JSON.
`;
