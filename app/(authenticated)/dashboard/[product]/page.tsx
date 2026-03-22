"use client";

import { BillingOverview, SIOFivePillars } from "@/components/dashboard";
import {
  AEOCard,
  ClarityCard,
  MomentumCard,
  PositioningCard,
  ProofCard,
  SimplifiedEgoStab,
  SimplifiedOverallAssessment,
} from "@/components/explainable-report";
import { MissingDataBanner } from "@/components/missing-data-banner";
import {
  CategoryWeights,
  ProductDashboardHeader,
} from "@/components/product-dashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useProducts } from "@/hooks/use-products";
import { useProductStore } from "@/stores/product-store";
import { AuditReportV1 } from "@/types/audit-report-v1";
import {
  BarChart3,
  CheckCircle,
  Clock,
  HelpCircle,
  Info,
  RefreshCcw,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductDashboard() {
  const router = useRouter();
  const { selectedProduct } = useProductStore();
  const { fetchProducts } = useProducts();

  const [report, setReport] = useState<
    (AuditReportV1 & { createdAt?: string }) | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!selectedProduct) return;

    const fetchReport = async () => {
      try {
        const response = await fetch(
          `/api/products/${selectedProduct.id}/audit/latest`,
        );
        if (response.ok) {
          const data = await response.json();
          setReport(data.report || null);
        }
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [selectedProduct]);

  const handleRunAudit = () => {
    if (!selectedProduct) return;
    router.push(`/dashboard/${selectedProduct.id}/audit-page`);
  };

  const handleExport = () => {
    // Export feature coming soon
  };

  const handleSettings = () => {
    if (selectedProduct) {
      router.push(`/dashboard/${selectedProduct.id}/settings`);
    }
  };

  if (isLoading || !selectedProduct) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-orange-600 border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Loading product dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <ProductDashboardHeader
        onRunAudit={handleRunAudit}
        onExport={handleExport}
        onSettings={handleSettings}
      />

      {/* Missing Data Warning Banner */}
      <MissingDataBanner />

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Info className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-800">
              Intelligence Command Center
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              Complete SIO-V5 analysis for {selectedProduct.name}. Quick
              overview with score + what it means.
            </p>
          </div>
        </div>
      </div>

      {!report ? (
        /* No Report State */
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-orange-100 rounded-full">
                <BarChart3 className="h-12 w-12 text-orange-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">No Audit Available</CardTitle>
            <CardDescription>
              Run an audit to generate your SIO-V5 report
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={handleRunAudit} size="lg">
              <RefreshCcw className="h-5 w-5 mr-2" />
              Run First Audit
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Audit Date Badge */}
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">
                  Audit Report
                </p>
                <p className="text-xs text-slate-500">
                  {report?.createdAt
                    ? new Date(report.createdAt).toLocaleString()
                    : "Date unavailable"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-blue-600 hover:text-blue-700"
              >
                <a href={`/dashboard/${selectedProduct.id}/guidance/overview`}>
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Guide
                </a>
              </Button>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Completed
              </Badge>
            </div>
          </div>

          {/* Calculate composite score */}
          {(() => {
            const compositeScore = report.overall_assessment.composite_score;

            return (
              <>
                {/* Overall Assessment */}
                <SimplifiedOverallAssessment
                  report={report}
                  productName={selectedProduct.name}
                />

                {/* Ego Stab */}
                <SimplifiedEgoStab
                  report={report}
                  compositeScore={compositeScore}
                />
              </>
            );
          })()}

          {/* 5 Pillars Overview */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">SIO-V5 Pillars</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link
                  href={`/dashboard/${selectedProduct.id}/guidance/overview`}
                >
                  <Info className="h-4 w-4 mr-2" />
                  Learn more
                </Link>
              </Button>
            </div>
            <SIOFivePillars
              aeoScore={report.aeo_index.score}
              positioningScore={report.positioning_sharpness.score}
              clarityScore={report.clarity_velocity.score}
              momentumScore={report.momentum_signal.score}
              proofScore={report.founder_proof_vault.score}
              size="lg"
            />
          </div>

          {/* Individual Pillar Cards with Grade Summary at Top */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Detailed Analysis</h2>
              <p className="text-xs text-muted-foreground">
                Score + what it means at a glance
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              <AEOCard
                report={report}
                productId={selectedProduct.id}
                fullAuditLink={`/dashboard/${selectedProduct.id}/audit/aeo`}
              />
              <PositioningCard
                report={report}
                productId={selectedProduct.id}
                fullAuditLink={`/dashboard/${selectedProduct.id}/audit/positioning`}
              />
              <ClarityCard
                report={report}
                productId={selectedProduct.id}
                fullAuditLink={`/dashboard/${selectedProduct.id}/audit/clarity`}
              />
              <MomentumCard
                report={report}
                productId={selectedProduct.id}
                fullAuditLink={`/dashboard/${selectedProduct.id}/audit/momentum`}
              />
              <ProofCard
                report={report}
                productId={selectedProduct.id}
                fullAuditLink={`/dashboard/${selectedProduct.id}/audit/proof`}
              />
            </div>
          </div>

          {/* Competitors */}
          {report.top_competitors.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-orange-600" />
                  <CardTitle>Top Competitors</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {report.top_competitors.map((competitor, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <span className="font-medium">{competitor.name}</span>
                      <Badge
                        className={
                          competitor.threat_level === "high"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : competitor.threat_level === "medium"
                              ? "bg-orange-50 text-orange-700 border-orange-200"
                              : "bg-green-50 text-green-700 border-green-200"
                        }
                      >
                        {competitor.threat_level} threat
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Category Weights */}
          <CategoryWeights report={report} />

          {/* Product Billing */}
          <BillingOverview
            billings={[
              {
                productId: selectedProduct.id,
                productName: selectedProduct.name,
                plan: "free",
                status: "active",
              },
            ]}
          />
        </>
      )}
    </div>
  );
}
