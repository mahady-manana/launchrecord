"use client";

import { FirstImpressionReport } from "@/services/sio-report/schema";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { MetricSection, StatementCard } from "./ReusableMetricSections";

interface ActionableFirstImpressionProps {
  report: FirstImpressionReport;
  productId: string;
}

export function ActionableFirstImpression({
  report,
  productId,
}: ActionableFirstImpressionProps) {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              First Impression (Hero)
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              80% of visitors never scroll past this
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-3xl font-bold text-slate-900">
                {report.score}
              </div>
            </div>
            <Link href={`/dashboard/${productId}/audit/clarity`}>
              <Pencil className="h-5 w-5 text-slate-400 hover:text-slate-600" />
            </Link>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Statement */}
        {report.statement && <StatementCard statement={report.statement} />}

        {/* Headline */}
        <MetricSection
          title="Headline"
          current={report.headline.current}
          negativeComments={report.headline.negativeComments}
          positiveComments={report.headline.positiveComments}
          suggestions={report.headline.suggested}
        />

        {/* Subheadline */}
        <MetricSection
          title="Subheadline"
          current={report.subheadline.current}
          negativeComments={report.subheadline.negativeComments}
          positiveComments={report.subheadline.positiveComments}
          suggestions={report.subheadline.suggested}
        />

        {/* CTA */}
        <MetricSection
          title="Call-to-Action"
          current={report.cta.current}
          negativeComments={report.cta.negativeComments}
          positiveComments={report.cta.positiveComments}
          suggestions={report.cta.suggested}
        />
      </div>
    </div>
  );
}
