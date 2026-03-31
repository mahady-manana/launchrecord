"use client";

import { Action } from "@/research/sio-v5-report-schema";
import { ActionItemCard } from "./ActionItemCard";

interface TopPrioritiesCardProps {
  actions: Action[];
}

export function TopPrioritiesCard({ actions }: TopPrioritiesCardProps) {
  return (
    <div className="border border-slate-200 rounded-xl p-6 bg-white">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Top 5 Priorities
        </h2>
        <p className="text-slate-600 text-sm">
          The most impactful actions to improve your startup's positioning,
          clarity, and AI visibility.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-3 mb-4">
        {actions.map((action, idx) => (
          <ActionItemCard key={idx} action={action} index={idx} />
        ))}
      </div>

      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          <span className="font-semibold">Expected Impact:</span> Implementing
          these 5 actions can improve your overall score by 15-25 points within
          30-60 days.
        </p>
      </div>
    </div>
  );
}
