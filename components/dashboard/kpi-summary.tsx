"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/stores/product-store";
import { AuditReportV1 } from "@/types/audit-report-v1";
import { AlertTriangle, CheckCircle, Package, TrendingUp } from "lucide-react";

interface KPISummaryProps {
  products: Product[];
  reports?: Record<string, AuditReportV1 | null>;
  className?: string;
}

export function KPISummary({
  products,
  reports = {},
  className,
}: KPISummaryProps) {
  const totalProducts = products.length;

  // Count products with audited scores
  const auditedProducts = products.filter((p) => {
    const report = reports[p.id];
    return (
      report?.overall_assessment?.composite_score !== undefined &&
      report.overall_assessment.composite_score !== null
    );
  }).length;

  // Count products with critical issues (score < 40)
  const criticalIssues = products.filter((p) => {
    const report = reports[p.id];
    const score = report?.overall_assessment?.composite_score || p.score || 0;
    return score < 40;
  }).length;

  // Count products with strong momentum (momentum score >= 70)
  const strongMomentum = products.filter((p) => {
    const report = reports[p.id];
    return (
      report?.momentum_signal?.score !== undefined &&
      report.momentum_signal.score >= 70
    );
  }).length;

  // Count products needing audit
  const needsAudit = totalProducts - auditedProducts;

  const kpis = [
    {
      title: "Total Products",
      value: totalProducts.toString(),
      description: "Products in portfolio",
      icon: Package,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      trend: null,
    },
    {
      title: "Audited",
      value: auditedProducts.toString(),
      description: `${needsAudit > 0 ? `${needsAudit} need` : "All"} audit${needsAudit !== 1 ? "s" : ""}`,
      icon: TrendingUp,
      gradient:
        needsAudit === 0
          ? "from-green-500 to-emerald-500"
          : "from-orange-500 to-amber-500",
      bgGradient:
        needsAudit === 0
          ? "from-green-50 to-emerald-50"
          : "from-orange-50 to-amber-50",
      trend: auditedProducts === totalProducts ? "positive" : null,
    },
    {
      title: "Critical Issues",
      value: criticalIssues.toString(),
      description: "Products need attention",
      icon: AlertTriangle,
      gradient:
        criticalIssues > 0
          ? "from-red-500 to-rose-500"
          : "from-green-500 to-emerald-500",
      bgGradient:
        criticalIssues > 0
          ? "from-red-50 to-rose-50"
          : "from-green-50 to-emerald-50",
      trend: criticalIssues > 0 ? "negative" : "positive",
    },
    {
      title: "Strong Momentum",
      value: strongMomentum.toString(),
      description: "Products with traction",
      icon: TrendingUp,
      gradient: "from-green-500 to-lime-500",
      bgGradient: "from-green-50 to-lime-50",
      trend: strongMomentum > 0 ? "positive" : null,
    },
  ];

  return (
    <div className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={kpi.title}
              className="group bg-white border-2 hover:shadow-lg transition-all duration-300 border-white overflow-hidden"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {kpi.title}
                  </CardTitle>
                  <div className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mt-1">
                    {kpi.value}
                  </div>
                </div>
                <div
                  className={`p-2.5 rounded-xl bg-gradient-to-br ${kpi.bgGradient} shadow-sm group-hover:shadow-md transition-shadow`}
                >
                  <Icon className={`h-4 w-4`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-slate-500">{kpi.description}</p>
                  {kpi.trend === "positive" && (
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  )}
                  {kpi.trend === "negative" && (
                    <AlertTriangle className="h-3 w-3 text-red-600" />
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
