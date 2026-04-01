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
import { Check } from "lucide-react";
import { useState } from "react";
import { useSubscribe } from "@/hooks/use-subscribe";

export interface PricingTier {
  name: string;
  planType: "free" | "founder";
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
  ctaLink?: string;
  onSubscribe?: () => void;
}

interface PricingCardProps {
  tier: PricingTier;
  variant?: "default" | "compact";
  productId?: string;
}

export function PricingCard({ tier, variant = "default", productId }: PricingCardProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { startSubscription } = useSubscribe();
  const isFree = tier.planType === "free";
  const isFeatured = tier.isFeatured || tier.planType === "founder";

  const handleSubscribe = async () => {
    if (tier.planType === "free") {
      window.location.href = tier.ctaLink || "/sio-audit";
      return;
    }

    setIsCheckingOut(true);
    try {
      const result = await startSubscription({
        productId,
        planType: tier.planType as "founder",
      });

      if (result.ok && result.url) {
        window.location.href = result.url;
      }
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <Card
      className={`relative flex flex-col h-full transition-all duration-300 hover:shadow-lg ${
        isFeatured
          ? "border-primary shadow-lg scale-105 bg-gradient-to-b from-primary/5 to-transparent"
          : isFree
            ? "border-slate-700 bg-slate-900/50"
            : "border-slate-800 bg-slate-950/50"
      } ${variant === "compact" ? "text-sm" : ""}`}
    >
      {isFeatured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
            Best Value
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
          {tier.planType !== "free" && (
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
          {tier.planType === "free" && (
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
        {tier.planType !== "free" && (
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
          {tier.planType === "free" && (
            <div>
              <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">
                Free Plan Includes
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

          {tier.planType !== "free" && (
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
          onClick={handleSubscribe}
          disabled={isCheckingOut}
          className={`w-full h-12 font-bold uppercase tracking-widest transition-all ${
            isFeatured
              ? "bg-primary hover:bg-primary/90 text-primary-foreground"
              : "bg-white hover:bg-slate-200 text-black"
          } ${variant === "compact" ? "text-xs" : "text-sm"}`}
        >
          {isCheckingOut ? "Processing..." : tier.ctaText}
        </Button>
      </CardFooter>
    </Card>
  );
}

export const pricingTiers: PricingTier[] = [
  {
    name: "Free",
    planType: "free",
    price: "$0",
    period: "/ month",
    description: "Run a full SIO-V5 audit and get your war briefing.",
    limits: {
      products: 1,
      teamMembers: 1,
      competitors: 1,
    },
    features: [
      "SIO-V5 audit",
      "Global score + war briefing",
      "5-pillar scoring breakdown",
      "Positioning + clarity insights",
      "AEO visibility check",
    ],
    ctaText: "Get Free Audit",
    ctaLink: "/sio-audit",
  },
  {
    name: "Founder Plan",
    planType: "founder",
    price: "$49",
    period: "/ month",
    description: "Competitive intelligence + weekly mission control.",
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
    ctaText: "Start Founder Plan",
    isFeatured: true,
  },
];

export const coreSystemFeatures: PricingTier = {
  name: "Free Plan",
  planType: "free",
  price: "Free",
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
  ctaText: "Get Free Audit",
  ctaLink: "/sio-audit",
};
