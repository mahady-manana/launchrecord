"use client";

import { PillarDetailCard } from "@/components/dashboard/pillar-card";
import { AuditReportV1 } from "@/types/audit-report-v1";
import Link from "next/link";

interface ClarityVelocityPillarProps {
  report: AuditReportV1;
  productId: string;
}

export function ClarityVelocityPillar({
  report,
  productId,
}: ClarityVelocityPillarProps) {
  return (
    <div className="space-y-3">
      <PillarDetailCard
        title="Clarity Velocity"
        score={report.clarity_velocity.score}
        critique={report.clarity_velocity.critique}
        audit={report.clarity_velocity.audit}
        icon="clarity"
        band={report.clarity_velocity.band}
      />
      <Link
        href={`/dashboard/${productId}/audit/clarity`}
        className="block w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-center font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 hover:shadow-lg"
      >
        Full Clarity Audit
      </Link>
    </div>
  );
}
