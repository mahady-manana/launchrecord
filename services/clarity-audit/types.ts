export interface ClarityAuditResult {
  score: number;
  band: "instant" | "clear" | "average" | "confusing" | "opaque";
  executiveSummary: string; // 2-3 sentence brutal summary

  // Core Metrics (0-100 each)
  metrics: {
    headlineClarity: {
      score: number;
      verdict: string; // One sentence verdict
      currentHeadline?: string;
      problem: string;
      suggestedHeadline: string;
      why: string;
    };
    valueProposition: {
      score: number;
      verdict: string;
      currentValueProp?: string;
      problem: string;
      suggestedValueProp: string;
      why: string;
    };
    visualHierarchy: {
      score: number;
      verdict: string;
      problem: string;
      specificIssue: string;
      fix: string;
    };
    benefitClarity: {
      score: number;
      verdict: string;
      problem: string;
      missingBenefits: string[];
      suggestedBenefits: string[];
    };
    ctaClarity: {
      score: number;
      verdict: string;
      currentCTA?: string;
      problem: string;
      suggestedCTA: string;
      placement: string;
    };
    proofElements: {
      score: number;
      verdict: string;
      foundProof: string[];
      missingProof: string[];
      suggestedProof: string[];
    };
  };

  // 5-Second Test Results
  fiveSecondTest: {
    passes: boolean;
    estimatedTimeToUnderstand: number; // seconds
    firstImpression: string; // What a visitor would think in first 5 seconds
    confusionPoints: string[];
    clarityWins: string[];
  };

  // Detailed Findings
  findings: {
    critical: Array<{
      issue: string;
      location: string;
      impact: string;
      evidence: string;
    }>;
    warnings: Array<{
      issue: string;
      location: string;
      impact: string;
      evidence: string;
    }>;
    positives: Array<{
      strength: string;
      location: string;
      why: string;
    }>;
  };

  // Actionable Recommendations (prioritized)
  recommendations: Array<{
    priority: "critical" | "high" | "medium" | "low";
    category: "headline" | "messaging" | "design" | "cta" | "proof" | "content";
    action: string;
    why: string;
    before: string;
    after: string;
    implementation: {
      steps: string[];
      effort: "low" | "medium" | "high";
      expectedImpact: string;
    };
    example: string;
  }>;

  // Competitive Context
  competitiveContext: {
    clarityVsCompetitors: "behind" | "average" | "ahead";
    industryStandardClarity: number;
    yourClarity: number;
    gap: string;
  };
}

export interface ClarityReport {
  _id: string;
  productId: string;
  url: string;
  score: number;
  band: "instant" | "clear" | "average" | "confusing" | "opaque";
  executiveSummary: string;
  metrics: ClarityAuditResult["metrics"];
  fiveSecondTest: ClarityAuditResult["fiveSecondTest"];
  findings: ClarityAuditResult["findings"];
  recommendations: ClarityAuditResult["recommendations"];
  competitiveContext: ClarityAuditResult["competitiveContext"];
  metadata?: {
    auditDuration?: number;
    tokenUsage?: number;
    modelUsed?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ClarityAuditOptions {
  url: string;
  timeout?: number;
}
