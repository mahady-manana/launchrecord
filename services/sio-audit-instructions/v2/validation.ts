export const validationInstruction = `
# SIO-v5 Audit Engine - Step 4: Final Validation & Refinement

## ⚠️ CORE PRINCIPLE

- Issues represent real problems in the content
- Scores represent the impact of those problems
- NEVER modify issues to match scores
- ONLY adjust scores if they contradict issues or booleans
- Improve all recommendations and fixes to be strong, clear and directly improve conversions 

---

## Step-by-Step Process

### 1. Score Consistency Check (STRICT)

Verify that each category score is consistent with:
- existing issues (especially HIGH severity)
- boolean signals (e.g. isPositioningClear, isMessagingClear)

RULES:

THIS IS VERY IMPORTANT AND MUST BE ENFORCED STRICTLY

- If isPositioningClear = false → positioning score MUST be below 60
- If isMessagingClear = false → clarity score MUST be below 60
- If isUserLeftGuessing = true → first_impression score MUST be below 60

- If multiple HIGH severity issues exist in a category → score MUST reflect significant weakness (typically < 60)

If mismatch:
→ adjust the SCORE (NOT the issues)

---

### 2. First Impression Deep Validation (CRITICAL)

Re-evaluate the HERO section:

Ensure alignment between:
- headline
- subheadline
- CTA

Validate presence and clarity of:
- ICP (who it is for)
- core function (what it does)
- differentiation (why it is different)
- What problems it solve
- What outcomes it promises

Need to evaluate deeply the Problems-solution-fit.

If missing or unclear:
→ ensure relevant HIGH severity issues exist

---

### 3. Headline & Subheadline Rewrite Quality

For issues related to:
- headline
- subheadline

Ensure fixes:
- clearly express ICP
- communicate concrete value
- avoid generic phrasing
- include differentiation when possible

No vague rewrites allowed. No All-in-one, Unleash, AI-Powered, or any AI'sh words

---

### 4. AI / Generic Wording Filter (STRICT)

Scan ALL \`fixes\`.

Remove or rewrite any vague, overused, or low-signal phrases such as:

- "AI-powered"
- "all-in-one"
- "next-generation"
- "cutting-edge"
- "revolutionary"
- "smart solution"
- "powerful platform"

RULE:
→ Fixes must NOT reuse the same type of vague language flagged in issues

Replace with:
- specific outcomes
- clear use cases
- concrete value

---

### 5. Statement Diagnostic Check

All statements must remain diagnostic only.
All statement must tell its impact to create tension and urgency
No advice. No implicit/explicit instruction. No recommendations

Replace:
- "should", "must", "improve", "fix"

With:
- "is missing"
- "does not specify"
- "fails to convey"
- "contains"

No instructions inside statements.

---

### 6. Fix Quality Check

- fixes → copy-paste ready, concrete
- recommendations → explain WHAT and WHY only

No overlap.

---

### 7. Issue Integrity Check

- Do NOT remove valid issues to “clean” the report
- Do NOT add filler issues
- Keep only real, evidence-based problems

---

### 8. Overall Score Derivation

Compute \`overall\`:

- first_impression: 35%
- positioning: 25%
- clarity: 25%
- aeo: 15%

Cap at 89.
Never round up.

---

## 🔗 FINAL RULES

- Issues are the source of truth
- Scores must align with issues and booleans
- Do not introduce contradictions
- Do not rewrite system structure
- Maintain professional, consistent output

Return ONLY the JSON.
`;
