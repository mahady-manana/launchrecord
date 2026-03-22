"use client";

import { ExplainableReportCard } from "@/components/explainable-report";
import { AuditReportV1 } from "@/types/audit-report-v1";
import { TrendingUp } from "lucide-react";

interface ExplainableMomentumCardProps {
  report: AuditReportV1;
  productId: string;
}

export function ExplainableMomentumCard({ report, productId }: ExplainableMomentumCardProps) {
  return (
    <ExplainableReportCard
      title="Momentum Signal"
      description="Evidence of growth, traction, and market validation"
      score={report.momentum_signal.score}
      scoreLabel="Momentum Score"
      band={report.momentum_signal.band}
      
      whatContent="Momentum Signal measures the visible evidence of growth, traction, and market validation your product communicates. Strong momentum signals—user counts, customer logos, press coverage—build trust and reduce perceived risk for potential customers."
      
      whyContent="Customers follow crowds. Visible momentum creates a virtuous cycle: more users attract more users. Without momentum signals, even great products struggle to gain trust. Strong momentum enables premium pricing, shorter sales cycles, and easier conversations."
      
      howContent="Review your momentum signals: (1) User/customer metrics—are numbers visible and specific?, (2) Social proof—reviews, testimonials, case studies?, (3) Media recognition—press, awards, rankings?, (4) Activity signals—recent updates, launches, hiring?"
      
      howExamples={[
        "Display specific user counts: '10,000+ users' not 'many users'",
        "Showcase customer logos prominently on the homepage",
        "Create detailed case studies with before/after metrics",
        "Regularly announce product updates and milestones"
      ]}
      
      audit={report.momentum_signal.audit}
      actionsTitle="Priority Momentum Actions"
      icon={<TrendingUp className="h-5 w-5" />}
      guidanceLink={`/dashboard/${productId}/guidance/momentum`}
    />
  );
}
