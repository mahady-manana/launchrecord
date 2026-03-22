"use client";

import { SimplifiedReportCard } from "./simplified-report-card";
import { GradeSummary } from "./grade-summary";
import { AuditReportV1 } from "@/types/audit-report-v1";
import { Zap } from "lucide-react";

interface SimplifiedClarityCardProps {
  report: AuditReportV1;
  productId: string;
}

export function SimplifiedClarityCard({ report, productId }: SimplifiedClarityCardProps) {
  return (
    <div className="space-y-4">
      <SimplifiedReportCard
        title="Clarity Velocity"
        description="How quickly visitors understand your value"
        score={report.clarity_velocity.score}
        band={report.clarity_velocity.band}
        
        explanation="Clarity Velocity measures how quickly (in seconds) a visitor understands what you offer and why they should care. High clarity means visitors 'get it' within 3-5 seconds of landing on your page."
        
        audit={report.clarity_velocity.audit}
        icon={<Zap className="h-5 w-5" />}
        guidanceLink={`/dashboard/${productId}/guidance/clarity`}
      />
      
      <GradeSummary score={report.clarity_velocity.score} pillarType="clarity" />
    </div>
  );
}
