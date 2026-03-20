"use client";

import { PillarDetailCard } from "@/components/dashboard/pillar-card";
import { AuditReportV1 } from "@/types/audit-report-v1";
import Link from "next/link";

interface MomentumSignalPillarProps {
  report: AuditReportV1;
  productId: string;
}

export function MomentumSignalPillar({
  report,
  productId,
}: MomentumSignalPillarProps) {
  return (
    <div className="space-y-3">
      <PillarDetailCard
        title="Momentum Signal"
        score={report.momentum_signal.score}
        critique={report.momentum_signal.critique}
        audit={report.momentum_signal.audit}
        icon="momentum"
        band={report.momentum_signal.band}
      />
      <Link
        href={`/dashboard/${productId}/audit/momentum`}
        className="block w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-center font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 hover:shadow-lg"
      >
        Full Momentum Audit
      </Link>
    </div>
  );
}
