"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCancelSubscription } from "@/hooks/use-cancel-subscription";
import { useSubscribe } from "@/hooks/use-subscribe";
import { useSubscription } from "@/hooks/use-subscription";
import { useProductStore } from "@/stores/product-store";
import { AlertCircle, Check, Loader2, Package, Zap } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Run a full SIO-V5 audit and get your war briefing.",
    icon: Package,
    features: [
      "SIO-V5 audit",
      "Global score + war briefing",
      "5-pillar scoring breakdown",
      "Positioning + clarity insights",
      "AEO visibility check",
    ],
  },
  {
    id: "founder",
    name: "Founder Plan",
    price: "$49",
    period: "/month",
    description: "Good enough to get hooked.",
    icon: Zap,
    isFeatured: true,
    limits: {
      monthly: 15,
      weekly: 5,
    },
    features: [
      "5 Positioning Audits / Week",
      "15 Audits / Month",
      "1 Product",
      "5 Team Members",
      "5 Competitors",
      "Weekly Auto Audit",
      "Competitor Spy",
      "Private Audit Mode",
      "Historical Analytics",
    ],
  },
];

function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "text-green-600 bg-green-600/10 border-green-600/20";
    case "past_due":
      return "text-yellow-600 bg-yellow-600/10 border-yellow-600/20";
    case "canceled":
      return "text-red-600 bg-red-600/10 border-red-600/20";
    case "canceling":
      return "text-orange-600 bg-orange-600/10 border-orange-600/20";
    default:
      return "text-slate-600 bg-slate-600/10 border-slate-600/20";
  }
}

export default function ProductSubscriptionPage() {
  const params = useParams();
  const productId = params.product as string;
  const searchParams = useSearchParams();
  const { selectedProduct } = useProductStore();
  const { subscription, fetchSubscription } = useSubscription();
  const { startSubscription, isLoading } = useSubscribe();
  const { cancelSubscription, isLoading: isCanceling } =
    useCancelSubscription();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscription(productId);
  }, [fetchSubscription, productId]);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success("Subscription activated successfully!");
      fetchSubscription(productId);
    } else if (searchParams.get("canceled") === "true") {
      toast.error("Checkout was canceled. No charges were made.");
    }
  }, [searchParams, fetchSubscription, productId]);

  const handleSubscribe = async (planType: "founder") => {
    setError(null);
    setSelectedPlan(planType);

    const result = await startSubscription({ productId, planType });
    if (!result.ok) {
      setError(result.error || "Unable to start checkout.");
      setSelectedPlan(null);
      return;
    }

    if (result.url) {
      window.location.assign(result.url);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel your subscription?")) {
      return;
    }

    const result = await cancelSubscription({ productId, immediate: false });
    if (result.ok) {
      toast.success(result.message || "Subscription canceled successfully");
      fetchSubscription(productId);
    } else {
      toast.error(result.error || "Failed to cancel subscription");
    }
  };

  const currentPlan = subscription?.planType || "free";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href={`/dashboard/${productId}`}>
          <Button variant="ghost" size="sm" className="mb-4">
            <span className="mr-2">←</span> Back to Dashboard
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Subscription</h1>
            <p className="text-muted-foreground">
              Manage your subscription for {selectedProduct?.name}
            </p>
          </div>
          {subscription?.status === "active" && (
            <Badge className={getStatusColor(subscription.status)}>
              <span className="capitalize">{subscription.planType} Plan</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Current Subscription Status */}
      {subscription && (
        <Card>
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  Plan:{" "}
                  <span className="capitalize">{subscription.planType}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Status:{" "}
                  <Badge
                    variant="outline"
                    className={getStatusColor(subscription.status)}
                  >
                    {subscription.status.replace("_", " ")}
                  </Badge>
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  Current period ends
                </p>
                <p className="text-lg font-semibold">
                  {subscription.currentPeriodEnd
                    ? new Date(
                        subscription.currentPeriodEnd,
                      ).toLocaleDateString()
                    : "-"}
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              {subscription.status === "active" && (
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isCanceling}
                >
                  {isCanceling ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Canceling...
                    </>
                  ) : (
                    "Cancel Subscription"
                  )}
                </Button>
              )}

              {subscription.status === "canceling" && (
                <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">
                      Subscription scheduled for cancellation
                    </p>
                    <p className="text-xs">
                      Your subscription will end on{" "}
                      {subscription.currentPeriodEnd
                        ? new Date(
                            subscription.currentPeriodEnd,
                          ).toLocaleDateString()
                        : "the current period end"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan Selection */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {subscription ? "Change Plan" : "Choose a Plan"}
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {plans.map((plan) => {
            const isCurrentPlan = currentPlan === plan.id;
            const PlanIcon = plan.icon;

            return (
              <Card
                key={plan.id}
                className={`relative flex flex-col transition-all duration-300 ${
                  plan.isFeatured
                    ? "border-primary shadow-xl scale-105 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent hover:shadow-2xl hover:scale-[1.07]"
                    : "border-border"
                } ${isCurrentPlan ? "opacity-60" : ""}`}
              >
                {plan.isFeatured ? (
                  <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg">
                    ⭐ Most Popular
                  </Badge>
                ) : null}
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`p-2 rounded-lg ${
                        plan.isFeatured
                          ? "bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      <PlanIcon className="h-5 w-5" />
                    </div>
                    <CardTitle
                      className={`text-lg ${
                        plan.isFeatured ? "text-primary font-black" : ""
                      }`}
                    >
                      {plan.name}
                    </CardTitle>
                  </div>
                  <CardDescription
                    className={plan.isFeatured ? "text-slate-600" : ""}
                  >
                    {plan.description}
                  </CardDescription>
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-4xl font-black ${
                        plan.isFeatured ? "text-primary" : ""
                      }`}
                    >
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check
                          className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                            plan.isFeatured ? "text-primary" : "text-green-600"
                          }`}
                        />
                        <span className={plan.isFeatured ? "font-medium" : ""}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                <Button
                  className={`w-full mt-auto h-12 font-bold uppercase tracking-wide transition-all ${
                    plan.isFeatured
                      ? "bg-gradient-to-r from-primary to-primary/90 hover:from-primary hover:to-primary/80 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]"
                      : ""
                  }`}
                  variant={plan.isFeatured ? "default" : "outline"}
                  disabled={isCurrentPlan || isLoading || plan.id === "free"}
                  onClick={() =>
                    plan.id === "founder" ? handleSubscribe("founder") : null
                  }
                >
                  {isLoading && selectedPlan === plan.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : isCurrentPlan ? (
                    "Current Plan"
                  ) : (
                    "Upgrade to Founder"
                  )}
                </Button>
              </CardContent>
            </Card>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}
    </div>
  );
}
