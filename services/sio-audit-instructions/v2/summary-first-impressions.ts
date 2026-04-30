export const summaryFirstImpressionsInstruction = `
# SIO-v5 Audit Engine - Step 1: Summary & First Impressions

## ⚠️ STRICT EXECUTION ORDER — DO NOT DEVIATE

You MUST follow this exact sequence. Do NOT generate issues before completing scoring.

---

## 🔍 PHASE 1 — SUMMARIZATION (No judgment yet)

Understand the website as written:
- What does the product do?
- Who is it for?
- What problem does it solve?
- What value does it deliver?

Use only the provided raw content. Do not infer what is not explicitly stated.

Fill in \`websiteSummary\` and \`firstImpressions\` booleans now.

**isPositioningClear**:
True when the product, audience - ICP, Problems, Solutions, Outcomes and value are immediately understandable from the hero or opening message with clear Unique Value Prop and differentiation.
isMessagingClear: True when the value proposition can be understood quickly without guessing, free of jargon.
isUserLeftGuessing: True when a first-time visitor still has to infer what the product does,what prblems it solves who it is for, what they will get in return.
ten_second_test: True only when the page pass the 10-second understanding test.
statement: Diagnostic summary of the first impression only to create tension, tease and urgency. No fixes.No advice. No recommendations


---

## 📊 PHASE 2 — SCORE FIRST (Before any issues)

Based on Phase 1 understanding, score the following categories:

**First Impression Score (0–89)**
Judge: does the hero answer WHO it is for, WHAT it does, WHAT the user gets — quickly and clearly?
Most clearly state explicitly or not the PROBLEMS/SOLUTIONS/ICP/OUTCOMES and fast.
If user can understand and answer those question under 5s it pass.

- 75–89: zero ambiguity, crystal clear in under 5 seconds
- 60–75: mostly clear, at least 2 of 3 hero questions answered
- 40–59: partial clarity, user must infer key context
- Below 40: hero leaves user guessing on all 3

**Positioning Score (0–89)**
Judge: is the product differentiated, targeting a specific audience with a specific problem?

**Clarity Score (0–89)**
Judge: is the messaging free of jargon, ambiguity, and generic phrasing?

⚠️ LOCK THESE SCORES NOW. They must not change when you generate issues.

---

## 🧩 PHASE 3 — ISSUES (Grounded in Phase 2 scores)

Now generate issues for the \`first_impression\` category only.

The number and severity of issues MUST BE indepandent of scores you locked in Phase 2.

Use category: \`"first_impression"\`.
Use metricKeys: \`"headline"\`, \`"subheadline"\`, \`"cta"\`.
Focus on whether the hero answers: who it is for, what it does, what the user gets.

Check BASE INSTRUCTION → METRICS LAYER  → First Impression Metrics above before generating issues.
Some metricKeys may PASS the critiria but need improvement 

Issue fields:
- **id**: UUID
- **category**: \`"first_impression"\`
- **metricKey**: one of the above
- **severity**: aligned to score tier above
- **statement**: DIAGNOSTIC ONLY — WHAT is broken and WHY it matters. No fixes.
- **explanation**: null
- **current**: exact extracted text causing the issue
- **recommendations**: strategic HOW-TO guidance
- **fixes**: copy-paste ready rewrites (max 3)
- **impactScore**: negative number

---

## 🧩 PHASE 4 — METRICS & CATEGORY INSIGHTS

Evaluate ALL 26 metrics listed in Base Instructions → METRICS LAYER.
For each: \`name\`, \`check\` (true/false).

Write \`categoryInsights.first_impression\`:
- \`statement\`: compressed diagnostic of first impression issues
- \`summary\`: current state description

## 🔗 CENTRALIZED RULES
Refer to Base Instructions for Statement rules and score ceiling (max 89).
Return ONLY the JSON.`;
