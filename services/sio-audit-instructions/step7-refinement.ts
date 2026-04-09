/**
 * Step 7: Refinement & Quality Assurance - Specific Instructions
 *
 * Use with: base-instructions.ts
 * Reviews: Complete report for consistency, accuracy, and completeness
 * Context: Receives all previous analysis (summary, first impression, positioning, clarity, AEO)
 * Returns: Complete refined report in SIO-V5 JSON schema format
 */

export const step7RefinementInstructions = `
## CONTEXT: COMPLETE AUDIT REPORT

Your task is to analyze a startup's website and generate brutally honest, specific, actionable reports.

You are performing quality assurance on a complete SIO-V5 audit report.

**Complete Report:**
{COMPLETE_REPORT_CONTEXT}

---

## YOUR SPECIFIC TASK: Quality Assurance & Refinement

Review the report across these dimensions and return the **COMPLETE refined report**:

### 1. Consistency Check

- **Score alignment**: Do scores across sections logically align with the overall score?
- **Contradictions**: Are there contradictions between sections?
  - Example: Positioning says "clear category" but Clarity says "confused messaging"
- **Comment-score match**: Do comments match the scores given?
  - Example: Great comments but suspiciously low score

### 2. Completeness Check

- **Required fields**: Are all required fields populated?
- **Empty arrays**: Are there empty arrays that should have content?
  - Every section should have at least 1 positive and 1 negative comment
- **Unclear sentences**: Do all unclear sentences have issues and fixes?
- **Suggested rewrites**: Does every section have 2-3 suggestions?

### 3. Quality Refinement

- **Rewrite readiness**: Are suggested rewrites actually copy-paste ready?
- **Specificity**: Are comments specific and actionable (not vague)?
  - ❌ BAD: "Improve headline"
  - ✅ GOOD: "Change 'AI Platform' to 'We help startups 10x their audit speed'"
- **Examples**: Do examples demonstrate the solution clearly?

### 4. Scoring Validation

- **Score justification**: Are scores justified by the comments? A score of 70+ should have strong no issues in positioning and clarity, while a score of 40 should have significant issues.
- **Obvious mismatches**: Are there great comments but low scores (or vice versa)?
- **Weighting accuracy**: Does the overall score properly reflect section weights?

### 5. Score rules

#### 70-100 Scoring Guidelines:
- ICP is clear and specific (not broad or vague)
- Positioning is unique and differentiated (not generic)
- Messaging is clear and consistent (not confusing)
- No major issues in any section
- Strong positives across sections

#### 40-69 Scoring Guidelines:
- ICP may be somewhat vague or broad
- Positioning may have some generic elements
- Messaging may have some inconsistencies or unclear areas
- Some issues present but not critical
- Mixed positives and negatives

#### 0-39 Scoring Guidelines:
- ICP is very vague or missing
- Positioning is generic or non-existent
- Messaging is confusing or contradictory
- Major issues present in multiple sections
- Predominantly negative comments with few positives

Only a almost perfect report with no issues should score above 80. A report with any significant issues should score below 70.

---

## RETURN FORMAT

Return the **COMPLETE SIO-V5 report** following the JSON schema provided.

- Include ALL sections: websiteSummary, firstImpression, positioning, clarity, aeo
- Include ALL metadata: overallScore, statement, overallCommentPositive, overallCommentNegative
- Maintain existing data and only change what needs improvement
- Do NOT omit any sections - return the complete report

---

## REFINEMENT GUIDELINES

### When to Adjust Scores:
- Only adjust if there's a clear mismatch between comments and score
- Maximum adjustment: ±5 points
- Ensure scores align with scoring guidelines

### When to Refine Statements:
- If statement is vague or generic
- If statement doesn't reflect the actual findings
- If statement could be more specific and actionable

### When to Refine Sections:
- If comments are vague or not actionable
- If suggested rewrites aren't actually copy-paste ready
- If there are missing comments that should exist
- If scores don't match the analysis quality

---

## IMPORTANT

- Return the **COMPLETE report** in SIO-V5 JSON schema format
- Do NOT wrap in a refinements object
- Do NOT omit any sections
- Maintain all existing data unless improving it
- Be conservative - only change things that are genuinely wrong or could be significantly better
- Maintain the brutal honesty and specificity of the original report
- Do NOT soften the critique - maintain the same honest tone

ANY ERROR, INCONSISTENCY, NO ICP, VAGUENESS OR NEED OPTIMIZATION WILL RESULT IN A LOW SCORE.

`;
