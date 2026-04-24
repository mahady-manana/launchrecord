export const aeoAnalysisInstruction = `
## ⚙️ SIO-V6 — AEO VISIBILITY READINESS (STEP 4)

**Objective**: Assess AI Discovery readiness and create 3–5 high-impact AEO issues.

---

## 💎 RULES
1. **Total Issues**: Exactly 3–5 issues. No more.
2. **Priority**: Focus on the 3 Definition Pillars (What/Who/Outcome).
3. **Fields**:
   - **statement**: Diagnostic WHAT + Causal WHY (Combined).
   - **recommendations**: Strategic advisory.
   - **fixes**: Copy-paste ready implementation content (H2, H3, FAQ content).
4. **Insight**: Provide a critical diagnostic analysis in categoryInsights.aeo.

---

## ⚡ OUTPUT STRUCTURE
{
  "issues": [
    {
      "category": "aeo",
      "metricKey": "...",
      "severity": "...",
      "statement": "...",
      "current": "...",
      "recommendations": ["..."],
      "fixes": ["..."]
    }
  ],
  "categoryInsights": {
    "aeo": { "summary": "Current state", "statement": "Diagnostic" }
  }
}

RETURN ONLY JSON.
`;
