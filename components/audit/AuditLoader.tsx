"use client";

import { TerminalAuditLoader } from "@/components/audit/TerminalAuditLoader";
import { AuditProgress } from "@/components/audit/useAudit";

export interface AuditLoaderProps {
  currentProgress: AuditProgress;
  url: string;
  onComplete?: () => void;
  className?: string;
}

// Default audit steps for SIO-V5 audit
const defaultSteps = [
  {
    id: "init",
    name: "Initializing audit & fetching content",
    progress: "content_fetched" as AuditProgress,
    metrics: [
      "Validating URL",
      "Checking permissions",
      "Fetching website content",
      "Analyzing robots.txt & sitemap",
    ],
    subMetrics: [
      "Title tags",
      "Meta descriptions",
      "Open Graph tags",
      "Schema markup",
    ],
  },
  {
    id: "summary",
    name: "Analyzing website summary & first impressions",
    progress: "summary_complete" as AuditProgress,
    metrics: [
      "Extracting value proposition",
      "Analyzing headline",
      "Evaluating subheadline",
      "Reviewing CTA",
    ],
    subMetrics: [
      "Problem statement",
      "Outcome promises",
      "Solution clarity",
      "Feature highlights",
    ],
  },
  {
    id: "positioning",
    name: "Evaluating positioning & clarity",
    progress: "positioning_clarity_complete" as AuditProgress,
    metrics: [
      "Category ownership",
      "Unique value proposition",
      "Competitive differentiation",
      "Target audience clarity",
      "Problem-solution fit",
      "Messaging consistency",
    ],
    subMetrics: [
      "Headline clarity",
      "Value proposition",
      "Feature-benefit mapping",
      "Visual hierarchy",
      "CTA clarity",
      "Proof placement",
    ],
  },
  {
    id: "aeo",
    name: "Checking AEO visibility",
    progress: "aeo_complete" as AuditProgress,
    metrics: [
      "AI engine presence",
      "Structured data readiness",
      "Answer engine optimization",
    ],
    subMetrics: [
      "Featured snippet readiness",
      "Knowledge graph signals",
      "Entity markup",
    ],
  },
  {
    id: "scoring",
    name: "Calculating scores",
    progress: "scoring_complete" as AuditProgress,
    metrics: [
      "Weighting section scores",
      "Generating overall statement",
      "Compiling recommendations",
    ],
  },
  {
    id: "refine",
    name: "Refining & finalizing report",
    progress: "complete" as AuditProgress,
    metrics: [
      "Cross-validating scores",
      "Checking consistency",
      "Finalizing recommendations",
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
