/**
 * SIO-V5 Report Schema - Uniform with Examples & Categories
 *
 * CORE PRINCIPLE: One schema fits all, with examples and categorization
 * - Every report has: score, statement, actions (grouped by category)
 * - Every action has: problem, solution, example, priority
 * - Every sub-metric has: score, statement, actions
 */

// ============================================================================
// CORE INTERFACES
// ============================================================================

/**
 * Action Item - Used in EVERY section with concrete examples
 */
export interface Action {
  /** Specific, observable problem */
  problem: string;
  /** Actionable, specific solution */
  solution: string;
  /** Concrete example of the solution implemented */
  example: string;
  /** Priority score 0-100 (higher = more important) */
  priority: number;
}

/**
 * Website Summary Section with comments
 * Lists what they currently have + comments pointing out issues
 */
export interface SummarySection {
  /** Current items from website */
  currents: string[];
  /** Positive comments/observations about current items */
  positiveComments: string[];
  /** Negative comments pointing out problems (no fixes, just observations) */
  negativeComments: string[];
}

/**
 * Website Summary - Extracted from startup's website content
 * This captures what they SAY they do vs. what the audit reveals
 */
export interface WebsiteSummary {
  /** 1-2 sentence summary written based on website content */
  summary: string;
  /** Comment on the summary */
  summaryComment?: string;

  /** Problems they claim to solve */
  problems: SummarySection;

  /** Outcomes they promise */
  outcomes: SummarySection;

  /** Solutions they offer */
  solutions: SummarySection;

  /** Features they highlight */
  features: SummarySection;

  /** Is positioning clear? (true = clear, false = unclear) */
  isPositioningClear: boolean;

  /** Is messaging clear? (true = clear, false = unclear) */
  isMessagingClear: boolean;

  /** Are users left guessing? (true = yes/guessing, false = no/clear) */
  areUsersLeftGuessing: boolean;
}

/**
 * First Impression (Hero Section) Report
 * Analyzes the hero section - the most critical conversion factor
 * 80% of visitors never scroll past this point
 */
export interface FirstImpressionReport {
  /** Overall hero section score 0-100 */
  score: number;

  /** Overall assessment (2-3 sentences) */
  statement: string;

  /** Overall positive comments about the hero section */
  overallCommentPositive: string[];

  /** Overall negative comments about the hero section */
  overallCommentNegative: string[];

  /** Headline analysis */
  headline: {
    statement: string;
    current: string;
    positiveComments: string[];
    negativeComments: string[];
    recommendation: string[];
    suggested: string[];
  };

  /** Subheadline analysis */
  subheadline: {
    statement: string;
    current: string;
    positiveComments: string[];
    negativeComments: string[];
    recommendation: string[];
    suggested: string[];
  };

  /** CTA analysis */
  cta: {
    statement: string;
    current: string;
    positiveComments: string[];
    negativeComments: string[];
    recommendation: string[];
    suggested: string[];
  };
}

/**
 * Positioning Section Summary
 * Overall positioning analysis with current state, comments, and fixes
 */
export interface PositioningSummary {
  /** Current positioning statement from website */
  current: string;
  /** Positive comments about positioning */
  positiveComments: string[];
  /** Negative comments pointing out positioning issues */
  negativeComments: string[];
  /** Suggested positioning statements */
  suggested: string[];
}

/**
 * Positioning Sub-Metric Analysis
 * Each sub-metric (Category Ownership, UVP, etc.) with current, comments, fixes
 */
export interface PositioningSubMetric {
  /** Diagnostic statement about this sub-metric */
  statement: string;
  /** Score 0-100 */
  score: number;
  /** Current state for this sub-metric */
  current: string;
  /** Positive comments about this sub-metric */
  positiveComments: string[];
  /** Negative comments pointing out issues */
  negativeComments: string[];
  /** Structural recommendations for this sub-metric */
  recommendation: string[];
  /** Suggested fixes */
  suggested: string[];
}

/**
 * Positioning Report
 * Analyzes market positioning across 6 key dimensions
 */
export interface PositioningReport {
  /** Overall positioning score 0-100 */
  score: number;

  /** Overall assessment (2-3 sentences) */
  statement: string;

  /** Overall positive comments about positioning */
  overallCommentPositive: string[];

  /** Overall negative comments about positioning */
  overallCommentNegative: string[];

  /** Overall positioning summary */
  summary: PositioningSummary;

  /** Sub-metrics analysis */
  subMetrics: {
    categoryOwnership: PositioningSubMetric;
    uniqueValueProp: PositioningSubMetric;
    competitiveDiff: PositioningSubMetric;
    targetAudience: PositioningSubMetric;
    problemSolutionFit: PositioningSubMetric;
    messagingConsistency: PositioningSubMetric;
  };
}

// ============================================================================
// MAIN REPORT
// ============================================================================

