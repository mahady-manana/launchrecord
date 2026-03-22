"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AuditAction } from "@/types/audit-report-v1";
import { AlertCircle, CheckCircle, Info, TrendingUp } from "lucide-react";
import { ExplainableActionItem } from "./explainable-action-item";
import { ExplainableScore } from "./explainable-score";

interface GradeBreakdown {
  label: string;
  range: string;
  whatItMeans: string;
  marketReality?: string;
  priority: string[];
  icon: "check" | "info" | "alert";
}

interface EnhancedPillarCardProps {
  title: string;
  description: string;
  score: number;
  band?: string;
  explanation: string;
  audit?: AuditAction[];
  icon?: React.ReactNode;
  guidanceLink?: string;
  fullAuditLink?: string;
  gradeInfo: GradeBreakdown;
}

export function EnhancedPillarCard({
  title,
  description,
  score,
  band,
  explanation,
  audit,
  icon,
  guidanceLink,
  fullAuditLink,
  gradeInfo,
}: EnhancedPillarCardProps) {
  const getIcon = () => {
    switch (gradeInfo.icon) {
      case "check":
        return <CheckCircle className="h-5 w-5" />;
      case "info":
        return <Info className="h-5 w-5" />;
      case "alert":
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getColorClass = () => {
    if (score >= 90) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 70) return "text-lime-600 bg-lime-50 border-lime-200";
    if (score >= 40) return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  return (
    <Card className="border-2 bg-gradient-to-br from-white to-slate-50 overflow-hidden">
      <CardHeader className="pb-3">
        {/* Title and Score Row */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {icon && <div className="text-orange-600">{icon}</div>}
              <CardTitle className="text-lg">{title}</CardTitle>
            </div>
            <CardDescription className="text-xs mt-0.5">
              {description}
            </CardDescription>
          </div>
          <ExplainableScore
            score={score}
            label={`${title} Score`}
            size="md"
            what={explanation}
            how="Score is calculated based on multiple factors specific to this metric."
            why="A higher score indicates better optimization and lower risk."
          />
        </div>

        {/* Grade Summary - Structured Format */}
        <div className={cn("rounded-lg border p-3 space-y-2", getColorClass())}>
          {/* Label + Range */}
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0">{getIcon()}</div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">{gradeInfo.label}</span>
              <Badge variant="outline" className="text-xs font-semibold">
                {gradeInfo.range}
              </Badge>
            </div>
          </div>

          {/* What It Means */}
          <p className="text-xs opacity-95 leading-relaxed">
            {gradeInfo.whatItMeans}
          </p>

          {/* Market Reality (if present) */}
          {gradeInfo.marketReality && (
            <div className="text-xs opacity-90 bg-white/50 rounded p-2">
              <span className="font-semibold">Market reality:</span>{" "}
              {gradeInfo.marketReality}
            </div>
          )}

          {/* Priority Actions as Bullets */}
          {gradeInfo.priority.length > 0 && (
            <div className="space-y-1">
              <div className="text-xs font-semibold">Focus on:</div>
              <ul className="space-y-0.5">
                {gradeInfo.priority.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-xs opacity-90 flex items-start gap-1.5"
                  >
                    <span className="flex-shrink-0 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Direct Explanation */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-sm text-slate-700 leading-relaxed">
            {explanation}
          </p>
          {guidanceLink && (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="mt-2 h-auto p-0 text-orange-600 hover:text-orange-700 text-xs"
            >
              <a href={guidanceLink}>Learn more →</a>
            </Button>
          )}
        </div>

        {/* Band/Level indicator */}
        {band && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Performance:</span>
            <Badge variant="outline" className="capitalize text-xs">
              {band}
            </Badge>
          </div>
        )}

        {/* Priority Actions */}
        {audit && audit.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Top Actions
            </div>
            {audit.slice(0, 3).map((action, idx) => (
              <ExplainableActionItem
                key={idx}
                action={action.action}
                priority={action.priority}
                why={`This action is prioritized at level ${action.priority} based on its potential impact.`}
                how="Implement this action by reviewing your current setup and making targeted improvements."
                example="For example, if this is about schema markup, add structured data to your pages."
              />
            ))}
          </div>
        )}

        {/* Full Audit Button */}
        {fullAuditLink && (
          <div className="pt-3 border-t border-slate-200">
            <Button
              asChild
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 h-11"
            >
              <a
                href={fullAuditLink}
                className="flex items-center justify-center gap-2"
              >
                <span className="text-sm">Run Full {title}</span>
                <span className="flex items-center justify-center w-6 h-6 bg-white/20 rounded-full text-xs">
                  →
                </span>
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
