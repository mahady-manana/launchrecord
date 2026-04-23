export const aeoAnalysisInstruction = `
## ⚙️ SIO-V6 — AEO VISIBILITY READINESS (STEP 4)

**Primary Objective**: Assess how well the website content is structured for AI Discovery (AEO - Artificial Engine Optimization). 
Refer to **General Instructions** for core metric definitions and diagnostic rules.

---

## 🧩 AEO DIAGNOSTIC DIMENSIONS (CRITICAL)

### 1. The "Definition" Pillar (non-negotiable)
The product MUST clearly answer these 3 questions in a direct, parseable way:
- **What is it?** (Category/Identity)
- **Who is it for?** (Specific ICP)
- **What outcome does it deliver?** (Primary Result)
*Any missing or vague pillar MUST be reported as a CRITICAL AEO issue.*

### 2. ICP & Exclusions
- Does the site explicitly state for who / not for who?
- AI systems prioritize specificity over broad claims. Lack of "Exclusions" (who should NOT use it) is a HIGH friction point for AI category bucketization.

### 3. Problem-Solution Causal Mapping
- Are there clear pairs of [Problem] → [Solution]?
- AI search engines look for cause-effect clarity. Do not assume AI will infer the mapping. It must be explicit.

### 4. Intent & Use-Cases
- Are use-case blocks structured based on likely search queries (e.g., "How to fix X")? 
- Outcome-based phrasing is preferred over feature-led descriptions for AI intent mapping.

### 5. Category Anchoring
- Does it use "Unlike X, we focus on Y" or "Alternative to [Category]"?
- AI needs a mental frame of reference to place the product in a bucket.

### 6. Intent-Driven Q&A
- Are there high-intent questions (What does X do? How is it different?) properly categorized?
- Avoid generic marketing filler/FAQ fluff.

### 7. Terminology & Structure
- **Consistency**: Use one primary term (e.g., "audit" not "scan" + "review" + "analysis") to build extraction confidence.
- **Quantifiable Claims**: Deploy concrete data (e.g., "200+ SaaS founders") for higher extraction reliability.
- **Scannability**: Short paragraphs, clear H2/H3 headers, and bullet points are essential for AI parsing.

---

## ⚡ OUTPUT STRUCTURE
You MUST generate new AEO issues and update the AEO Category Insight:

{
  "issues": [
    {
      "id": "aeo-xxx",
      "category": "aeo",
      "metricKey": "one_line_definition | audience_specificity | problem_solution_mapping | ...",
      "severity": "critical | high | medium | low",
      "statement": "...",
      "explanation": "...",
      "current": "...",
      "recommendations": ["..."],
      "fixes": ["..."]
    }
  ],
  "categoryInsights": {
    "aeo": {
      "summary": "Neutral description of the CURRENT AEO/parsing state of the site.",
      "statement": "Diagnostic analysis of AI-readiness and extraction reliability."
    }
  }
}

RETURN ONLY JSON.
`;
