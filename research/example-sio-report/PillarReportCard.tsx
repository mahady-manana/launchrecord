"use client";

import { ReportSection } from "../sio-v5-report-schema";
import { ActionItemCard } from "./ActionItemCard";
import { SubMetricCard } from "./SubMetricCard";

interface PillarReportCardProps {
  title: string;
  section: ReportSection;
  icon: React.ReactNode;
  color: string;
}

export function PillarReportCard({
  title,
  section,
  icon,
  color,
}: PillarReportCardProps) {
  const scoreColor =
    section.score >= 70
      ? "text-green-600"
      : section.score >= 50
        ? "text-yellow-600"
        : section.score >= 30
          ? "text-orange-600"
          : "text-red-600";

  const scoreBg =
    section.score >= 70
      ? "bg-green-50"
      : section.score >= 50
        ? "bg-yellow-50"
        : section.score >= 30
          ? "bg-orange-50"
          : "bg-red-50";

  return (
    <div className="border border-slate-200 rounded-xl p-6 bg-white">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}
        >
          {icon}
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          <div
            className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${scoreBg} ${scoreColor}`}
          >
            Score: {section.score}/100
          </div>
        </div>
      </div>

      <p className="text-slate-600 leading-relaxed mb-6">{section.statement}</p>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
          Top Actions ({section.actions.length})
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          {section.actions.slice(0, 4).map((action, idx) => (
            <ActionItemCard key={idx} action={action} index={idx} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
          Detailed Breakdown
        </h3>
        <div className="grid gap-3">
          {section.subMetrics.map((subMetric, idx) => (
            <SubMetricCard key={idx} subMetric={subMetric} />
          ))}
        </div>
      </div>
    </div>
  );
}
