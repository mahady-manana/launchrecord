"use client";

import { FAQSection } from "@/components/landing/FAQSection";
import { FivePillarsSection } from "@/components/landing/FivePillarsSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { PainkillersSection } from "@/components/landing/PainkillersSection";
import { PreAuditFunnel } from "@/components/landing/PreAuditFunnel";
import { SocialProofSection } from "@/components/landing/SocialProofSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { PricingCard, pricingTiers } from "@/components/pricing/pricing-card";
import Link from "next/link";
import { ReactNode } from "react";

interface LaunchRecordLandingPageProps {
  Directories: ReactNode;
}
export default function LaunchRecordLandingPage({
  Directories,
}: LaunchRecordLandingPageProps) {
  return (
    <div className="py-10 lg:px-0 px-4">
      <HeroSection />
      {Directories}
      <FivePillarsSection />
      <StatsSection />
      <PainkillersSection />
      <section className="max-w-7xl mx-auto space-y-12 bg-slate-900 px-4 rounded-xl py-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-slate-100">
            Choose Your War Room
          </h2>
          <p className="text-lg text-slate-200 max-w-2xl mx-auto">
            Every plan includes the Core System. Upgrade to unlock competitive
            intelligence and strategic warfare capabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      </section>
      <PreAuditFunnel />
      <FAQSection />
      <SocialProofSection />
    </div>
  );
}
