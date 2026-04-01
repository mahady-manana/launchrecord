"use client";

import { CommentItem } from "@/components/sio-report/CommentItem";
import { SIOV5Report } from "@/research/sio-v5-report-schema";

interface WebsiteSummaryCardProps {
  summary: SIOV5Report["websiteSummary"];
}

function SectionWithComments({
  title,
  section,
}: {
  title: string;
  section: SIOV5Report["websiteSummary"]["problems"];
}) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold text-slate-500 uppercase">
        {title} ({section.currents.length})
      </div>

      {/* Current Items */}
      <div className="space-y-1 mb-3">
        {section.currents.map((item, idx) => (
          <div
            key={idx}
            className="text-slate-700 text-xs bg-white rounded p-2 border border-slate-200"
          >
            {item}
          </div>
        ))}
      </div>

      {/* Positive Comments */}
      {section.positiveComments && section.positiveComments.length > 0 && (
        <ul className="space-y-1 mb-3">
          {section.positiveComments.map((comment, idx) => (
            <CommentItem
              key={idx}
              as="li"
              variant="positive"
              text={comment}
              className="text-xs"
            />
          ))}
        </ul>
      )}

      {/* Negative Comments */}
      {section.negativeComments && section.negativeComments.length > 0 && (
        <ul className="space-y-1">
          {section.negativeComments.map((comment, idx) => (
            <CommentItem
              key={idx}
              as="li"
              variant="negative"
              text={comment}
              className="text-xs"
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export function WebsiteSummaryCard({ summary }: WebsiteSummaryCardProps) {
  return (
    <div className="border border-slate-200 rounded-xl p-6 bg-blue-50">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-800 mb-1">
          Startup's summary
        </h2>
        <p className="text-slate-500 text-xs">
          What your website says + audit comments
        </p>
      </div>

      {/* Summary */}
      <div className="mb-4">
        <div className="text-xs font-semibold text-slate-500 uppercase mb-2">
          Summary / Tagline
        </div>
        <div className="bg-white rounded-lg p-3 border border-slate-200">
          <p className="text-slate-700 text-sm">{summary.summary}</p>
        </div>
        {summary.summaryComment && (
          <div className="mt-2">
            <CommentItem
              variant="negative"
              text={summary.summaryComment}
              className="text-xs"
            />
          </div>
        )}
      </div>

      {/* Grid Layout */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <SectionWithComments title="Problems" section={summary.problems} />
        <SectionWithComments title="Outcomes" section={summary.outcomes} />
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <SectionWithComments title="Solutions" section={summary.solutions} />
        <SectionWithComments title="Features" section={summary.features} />
      </div>

      {/* Status Badges */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200">
        <div
          className={`px-3 py-1.5 rounded-full text-xs font-bold ${
            summary.isPositioningClear
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {summary.isPositioningClear
            ? "✓ Positioning Clear"
            : "✗ Positioning Unclear"}
        </div>
        <div
          className={`px-3 py-1.5 rounded-full text-xs font-bold ${
            summary.isMessagingClear
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {summary.isMessagingClear
            ? "✓ Messaging Clear"
            : "✗ Messaging Unclear"}
        </div>
        <div
          className={`px-3 py-1.5 rounded-full text-xs font-bold ${
            summary.areUsersLeftGuessing
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {summary.areUsersLeftGuessing
            ? "⚠ Users Left Guessing"
            : "✓ Users Understand"}
        </div>
      </div>
    </div>
  );
}
