/**
 * Pillar Audit Services
 * Reusable services for independent audits of each pillar:
 * - Positioning
 * - Product Clarity
 * - Momentum
 * - Founder Proof
 */

export interface PillarAuditResult {
  score: number;
  band: string;
  findings: string[];
  recommendations: string[];
  metrics: Record<string, any>;
}

export interface PillarConfig {
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  metrics: string[];
}

export const PILLAR_CONFIGS: Record<string, PillarConfig> = {
  positioning: {
    name: "Positioning",
    slug: "positioning",
    description:
      "Measure how distinctly your startup occupies a unique space in the market and AI consciousness.",
    icon: "Target",
    color: "blue",
    gradientFrom: "from-blue-500",
    gradientTo: "to-indigo-600",
    metrics: [
      "Category Definition",
      "Unique Value Proposition",
      "Competitive Differentiation",
      "AI Entity Recognition",
      "Market Position Clarity",
    ],
  },
  clarity: {
    name: "Product Clarity",
    slug: "clarity",
    description:
      "Evaluate how quickly and clearly visitors understand what your product does and why it matters.",
    icon: "Eye",
    color: "green",
    gradientFrom: "from-green-500",
    gradientTo: "to-emerald-600",
    metrics: [
      "Message Clarity",
      "Value Communication",
      "Feature-Benefit Mapping",
      "Visual Hierarchy",
      "Conversion Pathway",
    ],
  },
  momentum: {
    name: "Momentum",
    slug: "momentum",
    description:
      "Assess your startup's growth signals, market traction, and velocity indicators.",
    icon: "TrendingUp",
    color: "orange",
    gradientFrom: "from-orange-500",
    gradientTo: "to-red-600",
    metrics: [
      "Growth Trajectory",
      "Market Signals",
      "User Engagement",
      "Competitive Velocity",
      "Traction Evidence",
    ],
  },
  founderProof: {
    name: "Founder Proof",
    slug: "founder-proof",
    description:
      "Validate your authority, credibility, and social proof as a founder and startup.",
    icon: "Shield",
    color: "purple",
    gradientFrom: "from-purple-500",
    gradientTo: "to-pink-600",
    metrics: [
      "Founder Authority",
      "Social Proof",
      "Evidence Quality",
      "Credibility Signals",
      "Trust Indicators",
    ],
  },
  aeo: {
    name: "AEO",
    slug: "aeo",
    description:
      "Analyze your visibility and recommendation rate across AI engines like ChatGPT, Claude, and Gemini.",
    icon: "Bot",
    color: "cyan",
    gradientFrom: "from-cyan-500",
    gradientTo: "to-blue-600",
    metrics: [
      "AI Engine Presence",
      "Citation Frequency",
      "Semantic Authority",
      "Entity Strength",
      "Recommendation Rate",
    ],
  },
};

/**
 * Analyze Positioning - Evaluates market positioning and differentiation
 */
export async function analyzePositioning(
  websiteUrl: string,
): Promise<PillarAuditResult> {
  // Simulated analysis - in production, this would call actual analysis APIs
  const score = Math.floor(Math.random() * 40) + 60; // 60-100 for demo

  const findings = [
    "Your category definition shows moderate clarity but lacks distinctive language",
    "Competitive differentiation is present but could be sharpened",
    "AI entity recognition signals are developing but not yet strong",
    "Market position is understandable but not memorable",
    "Value proposition requires more specific outcome framing",
  ];

  const recommendations = [
    "Refine your category definition to own a unique space",
    "Add specific competitor contrasts to sharpen differentiation",
    "Implement structured data to strengthen entity signals",
    "Create definitive content that establishes category leadership",
    "Quantify value propositions with specific metrics and outcomes",
  ];

  return {
    score,
    band: getBandForScore(score, [
      "Dominant",
      "Strong",
      "Blended",
      "Weak",
      "Ghost",
    ]),
    findings,
    recommendations,
    metrics: {
      categoryDefinition: Math.floor(Math.random() * 40) + 60,
      uniqueValueProp: Math.floor(Math.random() * 40) + 60,
      competitiveDiff: Math.floor(Math.random() * 40) + 60,
      aiEntityRecognition: Math.floor(Math.random() * 40) + 60,
      marketPositionClarity: Math.floor(Math.random() * 40) + 60,
    },
  };
}

/**
 * Analyze Product Clarity - Evaluates message and value communication
 */
