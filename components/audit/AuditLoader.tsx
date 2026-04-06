"use client";

import { TerminalAuditLoader } from "@/components/audit/TerminalAuditLoader";
import { AuditProgress } from "@/components/audit/useAudit";

export interface AuditLoaderProps {
  currentProgress: AuditProgress;
  url: string;
  onComplete?: () => void;
  className?: string;
}

// Default audit steps for SIO-V5 audit - verbose with all sub-metrics
const defaultSteps = [
  {
    id: "init",
    name: "Initializing audit & fetching content",
    progress: "content_fetched" as AuditProgress,
    metrics: [
      "Validating URL & permissions",
      "Checking for existing reports",
      "Fetching website content",
      "Analyzing robots.txt",
      "Parsing sitemap.xml",
    ],
    subMetrics: [
      "Title tags extraction",
      "Meta descriptions parsing",
      "Open Graph tags analysis",
      "Schema markup detection",
      "Canonical URLs verification",
      "Robots.txt directives check",
      "Sitemap URL discovery",
      "Content length validation",
    ],
  },
  {
    id: "summary",
    name: "Analyzing website summary & first impressions",
    progress: "summary_complete" as AuditProgress,
    metrics: [
      "Extracting value proposition",
      "Analyzing problems & outcomes",
      "Evaluating solutions & features",
      "Scoring hero section",
      "Analyzing headline",
      "Evaluating subheadline",
      "Reviewing CTA effectiveness",
    ],
    subMetrics: [
      "Problem statement extraction",
      "Outcome promises identification",
      "Solution clarity assessment",
      "Feature highlights analysis",
      "Positioning clarity check",
      "Messaging clarity check",
      "Headline impact scoring",
      "Subheadline relevance check",
      "CTA action-orientation check",
      "Conversion optimization review",
    ],
  },
  {
    id: "positioning",
    name: "Evaluating positioning & clarity",
    progress: "positioning_clarity_complete" as AuditProgress,
    metrics: [
      "Category ownership analysis",
      "Unique value proposition scoring",
      "Competitive differentiation check",
      "Target audience clarity review",
      "Problem-solution fit assessment",
      "Messaging consistency check",
      "Headline clarity scoring",
      "Value proposition clarity",
      "Feature-benefit mapping",
      "Visual hierarchy analysis",
      "CTA clarity review",
      "Proof placement evaluation",
    ],
    subMetrics: [
      "Category definition check",
      "Market positioning statement",
      "UVP specificity scoring",
      "Competitor comparison analysis",
      "ICP specificity assessment",
      "Audience role clarity",
      "Problem articulation check",
      "Solution alignment scoring",
      "Cross-page consistency check",
      "Message tone evaluation",
      "Jargon detection & flagging",
      "Reading level assessment",
      "Benefit statement mapping",
      "Feature-to-benefit links",
      "Content order analysis",
      "Information hierarchy check",
      "CTA specificity scoring",
      "Action clarity assessment",
      "Social proof positioning",
      "Testimonial placement check",
    ],
  },
  {
    id: "aeo",
    name: "Checking AEO visibility",
    progress: "aeo_complete" as AuditProgress,
    metrics: [
      "AI engine presence check",
      "Structured data readiness",
      "Answer engine optimization",
      "Schema markup evaluation",
      "FAQ schema analysis",
    ],
    subMetrics: [
      "ChatGPT presence likelihood",
      "Claude mention probability",
      "Gemini visibility check",
      "Perplexity optimization",
      "JSON-LD completeness",
      "Meta tags optimization",
      "Open Graph completeness",
      "Featured snippet readiness",
      "People Also Ask optimization",
      "Knowledge graph signals",
      "Entity markup check",
      "Structured data validation",
    ],
  },
  {
    id: "scoring",
    name: "Calculating final scores",
    progress: "scoring_complete" as AuditProgress,
    metrics: [
      "Weighting first impression (20%)",
      "Weighting positioning (25%)",
      "Weighting clarity (25%)",
      "Weighting AEO (10%)",
      "Weighting website summary (20%)",
      "Determining report band",
      "Generating overall statement",
      "Compiling recommendations",
    ],
    subMetrics: [
      "Score normalization",
      "Cross-section validation",
      "Band assignment logic",
      "Statement generation",
      "Positive comments aggregation",
      "Negative comments aggregation",
      "Priority ranking",
      "Action item compilation",
    ],
  },
  {
    id: "refine",
    name: "Refining & finalizing report",
    progress: "complete" as AuditProgress,
    metrics: [
      "Cross-validating scores",
      "Checking consistency",
      "Refining unclear statements",
      "Verifying completeness",
      "Generating final report",
      "Cleaning temporary data",
    ],
    subMetrics: [
      "Score-comment alignment",
      "Contradiction detection",
      "Rewrite readiness check",
      "Specificity validation",
      "Field completeness",
      "Action item validation",
      "Data sanitization",
      "Report finalization",
    ],
  },
];

export function AuditLoader({
  currentProgress,
  url,
  onComplete,
  className,
}: AuditLoaderProps) {
  return (
    <TerminalAuditLoader
      command={`sio audit --full url '${url}'`}
      steps={defaultSteps}
      currentProgress={currentProgress}
      onComplete={onComplete}
      className={className}
    />
  );
}
