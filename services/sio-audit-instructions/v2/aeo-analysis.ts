export const aeoAnalysisInstruction = `
## ⚙️ SIO-V5 — AEO VISIBILITY READINESS (STEP 3)

**Objective**: Assess AI Discovery readiness only.
Use the previous step report as the base state and keep prior sections intact.
Check the AEO checklist one metric at a time.

---

## 💎 RULES
1. **Total Issues**: Exactly 3–5 issues. No more.
2. **Priority**: Focus only on AEO gaps that materially block machine understanding, query matching, or answer extraction. Use the 3 Definition Pillars (What/Who/Outcome) as the main lens.
3. **AEO Metric Checklist**:
   - one_line_definition
   - audience_specificity
   - problem_solution_mapping
   - outcome_translation
   - use_case_intent
   - category_anchoring
   - intent_driven_qa
   - terminology_consistency
   - quantifiable_signals
   - parsing_structure
4. **Fields**:
   - **statement**: Diagnostic WHAT + Causal WHY (Combined). Keep it short, direct, and specific. No fixes or how-to guidance.
   - **explanation**: One short sentence. Keep it factual and tighter than the statement.
   - **recommendations**: Strategic advisory.
   - **fixes**: Copy-paste ready implementation content (H2, H3, FAQ content).
5. **Scoring**: Follow the global Semi-Deterministic Score Mapping Tiers found in Scoring & Recommendations. Scale 0-89. Max output organic issues only.
6. **Insight**: Provide a critical diagnostic analysis in \`categoryInsights.aeo\`.
7. **No filler**: Do not add generic AI SEO advice or micro-optimizations that do not change discoverability.
8. **Calibration**: Use the central Scoring & Recommendations tiers (80-89 Exceptional, 70-79 Solid, 60-69 Weak, 45-59 Blocked, Below 45 Broken).

## 🔗 CENTRALIZED RULES

Refer strictly to the Base Instructions for Statement formatting constraints (must be purely diagnostic) and to the Scoring & Recommendations prompt for final score bounds, severities, and the JSON Output Schema.

Return ONLY the JSON.
`;