export interface SIOV5Report {
  /** Overall score 0-100 */
  score: number;
  /** Overall score 0-100 */
  overallScore: number;
  /** Overall assessment (2-3 sentences) */
  statement: string;

  /** Overall positive comments about the startup */
  overallCommentPositive: string[];

  /** Overall negative comments about the startup */
  overallCommentNegative: string[];

  /** Website Summary - What they claim vs. reality with comments */
  websiteSummary: WebsiteSummary;

  /** First Impression (Hero Section) Report */
  firstImpression: FirstImpressionReport;

  /** Positioning Report */
  positioning: PositioningReport;

  /** Clarity Report */
  clarity: ClarityReport;

  /** AEO Report (Simplified - Free Audit) */
  aeo: AEOReport;

  /** Metadata */
  analyzedUrl: string;
  analyzedAt: string;
  band: ReportBand;
}

/**
 * Clarity Section Summary
 * Overall clarity analysis with current state, comments, and fixes
 */
export interface ClaritySummary {
  /** Current messaging from website */
  current: string;
  /** Positive comments about clarity */
  positiveComments: string[];
  /** Negative comments pointing out clarity issues */
  negativeComments: string[];
  /** Suggested messaging */
  suggested: string[];
}

/**
 * Unclear Sentence/Phrase with fix
 * Points out specific unclear text and provides direct fix
 */
export interface UnclearText {
  /** The unclear sentence/phrase from website */
  text: string;
  /** Why it's unclear */
  issue: string;
  /** Suggested rewrite */
  fix: string;
}

/**
 * Clarity Sub-Metric Analysis
 * Each sub-metric (Headline, Value Prop, etc.) with current, comments, fixes, and unclear texts
 */
export interface ClaritySubMetric {
  /** Diagnostic statement about this sub-metric */
  statement: string;
  /** Score 0-100 */
  score: number;
  /** Current state for this sub-metric */
  current: string;
  /** Positive comments about this sub-metric */
  positiveComments: string[];
  /** Negative comments pointing out issues */
  negativeComments: string[];
  /** Structural recommendations for this sub-metric */
  recommendation: string[];
  /** Suggested fixes */
  suggested: string[];
  /** Specific unclear sentences/phrases found */
  unclearTexts: UnclearText[];
}

/**
 * Clarity Report
 * Analyzes message clarity and communication across 6 key dimensions
 */
export interface ClarityReport {
  /** Overall clarity score 0-100 */
  score: number;

  /** Overall assessment (2-3 sentences) */
  statement: string;

  /** Overall positive comments about clarity */
  overallCommentPositive: string[];

  /** Overall negative comments about clarity */
  overallCommentNegative: string[];

  /** Overall clarity summary */
  summary: ClaritySummary;

  /** Specific unclear sentences found across the site */
  unclearSentences: UnclearText[];

  /** Sub-metrics analysis */
  subMetrics: {
    headlineClarity: ClaritySubMetric;
    valueProposition: ClaritySubMetric;
    featureBenefitMapping: ClaritySubMetric;
    visualHierarchy: ClaritySubMetric;
    ctaClarity: ClaritySubMetric;
    proofPlacement: ClaritySubMetric;
  };
}

/**
 * AEO Report - Simplified (Free Audit)
 * Basic AI visibility check - kept simple since this is offered as free audit
 */
export interface AEOReport {
  /** Overall AEO score 0-100 */
  score: number;

  /** Overall assessment (1-2 sentences) */
  statement: string;

  /** AI Engine Presence Check */
  aiPresence: {
    /** Is brand mentioned in AI responses? */
    isPresent: boolean;
    /** Which engines mention the brand */
    engines: string[];
    /** Comment on presence */
    comment: string;
  };

  /** Basic recommendations */
  recommendations: string[];
}

/**
 * AEO Report - TODO: Same structure as PositioningReport
 */
export interface ReportSection {
  /** Score 0-100 */
  score: number;
  /** Direct problem statement (2-3 sentences) */
  statement: string;
  /** Actions to fix the problem (3-5 recommended, highest priority first) */
  actions: Action[];
  /** Sub-metrics that break down the pillar into categories */
  subMetrics: SubMetric[];
}

/**
 * Sub-Metric - Used for AEO pillar (for now)
 * TODO: Update to use same structure as PositioningSubMetric
 */
export interface SubMetric {
  /** Sub-metric name (e.g., "Category Ownership", "Headline Clarity") */
  name: string;
  /** Score 0-100 for this specific sub-metric */
  score: number;
  /** Direct problem statement for this sub-metric */
  statement: string;
  /** Actions to fix this sub-metric (2-3 recommended) */
  actions: Action[];
}

// ============================================================================
// REPORT BANDS
// ============================================================================

export type ReportBand =
  | {
      name: "Dominant";
      scoreRange: "90-100";
      description: "You own the category";
    }
  | {
      name: "Strong";
      scoreRange: "70-89";
      description: "Clear differentiation";
    }
  | {
      name: "Blended";
      scoreRange: "50-69";
      description: "Understandable but not distinctive";
    }
  | { name: "Weak"; scoreRange: "30-49"; description: "Unclear positioning" }
  | { name: "Ghost"; scoreRange: "0-29"; description: "Invisible to market" };

