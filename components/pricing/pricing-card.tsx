"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, X } from "lucide-react";
import Link from "next/link";

export interface PricingTier {
  name: string;
  planType: "core" | "founder" | "growth" | "sovereign";
  price: string;
  period?: string;
  description: string;
  limits: {
    products: number;
    teamMembers: number;
    competitors: number;
  };
  features: string[];
  killerFeatures?: string[];
  isFeatured?: boolean;
  ctaText: string;
  ctaLink: string;
}

interface PricingCardProps {
  tier: PricingTier;
  variant?: "default" | "compact";
}

export function PricingCard({ tier, variant = "default" }: PricingCardProps) {
  const isCore = tier.planType === "core";
  const isSovereign = tier.planType === "sovereign";
  const isFeatured = tier.isFeatured || isSovereign;

  return (
    <Card
      className={`relative flex flex-col h-full transition-all duration-300 hover:shadow-lg ${
        isFeatured
          ? "border-primary shadow-lg scale-105 bg-gradient-to-b from-primary/5 to-transparent"
          : isCore
            ? "border-slate-700 bg-slate-900/50"
            : "border-slate-800 bg-slate-950/50"
      } ${variant === "compact" ? "text-sm" : ""}`}
    >
      {isFeatured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
            {isSovereign ? "Most Powerful" : "Best Value"}
          </span>
        </div>
      )}

      <CardHeader className="space-y-4 pb-6">
        <div className="space-y-2">
          <CardTitle
            className={`text-2xl font-black uppercase tracking-tighter ${
              isFeatured ? "text-primary" : "text-white"
            }`}
          >
            {tier.name}
          </CardTitle>
          {tier.planType !== "core" && (
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white">
                {tier.price}
              </span>
              {tier.period && (
                <span className="text-slate-400 font-medium">
                  {tier.period}
                </span>
              )}
            </div>
          )}
          {tier.planType === "core" && (
            <p className="text-primary font-bold text-lg">
              {tier.price} {tier.period}
            </p>
          )}
        </div>
        <CardDescription className="text-slate-400 leading-relaxed">
          {tier.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-6">
        {/* Limits Section */}
        {tier.planType !== "core" && (
          <div className="space-y-3 border-b border-slate-800 pb-4">
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">
              Limits
            </p>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 bg-slate-900 rounded-md">
                <p className="text-lg font-bold text-white">{tier.limits.products}</p>
                <p className="text-[10px] text-slate-500 uppercase">Product</p>
              </div>
              <div className="text-center p-2 bg-slate-900 rounded-md">
                <p className="text-lg font-bold text-white">{tier.limits.teamMembers}</p>
                <p className="text-[10px] text-slate-500 uppercase">Team</p>
              </div>
              <div className="text-center p-2 bg-slate-900 rounded-md">
                <p className="text-lg font-bold text-white">{tier.limits.competitors}</p>
                <p className="text-[10px] text-slate-500 uppercase">Competitors</p>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="space-y-4">
          {tier.planType === "core" && (
            <div>
              <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">
                Core System Features
              </p>
              <div className="space-y-2">
                {tier.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tier.planType !== "core" && (
            <>
              <div className="space-y-2">
                {tier.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {tier.killerFeatures && tier.killerFeatures.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <p className="text-xs font-mono text-primary uppercase tracking-widest">
                    Killer Features
                  </p>
                  <div className="space-y-2">
                    {tier.killerFeatures.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 p-2 bg-primary/5 rounded-md border border-primary/20"
                      >
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-slate-200 text-sm font-medium">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-6">
        <Button
          asChild
          className={`w-full h-12 font-bold uppercase tracking-widest transition-all ${
            isFeatured
              ? "bg-primary hover:bg-primary/90 text-primary-foreground"
              : "bg-white hover:bg-slate-200 text-black"
          } ${variant === "compact" ? "text-xs" : "text-sm"}`}
        >
          <Link href={tier.ctaLink}>{tier.ctaText}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export const pricingTiers: PricingTier[] = [
  {
    name: "Founder Plan",
    planType: "founder",
    price: "$49",
    period: "/ month",
    description: "Good enough to get hooked.",
    limits: {
      products: 1,
      teamMembers: 5,
      competitors: 5,
    },
    features: [
      "Weekly Auto Audit",
      "Competitor Spy (score & positioning changes)",
      "Private Audit Mode",
      "Historical Analytics",
      "Strategy Recommendations",
      "Basic Market Snapshot",
      "Execution Timeline",
    ],
    ctaText: "Start Free Trial",
    ctaLink: "/register?plan=founder",
  },
  {
    name: "Growth Plan",
    planType: "growth",
    price: "$99",
    period: "/ month",
    description: "Now the platform becomes competitive intelligence.",
    limits: {
      products: 1,
      teamMembers: 10,
      competitors: 10,
    },
    features: [
      "Everything in Founder Plan +",
      "Competitor Change Alerts",
      "Launch Readiness Score",
      "Investor Report Generator",
      "Hide Score Option",
      "Featured Product Rotation",
      "Competitive Gap Analysis",
      "Market Intelligence Reports",
    ],
    ctaText: "Start Free Trial",
    ctaLink: "/register?plan=growth",
    isFeatured: true,
  },
  {
    name: "Sovereign Plan",
    planType: "sovereign",
    price: "$299",
    period: "/ month",
    description: "The strategic command center for serious founders.",
    limits: {
      products: 1,
      teamMembers: 20,
      competitors: 20,
    },
    features: [
      "Everything in Growth Plan +",
      "Priority Support",
      "Strategic Architect Sessions",
      "Emergency Pivot Calls",
      "White-Glove Proof Curation",
    ],
    killerFeatures: [
      "Strategy Sandbox - Simulate decisions before building",
      "Defensibility Delta Engine - See exact gap vs category leader",
      "Founder War Room - Real-time competitive dashboard",
      "Strategic Moat Generator - AI creates new moat strategies",
      "VC-Ready Strategic Dossier - Full investor intelligence report",
      "Market Intelligence Briefs - Monthly deep niche reports",
      "Sovereign Founder Profile - Public credibility score",
    ],
    ctaText: "Start Free Trial",
    ctaLink: "/register?plan=sovereign",
  },
];

export const coreSystemFeatures: PricingTier = {
  name: "Core System",
  planType: "core",
  price: "Included in all plans",
  description: "The foundation features that power every audit.",
  limits: {
    products: 0,
    teamMembers: 0,
    competitors: 0,
  },
  features: [
    "AI strategic audit",
    "5 pillars scoring",
    "Defensibility score",
    "Positioning analysis",
    "Score evolution tracking",
    "Strategy evolution tracking",
    "Timeline of improvements",
    "AI suggests: moat creation, positioning shifts, pricing & distribution strategy",
  ],
  ctaText: "Get Started",
  ctaLink: "/register",
};
