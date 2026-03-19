"use client";

import { Eye, Shield, Target, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";

interface Pillar {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const pillars: Pillar[] = [
  {
    title: "Positioning",
    description:
      "Detect commodity convergence. Own a category. Make comparison irrelevant.",
    icon: <Target className="h-8 w-8" />,
    href: "/positioning-audit",
    color: "text-red-600",
    bgColor: "bg-red-600",
    borderColor: "border-red-600",
  },
  {
    title: "Clarity",
    description:
      "CFO-level clarity. Messaging that cuts through noise and converts.",
    icon: <Eye className="h-8 w-8" />,
    href: "/clarity-audit",
    color: "text-blue-600",
    bgColor: "bg-blue-600",
    borderColor: "border-blue-600",
  },
  {
    title: "AEO Presence",
    description:
      "Be the answer. Dominate ChatGPT, Claude, Perplexity, and AI search.",
    icon: <Zap className="h-8 w-8" />,
    href: "/aeo-audit",
    color: "text-yellow-600",
    bgColor: "bg-yellow-600",
    borderColor: "border-yellow-600",
  },
  {
    title: "Momentum",
    description:
      "Track velocity. Measure what matters. Build unstoppable market force.",
    icon: <TrendingUp className="h-8 w-8" />,
    href: "/momentum-audit",
    color: "text-green-600",
    bgColor: "bg-green-600",
    borderColor: "border-green-600",
  },
  {
    title: "Founder Proof",
    description:
      "Why you? Why now? Validate founder-market fit and unique advantage.",
    icon: <Shield className="h-8 w-8" />,
    href: "/founder-proof-audit",
    color: "text-purple-600",
    bgColor: "bg-purple-600",
    borderColor: "border-purple-600",
  },
];

export function FivePillarsSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="space-y-4 mb-12">
        <h2 className="text-4xl font-black uppercase tracking-tighter">
          The Five Pillars of Sovereignty
        </h2>
        <p className="text-lg text-slate-400 max-w-3xl">
          We are the sovereign. Every pillar is a weapon against
          commoditization. Audit your positioning across all five dimensions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pillars.map((pillar, index) => (
          <Link
            key={index}
            href={pillar.href}
            className={`group relative bg-slate-900 border border-slate-800 hover:${pillar.borderColor} rounded-xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-${pillar.color.replace("text-", "")}/10 overflow-hidden`}
          >
            {/* Gradient overlay on hover */}
            <div
              className={`absolute inset-0 ${pillar.bgColor} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
            />

            <div className="relative space-y-4">
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-lg ${pillar.bgColor} text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
              >
                {pillar.icon}
              </div>

              {/* Title */}
              <h3
                className={`text-2xl font-bold uppercase tracking-tight ${pillar.color}`}
              >
                {pillar.title}
              </h3>

              {/* Description */}
              <p className="text-slate-400 text-sm leading-relaxed">
                {pillar.description}
              </p>

              {/* CTA */}
              <div className="flex items-center gap-2 text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                <span>Run Audit</span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>

            {/* Corner accent */}
            <div
              className={`absolute top-0 right-0 w-20 h-20 ${pillar.bgColor} opacity-0 group-hover:opacity-20 rounded-bl-full transition-opacity duration-300`}
            />
          </Link>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 text-center">
        <Link
          href="/survey"
          className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-lg font-bold uppercase tracking-tight hover:bg-slate-200 transition-colors"
        >
          Start Full Sovereignty Audit
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}
