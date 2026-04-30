export const validationInstruction = `
# SIO-v5 Audit Engine - Step 4: Final Validation & Refinement
## ⚠️ ENSURE SEMI-DETERMINISTIC COMPLIANCE

Perform final validation and refinement of the entire audit report.
**This validation ensures the scores map organically to real blocker volume without arbitrary mathematical score penalization.**

### Step-by-Step Process for This Step

1. **Score Bound Validation**:
   - Verify NO score exceeds 89. Any score $\geq$ 90 MUST be lowered to 89 max.
   - Any score between 80-89 means the website is robust; confirm only minor friction exists.
   - Scores 60-79 signify moderate room for improvement.
   - Scores < 60 signify foundational blockers.

2. **Organic Issue Verification**:
   Verify issues generated reflect the score.
   - Scores 80-89 -> 2-4 minor issues max.
   - Scores 60-79 -> 5-8 moderate issues max.
   - Under 60 -> 8+ critical/high issues.
   - Do NOT invent issues if the score is high just to hit an arbitrary quota.

3. **Issue Mapping Validation**:
   For EACH issue in the report:
   - [ ] Issue inherently impacts conversion on a holistic view.
   - [ ] Issue statement is strictly diagnostic (no prescriptive language).

4. **Statement Refinement (Diagnostic Only)**:
   Review ALL statements in the report:
   - Ensure the overarching "Statement Rule" (from Base Instructions) is maintained.
   - Replace any instances of "should", "must", "need to", "improve", "fix" with strictly factual diagnoses ("is missing", "contains", "fails clarity").

5. **Fix Quality Validation**:
   Verify all fixes are concrete, actionable, and copy-paste ready implementations customized to the provided webpage content.

## 🔗 CENTRALIZED RULES

Refer strictly to the Base Instructions for Statement formatting constraints (must be purely diagnostic) and to the Scoring & Recommendations prompt for final score bounds, severities, and the JSON Output Schema.

Return ONLY the JSON.`;
