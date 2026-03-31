"use client";

import { Action } from "../sio-v5-report-schema";

interface ActionItemCardProps {
  action: Action;
  index: number;
}

export function ActionItemCard({ action, index }: ActionItemCardProps) {
  const priorityColor =
    action.priority >= 90
      ? "bg-red-500"
      : action.priority >= 75
        ? "bg-orange-500"
        : action.priority >= 50
          ? "bg-yellow-500"
          : "bg-slate-500";

  const priorityLabel =
    action.priority >= 90
      ? "Critical"
      : action.priority >= 75
        ? "High"
        : action.priority >= 50
          ? "Medium"
          : "Low";

  return (
    <div className="border border-slate-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow relative">
      {/* Floating Priority Badge */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${priorityColor}`} />
        <span className="text-xs font-bold text-slate-700">
          {action.priority}
        </span>
      </div>

      <div className="space-y-2 pr-20">
        <p className="text-slate-800 text-xs font-semibold leading-relaxed">
          {action.problem}
        </p>

        <p className="text-slate-600 text-xs leading-relaxed">
          {action.solution}
        </p>

        <div className="bg-slate-50 rounded p-2 border border-slate-200">
          <p className="text-slate-600 text-xs leading-relaxed italic">
            {action.example}
          </p>
        </div>
      </div>
    </div>
  );
}
