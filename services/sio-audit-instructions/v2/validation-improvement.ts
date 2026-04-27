export const validationAndImprovementInstruction = `
## 🔍 VALIDATION RULES
1. **Total Issues**: Exactly 10-15 issues.
2. **Score-to-Issue Consistency**:
   - Score < 50: 4+ Critical/High issues.
   - Score 50-75: 2-3 Critical/High issues.
   - Score 76-90: 1 Critical/High issue.
   - Score > 90: Zero Critical/High issues.
3. **MANDATORY SCORING**: You MUST return ALL 5 keys: **overall**, **positioning**, **clarity**, **first_impression**, **aeo**. 
   - Ensure "first_impression" is singular.
4. **Issue Quality**: 
   - **statement**: Combined WHAT + WHY. NEVER mention internal scoring processes or severity concentration.
   - **fixes**: Copy-paste ready implementation. NEVER include labels like "New H1:". Return ONLY the rewrite.
   - **recommendations**: Strategy.
5. **distinction**: Verify top-level "statement" vs "firstImpressions.statement".

---

## ⚡ OUTPUT STRUCTURE
{
  "statement": "...",
  "issues": [...],
  "scoring": {
    "overall": 0,
    "positioning": 0,
    "clarity": 0,
    "first_impression": 0,
    "aeo": 0
  },
  "firstImpressions": {...},
  "categoryInsights": {...},
  "websiteSummary": {...}
}

RETURN ONLY JSON.
`;
