export interface ClarityAuditResult {
  score: number;
  band: "instant" | "clear" | "average" | "confusing" | "opaque";
  critique: string;
  metrics: {
    headlineClarity: number;
    visualFlow: number;
    valueHierarchy: number;
    benefitClarity: number;
    ctaClarity: number;
    proofPlacement: number;
  };
  findings: string[];
  recommendations: Array<{
    action: string;
    priority: number;
  }>;
  fiveSecondTest: {
    passes: boolean;
    timeToUnderstand: number;
    frictionPoints: string[];
  };
}

export interface ClarityReport {
  _id: string;
  productId: string;
  url: string;
  score: number;
  band: "instant" | "clear" | "average" | "confusing" | "opaque";
  critique: string;
  metrics: {
    headlineClarity: number;
    visualFlow: number;
    valueHierarchy: number;
    benefitClarity: number;
    ctaClarity: number;
    proofPlacement: number;
  };
  findings: string[];
  recommendations: Array<{
    action: string;
    priority: number;
  }>;
  fiveSecondTest: {
    passes: boolean;
    timeToUnderstand: number;
    frictionPoints: string[];
  };
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
