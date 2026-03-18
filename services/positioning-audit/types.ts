export interface PositioningAuditResult {
  url: string;
  overallScore: number;
  categoryOwnership: CategoryOwnershipResult;
  uniqueValueProposition: UniqueValuePropositionResult;
  competitiveDifferentiation: CompetitiveDifferentiationResult;
  targetAudienceClarity: TargetAudienceClarityResult;
  problemSolutionFit: ProblemSolutionFitResult;
  messagingConsistency: MessagingConsistencyResult;
  timestamp: Date;
}

export interface CategoryOwnershipResult {
  score: number;
  maxScore: number;
  categoryDefinition: string;
  ownedKeywords: string[];
  missingKeywords: string[];
  categoryLeaders: string[];
  recommendations: string[];
}

export interface UniqueValuePropositionResult {
  score: number;
  maxScore: number;
  identifiedUVP: string;
  uvpClarity: "clear" | "somewhat clear" | "unclear";
  uniquenessLevel: "highly unique" | "moderately unique" | "not unique";
  supportingEvidence: string[];
  recommendations: string[];
}

export interface CompetitiveDifferentiationResult {
  score: number;
  maxScore: number;
  identifiedCompetitors: string[];
  differentiationFactors: string[];
  weakPoints: string[];
  recommendations: string[];
}

export interface TargetAudienceClarityResult {
  score: number;
  maxScore: number;
  identifiedAudiences: string[];
  audienceSpecificity: "very specific" | "somewhat specific" | "vague";
  personaDepth: "detailed" | "basic" | "missing";
  recommendations: string[];
}

export interface ProblemSolutionFitResult {
  score: number;
  maxScore: number;
  identifiedProblems: string[];
  solutionClarity: string;
  fitQuality: "strong" | "moderate" | "weak";
  recommendations: string[];
}

export interface MessagingConsistencyResult {
  score: number;
  maxScore: number;
  toneConsistency: "consistent" | "somewhat consistent" | "inconsistent";
  valuePropConsistency: "consistent" | "somewhat consistent" | "inconsistent";
  channelAlignment: string[];
  recommendations: string[];
}

export interface PositioningAuditOptions {
  url: string;
  timeout?: number;
}
