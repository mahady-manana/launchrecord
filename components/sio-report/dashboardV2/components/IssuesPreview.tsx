"use client";

import { Lock, UserPlus } from "lucide-react";
import { Issue, IssueCard } from "./IssueCard";
import { IssuesStatusSummary } from "./IssuesStatusSummary";

interface IssuesPreviewProps {
  issues: Issue[];
  onViewAll: () => void;
}

export function IssuesPreview({ issues, onViewAll }: IssuesPreviewProps) {
  // Extract specific counts: 1 critical, 2 high, 2 medium, 2 low
  const getTopIssues = () => {
    const critical = issues.filter((i) => i.severity === "critical").slice(0, 1);
    const high = issues.filter((i) => i.severity === "high").slice(0, 2);
    const mdm = issues.filter((i) => i.severity === "medium").slice(0, 2);
    const low = issues.filter((i) => i.severity === "low").slice(0, 2);
    
    return [...critical, ...high, ...mdm, ...low];
  };

  const previewIssues = getTopIssues();

  const counts = {
    critical: issues.filter((i) => i.severity === "critical").length,
    high: issues.filter((i) => i.severity === "high").length,
    medium: issues.filter((i) => i.severity === "medium").length,
    low: issues.filter((i) => i.severity === "low").length,
  };

  if (previewIssues.length === 0) return null;

  return (
    <div className="bg-slate-50/50 rounded-2xl border border-slate-200/60 p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
            Priority Action Items
          </h3>
          <p className="text-sm text-slate-500 mt-1">Foundational changes to maximize conversion potential.</p>
        </div>
      </div>

      <IssuesStatusSummary issues={issues} />

      <div className="grid grid-cols-1 gap-6">
        {previewIssues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>
      
      {/* Signup CTA / Paywall Block */}
      <div className="mt-10 bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl border border-slate-800">
        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left md:max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-[10px] font-bold uppercase tracking-widest">
              <Lock className="w-3 h-3" /> Paywalled Insights
            </div>
            <h4 className="text-2xl font-black tracking-tight leading-tight">
              Unlock the remaining {issues.length - previewIssues.length} high-impact fixes.
            </h4>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">
              Build an audit-proof conversion engine. Sign up to access every tactical recommendation, competitive benchmark, and copy-paste ready fix.
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto">
            <button 
              onClick={() => window.location.href = '/api/auth/login'}
              className="group h-14 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98]"
            >
              <UserPlus className="w-4 h-4" /> Sign Up & Unlock Report
            </button>
            <p className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              Join 500+ A-Player Founders
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
