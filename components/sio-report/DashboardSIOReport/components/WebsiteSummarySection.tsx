"use client";

import { WebsiteSummary } from "@/services/sio-report/schema";
import { Globe } from "lucide-react";

interface WebsiteSummarySectionProps {
  summary: WebsiteSummary;
}

function CategorySection({
  title,
  currents,
  positiveComments,
  negativeComments,
}: {
  title: string;
  currents: string[];
  positiveComments?: string[];
  negativeComments?: string[];
}) {
  if (
    currents.length === 0 &&
    !positiveComments?.length &&
    !negativeComments?.length
  )
    return null;

  return (
    <div className="rounded-lg border border-slate-200 p-4 space-y-3">
      <h4 className="text-sm font-semibold text-slate-700">{title}</h4>

      {/* Currents */}
      {currents.length > 0 && (
        <ul className="space-y-1">
          {currents.map((item, idx) => (
            <li
              key={idx}
              className="text-sm text-slate-600 pl-3 border-l-2 border-slate-200"
            >
              {item}
            </li>
          ))}
        </ul>
      )}

      {/* Positive Comments */}
      {positiveComments && positiveComments.length > 0 && (
        <div className="rounded-md bg-green-50 p-3 border border-green-100">
          <span className="text-xs font-semibold uppercase tracking-wide text-green-600">
            Strengths
          </span>
          <ul className="mt-1 space-y-1">
            {positiveComments.map((comment, idx) => (
              <li key={idx} className="text-sm text-green-700 pl-2">
                • {comment}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Negative Comments */}
      {negativeComments && negativeComments.length > 0 && (
        <div className="rounded-md bg-red-50 p-3 border border-red-100">
          <span className="text-xs font-semibold uppercase tracking-wide text-red-600">
            Weaknesses
          </span>
          <ul className="mt-1 space-y-1">
            {negativeComments.map((comment, idx) => (
              <li key={idx} className="text-sm text-red-700 pl-2">
                • {comment}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function WebsiteSummarySection({ summary }: WebsiteSummarySectionProps) {
  if (!summary) return null;

  return (
    <section className="border-b border-slate-200 py-8">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center">
          <Globe className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Website Summary</h2>
      </div>

      {/* Summary */}
      {summary.summary && (
        <p className="text-slate-600 leading-relaxed mb-6">{summary.summary}</p>
      )}

      {/* Clarity Flags */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div
          className={`px-4 py-3 rounded-lg text-center text-sm font-semibold ${
            summary.isPositioningClear
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          Positioning: {summary.isPositioningClear ? "Clear" : "Unclear"}
        </div>
        <div
          className={`px-4 py-3 rounded-lg text-center text-sm font-semibold ${
            summary.isMessagingClear
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          Messaging: {summary.isMessagingClear ? "Clear" : "Unclear"}
        </div>
        <div
          className={`px-4 py-3 rounded-lg text-center text-sm font-semibold ${
            !summary.areUsersLeftGuessing
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          Users: {summary.areUsersLeftGuessing ? "Confused" : "Understand"}
        </div>
      </div>

      {/* Category Extraction */}
      <div className="grid gap-4 sm:grid-cols-2">
        <CategorySection
          title="Problems Mentioned"
          currents={summary.problems?.currents || []}
          positiveComments={summary.problems?.positiveComments}
          negativeComments={summary.problems?.negativeComments}
        />
        <CategorySection
          title="Outcomes Promised"
          currents={summary.outcomes?.currents || []}
          positiveComments={summary.outcomes?.positiveComments}
          negativeComments={summary.outcomes?.negativeComments}
        />
        <CategorySection
          title="Solutions Offered"
          currents={summary.solutions?.currents || []}
          positiveComments={summary.solutions?.positiveComments}
          negativeComments={summary.solutions?.negativeComments}
        />
        <CategorySection
          title="Features Listed"
          currents={summary.features?.currents || []}
          positiveComments={summary.features?.positiveComments}
          negativeComments={summary.features?.negativeComments}
        />
      </div>
    </section>
  );
}
