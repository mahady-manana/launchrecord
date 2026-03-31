# SIO-V5 Report Schema Documentation

## Overview

The SIO-V5 Report Schema is a **problem-first, action-oriented** framework for auditing startup positioning, clarity, and AI visibility. Unlike traditional scoring systems that just give numbers, every section provides:

- **Current state** - What they currently say/have
- **Comments** - Specific issues pointed out
- **Suggested fixes** - Exactly what to change it to

---

## Core Principles

1. **No vague scores** - Every score comes with explanation
2. **Direct problem statements** - Call out issues explicitly
3. **Actionable fixes** - Show current → suggested transformation
4. **Sentence-level analysis** - Point out unclear text and provide rewrites

---

## Report Structure

```
SIOV5Report
├── score (0-100)
├── statement (overall assessment)
├── websiteSummary (what they claim + audit comments)
├── firstImpression (hero section analysis)
├── positioning (6 sub-metrics with current/suggested)
├── clarity (6 sub-metrics + unclear sentence analysis)
└── aeo (simplified free audit)
```

---

## Section 1: Website Summary

**Purpose:** Capture what the startup claims vs. what the audit reveals.

### Structure

```typescript
{
  summary: string;              // 1-2 sentence tagline from homepage
  summaryComment?: string;      // Comment on the summary
  problems: { currents[], comments[] }
  outcomes: { currents[], comments[] }
  solutions: { currents[], comments[] }
  features: { currents[], comments[] }
  isPositioningClear: boolean
  isMessagingClear: boolean
  areUsersLeftGuessing: boolean
}
```

### What It Shows

| Field | Description |
|-------|-------------|
| `summary` | Their tagline/one-liner |
| `currents[]` | List of what they claim (problems, outcomes, etc.) |
| `comments[]` | Audit observations pointing out vagueness, lack of metrics, etc. |
| 3 boolean flags | Quick positioning/messaging clarity check |

### Example

```json
{
  "summary": "StandupAI helps teams reduce meeting time.",
  "summaryComment": "Generic tagline without specific ICP or quantified outcome",
  "problems": {
    "currents": ["Teams waste time in meetings"],
    "comments": ["Vague - no specific time/cost metrics"]
  }
}
```

---

## Section 2: First Impression (Hero Section)

**Purpose:** Analyze the hero section - 80% of visitors never scroll past this.

### Structure

```typescript
{
  score: number;
  statement: string;
  overallComment: string;       // Strategic guidance
  headline: { current, comment, suggested }
  subheadline: { current, comment, suggested }
  cta: { current, comment, suggested }
}
```

### What It Shows

| Element | Current | Comment | Suggested |
|---------|---------|---------|-----------|
| Headline | What they have | Why it fails | Exact rewrite |
| Subheadline | What they have | Why it fails | Exact rewrite |
| CTA | What they have | Why it fails | Exact rewrite |

### Example

```json
{
  "headline": {
    "current": "StandupAI - The Future of Work",
    "comment": "Leads with brand name - visitors don't know what you do",
    "suggested": "Tired of endless standups? We help engineering managers save 10 hours/week"
  }
}
```

---

## Section 3: Positioning Report

**Purpose:** Analyze market positioning across 6 key dimensions.

### Structure

```typescript
{
  score: number;
  statement: string;
  summary: { current, comments[], suggested }
  subMetrics: {
    categoryOwnership: PositioningSubMetric
    uniqueValueProp: PositioningSubMetric
    competitiveDiff: PositioningSubMetric
    targetAudience: PositioningSubMetric
    problemSolutionFit: PositioningSubMetric
    messagingConsistency: PositioningSubMetric
  }
}
```

### Each Sub-Metric Contains

```typescript
{
  name: string;
  score: number;
  current: string;        // What they currently say
  comments: string[];     // Issues pointed out
  suggested: string;      // Exact rewrite
}
```

### The 6 Dimensions

| Dimension | What It Checks |
|-----------|----------------|
| **Category Ownership** | Do they own a specific category or compete in broad market? |
| **Unique Value Prop** | Quantified outcomes vs feature lists |
| **Competitive Diff** | Explicit competitor contrasts or vague "better than" |
| **Target Audience** | Specific ICP (role, size, industry) or "teams" |
| **Problem-Solution Fit** | Explicit problem stated or implied |
| **Messaging Consistency** | Same narrative across all pages |

---

## Section 4: Clarity Report

**Purpose:** Analyze message clarity with **sentence-level** analysis.

### Structure

```typescript
{
  score: number;
  statement: string;
  summary: { current, comments[], suggested }
  unclearSentences: [         // Site-wide unclear text
    { text, issue, fix }
  ]
  subMetrics: {
    headlineClarity: ClaritySubMetric
    valueProposition: ClaritySubMetric
    featureBenefitMapping: ClaritySubMetric
    visualHierarchy: ClaritySubMetric
    ctaClarity: ClaritySubMetric
    proofPlacement: ClaritySubMetric
  }
}
```

### Key Differentiator: `unclearTexts[]`

Every sub-metric AND the overall report contains specific unclear sentences:

