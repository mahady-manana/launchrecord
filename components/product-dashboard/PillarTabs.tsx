"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuditReportV1 } from "@/types/audit-report-v1";
import {
  AEOPresencePillar,
  ClarityVelocityPillar,
  FounderProofVaultPillar,
  MomentumSignalPillar,
  PositioningSharpnessPillar,
} from "./pillars";

interface PillarTabsProps {
  report: AuditReportV1;
  productId: string;
}

export function PillarTabs({ report, productId }: PillarTabsProps) {
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
          <AEOPresencePillar report={report} productId={productId} />
          <PositioningSharpnessPillar report={report} productId={productId} />
          <ClarityVelocityPillar report={report} productId={productId} />
          <MomentumSignalPillar report={report} productId={productId} />
          <FounderProofVaultPillar report={report} productId={productId} />
        </div>
      </TabsContent>

      <TabsContent value="aeo">
        <AEOPresencePillar report={report} productId={productId} />
      </TabsContent>

      <TabsContent value="positioning">
        <PositioningSharpnessPillar report={report} productId={productId} />
      </TabsContent>

      <TabsContent value="clarity">
        <ClarityVelocityPillar report={report} productId={productId} />
      </TabsContent>

      <TabsContent value="momentum">
        <MomentumSignalPillar report={report} productId={productId} />
      </TabsContent>

      <TabsContent value="proof">
        <FounderProofVaultPillar report={report} productId={productId} />
      </TabsContent>
    </Tabs>
  );
}
