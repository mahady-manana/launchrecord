"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AuditAction } from "@/types/audit-report-v1";
import {
  Award,
  CheckCircle,
  ChevronRight,
  Globe,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { CircularScore } from "./sio-circular-score";

interface PillarDetailCardProps {
  title: string;
  score: number;
  band?: string;
  critique: string;
  audit: AuditAction[];
  icon: "aeo" | "positioning" | "clarity" | "momentum" | "proof";
  className?: string;
  onExpand?: () => void;
}

const iconMap = {
  aeo: Globe,
  positioning: Target,
  clarity: Zap,
  momentum: TrendingUp,
  proof: Award,
};

const bandColorMap: Record<string, string> = {
  dominant: "bg-green-50 text-green-700 border-green-200",
  strong: "bg-lime-50 text-lime-700 border-lime-200",
  instant: "bg-green-50 text-green-700 border-green-200",
  clear: "bg-lime-50 text-lime-700 border-lime-200",
  viral: "bg-green-50 text-green-700 border-green-200",
  rising: "bg-lime-50 text-lime-700 border-lime-200",
  blended: "bg-blue-50 text-blue-700 border-blue-200",
  average: "bg-blue-50 text-blue-700 border-blue-200",
  stable: "bg-blue-50 text-blue-700 border-blue-200",
  weak: "bg-orange-50 text-orange-700 border-orange-200",
  confusing: "bg-orange-50 text-orange-700 border-orange-200",
  flat: "bg-orange-50 text-orange-700 border-orange-200",
  ghost: "bg-red-50 text-red-700 border-red-200",
  opaque: "bg-red-50 text-red-700 border-red-200",
  dead: "bg-red-50 text-red-700 border-red-200",
};

export function PillarDetailCard({
  title,
  score,
  band,
  critique,
  audit,
  icon,
  className,
  onExpand,
}: PillarDetailCardProps) {
  const Icon = iconMap[icon];

  const getPriorityColor = (priority: number) => {
    if (priority >= 80) return "bg-red-100 text-red-700";
    if (priority >= 50) return "bg-orange-100 text-orange-700";
    return "bg-blue-100 text-blue-700";
  };

  return (
    <Card className={cn("transition-all hover:shadow-md", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "p-2 rounded-lg",
                score >= 70
                  ? "bg-green-100"
                  : score >= 40
                    ? "bg-orange-100"
                    : "bg-red-100",
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5",
                  score >= 70
                    ? "text-green-600"
                    : score >= 40
                      ? "text-orange-600"
                      : "text-red-600",
                )}
              />
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              {band && (
                <Badge
                  className={cn(
                    "mt-1",
                    bandColorMap[band.toLowerCase()] ||
                      "bg-muted text-muted-foreground",
                  )}
                >
                  {band}
                </Badge>
              )}
            </div>
          </div>
          <CircularScore score={score} label="" size="sm" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">{critique}</p>
        </div>

        {audit.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Priority Actions
            </div>
            {audit.map((action, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 text-sm p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="flex-1">{action.action}</span>
                <Badge
                  variant="secondary"
                  className={cn("text-xs", getPriorityColor(action.priority))}
                >
                  P{action.priority}
                </Badge>
              </div>
            ))}
          </div>
        )}

        {onExpand && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-2"
            onClick={onExpand}
          >
            View Full Analysis
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

interface PillarOverviewProps {
  title: string;
  score: number;
  icon: "aeo" | "positioning" | "clarity" | "momentum" | "proof";
  onClick?: () => void;
  className?: string;
}

export function PillarOverview({
  title,
  score,
  icon,
  onClick,
  className,
}: PillarOverviewProps) {
  const Icon = iconMap[icon];

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 70) return "text-lime-600 bg-lime-50 border-lime-200";
    if (score >= 40) return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const colorClass = getScoreColor(score);

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]",
        "border-2",
        colorClass,
        className,
      )}
      onClick={onClick}
    >
      <CardContent className="p-4 flex items-center gap-4">
        <div className={cn("p-3 rounded-full", colorClass)}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-muted-foreground">
            {title}
          </div>
          <div className={cn("text-2xl font-bold", colorClass)}>{score}</div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </CardContent>
    </Card>
  );
}
