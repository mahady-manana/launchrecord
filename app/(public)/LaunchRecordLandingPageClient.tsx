"use client";

import { LandingLeaderboard } from "@/components/LandingLeaderboard";
import { PricingCard, pricingTiers } from "@/components/pricing/pricing-card";
import { WarBriefingPreview } from "@/components/WarBriefingPreview";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProtocolSection } from "@/components/landing/ProtocolSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { PainkillersSection } from "@/components/landing/PainkillersSection";
import { PreAuditFunnel } from "@/components/landing/PreAuditFunnel";
import { FAQSection } from "@/components/landing/FAQSection";
import { SocialProofSection } from "@/components/landing/SocialProofSection";
import Link from "next/link";

export default function LaunchRecordLandingPage() {
  return (
    <div className="space-y-20 py-10 lg:px-0 px-4">
      <HeroSection />
      <section className="max-w-6xl mx-auto">
        <LandingLeaderboard />
      </section>
      <section className="max-w-6xl mx-auto">
        <WarBriefingPreview />
      </section>
      <ProtocolSection />
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
