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
    stat: "85% of startups have positioning debt",
    title: "You Sound Like Everyone Else",
    description:
      "Your messaging is generic. You’re solving the same problems the same way as everyone else. Prospects can’t tell why you’re different—so they don’t choose you.",
    icon: <AlertTriangle className="h-8 w-8" />,
  },
  {
    stat: "65% of visitors leave from unclear messaging",
    title: "Visitors Don’t Get It",
    description:
      "People land on your site and don’t understand what you do in seconds. You talk about your product, not their problem. Confusion kills conversions.",
    icon: <TrendingDown className="h-8 w-8" />,
  },
  {
    stat: "94.2% of startups are invisible to AI",
    title: "AI Can’t See You",
    description:
      "You’re not cited, recommended, or surfaced by AI systems. If your positioning isn’t clear, you don’t exist in the fastest-growing discovery channel.",
    icon: <XCircle className="h-8 w-8" />,
  },
];

export function ProblemSection() {
  return (
    <section className="py-20 bg-slate-950 text-slate-200" id="problems">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">
            The Silent Killers of Most Startups
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Most founders are building features without clear positioning,
            messaging, or visibility. The market doesn’t care. Here’s what’s
            quietly killing your startup.
          </p>
        </div>

        {/* Problems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="relative group bg-red-50 border border-slate-200 hover:border-secondary/50 rounded-xl p-8 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center mb-6">
                {problem.icon}
              </div>

              {/* Stat - Small, colored, supporting evidence */}
              <p className="text-sm font-semibold text-secondary mb-3">
                {problem.stat}
              </p>

              {/* Title - Large, clear, direct problem statement */}
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-4 leading-tight">
                {problem.title}
              </h3>

              {/* Description */}
              <p className="text-slate-700 leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-slate-200 text-lg mb-2">
            The question isn't if you have these problems.
          </p>
          <p className="text-secondary font-bold text-xl">
            It's how bad they've already infected your conversion.
          </p>
        </div>
      </div>
    </section>
  );
}
