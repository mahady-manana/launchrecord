"use client";

import {
  AwardIcon,
  CircularScore,
  GlobeIcon,
  TargetIcon,
  TrendingUpIcon,
  ZapIcon,
} from "@/components/dashboard/sio-circular-score";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { getProductStatus } from "@/lib/product-status";
import { cn } from "@/lib/utils";
import { SIOV5Report } from "@/services/sio-report/schema";
import { ProductWithReport } from "@/stores/product-store";
import clsx from "clsx";
import { AlertCircle, BarChart3, Crown, Globe, RefreshCcw } from "lucide-react";
import Link from "next/link";

interface ProductSectionProps {
  product: ProductWithReport;
  report?: SIOV5Report | null;
  onViewProduct: () => void;
}

export function ProductSection({
  product,
  report,
  onViewProduct,
}: ProductSectionProps) {
  const compositeScore = report?.overallScore || product.score || 0;
  const status = getProductStatus(compositeScore);

  const getStatusStyle = (color: string) => {
    if (color.includes("purple"))
      return {
        bg: "bg-gradient-to-br from-purple-500 to-purple-600",
        text: "text-purple-600",
        light: "from-purple-50 to-purple-100/50",
        shadow: "shadow-purple-500/25",
      };
    if (color.includes("green"))
      return {
        bg: "bg-gradient-to-br from-green-500 to-emerald-600",
        text: "text-green-600",
        light: "from-green-50 to-emerald-100/50",
        shadow: "shadow-green-500/25",
      };
    if (color.includes("blue"))
      return {
        bg: "bg-gradient-to-br from-blue-500 to-cyan-600",
        text: "text-blue-600",
        light: "from-blue-50 to-cyan-100/50",
        shadow: "shadow-blue-500/25",
      };
    if (color.includes("orange"))
      return {
        bg: "bg-gradient-to-br from-orange-500 to-amber-600",
        text: "text-orange-600",
        light: "from-orange-50 to-amber-100/50",
        shadow: "shadow-orange-500/25",
      };
    return {
      bg: "bg-gradient-to-br from-red-500 to-rose-600",
      text: "text-red-600",
      light: "from-red-50 to-rose-100/50",
      shadow: "shadow-red-500/25",
    };
  };

  const statusStyle = getStatusStyle(status.color);

  return (
    <Card
      className={clsx(
        "group relative overflow-hidden border-2 shadow-xl shadow-slate-200/50 hover:shadow-2xl",
        "hover:shadow-slate-300/60 transition-all duration-500 to-white",
        "bg-white",
      )}
    >
      {/* Decorative gradient orb */}
      <div
        className={cn(
          "absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500",
          statusStyle.bg,
        )}
      />

      {/* Product Header */}
      <div className="relative p-6 pb-5 border-b border-slate-200/60">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Logo with glow effect */}
            <div className="relative">
              <div
                className={cn(
                  "absolute inset-0 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500",
                  statusStyle.bg,
                )}
              />
              {product.logo ? (
                <img
                  src={product.logo}
                  alt={product.name}
                  className="relative h-14 w-14 rounded-2xl object-cover shadow-lg ring-2 ring-white"
                />
              ) : (
                <div
                  className={cn(
                    "relative h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-white bg-gradient-to-br",
                    statusStyle.light,
                  )}
                >
                  <Globe className={cn("h-7 w-7", statusStyle.text)} />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="pt-0.5">
              <CardTitle className="text-lg font-bold text-slate-900 leading-tight">
                {product.name}
              </CardTitle>
              {product.tagline ? (
                <CardDescription className="mt-1.5 text-sm text-slate-500 font-medium line-clamp-1 max-w-md">
                  {product.tagline}
                </CardDescription>
              ) : (
                <div className="mt-2 h-4" />
              )}
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex gap-3">
            <Link
              href={`/dashboard/${product._id}/subscription`}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-bold tracking-wide uppercase shadow-lg bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 transition-all",
                "text-white flex items-center gap-1",
              )}
            >
              <Crown className="h-3 w-3 inline mr-1" />
              Upgrade
            </Link>
            <div
              className={cn(
                "px-4 py-2 rounded-full text-xs font-bold tracking-wide uppercase shadow-lg",
                statusStyle.bg,
                statusStyle.shadow,
                "text-white  flex items-center gap-1",
              )}
            >
              {status.status}
            </div>
            <Link
              href={"/dashboard/" + product._id}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-bold tracking-wide uppercase shadow-lg bg-white flex items-center gap-1",
              )}
            >
              View dashboard
            </Link>
          </div>
        </div>
      </div>

      <CardContent className="relative p-6 pt-5">
        {!report ? (
          <div
            className={cn(
              "relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br",
              statusStyle.light,
              "border border-slate-200/60",
            )}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-2xl" />
            <div className="relative flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "p-3 rounded-xl bg-gradient-to-br shadow-lg",
                    statusStyle.bg,
                    statusStyle.shadow,
                  )}
                >
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    No audit available
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5 font-medium">
                    Run an audit to analyze {product.name}
                  </p>
                </div>
              </div>
              <Link
                href={"/dashboard/" + product._id + "/audit-page"}
                className={cn(
                  "h-10 px-5 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl",
                  statusStyle.bg,
                  statusStyle.shadow,
                  "text-white flex items-center gap-2",
                )}
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                <span>Run Audit</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Score Section - Enhanced layout */}
            <div className="flex items-center gap-6">
              {/* Overall Score with decorative ring */}
              <div className="relative flex-shrink-0">
                <div
                  className={cn(
                    "absolute inset-0 rounded-full blur-xl opacity-30",
                    statusStyle.bg,
                  )}
                />
                <div className="relative">
                  <CircularScore score={compositeScore} size="lg" />
                </div>
              </div>

              {/* Elegant divider */}
              <div className="w-px h-24 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200" />

              {/* 5 Pillar Scores - Enhanced cards with insights */}
              <div className="flex-1">
                <div className="grid grid-cols-5 gap-3">
                  <PillarScoreCard
                    score={report.aeo.score}
                    label="AEO Presence"
                    insight={report.aeo.statement}
                    icon={GlobeIcon}
                    description="Track your AEO presence accross multiple AI"
                    productId={product._id}
                    pillar="aeo"
                  />
                  <PillarScoreCard
                    score={report.positioning.score}
                    label="Positioning"
                    insight={report.positioning.statement}
                    icon={TargetIcon}
                    description="Keep an eye on your positioning"
                    productId={product._id}
                    pillar="positioning"
                  />
                  <PillarScoreCard
                    score={report.clarity.score}
                    label="Product Clarity"
                    insight={report.clarity.statement}
                    icon={ZapIcon}
                    description="Pay attention to Time-To-Aha"
                    productId={product._id}
                    pillar="clarity"
                  />
                  <PillarScoreCard
                    score={report.overallScore}
                    label="Momentum"
                    insight={report.statement}
                    icon={TrendingUpIcon}
                    description="Find the best momentum to gear up your product"
                    productId={product._id}
                    pillar="momentum"
                  />
                  <PillarScoreCard
                    score={report.overallScore}
                    label="Proof Vault"
                    insight={
                      report.overallCommentPositive[0] ||
                      "Build your proof vault"
                    }
                    icon={AwardIcon}
                    description="Prove we are wrong"
                    productId={product._id}
                    pillar="proof"
                  />
                </div>
              </div>
            </div>

            {/* Insights Bar - Enhanced */}
            {report.overallCommentNegative.length > 0 && (
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/50 border border-slate-200/60 p-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 shadow-md shadow-orange-500/20">
                    <AlertCircle className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Constraint:
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {report.overallCommentNegative[0]}
                  </span>
                </div>
              </div>
            )}

            {/* Actions - Enhanced buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-200/60">
              <Button
                variant="outline"
                size="sm"
                onClick={onViewProduct}
                className="flex-1 h-11 rounded-xl text-sm font-semibold border-slate-200 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 hover:text-orange-600 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Full Report
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface PillarScoreCardProps {
  score: number;
  label: string;
  insight?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
  productId: string;
  pillar: "aeo" | "positioning" | "clarity" | "momentum" | "proof";
}

function PillarScoreCard({
  score,
  label,
  insight,
  icon: Icon,
  description,
  productId,
  pillar,
}: PillarScoreCardProps) {
  const getScoreStyle = (score: number) => {
    if (score >= 90)
      return {
        bg: "from-green-500 to-emerald-500",
        text: "text-green-600",
        light: "bg-green-50",
        shadow: "shadow-green-500/25",
        border: "border-green-200",
      };
    if (score >= 70)
      return {
        bg: "from-lime-500 to-green-500",
        text: "text-lime-600",
        light: "bg-lime-50",
        shadow: "shadow-lime-500/25",
        border: "border-lime-200",
      };
    if (score >= 40)
      return {
        bg: "from-orange-500 to-amber-500",
        text: "text-orange-600",
        light: "bg-orange-50",
        shadow: "shadow-orange-500/25",
        border: "border-orange-200",
      };
    return {
      bg: "from-red-500 to-rose-500",
      text: "text-red-600",
      light: "bg-red-50",
      shadow: "shadow-red-500/25",
      border: "border-red-200",
    };
  };

  const style = getScoreStyle(score);

  const pillarUrlMap = {
    aeo: "audit/aeo",
    positioning: "audit/positioning",
    clarity: "audit/clarity",
    momentum: "audit/momentum",
    proof: "audit/founder-proof",
  };

  return (
    <div
      className={cn(
        "group/pillar relative flex flex-col items-center p-3.5 rounded-md bg-white border transition-all duration-300 hover:-translate-y-1",
        style.border,
        "hover:shadow-xl",
      )}
    >
      {/* Subtle hover gradient */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover/pillar:opacity-10 transition-opacity duration-300",
          style.light.replace("bg-", "from-"),
          "to-transparent",
        )}
      />

      {/* Score Circle */}
      <div className="relative mb-2.5">
        <CircularScore score={score} size="sm" icon={Icon} />
      </div>

      {/* Label */}
      <span className="relative text-[10px] font-bold text-slate-700 uppercase tracking-wide text-center">
        {label}
      </span>

      {/* Score Number */}
      <span className={cn("relative text-xs text-center mt-2 text-slate-600")}>
        {description}
      </span>

      {/* Insight Text */}
      {insight && (
        <div className="relative mt-2.5 pt-2.5 border-t border-slate-100 w-full">
          <p className="text-[9px] leading-tight text-slate-500 font-medium text-center line-clamp-2">
            {insight}
          </p>
        </div>
      )}

      {/* Full Audit CTA Button */}
      <Link
        href={`/dashboard/${productId}/${pillarUrlMap[pillar]}`}
        className={cn(
          "relative mt-2.5 w-full px-2 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-wide transition-all duration-300 hover:shadow-md",
          style.bg,
          "text-white",
        )}
      >
        Full Audit
      </Link>
    </div>
  );
}
