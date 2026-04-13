"use client";

import { MetricInsight } from "@/components/sio-report/MetricInsight";
import { SIOV5Report } from "@/research/sio-v5-report-schema";
import { StrengthAndWeakness } from "../StrengthAndWeakness";

interface ClarityCardProps {
  report: SIOV5Report["clarity"];
  isGuest?: boolean;
  ctaHref?: string;
}

interface SubMetricCardProps {
  statement: string;
  score: number;
  current: string;
  positiveComments: string[];
  negativeComments: string[];
  recommendation: string[];
  suggested: string[];
  unclearTexts: SIOV5Report["clarity"]["unclearSentences"];
}

function SubMetricCard({
  statement,
  score,
  current,
  positiveComments,
  negativeComments,
  recommendation,
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
        title={statement}
        current={current}
        positiveComments={positiveComments}
        negativeComments={negativeComments}
        recommendation={recommendation}
        suggested={suggested}
        compact
      />
      <div className="flex items-center justify-between">
        <div
          className={`px-2 py-1 rounded-full text-xs font-bold ${scoreBg} ${scoreColor}`}
        >
          Score {score}/100
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

export function ClarityCard({ report, isGuest, ctaHref }: ClarityCardProps) {
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
      <StrengthAndWeakness
        postiveTitle="Messaging Clarity Strengths"
        negativeTitle="Messaging Clarity Weaknesses"
        commentNegative={report.overallCommentNegative}
        commentPositive={report.overallCommentPositive}
        isGuest={isGuest}
        ctaHref={ctaHref}
      ></StrengthAndWeakness>
      {/* Overall Comments Grid */}

      {/* Overall Clarity Summary */}
      <div className="mb-6 space-y-3">
        <MetricInsight
          isGuest={isGuest}
          ctaHref={ctaHref}
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
            Confusing Paragraphs To Fix ({report.unclearSentences.length})
          </h3>

          <div className="space-y-3">
            {report.unclearSentences
              .slice(0, isGuest ? 1 : 20)
              .map((item, idx) => (
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
          {isGuest ? (
            <div className="py-8 text-lg underline">
              <p>Please signup to see all unclear sentences</p>
            </div>
          ) : null}
        </div>
      )}

      {/* Sub-Metrics Grid */}
      {isGuest || !report.subMetrics ? null : (
        <div>
          <div className="space-y-4">
            <SubMetricCard
              statement={report.subMetrics.headlineClarity.statement}
              score={report.subMetrics.headlineClarity.score}
              current={report.subMetrics.headlineClarity.current}
              positiveComments={
                report.subMetrics.headlineClarity.positiveComments
              }
              negativeComments={
                report.subMetrics.headlineClarity.negativeComments
              }
              recommendation={report.subMetrics.headlineClarity.recommendation}
              suggested={report.subMetrics.headlineClarity.suggested}
              unclearTexts={report.subMetrics.headlineClarity.unclearTexts}
            />
            <SubMetricCard
              statement={report.subMetrics.valueProposition.statement}
              score={report.subMetrics.valueProposition.score}
              current={report.subMetrics.valueProposition.current}
              positiveComments={
                report.subMetrics.valueProposition.positiveComments
              }
              negativeComments={
                report.subMetrics.valueProposition.negativeComments
              }
              recommendation={report.subMetrics.valueProposition.recommendation}
              suggested={report.subMetrics.valueProposition.suggested}
              unclearTexts={report.subMetrics.valueProposition.unclearTexts}
            />
            <SubMetricCard
              statement={report.subMetrics.featureBenefitMapping.statement}
              score={report.subMetrics.featureBenefitMapping.score}
              current={report.subMetrics.featureBenefitMapping.current}
              positiveComments={
                report.subMetrics.featureBenefitMapping.positiveComments
              }
              negativeComments={
                report.subMetrics.featureBenefitMapping.negativeComments
              }
              recommendation={
                report.subMetrics.featureBenefitMapping.recommendation
              }
              suggested={report.subMetrics.featureBenefitMapping.suggested}
              unclearTexts={
                report.subMetrics.featureBenefitMapping.unclearTexts
              }
            />
            <SubMetricCard
              statement={report.subMetrics.visualHierarchy.statement}
              score={report.subMetrics.visualHierarchy.score}
              current={report.subMetrics.visualHierarchy.current}
              positiveComments={
                report.subMetrics.visualHierarchy.positiveComments
              }
              negativeComments={
                report.subMetrics.visualHierarchy.negativeComments
              }
              recommendation={report.subMetrics.visualHierarchy.recommendation}
              suggested={report.subMetrics.visualHierarchy.suggested}
              unclearTexts={report.subMetrics.visualHierarchy.unclearTexts}
            />
            <SubMetricCard
              statement={report.subMetrics.ctaClarity.statement}
              score={report.subMetrics.ctaClarity.score}
              current={report.subMetrics.ctaClarity.current}
              positiveComments={report.subMetrics.ctaClarity.positiveComments}
              negativeComments={report.subMetrics.ctaClarity.negativeComments}
              recommendation={report.subMetrics.ctaClarity.recommendation}
              suggested={report.subMetrics.ctaClarity.suggested}
              unclearTexts={report.subMetrics.ctaClarity.unclearTexts}
            />
            <SubMetricCard
              statement={report.subMetrics.proofPlacement.statement}
              score={report.subMetrics.proofPlacement.score}
              current={report.subMetrics.proofPlacement.current}
              positiveComments={
                report.subMetrics.proofPlacement.positiveComments
              }
              negativeComments={
                report.subMetrics.proofPlacement.negativeComments
              }
              recommendation={report.subMetrics.proofPlacement.recommendation}
              suggested={report.subMetrics.proofPlacement.suggested}
              unclearTexts={report.subMetrics.proofPlacement.unclearTexts}
            />
          </div>
        </div>
      )}
    </section>
  );
}
