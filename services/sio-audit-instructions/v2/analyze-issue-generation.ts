export const analyzeAndIssueInstruction = `
## ⚙️ SIO-V5 — SUMMARY & FIRST IMPRESSION (STEP 1)

Objective:
Generate a factual websiteSummary and first-impression issues only.
Check the first impression checklist one metric at a time:
- headline
- subheadline
- CTA
Do not force a generic SaaS template. If audience or outcomes are clearly implied by the hero, subheadline, CTA, visuals, or surrounding copy, treat them as present.

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
Generate 3–5 high-impact first impression issues based only on headline, subheadline, and CTA.
Judge whether the opening communicates what it is, who it is for, and why it matters for this category. Do not require those points to be stated in an identical SaaS-template way.

### Logic:
Issues must reflect gaps between:
→ what the website claims
→ what the user actually understands

Each issue must map to one of the three first impression metrics. Do not create issues from anything outside this checklist.

### Constraints:
- 3–5 issues required
- No duplicates or overlapping root causes
- One issue = one root problem and one metric key
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
- Keep each sentence short, direct, and specific
- Must include:
  → what is wrong
  → why it matters (conversion impact)
  → consequence (confusion, drop-off, weak differentiation)

### Constraints:
- No fixes or suggestions
- No how-to language
- No solution wording

### Explanation rule:
- Keep explanation to 1 short sentence
- Make it factual and direct
- Do not repeat the statement
- Do not add extra detail or new reasoning

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
- Set isPositioningClear to true when headline + subheadline make what it is, who it is for, and why it matters immediately obvious
- Set isMessagingClear to true when the value proposition is easy to grasp without guessing from the opening
- Set isUserLeftGuessing to true only when the first impression still leaves the visitor unsure about the product or audience
- Set ten_second_test to true only when the opening fails the 10-second understanding test
- Do not default these booleans to false on strong websites; they must match the actual opening message

### STATEMENT RULE:
- Must summarize first impression ONLY
- Must NOT contradict issue severity or categoryInsights
- It should reflect pass/fail status plainly, not hedge or default to false
- Keep it short, direct, and easy to scan

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
- Do not introduce metric keys outside headline, subheadline, and CTA

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
