"use client";

import { SIOV5Report } from "../sio-v5-report-schema";

interface PositioningCardProps {
  report: SIOV5Report["positioning"];
}

interface SubMetricCardProps {
  name: string;
  score: number;
  current: string;
  comments: string[];
  suggested: string;
}

function SubMetricCard({
  name,
  score,
  current,
  comments,
  suggested,
}: SubMetricCardProps) {
  const scoreColor =
    score >= 70
      ? "text-green-600"
      : score >= 50
      ? "text-yellow-600"
      : score >= 30
      ? "text-orange-600"
      : "text-red-600";

  const scoreBg =
    score >= 70
      ? "bg-green-50"
      : score >= 50
      ? "bg-yellow-50"
      : score >= 30
      ? "bg-orange-50"
      : "bg-red-50";

  return (
    <div className="border border-slate-200 rounded-xl p-4 bg-white">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-slate-800">{name}</h3>
        <div
          className={`px-2 py-1 rounded-full text-xs font-bold ${scoreBg} ${scoreColor}`}
        >
          {score}/100
        </div>
      </div>

      <div className="space-y-3">
        {/* Current */}
        <div className="bg-red-50 rounded-lg p-3 border border-red-200">
          <div className="text-xs text-red-600 font-semibold mb-1">
            Current:
          </div>
          <p className="text-red-700 text-sm line-through">{current}</p>
        </div>

        {/* Comments */}
        {comments.length > 0 && (
          <div className="space-y-1">
            {comments.map((comment, idx) => (
              <div
                key={idx}
                className="text-orange-600 text-xs italic flex items-start gap-1"
              >
                <span>⚠</span>
                <span>{comment}</span>
              </div>
            ))}
          </div>
        )}

        {/* Suggested */}
        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
          <div className="text-xs text-green-600 font-semibold mb-1">
            Suggested:
          </div>
          <p className="text-green-700 text-sm font-medium">{suggested}</p>
        </div>
      </div>
    </div>
  );
}

export function PositioningCard({ report }: PositioningCardProps) {
  const scoreColor =
    report.score >= 70
      ? "text-green-600"
      : report.score >= 50
      ? "text-yellow-600"
      : report.score >= 30
      ? "text-orange-600"
      : "text-red-600";

  const scoreBg =
    report.score >= 70
      ? "bg-green-50"
      : report.score >= 50
      ? "bg-yellow-50"
      : report.score >= 30
      ? "bg-orange-50"
      : "bg-red-50";

  return (
    <div className="border border-slate-200 rounded-xl p-6 bg-white">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center`}
        >
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Positioning</h2>
          <div
            className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${scoreBg} ${scoreColor}`}
          >
            Score: {report.score}/100
          </div>
        </div>
      </div>

      <p className="text-slate-600 leading-relaxed mb-6">{report.statement}</p>

      {/* Overall Positioning Summary */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
          Overall Positioning
        </h3>
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <div className="text-xs text-slate-500 font-semibold mb-2">
            Current:
          </div>
          <p className="text-slate-700 text-sm mb-3">
            {report.summary.current}
          </p>

          {report.summary.comments.length > 0 && (
            <div className="space-y-1 mb-3">
              {report.summary.comments.map((comment, idx) => (
                <div
                  key={idx}
                  className="text-orange-600 text-xs italic flex items-start gap-1"
                >
                  <span>⚠</span>
                  <span>{comment}</span>
                </div>
              ))}
            </div>
          )}

          <div className="text-xs text-green-600 font-semibold mb-2">
            Suggested:
          </div>
          <p className="text-green-700 text-sm font-medium">
            {report.summary.suggested}
          </p>
        </div>
      </div>

      {/* Sub-Metrics Grid */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
          Positioning Dimensions
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <SubMetricCard
            name={report.subMetrics.categoryOwnership.name}
            score={report.subMetrics.categoryOwnership.score}
            current={report.subMetrics.categoryOwnership.current}
            comments={report.subMetrics.categoryOwnership.comments}
            suggested={report.subMetrics.categoryOwnership.suggested}
          />
          <SubMetricCard
            name={report.subMetrics.uniqueValueProp.name}
            score={report.subMetrics.uniqueValueProp.score}
            current={report.subMetrics.uniqueValueProp.current}
            comments={report.subMetrics.uniqueValueProp.comments}
            suggested={report.subMetrics.uniqueValueProp.suggested}
          />
          <SubMetricCard
            name={report.subMetrics.competitiveDiff.name}
            score={report.subMetrics.competitiveDiff.score}
            current={report.subMetrics.competitiveDiff.current}
            comments={report.subMetrics.competitiveDiff.comments}
            suggested={report.subMetrics.competitiveDiff.suggested}
          />
          <SubMetricCard
            name={report.subMetrics.targetAudience.name}
            score={report.subMetrics.targetAudience.score}
            current={report.subMetrics.targetAudience.current}
            comments={report.subMetrics.targetAudience.comments}
            suggested={report.subMetrics.targetAudience.suggested}
          />
          <SubMetricCard
            name={report.subMetrics.problemSolutionFit.name}
            score={report.subMetrics.problemSolutionFit.score}
            current={report.subMetrics.problemSolutionFit.current}
            comments={report.subMetrics.problemSolutionFit.comments}
            suggested={report.subMetrics.problemSolutionFit.suggested}
          />
          <SubMetricCard
            name={report.subMetrics.messagingConsistency.name}
            score={report.subMetrics.messagingConsistency.score}
            current={report.subMetrics.messagingConsistency.current}
            comments={report.subMetrics.messagingConsistency.comments}
            suggested={report.subMetrics.messagingConsistency.suggested}
          />
        </div>
      </div>
    </div>
  );
}
