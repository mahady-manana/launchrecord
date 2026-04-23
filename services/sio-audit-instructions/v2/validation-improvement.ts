export const validationAndImprovementInstruction = `
## ⚙️ SIO-V6 — VALIDATION & IMPROVEMENT (STEP 3)

**Primary Objective**: Validate consistency and quality across the COMPLETE accumulated state.
Refer to **General Instructions** for core principles and **Quality & Impact Principles**.

---

## 🔍 VALIDATION LOGIC (CRITICAL)
- **Step 1 Validation**: Do boolean flags in First Impressions match the critical issues?
- **Step 2 Validation**: Does scoring correctly reflect the issue severity distribution?
- **Quality Validation**: Are the recommendations and fixes at the "highest possible level"? If they are generic or low-value, you MUST rewrite them.
- **Tone Validation**: Ensure statements are diagnostic and free of generic advice.
- **websiteSummary Validation**: Verify that websiteSummary.problems lists real-world USER PAINS the product solves (NOT audit findings). Verify that websiteSummary.solutions lists the PRODUCT's capabilities (NOT audit recommendations). If these are wrong, you MUST fix them.
- **categoryInsights Validation**: 
  - **summary**: MUST be a factual, neutral description of the CURRENT landing page state or strategy (what they have today). NO analysis, NO diagnostics, NO interpretation.
  - **statement**: MUST be the critical diagnostic analysis and technical assessment of that category. NO fixes, NO suggestions, NO 'how to' advice.
  - If these fields are mixed or contain incorrect content, you MUST rewrite them to comply.

---

## ⚠️ MANDATORY COVERAGE VALIDATION
1. **Submetric Coverage**: Every submetric defined in **General Instructions** MUST have at least one issue (LOW or higher). If any is missing, CREATE a LOW issue for it.
2. **Score-Critical Consistency**: If any category score (positioning, clarity, first_impression) is below 60, there MUST be at least 1 CRITICAL issue in that category. If missing, upgrade the highest-severity issue in that category to CRITICAL.

---

## 🛠 IMPROVEMENT RULES
- **Quality Upgrade**: Actively hunt for generic advice and replace it with high-impact, strategic recommendations.
- **Refinement**: Improve wording precision for issues and category insights.
- **Scoring Adjustment**: You MAY adjust scores (±5 max) to ensure logical distribution.
- **Consistency**: Resolve any contradictions between issues and summaries.

---

## ⚡ OUTPUT STRUCTURE
You MUST return the FINAL validated structure:
{
  "statement": "Overall product audit verdict (2-3 sentences) — must be distinct from firstImpressions.statement which covers ONLY the first 10 seconds.",
  "issues": [...],
  "scoring": {...},
  "firstImpressions": {...},
  "categoryInsights": {...},
  "websiteSummary": {...}
}

RETURN ONLY JSON. No commentary.
`;
