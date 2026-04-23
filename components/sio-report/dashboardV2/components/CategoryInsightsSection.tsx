"use client";

import { Card } from "@/components/ui/card";

interface CategoryInsights {
  positioning: { statement: string; summary: string };
  clarity: { statement: string; summary: string };
  first_impression: { statement: string; summary: string };
  aeo: { statement: string; summary: string };
}

interface CategoryInsightsSectionProps {
  insights: CategoryInsights;
}

export function CategoryInsightsSection({
  insights,
}: CategoryInsightsSectionProps) {
  const categories = [
    { key: "positioning" as const, title: "Positioning", icon: "🎯" },
    { key: "clarity" as const, title: "Clarity", icon: "💡" },
    { key: "first_impression" as const, title: "First Impression", icon: "👁️" },
    { key: "aeo" as const, title: "AEO Audit", icon: "🤖" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {categories.map((category) => {
        const insight = insights[category.key];
        return (
          <Card key={category.key} className="border-slate-200 bg-white shadow-none rounded-xl">
            <div className="p-5 space-y-4">
              {/* Simple Header */}
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <span className="text-xl grayscale opacity-70">{category.icon}</span>
                <h4 className="text-sm font-semibold text-slate-800 tracking-tight">{category.title}</h4>
              </div>

              {/* Minimal Content */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Current State</div>
                  <p className="text-sm text-slate-500 leading-relaxed italic">
                    {insight.summary}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Diagnostic</div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {insight.statement}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
