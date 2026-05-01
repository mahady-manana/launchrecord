"use client";

import Link from "next/link";

interface Pillar {
  title: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  link: string;
}
const features = [
  {
    title: "Instantly fix your first impression",
    description:
      "Turn confused visitors into clear buyers in seconds by identifying whether your homepage communicates value fast enough to prevent users from leaving before understanding what you offer.",
    outcomes: [
      "Reduce bounce caused by unclear messaging",
      "Improve understanding within the first 5 seconds",
      "Align headline, value, and intent instantly",
      "Strengthen first-scroll clarity and trust",
      "Remove friction between visit and comprehension",
    ],
    link: "/learn/first-impression-fix",
  },
  {
    title: "Stop blending in with competitors positioning control",
    description:
      "Clarify whether your product is truly differentiated or blending into the market by exposing where your positioning sounds generic and weakens your ability to attract the right users.",
    outcomes: [
      "Detect when your product sounds like competitors",
      "Clarify who your product is actually for",
      "Strengthen your unique value direction",
      "Remove category confusion in messaging",
      "Improve “why you” decision clarity",
    ],
    link: "/learn/positioning-control",
  },
  {
    title: "Turn your messaging into conversions",
    description:
      "Improve how easily users understand and trust your message by detecting unclear, vague, or misaligned copy that reduces sign-ups and weakens purchase intent.",
    outcomes: [
      "Identify confusing or vague messaging",
      "Improve headline → value → outcome flow",
      "Strengthen trust signals in copy",
      "Reduce cognitive friction in reading",
      "Increase conversion intent clarity",
    ],
    link: "/learn/conversion-clarity-fix",
  },
  {
    title: "Become understandable to AI & Search",
    description:
      "Increase your chances of being recommended by AI systems and search engines by evaluating how clearly your product is understood and whether it contains the signals needed to be cited and surfaced.",
    outcomes: [
      "Improve AI understanding of your product",
      "Detect missing authority signals",
      "Optimize content for AI citation readiness",
      "Benchmark against competitors in AI answers",
      "Increase visibility in AI-driven discovery",
    ],
    link: "/learn/aeo-visibility",
  },
];

export function WhatIsItSection() {
  return (
    <section className="bg-[#0d1738]" id="features">
      <div className="max-w-7xl py-20 mx-auto border-t border-slate-700">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-4xl font-bold text-slate-200 tracking-tighter">
            Start fixing your product foundation.
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            We help you understand why your website isn’t converting by
            analyzing how clearly your positioning, messaging, and first
            impression communicate value to real visitors. Then we show you
            exactly what to fix so your product becomes easier to understand,
            trust, and choose.
          </p>
        </div>

        {/* Features Grid */}
        <div className="gap-8 space-y-12">
          {features.map((pillar, index) => (
            <div
              key={index}
              className="flex flex-col rounded-md border border-slate-100 bg-gradient-to-b from-primary/10 to-white/10 border-b border-slate-700 p-0 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="md:flex items-center p-8 rounded-xl">
                <div className="md:w-1/2 ">
                  {/* Title */}
                  <div className="space-y-4 mb-16 max-w-4xl">
                    <h2 className="text-xl md:text-2xl text-white tracking-tighter inline font-medium">
                      {pillar.title}.
                    </h2>
                    <p className="inline text-xl md:text-2xl tracking-tighter pl-2 font-medium text-blue-300">
                      {pillar.description}
                    </p>
                  </div>

                  {/* <Link
                    href={pillar.link}
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-sm transition-colors"
                  >
                    Learn More
                    <svg
                      className="w-4 h-4"
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
                  </Link> */}
                </div>
                <div className="p-8">
                  {/* Features List */}
                  <ul className="space-y-2 mb-8 flex-1">
                    {pillar.outcomes.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start font-medium gap-2 text-slate-300 border-b border-slate-700 pb-4"
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Link */}
            </div>
          ))}
        </div>

        {/* Core System Callout */}
        <div className="my-12 bg-gradient-to-br from-primary/5 to-secondary/5 border border-slate-700 rounded-md p-8 md:p-12 text-center shadow-sm">
          <h3 className="text-2xl font-bold text-slate-100 uppercase tracking-tight mb-4">
            The Core System Is Free
          </h3>
          <p className="text-slate-200 max-w-2xl mx-auto mb-8">
            Every plan includes the SIO-V5 audit, Global Score, and basic
            defensibility tracking. Upgrade to unlock competitive intelligence,
            strategic warfare capabilities, and white-glove support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sio-audit"
              className="inline-flex items-center justify-center gap-2 bg-secondary text-white px-8 py-4 rounded-lg font-bold uppercase tracking-wider hover:bg-secondary/90 transition-colors shadow-md"
            >
              Get Your Free Audit
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-lg font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors border border-slate-300 shadow-sm"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
