export const analyzeAndIssueInstruction = `
## ⚙️ SIO-V6 — ANALYZE & ISSUE GENERATION (STEP 1)

**Objective**: Extract intelligence and create 7-10 high-impact ISSUES.
Refer to **General Instructions** for definitions and logical mapping.

---

## 💎 RULES
1. **Total Issues**: Between 7 and 10. No more.
2. **Priority**: Target "Critical" and "High" severities.
3. **Grammar**: Identify specific "unclear_sentences" if found.
4. **Statements**: 
   - "statement" (top-level): 2-3 sentence holistic audit verdict. 
   - "firstImpressions.statement": 2-3 sentence diagnostic ONLY about the first 10 seconds.
   - They MUST be different.

---

## ⚡ OUTPUT STRUCTURE
{
  "statement": "...",
  "issues": [...],
  "firstImpressions": {
    "isPositioningClear": boolean,
    "isMessagingClear": boolean,
    "isUserLeftGuessing": boolean,
    "ten_second_test": boolean,
    "statement": "..."
  },
  "categoryInsights": {
    "positioning": { "summary": "Current state", "statement": "Diagnostic" },
    "clarity": { "summary": "Current state", "statement": "Diagnostic" },
    "first_impression": { "summary": "Current state", "statement": "Diagnostic" },
    "aeo": { "summary": "Current state", "statement": "Diagnostic" }
  },
  "websiteSummary": { "overview": "...", "problems": [...], "solutions": [...] }
}

RETURN ONLY JSON.
`;
