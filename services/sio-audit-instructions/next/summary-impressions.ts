export const summaryImpressionInstruction = `
## ⚙️ SIO-V5 — ISSUE + SUMMARY GENERATION STEP

You are executing a core intelligence step in the SIO-V5 pipeline.

Your responsibilities are:

1. ISSUE GENERATION (PRIMARY TASK)
2. DERIVED SUMMARY INTELLIGENCE

You MUST NOT re-explain system rules or global architecture.

---

## 🧩 STEP 1 — ISSUE GENERATION

From the provided website content, generate structured ISSUES.

Each issue represents:
- a conversion friction point
- a messaging breakdown
- a positioning weakness
- or an AEO gap

Each issue MUST include:

- category (positioning | clarity | first_impression | aeo)
- metricKey (from allowed taxonomy only)
- severity (critical | medium | low)
- statement (diagnostic impact explanation)
- explanation (why it affects conversion)
- current (optional extracted text)
- recommendations (what must change)
- fixes (optional exact, precise improvements)
- impactScore (-1 to -25)

Rules:
- ONLY use observable content. NEVER create issues related to word spacing artifacts (e.g., 'FORYOUR') or parsing errors.
- DO NOT invent missing context
- DO NOT create new categories or metricKeys

---

## 📊 STEP 2 — FIRST IMPRESSION (DERIVED)

Generate ONE sentence only.

It MUST:
- summarize overall conversion state
- reflect dominant issue severity
- reflect clarity and positioning strength

Rules:
- must be derived ONLY from issues
- no new analysis allowed
- no fixes or recommendations

---

## 🧠 STEP 3 — CATEGORY SUMMARIES (DERIVED)

For each category:
- positioning
- clarity
- first_impression
- aeo

Generate:

- statement (compressed diagnostic from issues)
- summary (optional simplified explanation)

Rules:
- strictly derived from issues only
- no new insights allowed

---

## 🧾 STEP 4 — WEBSITE SUMMARY (DERIVED COMPRESSION)

Generate a high-level structured summary:

- overview: global diagnostic of the website
- keyProblems: top 3–5 conversion blockers
- keyStrengths: top 3–5 strongest elements

Rules:
- MUST be derived ONLY from issues
- MUST NOT introduce new analysis
- MUST NOT contradict issue layer

---

## 🚫 STRICT RULES

You MUST NOT:
- re-analyze raw HTML multiple times
- create issues outside observable signals
- introduce external assumptions
- generate insights not grounded in issues
- contradict issue data

---

## 🔥 CORE PRINCIPLE

Issues are the source of truth.

Everything else (first impression, summaries, website summary) is a structured compression of issues.
`;
