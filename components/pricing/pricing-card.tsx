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
import { useSubscribe } from "@/hooks/use-subscribe";
import { Check } from "lucide-react";
import { useState } from "react";

export interface PricingTier {
  name: string;
  planType: "onetime" | "founder";
  price: string;
  period?: string;
  description: string;
  limits: {
    audits: number | "unlimited";
    products?: number;
    teamMembers?: number;
    competitors?: number;
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

export function PricingCard({
  tier,
  variant = "default",
  productId,
}: PricingCardProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { startSubscription } = useSubscribe();
  const isFeatured = tier.isFeatured || tier.planType === "founder";

  const handleSubscribe = async () => {
    setIsCheckingOut(true);
    try {
      const result = await startSubscription({
        productId,
        planType: tier.planType as "onetime" | "founder",
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
          ? "border-primary shadow-lg scale-105 bg-gradient-to-b from-primary/5 to-white"
          : "border-slate-300 bg-white shadow-sm"
      } ${variant === "compact" ? "text-sm" : ""}`}
    >
      {isFeatured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
            Best Value
          </span>
        </div>
      )}

      <CardHeader className="space-y-4 pb-6">
        <div className="space-y-2">
          <CardTitle
            className={`text-2xl font-black uppercase tracking-tighter ${
              isFeatured ? "text-primary" : "text-slate-900"
            }`}
          >
            {tier.name}
          </CardTitle>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900">
              {tier.price}
            </span>
            {tier.period && (
              <span className="text-slate-500 font-medium">{tier.period}</span>
            )}
          </div>
        </div>
        <CardDescription className="text-slate-600 leading-relaxed">
          {tier.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-6">
        {/* Features Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            {tier.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-slate-700 text-sm">{feature}</span>
              </div>
            ))}
          </div>

          {tier.killerFeatures && tier.killerFeatures.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-200">
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
                    <span className="text-slate-700 text-sm font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-6">
        <Button
          onClick={handleSubscribe}
          disabled={isCheckingOut}
          className={`w-full h-12 font-bold uppercase tracking-wider transition-all ${
            isFeatured
              ? "bg-primary hover:bg-primary/90 text-white"
              : "bg-orange-500 hover:bg-orange-600 text-white"
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
    name: "One-Time Pass",
    planType: "onetime",
    price: "$29",
    period: "one-time",
    description: "5 full audits with positioning & messaging fixes.",
    limits: {
      audits: 5,
    },
    features: [
      "5 full SIO-V5 audits",
      "Complete reports with all insights",
      "Positioning insights & fixes",
      "PosiMessaging insights & fixes",
      "Positioning analysis",
      "Clarity analysis",
      "AEO presence check",
      "Actionable recommendations",
    ],
    killerFeatures: [
      "No subscription needed",
      "Pay once, use forever",
      "Full report access",
    ],
    ctaText: "Get 5 Audits - $29",
  },
  {
    name: "Founder Plan",
    planType: "founder",
    price: "$49",
    period: "/ month",
    description: "Continuous audits + weekly auto-audits + competitor intel.",
    limits: {
      audits: "unlimited",
      products: 1,
      teamMembers: 5,
      competitors: 5,
    },
    features: [
      "Unlimited manual audits",
      "Weekly Auto Audit",
      "Competitor Spy (score & positioning changes)",
      "Private Audit Mode",
      "Historical Analytics",
      "Strategy Recommendations",
      "Basic Market Snapshot",
      "Execution Timeline",
      "Positioning insights & fixes",
      "PosiMessaging insights & fixes",
    ],
    killerFeatures: [
      "Continuous monitoring",
      "Competitor intelligence",
      "Unlimited access",
    ],
    ctaText: "Start Founder Plan",
    isFeatured: true,
  },
];

export const coreSystemFeatures: PricingTier = {
  name: "Core System",
  planType: "onetime",
  price: "Included",
  description: "The foundation features that power every audit.",
  limits: {
    audits: 0,
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
