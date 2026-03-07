"use client";

import { PillarDetailCard } from "@/components/dashboard/pillar-card";
import { AuditReportV1 } from "@/types/audit-report-v1";

interface PositioningSharpnessPillarProps {
  report: AuditReportV1;
}

export function PositioningSharpnessPillar({ report }: PositioningSharpnessPillarProps) {
  return (
    <PillarDetailCard
      title="Positioning Sharpness"
      score={report.positioning_sharpness.score}
      critique={report.positioning_sharpness.critique}
      audit={report.positioning_sharpness.audit}
      icon="positioning"
      band={report.positioning_sharpness.band}
    />
  );
}
