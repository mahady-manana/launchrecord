"use client";

import { PillarDetailCard } from "@/components/dashboard/pillar-card";
import { AuditReportV1 } from "@/types/audit-report-v1";

interface MomentumSignalPillarProps {
  report: AuditReportV1;
}

export function MomentumSignalPillar({ report }: MomentumSignalPillarProps) {
  return (
    <PillarDetailCard
      title="Momentum Signal"
      score={report.momentum_signal.score}
      critique={report.momentum_signal.critique}
      audit={report.momentum_signal.audit}
      icon="momentum"
      band={report.momentum_signal.band}
    />
  );
}
