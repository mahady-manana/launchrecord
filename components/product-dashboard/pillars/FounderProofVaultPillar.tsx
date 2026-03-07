"use client";

import { PillarDetailCard } from "@/components/dashboard/pillar-card";
import { AuditReportV1 } from "@/types/audit-report-v1";

interface FounderProofVaultPillarProps {
  report: AuditReportV1;
}

export function FounderProofVaultPillar({ report }: FounderProofVaultPillarProps) {
  return (
    <PillarDetailCard
      title="Founder Proof Vault"
      score={report.founder_proof_vault.score}
      critique={report.founder_proof_vault.critique}
      audit={report.founder_proof_vault.audit}
      icon="proof"
    />
  );
}
