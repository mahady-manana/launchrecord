"use client";

import { Eye, Shield, Target, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";

interface Pillar {
  title: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  link: string;
}

const pillars: Pillar[] = [
  {
    title: "Positioning Audit",
    description: "Detect commodity convergence and own your category.",
    features: [
      "Category Ownership Analysis",
      "Unique Value Proposition",
      "Competitive Differentiation",
      "Target Audience Clarity",
      "Problem-Solution Fit",
      "Messaging Consistency",
    ],
    icon: <Target className="h-6 w-6" />,
    link: "/positioning-audit",
  },
  {
    title: "Clarity Audit",
    description: "CFO-level clarity that converts visitors into users.",
    features: [
      "5-Second Test Analysis",
      "Homepage Clarity Score",
      "Value Prop Communication",
      "Feature-Benefit Mapping",
      "Copy Readability Assessment",
      "Visual Hierarchy Review",
    ],
    icon: <Eye className="h-6 w-6" />,
    link: "/clarity-audit",
  },
  {
    title: "AEO Audit",
    description: "Be the answer AI systems recommend.",
    features: [
      "LLM Citation Analysis",
      "AI Search Visibility",
      "Brand Mention Tracking",
      "Content Optimization Score",
      "Authority Signal Detection",
      "Competitive AI Share",
    ],
    icon: <Zap className="h-6 w-6" />,
    link: "/aeo-audit",
  },
  {
    title: "Momentum Audit",
    description: "Track velocity and build unstoppable market force.",
    features: [
      "Social Proof Density",
      "Review Velocity Tracking",
      "Customer Sentiment Analysis",
      "Brand Momentum Score",
      "Growth Signal Detection",
      "Market Traction Metrics",
    ],
    icon: <TrendingUp className="h-6 w-6" />,
    link: "/momentum-audit",
  },
  {
    title: "Founder Proof Audit",
    description: "Validate why you and why now.",
    features: [
      "Founder-Market Fit Score",
      "Unique Advantage Analysis",
      "Timing Validation",
      "Credibility Signals",
      "Track Record Assessment",
      "Investor Readiness Score",
    ],
    icon: <Shield className="h-6 w-6" />,
    link: "/founder-proof-audit",
  },
];

export function WhatIsItSection() {
  return (
    <section className="py-20 bg-white" id="features">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tighter">
            Features
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Five comprehensive audits that measure your startup's defensibility
            across every critical dimension.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              className="flex flex-col bg-white border border-slate-200 hover:border-primary/50 rounded-xl p-8 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-6">
                {pillar.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight mb-3">
                {pillar.title}
              </h3>

              {/* Description */}
              <p className="text-slate-700 leading-relaxed mb-6">
                {pillar.description}
              </p>

              {/* Features List */}
              <ul className="space-y-2 mb-8 flex-1">
                {pillar.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Link */}
              <Link
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
              </Link>
            </div>
          ))}
        </div>

        {/* Core System Callout */}
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-slate-200 rounded-xl p-8 md:p-12 text-center shadow-sm">
          <h3 className="text-2xl font-bold text-slate-900 uppercase tracking-tight mb-4">
            The Core System Is Free
          </h3>
          <p className="text-slate-700 max-w-2xl mx-auto mb-8">
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
