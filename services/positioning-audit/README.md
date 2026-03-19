# Startup Positioning Audit Service

A comprehensive AI-powered service that analyzes a startup's website to evaluate their positioning across six critical dimensions.

## Overview

The Positioning Audit service uses OpenAI's GPT-4o-mini to analyze website content and provide actionable insights on:

1. **Category Ownership** - How well the startup defines and owns their market category
2. **Unique Value Proposition** - Clarity and uniqueness of the value proposition
3. **Competitive Differentiation** - How well the startup differentiates from competitors
4. **Target Audience Clarity** - Specificity and depth of target audience definition
5. **Problem-Solution Fit** - Quality of fit between problem and solution
6. **Messaging Consistency** - Consistency of messaging across content

## Quick Start

### Using the Service

```typescript
import { runStandalonePositioningAudit } from "@/services/positioning-audit/positioning-audit-standalone";

const result = await runStandalonePositioningAudit({
  url: "https://example.com",
  timeout: 30000,
});

console.log(`Overall Score: ${result.overallScore}/100`);
console.log(`Category: ${result.categoryOwnership.categoryDefinition}`);
console.log(`UVP: ${result.uniqueValueProposition.identifiedUVP}`);
```

### API Endpoint

```bash
curl -X POST http://localhost:3000/api/positioning-audit \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

## Architecture

```
services/positioning-audit/
├── index.ts                          # Main exports
├── types.ts                          # TypeScript type definitions
├── positioning-audit.ts              # Core audit logic
├── positioning-audit-standalone.ts   # Standalone runner with error handling
└── README.md                         # This file

app/api/positioning-audit/
└── route.ts                          # Next.js API route handler
```

## Type Definitions

### PositioningAuditResult

```typescript
interface PositioningAuditResult {
  url: string;
  overallScore: number;              // 0-100
  categoryOwnership: CategoryOwnershipResult;
  uniqueValueProposition: UniqueValuePropositionResult;
  competitiveDifferentiation: CompetitiveDifferentiationResult;
  targetAudienceClarity: TargetAudienceClarityResult;
  problemSolutionFit: ProblemSolutionFitResult;
  messagingConsistency: MessagingConsistencyResult;
  timestamp: Date;
}
```

### CategoryOwnershipResult

```typescript
interface CategoryOwnershipResult {
  score: number;                     // 0-100
  maxScore: number;                  // 100
  categoryDefinition: string;        // What category they're trying to own
  ownedKeywords: string[];           // Keywords they successfully own
  missingKeywords: string[];         // Keywords they should own
  categoryLeaders: string[];         // Main competitors
  recommendations: string[];         // Actionable recommendations
}
```

### UniqueValuePropositionResult

```typescript
interface UniqueValuePropositionResult {
  score: number;                     // 0-100
  maxScore: number;                  // 100
  identifiedUVP: string;             // Clear UVP statement
  uvpClarity: "clear" | "somewhat clear" | "unclear";
  uniquenessLevel: "highly unique" | "moderately unique" | "not unique";
  supportingEvidence: string[];      // Evidence from website
  recommendations: string[];
}
```

### CompetitiveDifferentiationResult

```typescript
interface CompetitiveDifferentiationResult {
  score: number;                     // 0-100
  maxScore: number;                  // 100
  identifiedCompetitors: string[];
  differentiationFactors: string[];
  weakPoints: string[];
  recommendations: string[];
}
```

### TargetAudienceClarityResult

```typescript
interface TargetAudienceClarityResult {
  score: number;                     // 0-100
  maxScore: number;                  // 100
  identifiedAudiences: string[];
  audienceSpecificity: "very specific" | "somewhat specific" | "vague";
  personaDepth: "detailed" | "basic" | "missing";
  recommendations: string[];
}
```

### ProblemSolutionFitResult

```typescript
interface ProblemSolutionFitResult {
  score: number;                     // 0-100
  maxScore: number;                  // 100
  identifiedProblems: string[];
  solutionClarity: string;
  fitQuality: "strong" | "moderate" | "weak";
  recommendations: string[];
}
```

### MessagingConsistencyResult

```typescript
interface MessagingConsistencyResult {
  score: number;                     // 0-100
  maxScore: number;                  // 100
  toneConsistency: "consistent" | "somewhat consistent" | "inconsistent";
  valuePropConsistency: "consistent" | "somewhat consistent" | "inconsistent";
  channelAlignment: string[];
  recommendations: string[];
}
```

## Usage Examples

### Basic Usage

```typescript
import { runStandalonePositioningAudit } from "@/services/positioning-audit";

async function auditStartup() {
  const result = await runStandalonePositioningAudit({
    url: "https://mystartup.com",
  });

  console.log(`Overall Score: ${result.overallScore}/100`);
  
  // Category Ownership
  console.log("Category:", result.categoryOwnership.categoryDefinition);
  console.log("Owned Keywords:", result.categoryOwnership.ownedKeywords);
  
  // UVP
  console.log("UVP:", result.uniqueValueProposition.identifiedUVP);
  console.log("UVP Clarity:", result.uniqueValueProposition.uvpClarity);
  
  // Recommendations
  console.log("Category Recommendations:", result.categoryOwnership.recommendations);
  console.log("UVP Recommendations:", result.uniqueValueProposition.recommendations);
}
```

### Using with API Route

```typescript
// In a Next.js API route or server component
const response = await fetch("/api/positioning-audit", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url: "https://example.com" }),
});

const result = await response.json();
```

### Error Handling

```typescript
try {
  const result = await runStandalonePositioningAudit({
    url: "https://example.com",
    timeout: 30000,
  });
  
  if (result.overallScore < 50) {
    console.log("Positioning needs improvement");
  }
} catch (error) {
  console.error("Audit failed:", error);
}
```

## Scoring

Each dimension is scored from 0-100 based on:

- **Category Ownership**: Clarity of category definition, keyword ownership, market positioning
- **UVP**: Clarity, uniqueness, supporting evidence
- **Competitive Differentiation**: Number of differentiation factors, weak points, defensibility
- **Target Audience Clarity**: Specificity, persona depth, niche focus
- **Problem-Solution Fit**: Problem clarity, solution clarity, fit quality
- **Messaging Consistency**: Tone consistency, value prop consistency, channel alignment

The overall score is a percentage of total points across all dimensions.

## Requirements

- OpenAI API key configured in environment variables (`OPENAI_API_KEY`)
- Website must be publicly accessible
- Website content must be parseable HTML

## Performance

- Typical audit time: 10-20 seconds
- Token usage: ~2000-4000 tokens per audit
- Model: GPT-4o-mini (cost-effective)

## Best Practices

1. **Use meaningful URLs** - Audit the homepage or key landing pages
2. **Review all dimensions** - Each dimension provides unique insights
3. **Focus on recommendations** - Actionable insights are more valuable than scores
4. **Compare over time** - Run audits periodically to track positioning improvements
5. **Benchmark competitors** - Audit competitor websites for comparison

## Limitations

- Requires website to be publicly accessible
- Analysis is based on visible content only
- May not capture nuanced industry context
- AI analysis may have occasional inaccuracies

## Related Services

- [AEO Audit](../aeo-audit/README.md) - AI Engine Optimization audit
- [Website Content Fetcher](../getWebsiteContent.ts) - Website content extraction
