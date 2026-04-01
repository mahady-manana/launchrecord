"use client";

import { CommentItem } from "@/components/sio-report/CommentItem";
import { MetricInsight } from "@/components/sio-report/MetricInsight";
import { SIOV5Report } from "@/research/sio-v5-report-schema";

interface PositioningCardProps {
  report: SIOV5Report["positioning"];
  isGuest?: boolean;
}

interface SubMetricCardProps {
  name: string;
  score: number;
  current: string;
  positiveComments: string[];
  negativeComments: string[];
  suggested: string[];
}

function SubMetricCard({
  name,
  score,
  current,
  positiveComments,
  negativeComments,
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
    <div className="py-4 border-b border-slate-200 last:border-b-0 ">
      <MetricInsight
        title={name}
        current={current}
        positiveComments={positiveComments}
        negativeComments={negativeComments}
        suggested={suggested}
        compact
      />
      <div className="flex items-center justify-between">
        <div
          className={`px-2 py-1 rounded-full text-xs font-bold ${scoreBg} ${scoreColor}`}
        >
          {name} score {score}/100
        </div>
      </div>
    </div>
  );
}

export function PositioningCard({ report, isGuest }: PositioningCardProps) {
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
    <section className="py-8 border-b border-slate-200">
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
          <h2 className="text-xl font-bold text-slate-800">
            Positioning & Differentiation
          </h2>
          <div
            className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${scoreBg} ${scoreColor}`}
          >
            Score: {report.score}/100
          </div>
        </div>
      </div>

      <p className="text-slate-600 leading-relaxed mb-6">{report.statement}</p>

      {/* Overall Comments Grid */}
      <div className="space-y-4 mb-6">
        {/* Positive Comments */}
        {report.overallCommentPositive &&
          report.overallCommentPositive.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-semibold text-slate-700">
                Strengths To Double Down
              </div>
              <ul className="space-y-2">
                {report.overallCommentPositive.map((comment, idx) => (
                  <CommentItem
                    key={idx}
                    as="li"
                    variant="positive"
                    text={comment}
                  />
                ))}
              </ul>
            </div>
          )}

        {/* Negative Comments */}
        {report.overallCommentNegative &&
          report.overallCommentNegative.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-semibold text-slate-700">
                Where You Lose Clarity
              </div>
              <ul className="space-y-2">
                {report.overallCommentNegative.map((comment, idx) => (
                  <CommentItem
                    key={idx}
                    as="li"
                    variant="negative"
                    text={comment}
                  />
                ))}
              </ul>
            </div>
          )}
      </div>

      {/* Overall Positioning Summary */}
      <div className="mb-6 space-y-3">
        <MetricInsight
          title="Your Market Positioning & Differentiation"
          current={report.summary.current}
          positiveComments={report.summary.positiveComments}
          negativeComments={report.summary.negativeComments}
          suggested={report.summary.suggested}
        />
      </div>

      {/* Sub-Metrics Grid */}
      <div>
        <div className="space-y-4">
          {isGuest ? null : (
            <>
              <SubMetricCard
                name="Niche Category Ownership"
                score={report.subMetrics.categoryOwnership.score}
                current={report.subMetrics.categoryOwnership.current}
                positiveComments={
                  report.subMetrics.categoryOwnership.positiveComments
                }
                negativeComments={
                  report.subMetrics.categoryOwnership.negativeComments
                }
                suggested={report.subMetrics.categoryOwnership.suggested}
              />
              <SubMetricCard
                name="Unique Value Proposition"
                score={report.subMetrics.uniqueValueProp.score}
                current={report.subMetrics.uniqueValueProp.current}
                positiveComments={
                  report.subMetrics.uniqueValueProp.positiveComments
                }
                negativeComments={
                  report.subMetrics.uniqueValueProp.negativeComments
                }
                suggested={report.subMetrics.uniqueValueProp.suggested}
              />
              <SubMetricCard
                name='Competitive Differentiation ("Why You vs Them")'
                score={report.subMetrics.competitiveDiff.score}
                current={report.subMetrics.competitiveDiff.current}
                positiveComments={
                  report.subMetrics.competitiveDiff.positiveComments
                }
                negativeComments={
                  report.subMetrics.competitiveDiff.negativeComments
                }
                suggested={report.subMetrics.competitiveDiff.suggested}
              />
              <SubMetricCard
                name='Target Audience Clarity ("Who You Serve")'
                score={report.subMetrics.targetAudience.score}
                current={report.subMetrics.targetAudience.current}
                positiveComments={
                  report.subMetrics.targetAudience.positiveComments
                }
                negativeComments={
                  report.subMetrics.targetAudience.negativeComments
                }
                suggested={report.subMetrics.targetAudience.suggested}
              />
              <SubMetricCard
                name='Problem-Solution Fit ("How Well You Solve The Problem")'
                score={report.subMetrics.problemSolutionFit.score}
                current={report.subMetrics.problemSolutionFit.current}
                positiveComments={
                  report.subMetrics.problemSolutionFit.positiveComments
                }
                negativeComments={
                  report.subMetrics.problemSolutionFit.negativeComments
                }
                suggested={report.subMetrics.problemSolutionFit.suggested}
              />
              <SubMetricCard
                name='Messaging Consistency ("How Consistent Your Messaging Is Across Content")'
                score={report.subMetrics.messagingConsistency.score}
                current={report.subMetrics.messagingConsistency.current}
                positiveComments={
                  report.subMetrics.messagingConsistency.positiveComments
                }
                negativeComments={
                  report.subMetrics.messagingConsistency.negativeComments
                }
                suggested={report.subMetrics.messagingConsistency.suggested}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
