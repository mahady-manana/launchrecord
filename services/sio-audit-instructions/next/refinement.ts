export const refinementInstruction = `

# STEP 3 — REFINEMENT & QA

INPUT:
{COMPLETE_REPORT_CONTEXT}

You receive a COMPLETE SIO-V5 audit report.

Your role:
→ detect inconsistencies
→ validate scoring
→ harden diagnostics
→ upgrade execution layers
→ enforce statement quality

Return FULL refined report.

---

## 🎯 OBJECTIVE

Ensure the report is:

- consistent
- complete
- sharp (no vague analysis)
- actionable (where needed)
- brutally clear

Only fix what is weak.

---

## 🔍 QA CHECKS

### 1. Consistency

- no contradictions across sections
- scores align with comments
- strong positives ≠ low score
- heavy negatives ≠ high score

---

### 2. Completeness

- all sections present
- no broken structure
- unclearTexts always include: { text, issue, fix }
- suggestions only if needed

Do NOT force content.

---

## 🧠 3. STATEMENT AUDIT (CRITICAL)

Apply to ALL:

- global statement
- positioning.statement
- clarity.statement
- sub-metrics statement (if applicable)

Each statement MUST:

- clearly describe WHAT is happening
- clearly identify WHAT is wrong (if any)
- explain WHY it impacts clarity, positioning, or conversion

Must be:

- specific
- evidence-grounded
- tension-driven (not descriptive fluff)

FORBIDDEN:

- generic phrasing ("could be improved", "needs clarity")
- fixes or solutions
- rewrites
- instructions

If weak:

→ rewrite to be sharper, more explicit, more diagnostic

---

## 🧪 4. DIAGNOSTIC QUALITY

Fix ONLY if weak:

- vague comments → make precise
- unclear negatives → explain impact
- soft critique → make explicit

Do NOT invent issues.

---

## 🛠️ 5. EXECUTION LAYER

### recommendations

Must:

- define WHAT to change
- explain WHY it matters
- describe HOW structurally

Must NOT:

- include copywriting

---

### suggested

Must:

- be copy-paste ready
- be specific and high impact

Remove if:

- weak
- redundant
- unnecessary

---

## 📊 6. SCORING VALIDATION

Adjust ONLY if mismatch exists (±5 max)

Guidelines:

- 70–100 → strong clarity, strong positioning, low friction
- 40–69 → mixed clarity, moderate friction
- 0–39 → unclear, weak positioning, high friction

Rules:

- real issues → score must drop
- strong clarity → score must reflect it

---

## ⚙️ REFINEMENT RULES

- preserve valid data
- improve only weak parts
- do NOT soften tone
- do NOT add assumptions
- do NOT hallucinate problems

---

## 📦 OUTPUT

Return FULL JSON:

- websiteSummary
- firstImpression
- positioning
- clarity
- aeo
- overallScore
- statement
- overallCommentPositive
- overallCommentNegative

STRICT:

- no markdown
- no commentary
- no wrapper
- no schema change

`;
