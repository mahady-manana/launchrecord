"use client";

import { SimplifiedReportCard } from "./simplified-report-card";
import { GradeSummary } from "./grade-summary";
import { AuditReportV1 } from "@/types/audit-report-v1";
import { TrendingUp } from "lucide-react";

interface SimplifiedMomentumCardProps {
  report: AuditReportV1;
  productId: string;
}

export function SimplifiedMomentumCard({ report, productId }: SimplifiedMomentumCardProps) {
  return (
    <div className="space-y-4">
      <SimplifiedReportCard
        title="Momentum Signal"
        description="Evidence of growth and market validation"
        score={report.momentum_signal.score}
        band={report.momentum_signal.band}
        
        explanation="Momentum Signal measures visible evidence of growth, traction, and market validation. Strong momentum signals—user counts, customer logos, press—build trust and reduce perceived risk for prospects."
        
        audit={report.momentum_signal.audit}
        icon={<TrendingUp className="h-5 w-5" />}
        guidanceLink={`/dashboard/${productId}/guidance/momentum`}
      />
      
      <GradeSummary score={report.momentum_signal.score} pillarType="momentum" />
    </div>
  );
}
