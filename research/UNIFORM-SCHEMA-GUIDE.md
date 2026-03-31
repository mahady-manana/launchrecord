# SIO-V5 Uniform Schema Principle

## One Rule: Everything Uses the Same Structure

### Core Schema

```typescript
// Every section, every pillar, every metric uses this:
interface ReportSection {
  score: number;      // 0-100
  statement: string;  // Direct problem statement (2-3 sentences)
  actions: Action[];  // 3-5 actions
}

// Every action uses this:
interface Action {
  problem: string;    // Specific, observable problem
  solution: string;   // Actionable, specific solution
  priority: number;   // 0-100 (higher = more important)
}
```

---

## Applied Everywhere

### Overall Report
```typescript
{
  score: 58,
  statement: "Your startup is stuck in the 'Blended' zone—visitors understand what you do after 8-10 seconds, but you're not distinctive enough to be memorable.",
  actions: [
    { 
      problem: "Your headline is generic and could apply to 100+ companies.",
      solution: "Rewrite to lead with specific problem and outcome.",
      priority: 95
    }
  ]
}
```

### Positioning Pillar
```typescript
positioning: {
  score: 52,
  statement: "Your positioning is understandable but not distinctive. You're using the same generic language as 80% of competitors.",
  actions: [
    {
      problem: "Category definition is too broad. You're competing against billion-dollar incumbents without a defensible niche.",
      solution: "Define subcategory: 'Async standup automation for remote engineering teams'.",
      priority: 90
    }
  ]
}
```

### Clarity Pillar
```typescript
clarity: {
  score: 48,
  statement: "Visitors need 8-10 seconds to understand what you offer—3x longer than high-converting sites.",
  actions: [
    {
      problem: "Headline tells visitors nothing about what you actually do.",
      solution: "Lead with problem + outcome: 'Tired of endless status meetings? We automate standups so engineering teams save 10 hours/week.'",
      priority: 95
    }
  ]
}
```

### AEO Pillar
```typescript
aeo: {
  score: 35,
  statement: "Your startup has low visibility in AI-generated responses. ChatGPT, Claude, and Gemini don't mention you.",
  actions: [
    {
      problem: "Your brand appears in 0 out of 4 major AI engines when queried about your category.",
      solution: "Create definitive category content, implement schema markup, and build topical authority.",
      priority: 85
    }
  ]
}
```

---

## No Exceptions

**OLD (Complex):**
```typescript
// Different structure for every pillar
positioning: {
  score: 52,
  statement: "...",
  actions: [...],
  categoryOwnership: { score, statement, actions, criteria: {...} },  // Different!
  uniqueValueProp: { score, statement, actions, criteria: {...} },    // Different!
  // ...more nested structures
}
```

**NEW (Simple):**
```typescript
// Same structure everywhere
positioning: {
  score: 52,
  statement: "...",
  actions: [...]
}

// If you need sub-metrics, they use the SAME structure
positioningCategoryOwnership: {
  score: 45,
  statement: "...",
  actions: [...]
}
```

---

## Why This Works

### 1. **Easy to Understand**
- One pattern to learn
- Predictable structure
- No nested complexity

### 2. **Easy to Implement**
- One component renders all sections
- Same validation everywhere
- Simple data flow

### 3. **Easy to Extend**
- Add new pillar? Use same structure
- Add new metric? Use same structure
- No schema changes needed

### 4. **Easy to Parse**
```typescript
// Same code works for every section
function renderSection(section: ReportSection) {
  return (
    <div>
      <Score value={section.score} />
      <Statement text={section.statement} />
      <Actions list={section.actions} />
    </div>
  );
}

// Works for:
// - Overall report
// - Positioning
// - Clarity
// - AEO
// - Momentum
// - Founder Proof
// - Any sub-metric
```

---

## Action Priority Guide

| Priority | Meaning | When to Use |
|----------|---------|-------------|
| 90-100 | Critical | Must fix immediately. Blocking conversion/visibility. |
| 75-89 | High | Major impact. Fix in next sprint. |
| 50-74 | Medium | Moderate impact. Add to backlog. |
| 0-49 | Low | Nice to have. Fix when time allows. |

---

## Action Writing Guide

### Problem Statement
**Do:**
- Be specific: "Headline uses generic SaaS language"
- Be observable: "Zero visitors could articulate value in 5-second test"
- Include impact: "Blends with 20+ competitors"

**Don't:**
- Be vague: "Positioning needs work"
- Be abstract: "Low clarity score"
- Blame: "You failed at messaging"

### Solution Statement
**Do:**
- Be actionable: "Rewrite headline to lead with problem"
- Be specific: "Use formula: 'Tired of [pain]? We help [ICP] achieve [outcome]'"
- Include example: "'Tired of endless standups? We automate them.'"

**Don't:**
- Be vague: "Improve headline"
- Be abstract: "Enhance value communication"
- Multiple steps: "Research competitors, then write, then test"

### Priority Score
**Do:**
- Base on impact: "Expected 40% conversion improvement = 90+ priority"
- Consider effort: "1 hour work, high impact = higher priority"
- Compare to competitors: "They all do this well = higher priority"

**Don't:**
- Random numbers: "Seems like a 75"
- All same priority: "Everything is 80"
- Personal bias: "I like headlines, so 95"

---

## Example: Full Report Structure

```
SIOV5Report
├── score: 58
├── statement: "..."
├── actions: [Action, Action, Action, Action, Action]
├── positioning: ReportSection
│   ├── score: 52
│   ├── statement: "..."
│   └── actions: [Action, Action, Action]
├── clarity: ReportSection
│   ├── score: 48
│   ├── statement: "..."
│   └── actions: [Action, Action, Action]
├── aeo: ReportSection
│   ├── score: 35
│   ├── statement: "..."
│   └── actions: [Action, Action, Action]
├── momentum?: ReportSection (optional)
└── founderProof?: ReportSection (optional)
```

**Total fields to implement:**
- `ReportSection`: 3 fields (score, statement, actions)
- `Action`: 3 fields (problem, solution, priority)
- `SIOV5Report`: 8 fields (score, statement, actions, 3 pillars, 2 optional, metadata)

**That's it. No nested criteria. No sub-metrics. Just score → statement → actions.**

---

## Migration from Old Schema

If you have existing complex schema:

```typescript
// OLD
positioning: {
  score: 52,
  categoryOwnership: {
    score: 45,
    criteria: { categoryDefinition: 40, ... },
    actions: [...]
  }
}

// NEW - Flatten it
positioning: {
  score: 52,
  statement: "...",
  actions: [
    // Include category ownership actions here
    { problem: "Category too broad...", solution: "...", priority: 90 },
    { problem: "No distinctive language...", solution: "...", priority: 85 }
  ]
}
```

**Rule: If it was a sub-metric, its actions go into the parent's actions array with appropriate priority.**
