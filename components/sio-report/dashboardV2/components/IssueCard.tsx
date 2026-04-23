"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
    Lightbulb,
    Lock,
    ShieldAlert,
    ShieldX,
    Sparkles
} from "lucide-react";
import { getMetricLabel } from "../metric-labels";

export interface Issue {
  id: string;
  category: "positioning" | "clarity" | "first_impression" | "aeo";
  severity: "critical" | "high" | "medium" | "low";
  statement: string;
  explanation?: string;
  current?: string;
  metricKey?: string;
  recommendations: string[];
  fixes: string[];
  isVisibleInFree?: boolean;
  isFixLocked?: boolean;
}

interface IssueCardProps {
  issue: Issue;
  isLocked?: boolean;
  showDetails?: boolean;
}

export function IssueCard({ issue, isLocked = false, showDetails = true }: IssueCardProps) {
  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "critical":
        return {
          border: "border-red-200 bg-red-50/30",
          accent: "bg-red-600",
          text: "text-red-700",
          badge: <Badge variant="outline" className="bg-red-600 text-white border-none px-2 py-0 h-5 text-[10px] font-black uppercase"><ShieldX className="w-3 h-3 mr-1" /> Critical Block</Badge>
        };
      case "high":
        return {
          border: "border-orange-200 bg-orange-50/30",
          accent: "bg-orange-500",
          text: "text-orange-700",
          badge: <Badge className="bg-orange-500 text-white border-none px-2 py-0 h-5 text-[10px] font-black uppercase"><ShieldAlert className="w-3 h-3 mr-1" /> High Friction</Badge>
        };
      case "medium":
        return {
          border: "border-yellow-200 bg-yellow-50/30",
          accent: "bg-yellow-400",
          text: "text-yellow-800",
          badge: <Badge variant="outline" className="bg-yellow-400 text-yellow-900 border-none px-2 py-0 h-5 text-[10px] font-black uppercase">Medium Impact</Badge>
        };
      default:
        return {
          border: "border-blue-200 bg-blue-50/30",
          accent: "bg-blue-500",
          text: "text-blue-700",
          badge: <Badge variant="outline" className="bg-blue-500 text-white border-none px-2 py-0 h-5 text-[10px] font-black uppercase">Optimization</Badge>
        };
    }
  };

  const styles = getSeverityStyles(issue.severity);

  return (
    <Card className={`group relative border shadow-sm transition-all duration-300 rounded-xl overflow-hidden ${styles.border} ${isLocked ? "opacity-60" : "hover:shadow-md"}`}>
      {/* Visual Accent */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${styles.accent}`} />
      
      <div className="p-5 space-y-4">
        {/* Header: Meta & Badges */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {styles.badge}
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
              {getMetricLabel(issue.metricKey || "")}
            </span>
          </div>
          {isLocked && <Lock className="w-4 h-4 text-slate-400" />}
        </div>

        {/* Statement: The "Problem" */}
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-800 leading-tight">
            {issue.statement}
          </h4>
          {showDetails && issue.explanation && (
            <p className="text-xs text-slate-500 leading-relaxed italic">
              {issue.explanation}
            </p>
          )}
        </div>

        {/* Value Section: Recommendations & Fixes */}
        {!isLocked && showDetails && (
          <div className="space-y-5 pt-4 border-t border-slate-200/50">
            {issue.recommendations.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-blue-700 font-bold text-[11px] uppercase tracking-widest">
                  <Lightbulb className="w-4 h-4" /> Strategy
                </div>
                <div className="text-sm text-slate-600 leading-relaxed font-medium pl-1">
                  {issue.recommendations[0]}
                </div>
              </div>
            )}
            
            {issue.fixes.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-[11px] uppercase tracking-widest">
                  <Sparkles className="w-4 h-4" /> Instant Fix
                </div>
                <div className="text-sm text-emerald-800 bg-emerald-50/30 border border-emerald-100/50 p-4 rounded-xl font-bold italic leading-relaxed">
                  "{issue.fixes[0]}"
                </div>
              </div>
            )}
          </div>
        )}

        {isLocked && (
          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium pt-2 italic">
            <Lock className="w-3 h-3" /> Upgrade to unlock detailed recommendations
          </div>
        )}
      </div>
    </Card>
  );
}
