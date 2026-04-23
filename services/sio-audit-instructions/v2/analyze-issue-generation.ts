export const analyzeAndIssueInstruction = `
## ⚙️ SIO-V6 — ANALYZE & ISSUE GENERATION (STEP 1)

**Primary Objective**: Extract intelligence and create structured ISSUES. 
Refer to **General Instructions** for core metric definitions, evaluation criteria, and quality rules.

---

## 💎 QUALITY GENERATION (CRITICAL)
- **High-Impact Focus**: Do not waste issues on trivialities. Focus on the 20% of problems that cause 80% of the friction.
- **Diagnostic Depth**: Every issue statement must clearly articulate the IMPACT on conversion or AI comprehension.
- **Evidence-Based**: Ensure every issue is grounded in the specific text and layout of the current site. Use the "current" field to prove the friction.

---

## 🧩 ISSUES CONTRACT
Each issue MUST adhere to the **General Instructions** schema, logical mapping, and quality rules. 
- **metricKey**: MUST be lowercase.
- MIN issues: 15 | MAX: 25
- Categories: 3 Positioning, 3 Clarity, 1 First Impression.

### ⚠️ MANDATORY COVERAGE RULE (DO NOT SKIP)
You MUST generate **at least one LOW or MEDIUM severity issue** for EACH of the submetrics defined in **General Instructions**, even if the website performs well on it. This ensures founders always have actionable improvement suggestions.

If a submetric is genuinely excellent, generate a LOW issue with a minor optimization suggestion. No submetric should have zero issues.

---

## ⚡ OUTPUT STRUCTURE

### ⚠️ CRITICAL: TWO DIFFERENT STATEMENTS (DO NOT CONFUSE)
1. **"statement"** (top-level): A 2-3 sentence **holistic audit verdict** about the product's overall positioning, messaging clarity, and conversion readiness across the ENTIRE website. This is the executive summary of the audit. It should cover the product as a whole — its strengths, core weaknesses, and overall state.
2. **"firstImpressions.statement"**: A 2-3 sentence diagnostic ONLY about the **initial landing experience** — what a visitor sees, understands (or fails to understand) in the first 5-10 seconds. Focus strictly on the hero section, above-the-fold content, headline, and immediate visual/messaging impact.

These two statements MUST be meaningfully different. The top-level statement is BROAD (whole product audit). The firstImpressions.statement is NARROW (first 10 seconds only). If they sound the same, you have FAILED.

{
  "statement": "2-3 sentence holistic audit of the product's positioning, messaging, and conversion readiness across the entire website.",
  "issues": [...],
  "firstImpressions": {
    "isPositioningClear": boolean,
    "isMessagingClear": boolean,
    "isUserLeftGuessing": boolean,
    "ten_second_test": boolean,
    "statement": "2-3 sentence diagnostic ONLY about the first 5-10 seconds of the landing experience. What does a visitor see, understand, or fail to grasp immediately?"
  },
  "categoryInsights": {
    "positioning": { 
      "summary": "Neutral description of the CURRENT positioning/target audience found on the site. NO analysis, NO diagnostic, NO interpretation.", 
      "statement": "Critical diagnostic analysis of the current positioning effectiveness. NO recommendations, NO fixes, NO hints on 'how to' improve." 
    },
    "clarity": { 
      "summary": "Neutral description of the CURRENT messaging/structure/hierarchy. NO analysis, NO diagnostic.", 
      "statement": "Critical diagnostic analysis of the messaging clarity and cognitive load. NO solutions, NO hints." 
    },
    "first_impression": { 
      "summary": "Neutral description of what visitors see first (Hero section). NO analysis, NO diagnostic.", 
      "statement": "Critical diagnostic analysis of the first 5-10 seconds of impact. NO advice, NO fixes." 
    },
    "aeo": { 
      "summary": "Neutral description of existing technical/semantic markup. NO analysis, NO diagnostic.", 
      "statement": "Critical diagnostic analysis of AI-readiness and search-engine visibility. NO recommendations, NO solutions." 
    }
  },
  "websiteSummary": {
    "overview": "Neutral, factual description of what the product/company does",
    "problems": ["Real-world USER PAINS or market problems that the PRODUCT claims to solve — NOT audit findings"],
    "solutions": ["Capabilities, features, or value propositions the PRODUCT provides — NOT audit recommendations"]
  }
}

RETURN ONLY JSON.
`;
