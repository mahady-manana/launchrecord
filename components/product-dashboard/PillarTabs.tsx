"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuditReportV1 } from "@/types/audit-report-v1";
import {
  AEOPresencePillar,
  PositioningSharpnessPillar,
  ClarityVelocityPillar,
  MomentumSignalPillar,
  FounderProofVaultPillar,
} from "./pillars";

interface PillarTabsProps {
  report: AuditReportV1;
}

export function PillarTabs({ report }: PillarTabsProps) {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="aeo">AEO</TabsTrigger>
        <TabsTrigger value="positioning">Positioning</TabsTrigger>
        <TabsTrigger value="clarity">Clarity</TabsTrigger>
        <TabsTrigger value="momentum">Momentum</TabsTrigger>
        <TabsTrigger value="proof">Proof</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <AEOPresencePillar report={report} />
          <PositioningSharpnessPillar report={report} />
          <ClarityVelocityPillar report={report} />
          <MomentumSignalPillar report={report} />
          <FounderProofVaultPillar report={report} />
        </div>
      </TabsContent>

      <TabsContent value="aeo">
        <AEOPresencePillar report={report} />
      </TabsContent>

      <TabsContent value="positioning">
        <PositioningSharpnessPillar report={report} />
      </TabsContent>

      <TabsContent value="clarity">
        <ClarityVelocityPillar report={report} />
      </TabsContent>

      <TabsContent value="momentum">
        <MomentumSignalPillar report={report} />
      </TabsContent>

      <TabsContent value="proof">
        <FounderProofVaultPillar report={report} />
      </TabsContent>
    </Tabs>
  );
}
