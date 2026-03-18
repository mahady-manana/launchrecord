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
  categoryOwnershipLevel: "Dominant" | "Strong" | "Blended" | "Weak" | "Ghost";
  recommendations: string[];
}

export interface UniqueValuePropositionResult {
  score: number;
  maxScore: number;
  identifiedUVP: string;
  uvpClarity: "Exceptional" | "Clear" | "Moderate" | "Unclear" | "Absent";
  uniquenessLevel:
    | "Highly Unique"
    | "Distinctive"
    | "Moderate"
    | "Generic"
    | "Common";
  supportingEvidence: string[];
  recommendations: string[];
}

export interface CompetitiveDifferentiationResult {
  score: number;
  maxScore: number;
  identifiedCompetitors: string[];
  differentiationFactors: string[];
  weakPoints: string[];
  differentiationStrength:
    | "Dominant"
    | "Strong"
    | "Moderate"
    | "Weak"
    | "Absent";
  recommendations: string[];
}

export interface TargetAudienceClarityResult {
  score: number;
  maxScore: number;
  identifiedAudiences: string[];
  audienceSpecificity:
    | "Laser-Focused"
    | "Specific"
    | "Moderate"
    | "Vague"
    | "Undefined";
  personaDepth: "Comprehensive" | "Detailed" | "Basic" | "Minimal" | "Missing";
  recommendations: string[];
}

export interface ProblemSolutionFitResult {
  score: number;
  maxScore: number;
  identifiedProblems: string[];
  solutionClarity: string;
  fitQuality: "Exceptional" | "Strong" | "Moderate" | "Weak" | "Poor";
  recommendations: string[];
}

export interface MessagingConsistencyResult {
  score: number;
  maxScore: number;
  toneConsistency:
    | "Exceptional"
    | "Consistent"
    | "Moderate"
    | "Inconsistent"
    | "Chaotic";
  valuePropConsistency:
    | "Exceptional"
    | "Consistent"
    | "Moderate"
    | "Inconsistent"
    | "Contradictory";
  channelAlignment: string[];
  recommendations: string[];
}

export interface PositioningAuditOptions {
  url: string;
  timeout?: number;
}
