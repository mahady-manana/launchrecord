export const analyzeAndIssueInstruction = `
## ⚙️ SIO-V6 — ANALYZE & ISSUE GENERATION (STEP 1)

**Primary Objective**: Extract intelligence and create structured ISSUES. 
Refer to **General Instructions** for core metric definitions and quality rules.

---

## 🧩 LOGICAL MAPPING (CRITICAL)
- **isPositioningClear = FALSE** → MUST generate 2+ CRITICAL "positioning" issues.
- **ten_second_test = FALSE** → MUST generate 2+ CRITICAL "first_impression" issues.
- **isMessagingClear = FALSE** → MUST generate 2+ HIGH/CRITICAL "clarity" issues.

---

## 🔍 CONTEXTUAL FLEXIBILITY (CRITICAL)
Do NOT enforce a rigid "startup template". 
- Some products need ICP + Outcome in headline; others don't.
- Evaluate effectiveness and clarity for the specific context, not adherence to a specific framework.
- Every startup has unique ways of implementing best practices.

---

## 🔍 DIAGNOSTIC PRINCIPLE (CRITICAL)
Do NOT rely only on provided examples. Apply these **first principles** to the unique website context. If a message is weak for a reason not listed but violates a principle, you MUST flag it.


---

## 🔍 evaluation: headline
- **What Matters**: Effectively capturing attention and communicating the "reason to exist" without forcing a rigid formula.
- **Checks**: Ambiguity requiring multiple paragraphs to resolve; jargon that alienates the intended user; overall compelling nature and clarity.

## 🔍 evaluation: subheadline
- **What Matters**: Reducing cognitive load by expanding on the primary hook and providing context.
- **Checks**: Pure repetition of headline; introduction of unsupported technical concepts; failure to bridge from promise to execution.

## 🔍 evaluation: cta (first impression)
- **What Matters**: A clear, low-friction trigger for the next logical step in the user journey.
- **Checks**: "Mystery meat" links with no clear destination; language disconnected from hero section value; visual buried in layout.

## 🔍 evaluation: category_ownership
- **What Matters**: An immediate mental frame of reference so users know how to value the product.
- **Checks**: Obscure "invented" categories that prevent comparison; lack of any baseline context; being too broad to be meaningful.

## 🔍 evaluation: unique_value_proposition (uvp)
- **What Matters**: Identifying the primary outcome or "edge" that makes the product worth choosing.
- **Checks**: UVP indistinguishable from industry "table stakes"; primary benefits claimed without any evidence; non-measurable outcomes.

## 🔍 evaluation: competitive_differentiation
- **What Matters**: Clarifying the specific "delta" between this product and known alternatives.
- **Checks**: Assuming the user already knows the competition; failure to state why this is better, faster, or more relevant for a specific niche.

## 🔍 evaluation: target_audience
- **What Matters**: Resonance with a specific ICP so the right user feels "spoken to."
- **Checks**: "Everything for everyone" language; lack of industry-specific terminology; mismatch between capability and target audience.

## 🔍 evaluation: problem_solution_fit
- **What Matters**: Direct alignment between a recognizable, "burning" user pain and the product solution.
- **Checks**: Trivial or "hallucinated" problems; solutions that look like a "feature looking for a problem"; weak bridge between pain and better state.

## 🔍 evaluation: messaging_consistency
- **What Matters**: A logical, aligned narrative flow from the top of the page to the bottom.
- **Checks**: Pivoting to unrelated value props halfway down; testimonials praising features not in copy; "Frankenstein" messaging.

## 🔍 evaluation: headline_clarity
- **What Matters**: Passing the "glance test" (3-5 seconds) for basic comprehension.
- **Checks**: Puns or clever wordplay prioritized over meaning; excessive jargon; requiring sub-copy reading to understand the main hook.

## 🔍 evaluation: value_proposition (clarity)
- **What Matters**: Making specific outcomes and benefits easy to find and digest during a quick scan.
- **Checks**: Value buried in massive text blocks; vague high-level marketing speak; lack of concrete outcome statements.

## 🔍 evaluation: feature_benefit_mapping
- **What Matters**: Connecting the technical "what" to the practical or emotional "why."
- **Checks**: "Laundry lists" of features without enabled outcomes; promising outcomes without showing the enabling features.

## 🔍 evaluation: visual_hierarchy
- **What Matters**: Guiding attention toward critical conversion and clarity elements through layout.
- **Checks**: Critical text too small to notice; CTA blending into background; secondary elements louder than primary value prop.

## 🔍 evaluation: cta_clarity
- **What Matters**: Precise transparency regarding the immediate result of a click.
- **Checks**: "Commitment-heavy" language before value is established; "commitment-vague" text that leaves the user guessing.

## 🔍 evaluation: proof_placement
- **What Matters**: Trust signals (logos, data) deployed at moments of maximum doubt or friction.
- **Checks**: Social proof sequestered at the bottom only; generic/unverifiable reviews; missing proof near primary CTAs.

## 🔍 evaluation: unclear_sentences
- **What Matters**: A professional, high-momentum reading experience through clean copy.
- **Checks**: Sentences so long the thread is lost; typos and grammar issues undermining credibility; passive voice stalling momentum.


---

## 🧩 ISSUES CONTRACT
Each issue MUST adhere to the **General Instructions** schema and quality rules. 
- **metricKey**: MUST be lowercase.
- MIN issues: 7 | MAX: 20
- Categories: 3 Positioning, 3 Clarity, 1 First Impression.

---

## ⚡ OUTPUT STRUCTURE
{
  "issues": [...],
  "firstImpressions": {
    "isPositioningClear": boolean,
    "isMessagingClear": boolean,
    "isUserLeftGuessing": boolean,
    "ten_second_test": boolean,
    "statement": "Summary of current conversion state (1 sentence)"
  },
  "categoryInsights": {
    "positioning": { "statement": "Diagnostic synthesis", "summary": "Simplified explanation" },
    "clarity": { "statement": "...", "summary": "..." },
    "first_impression": { "statement": "...", "summary": "..." },
    "aeo": { "statement": "...", "summary": "..." }
  },
  "websiteSummary": {
    "overview": "Neutral product description",
    "problems": ["User pains addressed by product"],
    "solutions": ["Product capabilities/value prop"]
  }
}

RETURN ONLY JSON.
`;
