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

## 📊 6. SCORING VALIDATION (STRICT ENFORCEMENT)

CRITICAL: You are NOT allowed to inflate scores.
Most startups score 50-60. Only exceptional ones reach 70+.

Your role: VALIDATE and CORRECT scores if mismatch exists.

### SCORING DISTRIBUTION (FOLLOW STRICTLY):

- 90–100 → FLAWLESS. Category-defining clarity and positioning. Extremely rare (<1%). ZERO friction anywhere.
- 70–89  → STRONG. Clear differentiation, minimal friction. Well-executed (~10%).
- 50–69  → AVERAGE. Understandable but has friction points. Most startups fall here (~60%).
- 30–49  → WEAK. Significant clarity or positioning issues. Conversion breaking (~25%).
- 0–29   → BROKEN. Users don't understand or don't care. Invisible (~4%).

**MOST STARTUPS SCORE 50-60. ONLY TRULY EXCEPTIONAL ONES REACH 70+.**
**IF SCORE IS ABOVE 70, YOU MUST JUSTIFY WHY THIS IS IN THE TOP 10% OF ALL SAAS SITES.**
**IF SCORE IS ABOVE 80, IT MUST BE TRULY WORLD-CLASS. Almost no startup reaches this.**

---

### MANDATORY SCORING PENALTIES (APPLY BEFORE RETURNING):

You MUST deduct points for these issues. NO EXCEPTIONS.

**PENALTY RULES**:

- Each unclear sentence = -2 points (max -10)
- Each grammar/spelling error = -5 points
- Each unclear/weak messaging instance = -2 points
- No clear positioning (isPositioningClear = false OR isMessagingClear = false) = -10 points
- Users left guessing (areUsersLeftGuessing = true) = -8 points
- Each negative comment identified = -2 points (max -15)
- First impression score < 50 = additional -5 points

Calculate total penalty and deduct from overallScore.

Example:
- 3 unclear sentences = -6
- No clear positioning = -10
- 4 negative issues = -8
- Total penalty = -24 points
- If raw score = 72, final score = 72 - 24 = 48

---

### SCORE-SPECIFIC CHECKS:

**For scores 70+**:
- MUST have zero unclear sentences
- MUST have strong differentiation explicitly stated
- MUST have no positioning weaknesses in sub-metrics
- MUST have headline that states WHO, WHAT, WHY clearly
- If ANY of these are missing, cap score at 60

**For scores 60-69**:
- Can have 1-2 minor unclear sentences
- MUST have explicit positioning
- Can have 2-3 negative comments max
- If has weak headline or vague CTA, cap at 55

**For scores 50-59** (most common):
- Typical startup range
- Has understandable messaging but with friction
- 3-5 negative comments normal
- Some sub-metrics weak (40-50 range)

**For scores < 50**:
- Significant issues present
- Users confused or unconvinced
- Multiple weak sub-metrics
- Poor first impression

---

### VALIDATION PROCESS:

1. Count all unclear sentences → apply penalty
2. Count all negative comments across sections → apply penalty
3. Check positioning/messaging clarity flags → apply penalty if false
4. Check if users left guessing → apply penalty if true
5. Review sub-metric scores → if variance is low (<50) and avg > 55, likely AI was too generous, cap at 55
6. Calculate total penalty
7. Apply to overallScore: finalScore = rawScore - penalty
8. If finalScore < 0, set to 0
9. Update individual section scores proportionally if overall changed significantly

RULE: When in doubt, SCORE LOWER. Better to be strict than lenient.
RULE: DEFAULT score for average SaaS = 50-60. Only go above 65 if truly exceptional.

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
