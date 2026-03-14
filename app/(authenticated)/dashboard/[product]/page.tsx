"use client";

import { BillingOverview, SIOFivePillars } from "@/components/dashboard";
import {
  CategoryWeights,
  EgoStab,
  OverallAssessment,
  PillarTabs,
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
  Info,
  RefreshCcw,
  Shield,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProductDashboardProps {
  params: Promise<{ product: string }>;
}

export default function ProductDashboard({ params }: ProductDashboardProps) {
  const router = useRouter();
  const { products, selectedProduct, setSelectedProduct } = useProductStore();
  const { fetchProducts, updateProduct } = useProducts();

  const [product, setProduct] = useState<typeof selectedProduct>(null);
  const [report, setReport] = useState<
    (AuditReportV1 & { createdAt?: string }) | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      const { product: productId } = await params;
      await fetchProducts();

      const foundProduct = products.find(
        (p) => p.id === productId || p._id === productId,
      );
      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedProduct(foundProduct);
        await fetchReport(productId);
      } else {
        router.push("/dashboard");
      }
    }
    loadProduct();
  }, [params]);

  const fetchReport = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}/audit/latest`);
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

  const handleRunAudit = () => {
    if (!product) return;
    router.push(`/dashboard/${product.id}/audit-page`);
  };

  const handleExport = () => {
    // Export feature coming soon
  };

  const handleSettings = () => {
    if (product) {
      router.push(`/dashboard/${product.id}/settings`);
    }
  };

  if (isLoading || !product) {
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
    <div className="space-y-8">
      {/* Header */}
      <ProductDashboardHeader
        onRunAudit={handleRunAudit}
        onExport={handleExport}
        onSettings={handleSettings}
      />

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
              Complete SIO-V5 analysis for {product.name}. Track defensibility
              across 5 key pillars.
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
              Run an audit to generate the complete SIO-V5 intelligence report
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
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Completed
            </Badge>
          </div>

          {/* Calculate composite score */}
          {(() => {
            const compositeScore = report.overall_assessment.composite_score;

            return (
              <>
                {/* Overall Assessment */}
                <OverallAssessment report={report} productName={product.name} />

                {/* Ego Stab - Score-based insights card */}
                <EgoStab report={report} compositeScore={compositeScore} />
              </>
            );
          })()}

          {/* 5 Pillars Overview */}
          <div>
            <h2 className="text-xl font-semibold mb-4">SIO-V5 Pillars</h2>
            <SIOFivePillars
              aeoScore={report.aeo_index.score}
              positioningScore={report.positioning_sharpness.score}
              clarityScore={report.clarity_velocity.score}
              momentumScore={report.momentum_signal.score}
              proofScore={report.founder_proof_vault.score}
              size="lg"
            />
          </div>

          {/* Pillar Tabs with Detailed Analysis */}
          <PillarTabs report={report} />

          {/* Competitors */}
          {report.top_competitors.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-orange-600" />
                  <CardTitle>Top Competitors</CardTitle>
                </div>
                <CardDescription>
                  Competitive landscape analysis
                </CardDescription>
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
                productId: product.id,
                productName: product.name,
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
