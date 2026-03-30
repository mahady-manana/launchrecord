"use client";

import { AlertTriangle, TrendingDown, XCircle } from "lucide-react";

interface Problem {
  stat: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const problems: Problem[] = [
  {
    stat: "73% of startups have positioning debt",
    title: "You Sound Like Every Other Startup",
    description:
      "Your messaging converges toward commodity every week. You're solving the same problems the same way, and prospects can't tell you apart from competitors.",
    icon: <AlertTriangle className="h-8 w-8" />,
  },
  {
    stat: "40% bounce rate from unclear messaging",
    title: "Visitors Leave Without Understanding",
    description:
      "Prospects can't understand what you do in 5 seconds. Your homepage talks about you, not their problem. Every second of confusion kills conversion.",
    icon: <TrendingDown className="h-8 w-8" />,
  },
  {
    stat: "94.2% of founders are invisible to AI",
    title: "AI Systems Don't See You",
    description:
      "LLMs don't cite you. AI search doesn't surface you. You're invisible to the fastest-growing discovery channels in the world.",
    icon: <XCircle className="h-8 w-8" />,
  },
];

export function ProblemSection() {
  return (
    <section className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-100 tracking-tighter">
            The Brutal Truth About Your Startup
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Most founders are building features. The market is deleting them.
            Here's what's killing your defensibility.
          </p>
        </div>

        {/* Problems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="relative group bg-slate-800/50 border border-slate-700 hover:border-orange-500/50 rounded-xl p-8 transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-lg bg-slate-900 text-orange-500 flex items-center justify-center mb-6">
                {problem.icon}
              </div>

              {/* Stat - Small, colored, supporting evidence */}
              <p className="text-sm font-semibold text-orange-500 mb-3">
                {problem.stat}
              </p>

              {/* Title - Large, clear, direct problem statement */}
              <h3 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight mb-4 leading-tight">
                {problem.title}
              </h3>

              {/* Description */}
              <p className="text-slate-400 leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-slate-300 text-lg mb-2">
            The question isn't if you have these problems.
          </p>
          <p className="text-orange-500 font-bold text-xl">
            It's how bad they've already infected your conversion.
          </p>
        </div>
      </div>
    </section>
  );
}
