import { BarChart3, CheckCircle2, Globe, Sparkles, TrendingUp } from "lucide-react";

interface ValuePanelProps {
  step: number;
}

export function ValuePanel({ step }: ValuePanelProps) {
  const badge =
    step === 1
      ? { text: "One step away from your full report" }
      : { text: "Unlock everything now" };

  const headline =
    step === 1
      ? {
          main: "Your audit is ready.",
          accent: "Let's unlock everything.",
        }
      : {
          main: "Choose how you want",
          accent: "to grow your startup.",
        };

  const description =
    step === 1
      ? "Confirm your product details and you'll instantly get access to your complete SIO-V5 report with actionable recommendations, plus a free spotlight listing in our startup directory."
      : "Pick a plan that fits — get your full report immediately, plus a directory listing with real traffic to boost your visibility.";

  const benefits =
    step === 1
      ? [
          {
            icon: BarChart3 as React.ComponentType<{ className?: string }>,
            title: "Full SIO-V5 report with fixes",
            desc: "Sentence-level rewrites, positioning gaps, and conversion boosts you can ship today.",
            color: "orange" as const,
          },
          {
            icon: Globe as React.ComponentType<{ className?: string }>,
            title: "Free startup directory listing",
            desc: "Get discovered by founders, investors, and early adopters browsing our curated directory.",
            color: "blue" as const,
          },
        ]
      : [
          {
            icon: CheckCircle2 as React.ComponentType<{ className?: string }>,
            title: "Instant full report",
            desc: "No more locked sections — get every sub-metric breakdown and fix.",
            color: "orange" as const,
          },
          {
            icon: TrendingUp as React.ComponentType<{ className?: string }>,
            title: "Directory listing with traffic",
            desc: "1k+ visitors in the last 15 days browsing startups like yours.",
            color: "emerald" as const,
          },
          {
            icon: BarChart3 as React.ComponentType<{ className?: string }>,
            title: "Actionable insights",
            desc: "Prioritized todo list you can hand straight to your team.",
            color: "blue" as const,
          },
        ];

  const colorMap = {
    orange: {
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
      icon: "text-orange-400",
    },
    blue: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      icon: "text-blue-400",
    },
    emerald: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      icon: "text-emerald-400",
    },
  };

  return (
    <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-12 xl:px-20">
      <div className="max-w-lg">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-8">
          <Sparkles className="h-4 w-4 text-orange-400" />
          <span className="text-sm font-medium text-orange-300">
            {badge.text}
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-bold text-white leading-tight mb-6">
          {headline.main}
          <br />
          <span className="text-orange-400">{headline.accent}</span>
        </h1>

        <p className="text-lg text-slate-300 mb-12 leading-relaxed">
          {description}
        </p>

        {/* Benefits */}
        <div className="space-y-6">
          {benefits.map((b) => {
            const colors = colorMap[b.color];
            return (
              <div key={b.title} className="flex items-start gap-4">
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-xl ${colors.bg} ${colors.border} flex items-center justify-center`}
                >
                  <b.icon className={`h-5 w-5 ${colors.icon}`} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1">
                    {b.title}
                  </h3>
                  <p className="text-sm text-slate-400">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Social proof */}
        <div className="mt-12 pt-8 border-t border-slate-700/50">
          <p className="text-sm text-slate-400">
            <span className="text-white font-semibold">220+</span> founders
            completed their profile and get full report every week
          </p>
        </div>
      </div>
    </div>
  );
}
