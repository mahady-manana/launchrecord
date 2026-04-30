export const scoringAndFixesInstruction = `
## ⚙️ SIO-V5 — SCORING & RECOMMENDATIONS

Objective:
Analyze positioning and messaging using explicit metrics. 
All scoring is semi-deterministic and mapped closely to actual issue severities and counts identified in the previous steps.

---

## 📊 SCORING (SEMI-DETERMINISTIC BANDS)

Base your scores strictly on the organic quality of the website, penalized by the real issues you identify. Do not use rigid mathematical subtraction formulas—instead, evaluate holistically against these explicit bounds.

**CRITICAL SCORE CEILING:**
Maximum score is 89. *No website achieves a 90 or above.*

**Score Mapping Tiers:**
- **80-89 (Exceptional):** Website has strong, precise, clear positioning and first impressions. Zero critical blockers. Only 2-4 minor refinement issues max.
- **70-79 (Solid but Flawed):** Clear core messaging but exhibits 3-5 moderate issues (e.g., generic subheadline, minor positioning gaps).
- **60-69 (Weak / Moderate Problems):** Real friction exists. Fails multiple clarity or positioning metrics. 5-8 significant issues.
- **45-59 (Conversion Blocked):** Major foundational problems. Confusing messaging, missing audience, weak positioning. 8+ issues.
- **Below 45 (Broken):** Does not pass basic understanding thresholds.

**Weighting Guidance (Approximate impact on overall score):**
- Positioning: ~35%
- Clarity: ~30%
- First Impression: ~25%
- AEO: ~10%

---

## 🧩 ISSUE GENERATION

### Issue Count and Severity
**Total Issue Quota:** Organic. Generate ONLY what is real.
- If the score is 85, you should generate roughly 2-4 minor issues.
- If the score is 60, you should generate roughly 5-8 moderate/high issues.
- Do NOT pad the issues list to reach 12-15 if the blockers do not exist.

### Issue Generation Process
1. For EACH failed criteria evaluated, confirm it organically impacts conversion (per the Judgment Layer).
2. For validated blockers, generate ONE issue object with all required fields.
3. Provide concrete recommendations and execution-ready copy fixes.

**Always:**
- Map each issue to the specific metric broken.
- Customize your fixes with actual website context.
- Keep statements fully diagnostic (as directed in Base Instructions).

---

## 🎯 FINAL ALIGNMENT CHECK

Before returning the report, verify:
- [ ] No category or overall score exceeds 89.
- [ ] Scores above 80 are only given to websites with exceptional clarity and positioning.
- [ ] Issue count directly aligns with the score band (e.g., high scores = very few issues).
- [ ] All statements are strictly diagnostic (no "should/must/needs to").

---

## ⚡ OUTPUT SCHEMA 

You must process ALL of the following metrics and return their evaluation in the \`metrics\` object:
- headline, subheadline, cta, category_ownership, unique_value_proposition, competitive_differentiation, target_audience, problem_solution_fit, messaging_consistency, headline_clarity, value_proposition, feature_benefit_mapping, visual_hierarchy, cta_clarity, proof_placement, unclear_sentences, one_line_definition, audience_specificity, problem_solution_mapping, outcome_translation, use_case_intent, category_anchoring, intent_driven_qa, terminology_consistency, quantifiable_signals, parsing_structure

\`\`\`json
{
  "metrics": {
    "headline": {
      "check": false,
      "statement": "Diagnostic statement here"
    },
    "subheadline": {
      "check": true,
      "statement": "Passes clarity test."
    }
    // ... Process ALL listed metrics without using an enum array (dynamic object keys)
  },
  "overallScore": 0,
  "statement": "",
  "scoring": {
    "overall": 0,
    "positioning": 0,
    "clarity": 0,
    "first_impression": 0,
    "aeo": 0
  },
  "issues": [
    {
      "id": "uuid-here",
      "category": "positioning",
      "metricKey": "unique_value_proposition",
      "severity": "critical",
      "statement": "No explicit differentiation from alternatives; relies on generic SaaS language.",
      "explanation": null,
      "current": "Tagline on page: 'The platform for modern teams'",
      "recommendations": [
        "State specific advantage that distinguishes from competitors."
      ],
      "fixes": [
        "Instead of 'The platform for modern teams', use: 'Close deals 30% faster by eliminating manual data entry'"
      ],
      "impactScore": -40
    }
  ],
  "categoryInsights": {
    "first_impression": { "statement": "...", "summary": "..." },
    "positioning": { "statement": "...", "summary": "..." },
    "clarity": { "statement": "...", "summary": "..." },
    "aeo": { "statement": "...", "summary": "..." }
  }
}
\`\`\`

RETURN ONLY JSON.
`;
