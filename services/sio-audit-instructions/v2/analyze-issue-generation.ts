export const analyzeAndIssueInstruction = `
## ⚙️ SIO-V5 — SUMMARY & FIRST IMPRESSION (STEP 1)

Objective:
Generate a factual websiteSummary and first-impression issues only.

The system operates in 2 coordinated actions:
1. websiteSummary creation
2. first impression issue generation

---

## 1. 📄 WEBSITE SUMMARY (ACTION)

### Rule:
Create a factual synthesis of what the website communicates.

- overview: what the product claims it is
- problems: customer pains it explicitly addresses
- outcomes: results or transformations it promises
- solutions: what the product offers or does

### Constraints:
- No critique or interpretation
- No assumptions or added meaning
- Must strictly reflect website content

### Outcome:
A structured factual representation of the website message.

---

## 2. 💎 ISSUE GENERATION (ACTION)

### Rule:
Generate 3–5 high-impact first impression issues based on websiteSummary + raw content.

### Logic:
Issues must reflect gaps between:
→ what the website claims
→ what the user actually understands

### Constraints:
- 3–5 issues required
- No duplicates or overlapping root causes
- One issue = one root problem
- Focus only on first impression: headline, subheadline, CTA
- Do not drift into positioning, messaging deep-dive, or AEO

### Severity:
- Critical: unclear value or purpose → drop-off risk
- High: value exists but poorly communicated
- Medium: friction but understandable
- Low: minor first impression improvements if needed to reach 3–5

### Outcome:
A structured, evidence-based set of first impression issues.

---

## 3. 🧠 STATEMENTS (ACTION)

### Rule:
Each issue must include a diagnostic statement:

- 2–3 sentences
- Must include:
  → what is wrong
  → why it matters (conversion impact)
  → consequence (confusion, drop-off, weak differentiation)

### Constraints:
- No fixes or suggestions
- No how-to language
- No solution wording

### Outcome:
Clear diagnostic reasoning per issue.

---

## 4. 🔍 FIRST IMPRESSIONS (CRITICAL CONSISTENCY RULE)

### Output:
"firstImpressions": {
  "isPositioningClear": boolean,
  "isMessagingClear": boolean,
  "isUserLeftGuessing": boolean,
  "ten_second_test": boolean,
  "statement": "..."
}

### ⚠️ STRICT CONSISTENCY REQUIREMENT:

This entire block MUST be fully consistent with:
- websiteSummary
- generated issues
- top-level statement
- categoryInsights (especially positioning + first impression)

### RULES:
- If positioning issues are critical/high → isPositioningClear MUST be false
- If messaging is unclear in issues → isMessagingClear MUST be false
- If users cannot understand value in first 10 seconds → ten_second_test MUST be true (fail)
- If multiple issues indicate confusion → isUserLeftGuessing MUST be true

### STATEMENT RULE:
- Must summarize first impression ONLY
- Must NOT contradict issue severity or categoryInsights

### OUTCOME:
A fully aligned first impression evaluation that reflects the actual issues, not an independent opinion.

---

## 5. 🎯 EVIDENCE & VALIDATION (ACTION)

### Rule:
Every issue must be grounded in:

- visible website content OR
- missing expected content inferred from websiteSummary

### Constraints:
- No speculation
- No forced issues
- No duplication

### Outcome:
All issues are traceable and justified.

---

## 6. 🎯 COVERAGE RULES (ACTION)

### Rule:
Stay strictly within first impression coverage.

### Constraints:
- Do not create positioning, clarity, or AEO issues in this step
- Max 5 issues total

### Outcome:
Root-cause driven first impression audit, not a surface listing.

---

## 7. 📊 SCORING (ACTION)

### Rule:
This first step must only score first_impression.

### Constraints:
- Score only the first impression layer
- Use the issues as evidence, not as a simple penalty formula
- Do not score blindly from issue count or severity count
- Two critical first impression issues can still coexist with an otherwise decent product story
- Only assign very low scores when the first impression is broadly broken
- 80+ is appropriate when the headline, subheadline, and CTA quickly explain what it is, who it is for, and why it matters
- 60–79 is appropriate when the opening is understandable but still rough or incomplete
- 40–59 is appropriate when the opening is weak but not fully confusing
- Below 40 should be rare and reserved for openings that fail the 10-second test
- Later steps will score their own layers and preserve this output

### Outcome:
A complete first-pass report with summary, first impression issues, and first impression score.

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
    "first_impression": { "summary": "...", "statement": "..." }
  },
  "scoring": {
    "first_impression": 0
  },
  "websiteSummary": {
    "overview": "...",
    "problems": [...],
    "outcomes": [...],
    "solutions": [...]
  }
}

---

RETURN ONLY JSON
`;
