export const aeoAnalysisInstruction = `
## ⚙️ SIO-V5 — AEO VISIBILITY READINESS (STEP 3)

**Objective**: Assess AI Discovery readiness only.
Use the previous step report as the base state and keep prior sections intact.

---

## 💎 RULES
1. **Total Issues**: Exactly 3–5 issues. No more.
2. **Priority**: Focus only on AEO gaps that materially block machine understanding, query matching, or answer extraction. Use the 3 Definition Pillars (What/Who/Outcome) as the main lens.
3. **Fields**:
   - **statement**: Diagnostic WHAT + Causal WHY (Combined). No fixes or how-to guidance.
   - **recommendations**: Strategic advisory.
   - **fixes**: Copy-paste ready implementation content (H2, H3, FAQ content).
4. **Scoring**: Only score the AEO layer here.
5. **Insight**: Provide a critical diagnostic analysis in categoryInsights.aeo.
6. **No filler**: Do not add generic AI SEO advice or micro-optimizations that do not change discoverability.
7. **Calibration**:
   - 85–100 when the page is structurally understandable to machines and uses clear, consistent terminology
   - 70–84 when the page is reasonably parseable but still missing some structured cues
   - 55–69 when AEO is partially present but inconsistent or incomplete
   - 40–54 when machine understanding is materially hindered
   - Below 40 only when the page is broadly opaque to parsers and answer engines

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
  "scoring": {
    "aeo": 0
  },
  "categoryInsights": {
    "aeo": { "summary": "Current state", "statement": "Diagnostic" }
  }
}

RETURN ONLY JSON.
`;
