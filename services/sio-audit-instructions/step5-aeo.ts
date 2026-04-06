/**
 * Step 5: AEO (Answer Engine Optimization) - Specific Instructions
 * 
 * Use with: base-instructions.ts
 * Analyzes: AI engine presence, structured data, answer engine readiness
 * Context: Receives summary, first impression, positioning, and clarity from previous steps
 */

export const step5AEOInstructions = `
## CONTEXT FROM PREVIOUS STEPS

You have access to comprehensive analysis from Steps 3-4:

**Website Summary:**
{WEBSITE_SUMMARY_CONTEXT}

**First Impression Analysis:**
{FIRST_IMPRESSION_CONTEXT}

**Positioning Analysis:**
{POSITIONING_CONTEXT}

**Clarity Analysis:**
{CLARITY_CONTEXT}

Use this context to:
- Reference positioning clarity when evaluating AI readiness
- Consider hero section strength when assessing AI first impressions
- Build on unclear sentences when suggesting AEO improvements
- Maintain consistency with earlier findings

---

## YOUR SPECIFIC TASK: AEO Visibility

Evaluate the startup's visibility in AI answer engines (ChatGPT, Claude, Gemini, etc.).

### 1. AI Engine Presence

Determine if this startup is likely to be mentioned by AI engines:
- **isPresent**: boolean - Is the brand likely mentioned in AI responses?
- **engines**: string[] - Which AI engines might mention this brand? (ChatGPT, Claude, Gemini, Perplexity, Copilot)
- **comment**: string - Detailed analysis of why/why not

Consider:
- Brand recognition and authority
- Press coverage and mentions
- Industry relevance
- Age and maturity of company
- Unique innovations worth mentioning

### 2. Structured Data Readiness

Check if the website has proper markup for AI understanding:
- Review JSON-LD schema presence and quality
- Evaluate meta tags completeness
- Assess Open Graph implementation
- Check for FAQ schema, Product schema, etc.

### 3. Answer Engine Optimization

Evaluate how well the site is optimized for AI answer engines:
- **Clear category definition**: Would AI confidently categorize this business?
- **Specific use case articulation**: Can AI explain what it does?
- **Target audience clarity**: Would AI know who this is for?
- **Differentiation signals**: Would AI explain why choose this over alternatives?

### 4. Recommendations

Provide 3-5 specific, actionable recommendations to improve AI visibility:
- Structured data additions
- Content optimizations
- FAQ implementations
- Schema markup suggestions
- Authority building strategies

---

## RETURN FORMAT

Return ONLY valid JSON matching this structure:

{
  "aeo": {
    "score": number (0-100),
    "statement": "string (1-2 sentence overall assessment)",
    "aiPresence": {
      "isPresent": boolean,
      "engines": ["string"],
      "comment": "string (detailed analysis)"
    },
    "recommendations": ["string (specific actionable recommendations)"]
  }
}

---

## SCORING GUIDELINES FOR AEO

Score based on:
- **AI Authority (30%)**: Is the brand known enough for AI to mention?
- **Structured Data (30%)**: Does the site have proper markup?
- **Content Clarity (25%)**: Would AI understand and explain this business?
- **FAQ/Educational Content (15%)**: Is there content that directly answers common questions?

**Typical scores:**
- 0-20: Unknown startup, no structured data, unclear positioning
- 21-40: Early startup, minimal markup, positioning improving
- 41-60: Growing startup, some structured data, clear positioning
- 61-80: Established player, good markup, very clear to AI
- 81-100: Industry leader, comprehensive markup, AI would confidently recommend

---

## IMPORTANT

- Be realistic about AI visibility (most startups won't have AI presence yet)
- Reference previous analysis when explaining why AI would/wouldn't mention them
- Check if structured data exists in the metadata provided
- Provide 3-5 specific recommendations
- Recommendations should be actionable and specific to this startup
- Consider the positioning and clarity findings when making suggestions
`;
