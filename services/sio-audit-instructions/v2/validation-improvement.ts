export const validationAndImprovementInstruction = `
## ⚙️ SIO-V6 — VALIDATION & IMPROVEMENT (STEP 3)

**Primary Objective**: Validate consistency and quality across the COMPLETE accumulated state.
Refer to **General Instructions** for core principles.

---

## 🧠 INPUT CONTRACT (COMPLETE STATE)
You will receive the complete output from **Step 2 (Scoring & Fixes)**:
{
  "issues": [...],
  "scoring": {...},
  "firstImpressions": {...},
  "categoryInsights": {...},
  "websiteSummary": {...}
}

---

## 🔍 VALIDATION LOGIC (CRITICAL)
- **Step 1 Validation**: Do boolean flags in First Impressions match the critical issues?
- **Step 2 Validation**: Does scoring correctly reflect the issue severity distribution?
- **Tone Validation**: Ensure statements are diagnostic and free of generic advice.

---

## 🛠 IMPROVEMENT RULES
- **Refinement**: Improve wording precision for issues and category insights.
- **Scoring Adjustment**: You MAY adjust scores (±5 max) to ensure logical distribution.
- **Consistency**: Resolve any contradictions between issues and summaries.

---

## ⚡ OUTPUT STRUCTURE
You MUST return the FINAL validated structure:
{
  "issues": [...],
  "scoring": {...},
  "firstImpressions": {...},
  "categoryInsights": {...},
  "websiteSummary": {...}
}

RETURN ONLY JSON. No commentary.
`;
