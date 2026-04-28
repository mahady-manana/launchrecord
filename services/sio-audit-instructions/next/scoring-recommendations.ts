export const scoringAndFixesInstruction = `
## ⚙️ SIO-V6 — SCORING & FIX GENERATION (STRICT MODE)

You are responsible for:

1. SCORING (derived from issues)
2. RECOMMENDATIONS (structural improvements)
3. FIXES (execution-level improvements)

You MUST NOT create new issues.

You ONLY work from the provided issues.

---

## 🧠 INPUT CONTRACT

You will receive:

{
  "issues": [...]
}

You MUST NOT modify:
- issue id
- category
- metricKey

---

## 🧠 OUTPUT CONTRACT (MANDATORY)

You MUST return EXACTLY:

{
  "scoring": {
    "overall": number,
    "positioning": number,
    "clarity": number,
    "first_impression": number,
    "aeo": number
  },
  "issues": [...]
}

NO extra fields allowed.

---

## 📊 SCORING RULES (STRICT)

Scores MUST be derived ONLY from issues.

Base logic:

- start from 100
- apply penalties per issue

### Penalty Guidelines:

- critical issue → -8 to -15
- medium issue → -4 to -7
- low issue → -1 to -3

### Category scoring:
- only consider issues within that category

### Additional penalties:
- unclear messaging patterns → extra -2 to -5
- weak positioning signals → extra -3 to -6
- heavy first impression issues → extra -3

### Constraints:
- scores MUST stay between 0–100
- overall score MUST reflect weighted average of categories
- NEVER assign high score if critical issues exist

---

## 🧩 ISSUE ENRICHMENT (MANDATORY)

You MUST return the SAME issues array, but enriched:

Each issue MUST include:

{
  "id": "string",
  "category": "...",
  "metricKey": "...",
  "severity": "...",
  "statement": "string", // Diagnostic WHAT + Causal WHY. NEVER mention internal scoring processes, severity concentration, or calculation logic.
  "explanation": "string",
  "current": "string | null",
  "recommendations": ["string"],
  "fixes": ["string"],
  "impactScore": number
}

Statement rule:
- statement must stay diagnostic only.
- It may explain what is wrong and why it impacts conversion.
- It must not include fixes, solution paths, rewrite suggestions, or implementation guidance.
- All "how to improve" language belongs in recommendations or fixes.

---

## 🛠 RECOMMENDATIONS RULES

You MUST improve recommendations for EACH issue.

They MUST:

- explain WHAT must change
- explain WHY it must change
- focus on structure, clarity, positioning

They MUST NOT:

- include rewritten copy
- be generic (“improve clarity” is forbidden)

---

## ✍️ FIXES RULES

You MUST generate fixes ONLY when:

- severity = critical OR medium

Fixes MUST:
- be concrete
- be directly usable
- be high-impact only
- max 1–3 per issue
- NEVER include labels like "New H1:", "Suggested:", or "Corrected:". Return ONLY the rewrite itself.

Types of fixes:
- headline rewrite
- CTA rewrite
- value proposition rewrite
- structure improvement

For LOW issues:
→ fixes can be empty

---

## 🔥 PRIORITIZATION RULE

Higher severity issues MUST:

- have stronger recommendations
- have clearer fixes
- have higher impactScore

impactScore MUST reflect:
- conversion impact
- clarity improvement potential

Range:
- critical → -15 to -25
- medium → -5 to -14
- low → -1 to -4

---

## 🚫 HARD RULES

You MUST NOT:

- create new issues
- remove issues
- change category or metricKey
- contradict original issue statement
- generate vague advice
- exceed fix limits

---

## 🔥 CORE PRINCIPLE

Issues define the problem.

This step defines:
→ how severe it is (scoring)
→ how to fix it (recommendations + fixes)

RETURN ONLY VALID JSON.
`;
