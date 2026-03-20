"use client";

import { PillarDetailCard } from "@/components/dashboard/pillar-card";
import { AuditReportV1 } from "@/types/audit-report-v1";
import Link from "next/link";

interface PositioningSharpnessPillarProps {
  report: AuditReportV1;
  productId: string;
}

export function PositioningSharpnessPillar({
  report,
  productId,
}: PositioningSharpnessPillarProps) {
  return (
    <div className="space-y-3">
      <PillarDetailCard
        title="Positioning Sharpness"
        score={report.positioning_sharpness.score}
        critique={report.positioning_sharpness.critique}
        audit={report.positioning_sharpness.audit}
        icon="positioning"
        band={report.positioning_sharpness.band}
      />
      <Link
        href={`/dashboard/${productId}/audit/positioning`}
        className="block w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-center font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 hover:shadow-lg"
      >
        Full Positioning Audit
      </Link>
    </div>
  );
}
