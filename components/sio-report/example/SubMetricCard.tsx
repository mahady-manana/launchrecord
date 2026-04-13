"use client";

import { SubMetric } from "@/research/sio-v5-report-schema";
import { ActionItemCard } from "./ActionItemCard";

interface SubMetricCardProps {
  subMetric: SubMetric;
}

export function SubMetricCard({ subMetric }: SubMetricCardProps) {
  const scoreColor =
    subMetric.score >= 70
      ? "text-green-600"
      : subMetric.score >= 50
        ? "text-yellow-600"
        : subMetric.score >= 30
          ? "text-orange-600"
          : "text-red-600";

  const scoreBg =
    subMetric.score >= 70
      ? "bg-green-50"
      : subMetric.score >= 50
        ? "bg-yellow-50"
        : subMetric.score >= 30
          ? "bg-orange-50"
          : "bg-red-50";

  return (
    <div className="border border-slate-200 rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-slate-800">
          {subMetric.statement}
        </h3>
        <div
          className={`px-2 py-1 rounded-full text-xs font-bold ${scoreBg} ${scoreColor}`}
        >
          {subMetric.score}/100
        </div>
      </div>

      <p className="text-slate-600 text-xs leading-relaxed mb-3">
        {subMetric.statement}
      </p>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase">
            Actions ({subMetric.actions.length})
          </span>
        </div>
        <div className="grid gap-2">
          {subMetric.actions.map((action, idx) => (
            <ActionItemCard key={idx} action={action} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}
