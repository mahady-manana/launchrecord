import { ArrowRight, CheckCircle2, Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

interface LockedOverlayProps {
  title: string;
  subtitle: string;
  signupHref: string;
  ctaLabel: string;
  metricLabels?: string[];
}

export function LockedOverlay({
  title,
  subtitle,
  signupHref,
  ctaLabel,
  metricLabels,
}: LockedOverlayProps) {
  return (
    <div className="relative bg-gradient-to-t from-white via-white/80 to-transparent">
      {/* Submetrics Preview List */}
      {metricLabels && metricLabels.length > 0 && (
        <div className="mb-6">
          <div className="space-y-3">
            {metricLabels.map((label) => (
              <div
                key={label}
                className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-white/70"
              >
                <CheckCircle2 className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-700">
                    {label}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Sign up to see detailed analysis and recommendations
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-white/90 backdrop-blur-sm p-6 text-center max-w-2xl mx-auto">
        <Lock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-600 mb-4">{subtitle}</p>
        <Link href={signupHref}>
          <Button className="bg-orange-500 hover:bg-orange-600">
            {ctaLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
