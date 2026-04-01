"use client";

import { CommentItem } from "@/components/sio-report/CommentItem";
import { MetricInsight } from "@/components/sio-report/MetricInsight";
import { SIOV5Report } from "@/research/sio-v5-report-schema";

interface ClarityCardProps {
  report: SIOV5Report["clarity"];
  isGuest?: boolean;
}

interface SubMetricCardProps {
  name: string;
  score: number;
  current: string;
  positiveComments: string[];
  negativeComments: string[];
  suggested: string[];
  unclearTexts: SIOV5Report["clarity"]["unclearSentences"];
}

function SubMetricCard({
  name,
  score,
  current,
  positiveComments,
  negativeComments,
  suggested,
  unclearTexts,
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
    <div className="py-4 border-b border-slate-200 last:border-b-0 space-y-3">
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

      {/* Unclear Texts */}
      {unclearTexts.length > 0 && (
        <div className="mt-4 space-y-3">
          <div className="text-xs font-semibold text-slate-500 uppercase">
            Confusing Lines To Fix ({unclearTexts.length})
          </div>
          {unclearTexts.map((item, idx) => (
            <div key={idx} className="border-l-2 border-orange-200 pl-3">
              <div className="text-orange-700 text-sm line-through mb-1">
                "{item.text}"
              </div>
              <div className="text-orange-600 text-xs italic mb-2">
                ⚠ {item.issue}
              </div>
              <div className="text-green-700 text-sm font-medium">
                → {item.fix}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ClarityCard({ report, isGuest }: ClarityCardProps) {
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
          className={`w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center`}
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
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Clarity & Comprehension
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
                Clear Wins
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
                Confusing Points
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

      {/* Overall Clarity Summary */}
      <div className="mb-6 space-y-3">
        <MetricInsight
          title="Messaging Clarity"
          current={report.summary.current}
          positiveComments={report.summary.positiveComments}
          negativeComments={report.summary.negativeComments}
          suggested={report.summary.suggested}
        />
      </div>

      {/* Unclear Sentences Found */}
      {report.unclearSentences.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
            Confusing Lines To Fix ({report.unclearSentences.length})
          </h3>
          <div className="space-y-3">
            {report.unclearSentences.map((item, idx) => (
              <div key={idx} className="border-l-2 border-orange-200 pl-3">
                <div className="text-orange-700 text-sm line-through mb-1">
                  "{item.text}"
                </div>
                <div className="text-orange-600 text-xs italic mb-2">
                  ⚠ {item.issue}
                </div>
                <div className="text-green-700 text-sm font-medium">
                  → {item.fix}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Metrics Grid */}
      {isGuest ? null : (
        <div>
          <div className="space-y-4">
            <SubMetricCard
              name='Headline Clarity ("Can Visitors Instantly Understand What You Do?")'
              score={report.subMetrics.headlineClarity.score}
              current={report.subMetrics.headlineClarity.current}
              positiveComments={
                report.subMetrics.headlineClarity.positiveComments
              }
              negativeComments={
                report.subMetrics.headlineClarity.negativeComments
              }
              suggested={report.subMetrics.headlineClarity.suggested}
              unclearTexts={report.subMetrics.headlineClarity.unclearTexts}
            />
            <SubMetricCard
              name='Value Proposition Clarity ("How Clearly You Communicate Your Unique Value")'
              score={report.subMetrics.valueProposition.score}
              current={report.subMetrics.valueProposition.current}
              positiveComments={
                report.subMetrics.valueProposition.positiveComments
              }
              negativeComments={
                report.subMetrics.valueProposition.negativeComments
              }
              suggested={report.subMetrics.valueProposition.suggested}
              unclearTexts={report.subMetrics.valueProposition.unclearTexts}
            />
            <SubMetricCard
              name='Feature-Benefit Mapping ("How Well You Link Features To Benefits")'
              score={report.subMetrics.featureBenefitMapping.score}
              current={report.subMetrics.featureBenefitMapping.current}
              positiveComments={
                report.subMetrics.featureBenefitMapping.positiveComments
              }
              negativeComments={
                report.subMetrics.featureBenefitMapping.negativeComments
              }
              suggested={report.subMetrics.featureBenefitMapping.suggested}
              unclearTexts={
                report.subMetrics.featureBenefitMapping.unclearTexts
              }
            />
            <SubMetricCard
              name='Visual Hierarchy & Readability ("How Easily Visitors Can Scan & Digest Your Content")'
              score={report.subMetrics.visualHierarchy.score}
              current={report.subMetrics.visualHierarchy.current}
              positiveComments={
                report.subMetrics.visualHierarchy.positiveComments
              }
              negativeComments={
                report.subMetrics.visualHierarchy.negativeComments
              }
              suggested={report.subMetrics.visualHierarchy.suggested}
              unclearTexts={report.subMetrics.visualHierarchy.unclearTexts}
            />
            <SubMetricCard
              name='CTA Clarity ("How Clear & Compelling Your Calls-To-Action Are")'
              score={report.subMetrics.ctaClarity.score}
              current={report.subMetrics.ctaClarity.current}
              positiveComments={report.subMetrics.ctaClarity.positiveComments}
              negativeComments={report.subMetrics.ctaClarity.negativeComments}
              suggested={report.subMetrics.ctaClarity.suggested}
              unclearTexts={report.subMetrics.ctaClarity.unclearTexts}
            />
            <SubMetricCard
              name='Proof Placement & Clarity ("How Well You Use Social Proof To Enhance Clarity")'
              score={report.subMetrics.proofPlacement.score}
              current={report.subMetrics.proofPlacement.current}
              positiveComments={
                report.subMetrics.proofPlacement.positiveComments
              }
              negativeComments={
                report.subMetrics.proofPlacement.negativeComments
              }
              suggested={report.subMetrics.proofPlacement.suggested}
              unclearTexts={report.subMetrics.proofPlacement.unclearTexts}
            />
          </div>
        </div>
      )}
    </section>
  );
}
