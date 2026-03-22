"use client";

import { SimplifiedReportCard } from "./simplified-report-card";
import { GradeSummary } from "./grade-summary";
import { AuditReportV1 } from "@/types/audit-report-v1";
import { Target } from "lucide-react";

interface SimplifiedPositioningCardProps {
  report: AuditReportV1;
  productId: string;
}

export function SimplifiedPositioningCard({ report, productId }: SimplifiedPositioningCardProps) {
  return (
    <div className="space-y-4">
      <SimplifiedReportCard
        title="Positioning Sharpness"
        description="How clearly and distinctly your product stands out"
        score={report.positioning_sharpness.score}
        band={report.positioning_sharpness.band}
        
        explanation="Positioning Sharpness measures how clearly your product distinguishes itself from competitors. Sharp positioning makes it immediately obvious what you offer, who it's for, and why you're different—not just better."
        
        audit={report.positioning_sharpness.audit}
        icon={<Target className="h-5 w-5" />}
        guidanceLink={`/dashboard/${productId}/guidance/positioning`}
      />
      
      <GradeSummary score={report.positioning_sharpness.score} pillarType="positioning" />
    </div>
  );
}