// ============================================================================
// SUB-METRIC DEFINITIONS (For Reference)
// ============================================================================

/**
 * Positioning Sub-Metrics (6 categories)
 */
export const POSITIONING_SUB_METRICS = {
  categoryOwnership: "Category Ownership",
  uniqueValueProp: "Unique Value Proposition",
  competitiveDifferentiation: "Competitive Differentiation",
  targetAudience: "Target Audience Clarity",
  problemSolutionFit: "Problem-Solution Fit",
  messagingConsistency: "Messaging Consistency",
} as const;

/**
 * Clarity Sub-Metrics (6 categories)
 */
export const CLARITY_SUB_METRICS = {
  headlineClarity: "Headline Clarity",
  visualFlow: "Visual Flow",
  valueHierarchy: "Value Hierarchy",
  benefitClarity: "Benefit Clarity",
  ctaClarity: "CTA Clarity",
  proofPlacement: "Proof Placement",
} as const;

/**
 * AEO Sub-Metrics (5 categories)
 */
export const AEO_SUB_METRICS = {
  aiEnginePresence: "AI Engine Presence",
  citationFrequency: "Citation Frequency",
  semanticAuthority: "Semantic Authority",
  entityStrength: "Entity Strength",
  recommendationRate: "Recommendation Rate",
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get band based on score
 */
export function getBand(score: number): ReportBand {
  if (score >= 90)
    return {
      name: "Dominant",
      scoreRange: "90-100",
      description: "You own the category",
    };
  if (score >= 70)
    return {
      name: "Strong",
      scoreRange: "70-89",
      description: "Clear differentiation",
    };
  if (score >= 50)
    return {
      name: "Blended",
      scoreRange: "50-69",
      description: "Understandable but not distinctive",
    };
  if (score >= 30)
    return {
      name: "Weak",
      scoreRange: "30-49",
      description: "Unclear positioning",
    };
  return {
    name: "Ghost",
    scoreRange: "0-29",
    description: "Invisible to market",
  };
}

/**
 * Calculate priority score based on impact and effort
 */
export interface PriorityFactors {
  conversionImpact: number; // 0-100
  visibilityImpact: number; // 0-100
  effort: number; // 0-100 (lower = easier)
  competitiveGap: number; // 0-100 (how far behind competitors)
}

export function calculatePriority(factors: PriorityFactors): number {
  const { conversionImpact, visibilityImpact, effort, competitiveGap } =
    factors;

  // Formula: weighted average with effort inverted (lower effort = higher priority)
  const priority =
    conversionImpact * 0.4 +
    visibilityImpact * 0.3 +
    (100 - effort) * 0.2 +
    competitiveGap * 0.1;

  return Math.round(priority);
}

/**
 * Create an action with validation
 */
export function createAction(action: Action): Action {
  // Validate priority is 0-100
  if (action.priority < 0 || action.priority > 100) {
    throw new Error(`Action priority must be 0-100, got ${action.priority}`);
  }

  // Validate problem is not empty
  if (!action.problem || action.problem.trim().length === 0) {
    throw new Error("Action problem is required");
  }

  // Validate solution is not empty
  if (!action.solution || action.solution.trim().length === 0) {
    throw new Error("Action solution is required");
  }

  // Validate example is not empty
  if (!action.example || action.example.trim().length === 0) {
    throw new Error("Action example is required");
  }

  return action;
}

/**
 * Create a sub-metric with validation
 */
export function createSubMetric(metric: SubMetric): SubMetric {
  // Validate score is 0-100
  if (metric.score < 0 || metric.score > 100) {
    throw new Error(`Sub-metric score must be 0-100, got ${metric.score}`);
  }

  // Validate has at least one action
  if (!metric.actions || metric.actions.length === 0) {
    throw new Error("Sub-metric must have at least one action");
  }

  // Validate statement is not empty
  if (!metric.statement || metric.statement.trim().length === 0) {
    throw new Error("Sub-metric statement is required");
  }

  return metric;
}

/**
 * Create a report section with validation
 */
export function createReportSection(section: ReportSection): ReportSection {
  // Validate score is 0-100
  if (section.score < 0 || section.score > 100) {
    throw new Error(`Section score must be 0-100, got ${section.score}`);
  }

  // Validate has at least one action
  if (!section.actions || section.actions.length === 0) {
    throw new Error("Report section must have at least one action");
  }

  // Validate has sub-metrics
  if (!section.subMetrics || section.subMetrics.length === 0) {
    throw new Error("Report section must have sub-metrics");
  }

  // Validate statement is not empty
  if (!section.statement || section.statement.trim().length === 0) {
    throw new Error("Report section statement is required");
  }

  return section;
}
