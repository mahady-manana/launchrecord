"use client";

import { Info } from "lucide-react";

interface HowToReadReportProps {
  className?: string;
  compact?: boolean;
}

export function HowToReadReport({
  className,
  compact = false,
}: HowToReadReportProps) {
  return (
    <section
      className={`border border-slate-200 bg-white rounded-lg p-6 ${className || ""}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 rounded-full bg-slate-100 p-2">
          <Info className="h-4 w-4 text-slate-600" />
        </div>
        <div className="space-y-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              How to read this report
            </h3>
            <p className="text-sm text-slate-600">
              A quick guide to interpreting your SIO-V5 results.
            </p>
          </div>
          <div className="space-y-2 text-sm text-slate-700">
            <p>
              1. Start with the overall score. It is the weighted snapshot of
              your positioning, clarity, and AEO readiness.
            </p>
            <p>
              2. Review each pillar score to find the biggest drag on
              conversion. The lowest pillar is usually the fastest win.
            </p>
            <p>
              3. Read the positive and negative comments next. These explain
              exactly what is working and what is confusing visitors.
            </p>
            {!compact && (
              <p>
                4. Treat suggestions as your action list. Apply 1-2 high-impact
                fixes, then re-run the audit to track progress.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
