"use client";

import { PillarDetailCard } from "@/components/dashboard/pillar-card";
import { AuditReportV1 } from "@/types/audit-report-v1";
import Link from "next/link";

interface AEOPresencePillarProps {
  report: AuditReportV1;
  productId: string;
}

export function AEOPresencePillar({
  report,
  productId,
}: AEOPresencePillarProps) {
  return (
    <div className="space-y-3">
      <PillarDetailCard
        title="AEO Presence"
        score={report.aeo_index.score}
        critique={report.aeo_index.critique}
        audit={report.aeo_index.audit}
        icon="aeo"
        band={report.aeo_index.search_visibility_risk}
      />
      <Link
        href={`/dashboard/${productId}/audit/aeo`}
        className="block w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-center font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 hover:shadow-lg"
      >
        Full AEO Audit
      </Link>
    </div>
  );
}
