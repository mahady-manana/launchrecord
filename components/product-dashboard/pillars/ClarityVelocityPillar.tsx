"use client";

import { PillarDetailCard } from "@/components/dashboard/pillar-card";
import { AuditReportV1 } from "@/types/audit-report-v1";

interface ClarityVelocityPillarProps {
  report: AuditReportV1;
}

export function ClarityVelocityPillar({ report }: ClarityVelocityPillarProps) {
  return (
    <PillarDetailCard
      title="Clarity Velocity"
      score={report.clarity_velocity.score}
      critique={report.clarity_velocity.critique}
      audit={report.clarity_velocity.audit}
      icon="clarity"
      band={report.clarity_velocity.band}
    />
  );
}
