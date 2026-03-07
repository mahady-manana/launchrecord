"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Product } from "@/stores/product-store";
import { AuditReportV1 } from "@/types/audit-report-v1";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Award,
  BarChart3,
  Globe,
  Plus,
  RefreshCcw,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

interface ProductOverviewCardProps {
  product: Product;
  report?: AuditReportV1 | null;
  onViewProduct: (productId: string) => void;
  onRunAudit?: (productId: string) => void;
  className?: string;
}

interface PillarScoreProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  score: number;
}

function PillarScore({ icon: Icon, label, score }: PillarScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-lime-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/30 flex-1">
      <Icon className={cn("h-4 w-4", getScoreColor(score))} />
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={cn("text-lg font-bold", getScoreColor(score))}>
        {score}
      </span>
    </div>
  );
}

export function ProductOverviewCard({
  product,
  report,
  onViewProduct,
  onRunAudit,
  className,
}: ProductOverviewCardProps) {
  const compositeScore = report?.overall_assessment?.composite_score || product.score || 0;

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-lime-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getCategoryPosition = (score: number) => {
    if (score >= 80) return { label: "Leader", color: "text-green-700 bg-green-50 border-green-200" };
    if (score >= 60) return { label: "Challenger", color: "text-blue-700 bg-blue-50 border-blue-200" };
    if (score >= 40) return { label: "Replicable", color: "text-orange-700 bg-orange-50 border-orange-200" };
    return { label: "Invisible", color: "text-red-700 bg-red-50 border-red-200" };
  };

  const position = getCategoryPosition(compositeScore);

  return (
    <Card className={cn("transition-all hover:shadow-lg group", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            {product.logo ? (
              <img
                src={product.logo}
                alt={product.name}
                className="h-10 w-10 rounded-lg object-cover border"
              />
            ) : (
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <Globe className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate">{product.name}</CardTitle>
              {product.tagline && (
                <CardDescription className="truncate">
                  {product.tagline}
                </CardDescription>
              )}
            </div>
          </div>
          <div className={cn(
            "px-3 py-1 rounded-full text-sm font-semibold border",
            position.color
          )}>
            {position.label}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Overall Score */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
          <div>
            <div className="text-sm text-muted-foreground">Overall SIO Score</div>
            <div className={cn("text-3xl font-bold", getScoreColor(compositeScore))}>
              {compositeScore}
              <span className="text-lg text-muted-foreground">/100</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Defensibility</div>
            <div className="text-sm font-medium">
              {compositeScore >= 70 ? "Strong" : compositeScore >= 40 ? "Moderate" : "Critical"}
            </div>
          </div>
        </div>

        {/* 5 Pillars Scores */}
        {report ? (
          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              SIO-V5 Pillar Scores
            </div>
            <div className="grid grid-cols-5 gap-2">
              <PillarScore
                icon={Globe}
                label="AEO"
                score={report.aeo_index.score}
              />
              <PillarScore
                icon={Target}
                label="Position"
                score={report.positioning_sharpness.score}
              />
              <PillarScore
                icon={Zap}
                label="Clarity"
                score={report.clarity_velocity.score}
              />
              <PillarScore
                icon={TrendingUp}
                label="Momentum"
                score={report.momentum_signal.score}
              />
              <PillarScore
                icon={Award}
                label="Proof"
                score={report.founder_proof_vault.score}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 p-4 rounded-lg bg-orange-50 border border-orange-200">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            <div className="flex-1 text-sm text-orange-800">
              No audit yet. Run an audit to see detailed insights.
            </div>
          </div>
        )}

        {/* Critical Issues */}
        {report && report.overall_assessment.primary_constraint && (
          <div className="flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <span className="text-muted-foreground">Primary constraint:</span>
            <span className="font-medium capitalize">{report.overall_assessment.primary_constraint}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 pt-4 border-t">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onViewProduct(product.id)}
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Dashboard
        </Button>
        {onRunAudit && (
          <Button
            size="sm"
            className="flex-1"
            onClick={() => onRunAudit(product.id)}
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Audit
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

interface AddProductCardProps {
  onAdd: () => void;
  className?: string;
}

export function AddProductCard({ onAdd, className }: AddProductCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] border-2 border-dashed",
        "flex items-center justify-center min-h-[400px]",
        className
      )}
      onClick={onAdd}
    >
      <CardContent className="flex flex-col items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
          <Plus className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="text-center">
          <div className="font-semibold">Add New Product</div>
          <div className="text-sm text-muted-foreground">
            Track another product in your portfolio
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
