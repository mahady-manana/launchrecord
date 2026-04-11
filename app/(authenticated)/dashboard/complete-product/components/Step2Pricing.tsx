"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSubscribe } from "@/hooks/use-subscribe";
import {
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Step2PricingProps {
  productId: string | null;
  onBack: () => void;
}

const PLANS = [
  {
    id: "onetime" as const,
    name: "One-Time Pass",
    price: "$29",
    period: "one-time",
    description: "Get 5 full audits — pay once, use whenever.",
    isFeatured: false,
    badge: null,
    ctaLabel: "Get One Time Pass",
    color: "slate" as const,
    features: [
      "5 complete SIO-V5 audit reports",
      "Sentence-level rewrites & fixes",
      "Positioning & clarity analysis",
      "AEO visibility check",
      "Free startup directory listing",
      "No expiration — use anytime",
    ],
    killerFeatures: [
      "Pay once, full 5 audits forever",
      "Perfect for a single launch",
      "No commitment needed",
    ],
  },
  {
    id: "founder" as const,
    name: "Founder Plan",
    price: "$49",
    period: "/ month",
    description: "15 audits + weekly auto-audits + competitor spy.",
    isFeatured: true,
    badge: "Best Value",
    ctaLabel: "Start growing",
    color: "green" as const,
    features: [
      "15 SIO-V5 audit reports",
      "Sentence-level rewrites & fixes",
      "Positioning & clarity analysis",
      "AEO visibility check",
      "Free startup directory listing",
      "Weekly auto-audits on your product",
      "Competitor monitoring & spy reports",
      "Priority support",
    ],
    killerFeatures: [
      "15 audits every month",
      "Auto-audits catch issues early",
      "Competitor spy insights",
    ],
  },
];

export function Step2Pricing({ productId, onBack }: Step2PricingProps) {
  const { startSubscription, isLoading: isCheckoutLoading } = useSubscribe();
  const [selectedPlan, setSelectedPlan] = useState<
    "onetime" | "founder" | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = async (planType: "onetime" | "founder") => {
    setError(null);
    setSelectedPlan(planType);

    if (!productId) {
      setError(
        "Product not saved yet. Please go back and complete your profile first.",
      );
      setSelectedPlan(null);
      return;
    }

    const result = await startSubscription({
      productId,
      planType,
      redirectToSubscription: false,
    });

    if (!result.ok) {
      setError(result.error || "Unable to start checkout.");
      setSelectedPlan(null);
    }
    if (result?.url) {
      window.location.assign(result.url);
    }
  };

  return (
    <div className="w-full max-w-4xl">
      {/* Mobile header */}
      <div className="lg:hidden mb-8">
        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-4">
          <Sparkles className="h-4 w-4 text-orange-500" />
          <span className="text-sm font-medium text-orange-600">
            Choose your plan
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          Unlock your full report
        </h2>
        <p className="text-sm text-slate-600">
          Pick a plan — get instant access to your complete audit and a free
          directory listing.
        </p>
      </div>

      {/* Desktop header */}
      <div className="hidden lg:block mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4"
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
          Back to product details
        </button>
        <CardTitle className="text-xl text-slate-800">
          Choose your plan
        </CardTitle>
        <p className="text-sm text-slate-500 mt-1">
          Both plans include your full audit report and free directory listing.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Plans grid */}
      <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
        {PLANS.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          const isLoading = isCheckoutLoading && isSelected;

          return (
            <Card
              key={plan.id}
              className={`relative border-2 transition-all ${
                plan.isFeatured
                  ? "border-green-500 shadow-lg scale-[1.02]"
                  : isSelected
                    ? "border-orange-400 shadow-md"
                    : "border-slate-200 hover:border-slate-300"
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                    <Star className="h-3 w-3" />
                    {plan.badge}
                  </span>
                </div>
              )}

              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  {plan.id === "onetime" ? (
                    <Zap className="h-5 w-5 text-slate-500" />
                  ) : (
                    <BarChart3 className="h-5 w-5 text-green-500" />
                  )}
                  <CardTitle
                    className={`text-lg ${plan.isFeatured ? "text-green-700" : "text-slate-800"}`}
                  >
                    {plan.name}
                  </CardTitle>
                </div>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-4xl font-bold ${plan.isFeatured ? "text-green-600" : "text-slate-900"}`}
                  >
                    {plan.price}
                  </span>
                  <span className="text-sm text-slate-500">{plan.period}</span>
                </div>
                <p className="text-sm text-slate-600 mt-2">
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Killer features */}
                <div
                  className={`rounded-lg p-3 ${plan.isFeatured ? "bg-green-50 border border-green-200" : "bg-slate-50 border border-slate-200"}`}
                >
                  <p
                    className={`text-xs font-semibold uppercase tracking-wide mb-2 ${plan.isFeatured ? "text-green-700" : "text-slate-600"}`}
                  >
                    What you get:
                  </p>
                  <div className="space-y-1.5">
                    {plan.killerFeatures.map((f) => (
                      <div key={f} className="flex items-center gap-2">
                        <CheckCircle2
                          className={`h-4 w-4 flex-shrink-0 ${plan.isFeatured ? "text-green-500" : "text-orange-500"}`}
                        />
                        <span className="text-sm text-slate-700">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* All features */}
                <div className="space-y-2">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-600">{f}</span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() => handleSelect(plan.id)}
                  disabled={isLoading}
                  className={`w-full ${
                    plan.isFeatured
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-orange-500 hover:bg-orange-600 text-white"
                  }`}
                >
                  {isLoading ? (
                    "Starting checkout..."
                  ) : (
                    <>
                      {plan.ctaLabel}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      <div className="py-10 flex justify-end">
        <Link href="/dashboard" className="underline text-sm text-slate-500">
          Skip and continue with limited report only
        </Link>
      </div>
    </div>
  );
}
