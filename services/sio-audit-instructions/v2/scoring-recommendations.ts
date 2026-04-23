export const scoringAndFixesInstruction = `
## ⚙️ SIO-V6 — SCORING & FIX GENERATION (STEP 2)

**Primary Objective**: Enrich the **Reported Issues** with SCORING and detailed FIXES.
Refer to **General Instructions** for core metric definitions, penalty rules, and **Quality & Impact Principles**.

---

## 💎 HIGH-IMPACT FIXES (CRITICAL)
- **A-Player Recommendations**: Recommendations MUST be tactical and professional. Avoid fluff. 
- **High-Level Fixes**: Fixes MUST be "highest possible level." Don't just suggest a word change; suggest a narrative restructure if necessary.
- **Conversion-Led**: Every fix should be designed to move the needle on actual user behavior and AI extraction confidence.

---

## 🧠 INPUT CONTRACT (REPORTED FROM PREVIOUS STEP)
You will receive the structured data generated in **Step 1 (Analyze & Issue Generation)**. 
This is your **Source of Truth**. You MUST process each issue reported to define its severity impact and practical resolution.

Input structure:
{
  "issues": [...],
  "firstImpressions": {...},
  "categoryInsights": {...},
  "websiteSummary": {...}
}

You MUST NOT remove issues. You MUST maintain original issue IDs. You MUST NOT create new issues EXCEPT to fill missing submetric coverage (see COVERAGE CHECK below).

---

## 📊 SCORING LOGIC (DERIVED FROM REPORTED ISSUES)
Scores must be derived ONLY from the issues received:
- **Base Score**: 100
- **Penalty per Critical**: -5 to -15
- **Penalty per High**: -3 to -10
- **Penalty per Medium**: -2 to -6
- **Penalty per Low**: -1 to -2

Overall score MUST stay between 0–100. Follow weighted category distribution.

---

## 🧩 ISSUE ENRICHMENT
Update each issue reported in Step 1 with:
- **recommendations**: Tactical WHAT must change. MUST be high-level and impactful.
- **fixes**: Implementation-level examples. MUST be copy-paste ready and of the highest quality.
- **impactScore**: Relative importance (-1 to -25) based on the "Quality & Impact Principles".

---

## ⚠️ SCORE-TO-ISSUE CONSISTENCY (MANDATORY)
After computing scores, validate the following:
- **If positioning score < 60** → There MUST be at least 1 CRITICAL severity issue with category "positioning". If none exists, you MUST upgrade the highest-severity positioning issue to CRITICAL.
- **If clarity score < 60** → There MUST be at least 1 CRITICAL severity issue with category "clarity". Same upgrade rule applies.
- **If first_impression score < 60** → There MUST be at least 1 CRITICAL severity issue with category "first_impression". Same upgrade rule applies.

### COVERAGE CHECK
Verify that every submetric defined in **General Instructions** has at least one issue. If Step 1 missed any, you MUST create a LOW issue for the missing submetric.

---

## ⚡ OUTPUT STRUCTURE
You MUST return the enriched data:
{
  "scoring": {
    "overall": number,
    "positioning": number,
    "clarity": number,
    "first_impression": number,
    "aeo": number
  },
  "issues": [...]
}

RETURN ONLY JSON.
`;