export async function analyzeClarity(
  websiteUrl: string,
): Promise<PillarAuditResult> {
  const score = Math.floor(Math.random() * 40) + 60;

  const findings = [
    "Headline clarity is moderate - visitors may need >5 seconds to understand your offering",
    "Value communication exists but lacks specific outcome framing",
    "Feature-benefit mapping is implicit rather than explicit",
    "Visual hierarchy could better guide attention to key messages",
    "Conversion pathway has friction points that reduce clarity",
  ];

  const recommendations = [
    "Simplify headline to communicate core value in <5 seconds",
    "Add specific before/after scenarios to illustrate transformation",
    "Make feature-benefit connections explicit with clear labels",
    "Restructure visual hierarchy to prioritize key value propositions",
    "Streamline conversion pathway with clearer CTAs and fewer steps",
  ];

  return {
    score,
    band: getBandForScore(score, [
      "Instant",
      "Clear",
      "Average",
      "Confusing",
      "Opaque",
    ]),
    findings,
    recommendations,
    metrics: {
      messageClarity: Math.floor(Math.random() * 40) + 60,
      valueCommunication: Math.floor(Math.random() * 40) + 60,
      featureBenefitMapping: Math.floor(Math.random() * 40) + 60,
      visualHierarchy: Math.floor(Math.random() * 40) + 60,
      conversionPathway: Math.floor(Math.random() * 40) + 60,
    },
  };
}

/**
 * Analyze Momentum - Evaluates growth signals and traction
 */
export async function analyzeMomentum(
  websiteUrl: string,
): Promise<PillarAuditResult> {
  const score = Math.floor(Math.random() * 40) + 60;

  const findings = [
    "Growth trajectory signals are present but not prominently showcased",
    "Market signals show moderate activity but lack amplification",
    "User engagement evidence is limited or not visible",
    "Competitive velocity appears average for your category",
    "Traction evidence exists but needs stronger presentation",
  ];

  const recommendations = [
    "Showcase growth metrics prominently (users, revenue, partnerships)",
    "Amplify market signals through press, awards, and milestones",
    "Display user engagement metrics and success stories",
    "Create momentum-specific content (growth updates, milestones)",
    "Build a traction wall with logos, metrics, and testimonials",
  ];

  return {
    score,
    band: getBandForScore(score, [
      "Viral",
      "Rising",
      "Stable",
      "Flat",
      "Dead",
    ]),
    findings,
    recommendations,
    metrics: {
      growthTrajectory: Math.floor(Math.random() * 40) + 60,
      marketSignals: Math.floor(Math.random() * 40) + 60,
      userEngagement: Math.floor(Math.random() * 40) + 60,
      competitiveVelocity: Math.floor(Math.random() * 40) + 60,
      tractionEvidence: Math.floor(Math.random() * 40) + 60,
    },
  };
}

/**
 * Analyze Founder Proof - Evaluates authority and credibility
 */
export async function analyzeFounderProof(
  websiteUrl: string,
): Promise<PillarAuditResult> {
  const score = Math.floor(Math.random() * 40) + 60;

  const findings = [
    "Founder authority signals are present but not maximized",
    "Social proof exists but lacks strategic placement",
    "Evidence quality is moderate - needs more specific metrics",
    "Credibility signals could be strengthened with third-party validation",
    "Trust indicators are present but not prominently displayed",
  ];

  const recommendations = [
    "Create founder story page highlighting expertise and journey",
    "Strategically place testimonials and case studies throughout site",
    "Quantify results with specific numbers and outcomes",
    "Add third-party validation (press, awards, certifications)",
    "Build trust stack with logos, metrics, and social proof sections",
  ];

  return {
    score,
    band: getBandForScore(score, [
      "Verified",
      "Strong",
      "Moderate",
      "Weak",
      "Absent",
    ]),
    findings,
    recommendations,
    metrics: {
      founderAuthority: Math.floor(Math.random() * 40) + 60,
      socialProof: Math.floor(Math.random() * 40) + 60,
      evidenceQuality: Math.floor(Math.random() * 40) + 60,
      credibilitySignals: Math.floor(Math.random() * 40) + 60,
      trustIndicators: Math.floor(Math.random() * 40) + 60,
    },
  };
}

/**
 * Helper function to determine band based on score
 */
function getBandForScore(score: number, bands: string[]): string {
  if (score >= 90) return bands[0];
  if (score >= 70) return bands[1];
  if (score >= 50) return bands[2];
  if (score >= 30) return bands[3];
  return bands[4];
}

/**
 * Get pillar configuration by slug
 */
export function getPillarConfig(slug: string): PillarConfig | null {
  return PILLAR_CONFIGS[slug] || null;
}

/**
 * Get all pillar configurations
 */
export function getAllPillars(): PillarConfig[] {
  return Object.values(PILLAR_CONFIGS);
}
