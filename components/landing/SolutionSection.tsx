"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
const steps = [
  {
    id: 1,
    title: "We detect your positioning and messaging problems",
    description:
      "Our engine analyzes your startup against 10,000+ SaaS sites to spot: commodity positioning, confusing messaging, and AI invisibility killing discovery. You get cold, clinical data—no opinions, no fluff.",
  },
  {
    id: 2,
    title: "We tell you what's broken and its impact on growth",
    description:
      "Your report shows your score, strong points, and weaknesses across different pillars of defensibility. Each weakness comes with specific examples and a truth summary. You'll know what works, what doesn't, and how to fix it. No generic advice. Just the raw data you need to prioritize fixes.",
  },
  {
    id: 3,
    title: "We show you how to fix it and win",
    description:
      "Every weakness comes with exact fixes. Your positioning is commodity? We show you how to differentiate. Your clarity is weak? We identify the confusing messages. You're invisible to AI? We tell you what to change to get cited. Then you execute weekly missions to make it happen.",
  },
  {
    id: 4,
    title: "We track your progress",
    description:
      "This isn't a one-time audit. Your Sovereign Dashboard tracks your scores across all five pillars over time. Complete weekly missions, upload proof of shipping, and watch your defensibility compound. You'll know exactly when you're winning—and when you're slipping.",
  },
];
const CardHowItWorks = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-white max-w-lg shadow rounded-lg p-8 h-full">
      {children}
    </div>
  );
};
export function SolutionSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-blue-100 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 bg-white rounded-lg shadow-lg p-12">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
            How It Works
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            We audit your startup's website. We don't just identify problems, we
            give you the exact fixes to make your product obvious and convert
            more users.
          </p>
        </div>

        {/* Main Solution Flow */}
        <div className="max-w-4xl mx-auto space-y-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((step) => (
            <div
              key={step.id}
              className="relative bg-slate-50/20 border border-slate-200 max-w-lg rounded-lg p-8 h-full"
            >
              <div className="">
                <div className="text-slate-200 font-black text-8xl">
                  <p>{step.id}</p>
                </div>
                <div className="flex-1 space-y-4 relative z-10 pt-4">
                  <h3 className="text-lg font-bold text-primary">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col md:flex-row gap-4 items-center justify-center bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
            <div className="text-left space-y-2">
              <p className="text-slate-700 font-medium">
                Ready to fix your positioning?
              </p>
            </div>
            <Link
              href="/sio-audit"
              className="inline-flex items-center gap-2 bg-secondary text-white px-8 py-4 rounded-lg font-bold uppercase tracking-wider hover:bg-secondary/90 transition-colors whitespace-nowrap shadow-md"
            >
              Run Free Audit
              <CheckCircle2 className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
