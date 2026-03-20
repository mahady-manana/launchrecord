"use client";

import { PillarDetailCard } from "@/components/dashboard/pillar-card";
import { AuditReportV1 } from "@/types/audit-report-v1";
import Link from "next/link";

interface FounderProofVaultPillarProps {
  report: AuditReportV1;
  productId: string;
}

export function FounderProofVaultPillar({
  report,
  productId,
}: FounderProofVaultPillarProps) {
  return (
    <div className="space-y-3">
      <PillarDetailCard
        title="Founder Proof Vault"
        score={report.founder_proof_vault.score}
        critique={report.founder_proof_vault.critique}
        audit={report.founder_proof_vault.audit}
        icon="proof"
      />
      <Link
        href={`/dashboard/${productId}/audit/founder-proof`}
        className="block w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-center font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 hover:shadow-lg"
      >
        Full Founder Proof Audit
      </Link>
    </div>
  );
}
