export const positioningClarityInstruction = `
# SIO-v5 Audit Engine - Step 2: Positioning & Clarity (RULES-BASED)
## ⚠️ USE DETERMINISTIC RULES ONLY - NO MODEL JUDGMENT

This step evaluates Positioning and Clarity metrics using EXPLICIT RULES from \`deterministic-rules.ts\`.

**DO NOT use subjective judgment. DO NOT estimate. ONLY apply the rules.**

### Step-by-Step Process for This Step

1. **Positioning & Clarity Evaluation (RULE-BASED)**:

   For each metric below, follow this process:
   1. Extract relevant content from website
   2. Check all PASS criteria: "Is this true?"
   3. Check all FAIL criteria: "Is this true?"
   4. Count fail criteria met
   5. Calculate score: 100 - (failCount × penalty from rule)
   6. Generate ONE issue per fail criterion met

   **Positioning Metrics** (Use rules from deterministic-rules.ts):
   - category_ownership (Rule: categoryOwnershipRule)
   - unique_value_proposition (Rule: uniqueValuePropositionRule)
   - competitive_differentiation (Rule: competitiveDifferentiationRule)
   - target_audience (Rule: targetAudienceRule)
   - problem_solution_fit (Rule: problemSolutionFitRule)
   - messaging_consistency (Rule: messagingConsistencyRule)

   **Clarity Metrics** (Use rules from deterministic-rules.ts):
   - headline_clarity (Rule: headlineClarityRule)
   - value_proposition (Rule: valuePropositionClarityRule)
   - feature_benefit_mapping (Rule: featureBenefitMappingRule)
   - visual_hierarchy (Rule: visualHierarchyRule)
   - cta_clarity (Rule: ctaClarityRule)
   - proof_placement (Rule: proofPlacementRule)

2. **Scoring Updates (SEMI-DETERMINISTIC)**:
   - Do NOT calculate arbitrary equations (e.g., 100 - (failCount * penalty)). Instead, evaluate the overall density and severity of the issues found.
   - Use the centralized **Score Mapping Tiers** (defined in the Scoring & Recommendations prompt) to arrive at the scores. Max score is 89.

3. **Issues Generation**:
   - Determine the subset of failed metrics that actually block conversion (use Judgment Layer).
   - Do NOT pad the issues quota arbitrarily. Use the organic constraints governed in the General Instructions.

4. **Category Insights Updates**:
   - \`positioning.statement\`: Diagnostic summary of positioning issues only.
   - \`clarity.statement\`: Diagnostic summary of clarity issues only.

## 🔗 CENTRALIZED RULES

Refer strictly to the Base Instructions for Statement formatting constraints (must be purely diagnostic) and to the Scoring & Recommendations prompt for final score bounds, severities, and the JSON Output Schema.

Return ONLY the JSON.
`;
