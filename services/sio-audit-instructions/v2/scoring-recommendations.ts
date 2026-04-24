export const scoringAndFixesInstruction = `
## ⚙️ SIO-V6 — SCORING & FIX GENERATION (STEP 2)

**Objective**: Dynamic SCORING and Fixes. Total issues: 10-15.

---

## 📊 SCORING MATHEMATICS (MANDATORY)
1. **Base Score**: 100.
2. **Penalties**: 
   - Critical: -15 to -20
   - High: -8 to -14
   - Medium: -4 to -7
   - Low: -1 to -3
3. **MANDATORY FIELDS**: You MUST return ALL 5 keys: **overall**, **positioning**, **clarity**, **first_impression**, **aeo**. 
   - Never skip a field. 
   - Use singular "first_impression" (NO plural 's').
4. **Consistency**:
   - Score < 50: 4+ Critical/High issues.
   - Score 50-75: 2-3 Critical/High issues.
   - Score 76-90: 1 Critical/High issue.
   - Score > 90: Only Medium/Low issues.

---

## 🧩 ISSUE ENRICHMENT
1. **Total Issues**: 10-15 issues. Trim if necessary.
2. **Fields**: statement (WHAT+WHY), recommendations (strategy), fixes (copy-paste), impactScore.

---

## ⚡ OUTPUT STRUCTURE
{
  "scoring": {
    "overall": 0,
    "positioning": 0,
    "clarity": 0,
    "first_impression": 0,
    "aeo": 0
  },
  "issues": [...]
}

RETURN ONLY JSON.
`;
