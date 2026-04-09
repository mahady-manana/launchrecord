"use client";

import { FAQSection } from "@/components/landing/FAQSection";
import { ForWhoSection } from "@/components/landing/ForWhoSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { OutcomeSection } from "@/components/landing/OutcomeSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { SolutionSection } from "@/components/landing/SolutionSection";
import { WhatIsItSection } from "@/components/landing/WhatIsItSection";
import { PricingCard, pricingTiers } from "@/components/pricing/pricing-card";
import Link from "next/link";

export default function LaunchRecordLandingPageClient() {
  return (
    <div className="bg-green-50">
      {/* Hero - Unchanged */}
      <HeroSection />

      {/* Problem Section */}
      <ProblemSection />

      {/* Solution Section */}
      <SolutionSection />

      {/* Outcome Section */}
      <OutcomeSection />

      {/* What Is It Section - Includes Five Pillars */}
      <WhatIsItSection />

      {/* For Who Section */}
      <ForWhoSection />

      {/* Pricing Section */}
      <section
        className="bg-gradient-to-b from-white to-slate-50 px-4 py-16"
        id="pricing"
      >
        <div className="max-w-7xl space-y-12  mx-auto ">
          <div className="text-center space-y-4 pb-20">
            <h2 className="text-4xl font-bold text-slate-900">
              Choose Your Plan
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Start free, then upgrade to Founder for competitive intelligence
              and weekly mission control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pricingTiers.map((tier, idx) => (
              <PricingCard key={idx} tier={tier} variant="compact" />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/pricing"
              className="text-primary hover:underline font-medium"
            >
              View detailed pricing comparison →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />
    </div>
  );
}
