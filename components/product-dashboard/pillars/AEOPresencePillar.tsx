"use client";

import { PillarDetailCard } from "@/components/dashboard/pillar-card";
import { AuditReportV1 } from "@/types/audit-report-v1";

interface AEOPresencePillarProps {
  report: AuditReportV1;
}

export function AEOPresencePillar({ report }: AEOPresencePillarProps) {
  return (
    <PillarDetailCard
      title="AEO Presence"
      score={report.aeo_index.score}
      critique={report.aeo_index.critique}
      audit={report.aeo_index.audit}
      icon="aeo"
      band={report.aeo_index.search_visibility_risk}
    />
  );
}
