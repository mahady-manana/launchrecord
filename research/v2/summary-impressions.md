# SIO-v5 Audit Engine - First Step: Summary, Impressions, Scoring, Issues, and Category Insights

Perform the first step of the audit: Summarization and Analysis, Metric Evaluation for First Impressions, Positioning, and Clarity, Scoring for those metrics, Issues Generation for related metrics, and Category Insights.

### Step-by-Step Process for This Step

1. **Summarization and Analysis**:
   Understand the website: what it does, who it is for, what problem it solves, what value it provides.

2. **Metric Evaluation** (Focus on First Impressions, Positioning, Clarity):
   Evaluate the key metrics as outlined in the general instructions, focusing on First Impressions, Positioning, and Clarity.

3. **Scoring** (For First Impressions, Clarity, Positioning):
   Score each relevant metric on a 0-100 scale based on the evaluation:
   - Positioning score
   - Clarity score
   - First impressions score

4. **Issues Generation** (For First Impressions, Positioning, Clarity):
   For each relevant metric, generate issues related directly to conversion optimization, messaging clarity, positioning, or AEO visibility.

   **Priority Note**: When creating issues, ensure headline, subheadline, and cta are considered first, as they are the most critical for conversions. Start by generating issues for these key metrics before others. Assign higher severity ("high") and impact scores (e.g., -20 to -50) to these. Ensure at least 3-5 issues focus on first impressions.

   Each issue must include these props:
   - **id**: Unique identifier (e.g., UUID).
   - **category**: One of the above categories.
   - **metricKey**: One of the above metricKeys.
   - **severity**: "low", "medium", "high". Use "high" for critical first impression issues like headline, subheadline, cta.
   - **statement** (DIAGNOSTIC LAYER): Explain WHAT is happening, WHAT is weak or breaking, WHY it impacts clarity or conversion. STRICTLY FORBIDDEN: fixes, rewrites, instructions, strategy. This is the WHY layer (tension creation).
   - **explanation**: null (always null).
   - **current**: The current exact text or context (if applicable).
   - **recommendations** (EXECUTION LOGIC): Array of strings. Define WHAT must change, WHY it must change, HOW to approach the fix (structural). Must be specific, actionable, grounded in evidence. Must NOT include copywriting or rewritten text. If no real issue, keep empty.
   - **fixes** (COPY FIXES): Array of strings. Provide exact fixes (copy-paste ready), such as headline rewrites, CTA improvements, positioning statements. Must be concrete, high impact, max 1–3 items.
   - **impactScore**: Numerical score indicating impact (e.g., -10 to -50 for negative). Use higher negative values for first impression issues.

5. **Category Insights**:
   For positioning, clarity, first_impression:
   - **statement**: Diagnostic layer (WHAT, WHAT weak, WHY).
   - **summary**: Current state description.

Deliver a structured JSON object with the following schema. Fill all fields based on the website analysis. No-BS, direct, actionable.

## Output Schema

### Top-Level Fields

```json
{
  "overallScore": 0, // Integer (0-100): Overall score based on all metrics. Calculate as average of positioning, clarity, first_impression, aeo scores. For this step, set to average of positioning, clarity, first_impression since aeo is 0.
  "statement": "" // String: Overall diagnostic statement summarizing first impressions, positioning, and clarity issues. Explain key weaknesses and their impact on conversions.
}
```

### websiteSummary

```json
{
  "overview": "", // String: Concise overview of the website's purpose and offerings.
  "problems": [], // Array of strings: List the main problems the website solves for users.
  "outcomes": [], // Array of strings: List the promised outcomes or benefits users get.
  "solutions": [], // Array of strings: List the solutions or features offered.
  "icp": [] // Array of strings: Describe the target audience (ICP) based on analysis.
}
```

### firstImpressions

```json
{
  "isPositioningClear": false, // Boolean: True if positioning is clear from the hero; false otherwise.
  "isMessagingClear": true, // Boolean: True if messaging is clear and understandable; false if confusing.
  "isUserLeftGuessing": true, // Boolean: True if users are left guessing about value or audience; false if clear.
  "ten_second_test": true, // Boolean: True if the hero passes the 10-second comprehension test; false if not.
  "statement": "" // String: Detailed statement on first impressions, highlighting strengths and weaknesses.
}
```

### issues (Array)

Generate 8-12 issue objects. Each issue object:

```json
{
  "id": "", // String: Unique UUID for the issue.
  "category": "", // String: One of "first_impression", "positioning", "clarity".
  "metricKey": "", // String: One of the metricKeys listed in the step-by-step process.
  "severity": "", // String: "low", "medium", or "high" based on impact.
  "statement": "", // String: Diagnostic statement (WHAT happening, WHAT weak, WHY impact).
  "explanation": null, // Always null.
  "current": "", // String: Exact current text or context from the website.
  "recommendations": [], // Array of strings: Structural recommendations (WHAT change, WHY, HOW).
  "fixes": [], // Array of strings: Exact copy-paste fixes (max 1-3).
  "impactScore": 0 // Integer: Negative score indicating impact, e.g., -10 to -50.
}
```

### scoring

```json
{
  "overall": 0, // Integer (0-100): Same as overallScore, set to 0 for this step.
  "positioning": 0, // Integer (0-100): Score for positioning based on evaluation (e.g., 70 if mostly clear).
  "clarity": 0, // Integer (0-100): Score for clarity based on messaging metrics.
  "first_impression": 0, // Integer (0-100): Score for first impressions based on hero analysis.
  "aeo": 0 // Integer (0-100): Set to 0, as AEO is not evaluated in this step.
}
```

### categoryInsights

```json
{
  "positioning": {
    "statement": "", // String: Diagnostic statement for positioning (WHAT, WHAT weak, WHY).
    "summary": "" // String: Current state summary of positioning.
  },
  "clarity": {
    "statement": "", // String: Diagnostic statement for clarity (WHAT, WHAT weak, WHY).
    "summary": "" // String: Current state summary of clarity.
  },
  "first_impression": {
    "statement": "", // String: Diagnostic statement for first impressions (WHAT, WHAT weak, WHY).
    "summary": "" // String: Current state summary of first impressions.
  },
  "aeo": {
    "statement": "", // String: Leave empty, as AEO is not evaluated in this step.
    "summary": "" // String: Leave empty, as AEO is not evaluated in this step.
  }
}
```
