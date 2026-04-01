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
    current: string;
    positiveComments: string[];
    negativeComments: string[];
    suggested: string[];
  };

  /** Subheadline analysis */
  subheadline: {
    current: string;
    positiveComments: string[];
    negativeComments: string[];
    suggested: string[];
  };

  /** CTA analysis */
  cta: {
    current: string;
    positiveComments: string[];
    negativeComments: string[];
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
  /** Sub-metric name */
  name: string;
  /** Score 0-100 */
  score: number;
  /** Current state for this sub-metric */
  current: string;
  /** Positive comments about this sub-metric */
  positiveComments: string[];
  /** Negative comments pointing out issues */
  negativeComments: string[];
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
  url: string;
  createdAt: Date;
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
  /** Sub-metric name */
  name: string;
  /** Score 0-100 */
  score: number;
  /** Current state for this sub-metric */
  current: string;
  /** Positive comments about this sub-metric */
  positiveComments: string[];
  /** Negative comments pointing out issues */
  negativeComments: string[];
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
 * Report Bands
 */
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
