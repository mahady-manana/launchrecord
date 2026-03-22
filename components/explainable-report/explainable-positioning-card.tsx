"use client";

import { ExplainableReportCard } from "@/components/explainable-report";
import { AuditReportV1 } from "@/types/audit-report-v1";
import { Target } from "lucide-react";

interface ExplainablePositioningCardProps {
  report: AuditReportV1;
  productId: string;
}

export function ExplainablePositioningCard({ report, productId }: ExplainablePositioningCardProps) {
  return (
    <ExplainableReportCard
      title="Positioning Sharpness"
      description="How clearly and distinctly your product stands out in the market"
      score={report.positioning_sharpness.score}
      scoreLabel="Positioning Score"
      band={report.positioning_sharpness.band}
      
      whatContent="Positioning Sharpness measures how clearly your product distinguishes itself from competitors in customers' minds. Sharp positioning makes it immediately obvious what you offer, who it's for, and why you're different—not just better."
      
      whyContent="Sharp positioning is the foundation of marketing effectiveness. It drives higher conversion rates (visitors instantly 'get it'), enables premium pricing (clear differentiation), and creates word-of-mouth growth (easy to describe). Weak positioning forces you into price competition and wastes marketing spend."
      
      howContent="Evaluate your positioning by checking: (1) Category clarity—do visitors immediately know what you offer?, (2) Differentiation—what makes you uniquely valuable?, (3) Audience specificity—are you speaking to someone specific?, (4) Value proposition—is the outcome crystal clear?"
      
      howExamples={[
        "Lead with outcome-based headlines, not feature lists",
        "Name your specific target audience explicitly on the homepage",
        "Define your unique mechanism—what you do differently that others don't",
        "Complete this sentence: 'We help [who] achieve [what] by [how], unlike [alternative]'"
      ]}
      
      audit={report.positioning_sharpness.audit}
      actionsTitle="Priority Positioning Actions"
      icon={<Target className="h-5 w-5" />}
      guidanceLink={`/dashboard/${productId}/guidance/positioning`}
    />
  );
}