```typescript
{
  text: "Streamline your workflow with our innovative platform",
  issue: "Generic jargon - 'streamline', 'innovative' could apply to any SaaS",
  fix: "Save 10 hours/week on status meetings with automated async standups"
}
```

### The 6 Dimensions

| Dimension | What It Checks |
|-----------|----------------|
| **Headline Clarity** | 5-second comprehension test |
| **Value Proposition** | Quantified outcomes vs vague benefits |
| **Feature-Benefit Mapping** | Features linked to outcomes or standalone |
| **Visual Hierarchy** | Problem/outcome before product visuals |
| **CTA Clarity** | Specific action + expectation setting |
| **Proof Placement** | Social proof before or alongside CTAs |

---

## Section 5: AEO Report (Simplified - Free Audit)

**Purpose:** Basic AI visibility check - kept simple for free audits.

### Structure

```typescript
{
  score: number;
  statement: string;
  aiPresence: {
    isPresent: boolean;       // Yes/No
    engines: string[];        // ["ChatGPT", "Claude", ...]
    comment: string;          // Brief explanation
  }
  recommendations: string[];  // 3 basic recommendations
}
```

### What It Shows

| Field | Description |
|-------|-------------|
| `isPresent` | Binary: mentioned in AI responses or not |
| `engines` | Which engines mention the brand |
| `comment` | Context about their AI visibility |
| `recommendations` | 3 high-level fixes |

### Why Simplified?

- **Free audit** - No need for deep analysis
- **Low resource cost** - Simple presence check
- **Upsell opportunity** - "Unlock full AEO report" for detailed analysis

---

## Visual Design Patterns

### Color Coding

| Color | Meaning |
|-------|---------|
| **Red** | Current state (what's wrong) |
| **Orange** | Comments/issues (⚠ warnings) |
| **Green** | Suggested fixes (what to change to) |
| **Blue** | Strategic guidance (overall comments) |

### Card Layout

```
┌─────────────────────────────────────┐
│ Dimension Name            Score     │
├─────────────────────────────────────┤
│ Current: [red, struck-through]      │
│ ⚠ Comment 1                         │
│ ⚠ Comment 2                         │
│ Suggested: [green, bold]            │
└─────────────────────────────────────┘
```

### Unclear Sentence Format

```
┌─────────────────────────────────────┐
│ "Streamline your workflow"          │ ← Orange, struck-through
│ ⚠ Generic jargon                    │
│ → Save 10 hours/week on...          │ ← Green, bold
└─────────────────────────────────────┘
```

---

## Scoring System

### Score Bands

| Score | Band | Meaning |
|-------|------|---------|
| 90-100 | Dominant | You own the category |
| 70-89 | Strong | Clear differentiation |
| 50-69 | Blended | Understandable but not distinctive |
| 30-49 | Weak | Unclear positioning |
| 0-29 | Ghost | Invisible to market |

### How Scores Are Calculated

Each sub-metric is scored 0-100 based on:
- **Specificity** - Are numbers/metrics provided?
- **Clarity** - Can visitors understand in 5 seconds?
- **Differentiation** - Could this apply to competitors?
- **Completeness** - Are all key elements present?

Overall score = weighted average of sub-metrics

---

## How To Use This Schema

### 1. Audit Website Content

Extract from homepage + key pages:
- Tagline/summary
- Problem statements
- Outcome claims
- Solution descriptions
- Feature lists
- Hero section elements (headline, subhead, CTA, visual)

### 2. Generate Comments

For each element, identify:
- Vague language (no metrics)
- Generic jargon ("streamline", "innovative")
- Missing ICP specification
- Feature-first vs outcome-first ordering
- Inconsistent messaging across pages

### 3. Write Suggested Fixes

For every issue, provide:
- **Exact rewrite** - Not "improve headline" but the actual new headline
- **Specific metrics** - Add numbers where missing
- **ICP specification** - Add role/company size/industry
- **Problem-first ordering** - Restructure to lead with pain point

### 4. Calculate Scores

Score each sub-metric 0-100, then calculate overall as weighted average.

---

## Example: Full Flow

### Input (Website Content)

```
Headline: "StandupAI - The Future of Work"
Subhead: "Streamline your team's workflow with our innovative platform"
CTA: "Get Started"
```

### Output (Report Section)

```json
{
  "headline": {
    "current": "StandupAI - The Future of Work",
    "comment": "Leads with brand name - visitors don't know what you do",
    "suggested": "Tired of endless standups? We help engineering managers save 10 hours/week"
  },
  "score": 35
}
```

---

## Files Reference

| File | Purpose |
|------|---------|
| `sio-v5-report-schema.ts` | TypeScript interfaces |
| `mock-data.ts` | Example report data |
| `*-Card.tsx` | UI components for each section |
| `sovereignty-assessment-questions.ts` | 20 audit questions (5 per category) |

---

## Next Steps

1. **Implement analysis logic** - Website content → report generation
2. **Build scoring algorithms** - Automated score calculation
3. **Create UI dashboard** - Full report visualization
4. **Add Momentum & Founder Proof** - Same structure as Positioning
5. **Build assessment flow** - Questions → auto-generated report
