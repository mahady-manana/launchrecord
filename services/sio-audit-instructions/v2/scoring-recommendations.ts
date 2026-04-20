export const scoringAndFixesInstruction = `
## ⚙️ SIO-V6 — SCORING & FIX GENERATION (STEP 2)

**Primary Objective**: Enrich the **Reported Issues** with SCORING and detailed FIXES.
Refer to **General Instructions** for core metric definitions and penalty rules.

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

You MUST NOT create new issues. You MUST NOT remove issues. You MUST maintain original issue IDs.

---

## 📊 SCORING LOGIC (DERIVED FROM REPORTED ISSUES)
Scores must be derived ONLY from the issues received:
- **Base Score**: 100
- **Penalty per Critical**: -8 to -15
- **Penalty per High**: -5 to -10
- **Penalty per Medium**: -3 to -6
- **Penalty per Low**: -1 to -2

Overall score MUST stay between 0–100. Follow weighted category distribution.

---

## 🧩 ISSUE ENRICHMENT
Update each issue reported in Step 1 with:
- **recommendations**: Tactical WHAT must change.
- **fixes**: Implementation-level examples.
- **impactScore**: Relative importance (-1 to -25).

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
