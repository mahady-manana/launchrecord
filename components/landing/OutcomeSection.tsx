"use client";

import { ArrowUpRight, BarChart3, DollarSign, Users } from "lucide-react";

interface Outcome {
  metric: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend: "up" | "down";
}

const outcomes: Outcome[] = [
  {
    metric: "Conversion Rate",
    value: "+127%",
    description: "Average increase after clarity fixes",
    icon: <ArrowUpRight className="h-8 w-8" />,
    trend: "up",
  },
  {
    metric: "AI Visibility",
    value: "+89%",
    description: "More citations in LLM responses",
    icon: <Users className="h-8 w-8" />,
    trend: "up",
  },
  {
    metric: "Positioning Score",
    value: "+2.3x",
    description: "Improvement vs category competitors",
    icon: <BarChart3 className="h-8 w-8" />,
    trend: "up",
  },
  {
    metric: "CAC Reduction",
    value: "-43%",
    description: "Lower acquisition cost from clarity",
    icon: <DollarSign className="h-8 w-8" />,
    trend: "down",
  },
];

export function OutcomeSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-blue-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tighter">
            The Outcome: Measurable Defensibility
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Founders who fix their positioning and clarity don't just survive.
            They compound advantage.
          </p>
        </div>

        {/* Outcomes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {outcomes.map((outcome, index) => (
            <div
              key={index}
              className="relative group bg-white border border-slate-200 hover:border-primary/50 rounded-xl p-8 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-6">
                {outcome.icon}
              </div>

              {/* Value */}
              <p className="text-4xl font-black text-primary mb-2">
                {outcome.value}
              </p>

              {/* Metric */}
              <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight mb-2">
                {outcome.metric}
              </h3>

              {/* Description */}
              <p className="text-slate-600 text-sm leading-relaxed">
                {outcome.description}
              </p>

              {/* Trend indicator */}
              <div className="mt-4 flex items-center gap-2">
                <div className="px-2 py-1 rounded text-xs font-bold uppercase bg-primary/10 text-primary">
                  {outcome.trend === "up" ? "↑" : "↓"} Better
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial / Social Proof */}
      </div>
    </section>
  );
}
