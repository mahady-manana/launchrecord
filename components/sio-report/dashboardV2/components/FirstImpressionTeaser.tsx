"use client";

import { CheckCircle2, XCircle } from "lucide-react";

interface FirstImpressions {
  isPositioningClear: boolean;
  isMessagingClear: boolean;
  isUserLeftGuessing: boolean;
  ten_second_test: boolean;
  statement: string;
}

interface FirstImpressionTeaserProps {
  firstImpressions?: FirstImpressions;
}

export function FirstImpressionTeaser({
  firstImpressions,
}: FirstImpressionTeaserProps) {
  if (!firstImpressions) return null;

  const checks = [
    {
      label: "Positioning",
      value: firstImpressions.isPositioningClear,
      desc: "Clear target audience and value",
    },
    {
      label: "Messaging",
      value: firstImpressions.isMessagingClear,
      desc: "Easy to understand core offer",
    },
    {
      label: "Instant Clarity",
      value: !firstImpressions.isUserLeftGuessing,
      desc: "Visitors aren't left guessing",
    },
    {
      label: "10-Second Test",
      value: firstImpressions.ten_second_test,
      desc: "Passed the speed test",
    },
  ];

  return (
    <div className="bg-white rounded-lg border p-6 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-lg font-bold text-slate-800">First Impression Teaser</h3>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
          V2 Analysis
        </span>
      </div>

      <p className="text-slate-600 italic border-l-4 border-blue-500 pl-4 py-1">
        "{firstImpressions.statement}"
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {checks.map((check, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 p-3 rounded-lg border ${
              check.value
                ? "bg-green-50/50 border-green-100"
                : "bg-red-50/50 border-red-100"
            }`}
          >
            {check.value ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <div
                className={`text-sm font-bold ${
                  check.value ? "text-green-800" : "text-red-800"
                }`}
              >
                {check.label}: {check.value ? "PASSED" : "FAILED"}
              </div>
              <div className="text-[11px] text-slate-500 leading-tight">
                {check.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
