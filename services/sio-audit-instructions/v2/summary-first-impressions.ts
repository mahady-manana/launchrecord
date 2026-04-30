export const summaryFirstImpressionsInstruction = `
# SIO-v5 Audit Engine - Step 1: Summary & First Impressions

Perform the first step of the audit: Website Summarization, First Impressions Analysis, Scoring for First Impressions/Positioning/Clarity, Issues Generation for First Impressions, and Category Insights for First Impressions.

### Step-by-Step Process for This Step

1. **Summarization and Analysis**:
   Understand the website: what it does, who it is for, what problem it solves, what value it provides.
   Use only the provided HTML/raw website content. Do not infer audience, features, or outcomes that are not visible in the content.

2. **First Impressions Evaluation**:
   Evaluate first impressions based on hero section analysis: headline, subheadline, main CTA, 10-second test, user guessing, positioning clarity, messaging clarity.
   The hero must answer, clearly and quickly:
   - Who is this for?
   - What does it do?
   - What does the user get in return?
   This may be answered directly or indirectly, but it must not leave the user guessing.
   Do not accept vague category labels, generic SaaS terminology, or unknown terms that do not ground the product. This is a clarity requirement, not a demand for a perfect SaaS page structure.
   Use only evidence from the provided raw content for every judgment.

3. **Scoring** (For First Impressions, Positioning, Clarity):
   Score each metric on a 0-100 scale based on the evaluation:
   - First impressions score (primary focus)
   - Positioning score
   - Clarity score
   - Overall score as average of these three

4. **Issues Generation** (For First Impressions):
   Generate issues related to first impressions, headline, subheadline, CTA, and related metrics.

   **Priority Note**: Focus on headline, subheadline, and CTA as most critical for conversions. The most important audit question is whether the hero answers who it is for, what it does, and what users get in return. If it does not, flag it as a high-impact first impression issue.

   Generate at least 3-5 issues for first impressions with higher severity and impact scores.

   Use category: "first_impression".

   Use these metricKeys: "headline", "subheadline", "cta", "ten_second_test", "user_guessing", "positioning_clarity", "messaging_clarity".

   Each issue must include these props:
   - **id**: Unique identifier (e.g., UUID).
   - **category**: "first_impression".
   - **metricKey**: One of the above metricKeys.
   - **severity**: "low", "medium", "high". Use "high" for critical first impression issues.
   - **statement** (DIAGNOSTIC LAYER): Explain WHAT is happening, WHAT is weak or breaking, WHY it impacts conversions. STRICTLY FORBIDDEN: fixes, rewrites, instructions, strategy.
   - **explanation**: null (always null).
   - **current**: The current exact text or context (if applicable).
   - **recommendations** (EXECUTION LOGIC): Array of strings. Define WHAT must change, WHY it must change, HOW to approach the fix. Must be specific, actionable, grounded in evidence. Must NOT include copywriting or rewritten text.
   - **fixes** (COPY FIXES): Array of strings. Provide exact fixes (copy-paste ready), such as headline rewrites, CTA improvements. Must be concrete, high impact, max 1–3 items.
   - **impactScore**: Numerical score indicating impact (e.g., -10 to -50 for negative).

5. **Category Insights**:
   For first_impression:
   - **statement**: Diagnostic layer (WHAT, WHAT weak, WHY).
   - **summary**: Current state description.

## 🔗 CENTRALIZED RULES

Refer strictly to the Base Instructions for Statement formatting constraints (must be purely diagnostic) and to the Scoring & Recommendations prompt for final score bounds, severities, and the JSON Output Schema.

Return ONLY the JSON.`;
