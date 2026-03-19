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
import { useProducts } from "@/hooks/use-products";
import { useSubscribe } from "@/hooks/use-subscribe";
import { useSubscription } from "@/hooks/use-subscription";
import { useProductStore } from "@/stores/product-store";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  ChevronRight,
  CreditCard,
  Crown,
  Loader2,
  Package,
  Plus,
  Shield,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

const plans = [
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
  {
    id: "growth",
    name: "Growth Plan",
    price: "$99",
    period: "/month",
    description: "Competitive intelligence unlocked.",
    icon: Shield,
    comingSoon: true,
    limits: {
      monthly: 30,
      weekly: 5,
    },
    features: [
      "5 Auto Audits / Week",
      "30 Audits / Month",
      "Everything in Founder +",
      "10 Team Members",
      "10 Competitors",
      "Competitor Change Alerts",
      "Launch Readiness Score",
      "Investor Report Generator",
      "Market Intelligence Reports",
    ],
  },
  {
    id: "sovereign",
    name: "Sovereign Plan",
    price: "$299",
    period: "/month",
    description: "The strategic command center.",
    icon: Crown,
    comingSoon: true,
    limits: {
      monthly: "Unlimited",
      weekly: "Unlimited",
    },
    features: [
      "Unlimited Audits",
      "Everything in Growth +",
      "20 Team Members",
      "20 Competitors",
      "Strategy Sandbox",
      "Defensibility Delta Engine",
      "Founder War Room",
      "Strategic Moat Generator",
      "VC-Ready Strategic Dossier",
    ],
  },
];

function SubscriptionContent() {
  const searchParams = useSearchParams();
  const { productsWithReports } = useProductStore();
  const { loadAllProductsData } = useProducts();
  const { subscriptions, fetchSubscription } = useSubscription();
  const { startSubscription, isLoading } = useSubscribe();
  const { cancelSubscription, isLoading: isCanceling } =
    useCancelSubscription();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAllProductsData();
    fetchSubscription();
  }, [loadAllProductsData, fetchSubscription]);

  useEffect(() => {
    // Handle success/cancel from Stripe redirect
    if (searchParams.get("success") === "true") {
      toast.success("Subscription activated successfully!");
      fetchSubscription();
      setCurrentStep(1);
      setSelectedProductId(null);
      setSelectedPlan(null);
    } else if (searchParams.get("canceled") === "true") {
      toast.error("Checkout was canceled. No charges were made.");
    }
  }, [searchParams, fetchSubscription]);

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentStep(2);
    setError(null);
  };

  const handleBackToProducts = () => {
    setSelectedProductId(null);
    setSelectedPlan(null);
    setCurrentStep(1);
    setError(null);
  };

  const handleSubscribe = async (
    planType: "founder" | "growth" | "sovereign",
  ) => {
    if (!selectedProductId) {
      setError("Please select a product first");
      return;
    }

    setError(null);
    setSelectedPlan(planType);

    const result = await startSubscription({
      productId: selectedProductId,
      planType,
    });
    if (!result.ok) {
      setError(result.error || "Unable to start checkout.");
      setSelectedPlan(null);
      return;
    }

    if (result.url) {
      window.location.assign(result.url);
    }
  };

  const handleCancel = async (productId: string) => {
    if (!confirm("Are you sure you want to cancel your subscription?")) {
      return;
    }

    const result = await cancelSubscription({ productId, immediate: false });
    if (result.ok) {
      toast.success(result.message || "Subscription canceled successfully");
      fetchSubscription();
    } else {
      toast.error(result.error || "Failed to cancel subscription");
    }
  };

  const getStatusColor = (status: string) => {
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
  };

  // Get subscription for selected product
  const selectedSubscription = subscriptions.find(
    (s) => s.productId === selectedProductId,
  );
  const currentPlan = selectedSubscription?.planType || null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Billing
        </p>
        <h1 className="mt-2 text-2xl font-semibold">Subscription</h1>
      </div>

      {/* Stepper */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-4">
            <div
              className={`flex items-center gap-2 ${currentStep === 1 ? "text-primary" : "text-muted-foreground"}`}
            >
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center font-bold ${
                  currentStep === 1 ? "bg-primary text-white" : "bg-muted"
                }`}
              >
                1
              </div>
              <Package className="h-4 w-4" />
              <span className="font-medium">Select Product</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <div
              className={`flex items-center gap-2 ${currentStep === 2 ? "text-primary" : "text-muted-foreground"}`}
            >
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center font-bold ${
                  currentStep === 2 ? "bg-primary text-white" : "bg-muted"
                }`}
              >
                2
              </div>
              <CreditCard className="h-4 w-4" />
              <span className="font-medium">Select Plan</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Product Selection */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Select Product</CardTitle>
            <CardDescription>
              Choose which product you want to subscribe or upgrade
            </CardDescription>
          </CardHeader>
          <CardContent>
            {productsWithReports.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {productsWithReports.map((product) => {
                  const productSubscription = subscriptions.find(
                    (s) => s.productId === product.id,
                  );

                  return (
                    <button
                      key={product.id}
                      onClick={() => handleProductSelect(product.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                        selectedProductId === product.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {productSubscription ? (
                              <Badge
                                className={getStatusColor(
                                  productSubscription.status,
                                )}
                              >
                                {productSubscription.planType}
                              </Badge>
                            ) : (
                              "No subscription"
                            )}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Plus className="h-12 w-12 text-muted-foreground" />
                <div className="text-center">
                  <p className="font-semibold">No products yet</p>
                  <p className="text-sm text-muted-foreground">
                    Add a product first to manage subscriptions
                  </p>
                </div>
                <Link href="/dashboard/survey">
                  <Button>Add Product</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Plan Selection */}
      {currentStep === 2 && selectedProductId && (
        <>
          {/* Current Subscription Status */}
          {selectedSubscription && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Current Subscription</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      Plan:{" "}
                      <span className="capitalize">
                        {selectedSubscription.planType}
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Status:{" "}
                      <Badge
                        variant="outline"
                        className={getStatusColor(selectedSubscription.status)}
                      >
                        {selectedSubscription.status.replace("_", " ")}
                      </Badge>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Current period ends
                    </p>
                    <p className="text-lg font-semibold">
                      {selectedSubscription.currentPeriodEnd
                        ? new Date(
                            selectedSubscription.currentPeriodEnd,
                          ).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                </div>

                {selectedSubscription.status === "active" && (
                  <Button
                    variant="outline"
                    onClick={() => handleCancel(selectedSubscription.productId)}
                    disabled={isCanceling}
                    className="w-full sm:w-auto"
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

                {selectedSubscription.status === "canceling" && (
                  <div className="flex items-center gap-2 text-yellow-600">
                    <AlertCircle className="h-4 w-4" />
                    <p className="text-sm">
                      Your subscription will end on{" "}
                      {selectedSubscription.currentPeriodEnd
                        ? new Date(
                            selectedSubscription.currentPeriodEnd,
                          ).toLocaleDateString()
                        : "the current period end"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Plan Selection */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Step 2: Select Plan</CardTitle>
                  <CardDescription>
                    Choose the plan that fits your needs
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToProducts}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Change Product
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {plans.map((plan) => {
                  const isCurrentPlan = currentPlan === plan.id;
                  const isUpgrade =
                    plan.id === "growth" && currentPlan === "founder";
                  const isDowngrade =
                    plan.id === "founder" && currentPlan === "growth";
                  const isComingSoon = plan.comingSoon;

                  return (
                    <Card
                      key={plan.id}
                      className={`relative flex flex-col transition-all duration-300 ${
                        plan.isFeatured
                          ? "border-primary shadow-xl scale-105 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent hover:shadow-2xl hover:scale-[1.07]"
                          : "border-border"
                      } ${isCurrentPlan ? "opacity-60" : ""} ${
                        isComingSoon ? "opacity-75 grayscale" : ""
                      }`}
                    >
                      {isComingSoon ? (
                        <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-slate-600">
                          Coming Soon
                        </Badge>
                      ) : plan.isFeatured ? (
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
                            <Shield className="h-5 w-5" />
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
                          <span className="text-muted-foreground">
                            {plan.period}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 space-y-4">
                        <ul className="space-y-3">
                          {plan.features.map((feature, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-sm"
                            >
                              <Check
                                className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                                  plan.isFeatured
                                    ? "text-primary"
                                    : "text-green-600"
                                }`}
                              />
                              <span
                                className={plan.isFeatured ? "font-medium" : ""}
                              >
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
                          variant={
                            plan.isFeatured && !isComingSoon
                              ? "default"
                              : "outline"
                          }
                          disabled={isCurrentPlan || isLoading || isComingSoon}
                          onClick={() =>
                            handleSubscribe(
                              plan.id as "founder" | "growth" | "sovereign",
                            )
                          }
                        >
                          {isLoading && selectedPlan === plan.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : isCurrentPlan ? (
                            "Current Plan"
                          ) : isComingSoon ? (
                            "Coming Soon"
                          ) : (
                            <>
                              {isUpgrade
                                ? "🚀 Upgrade"
                                : isDowngrade
                                  ? "Downgrade"
                                  : "✨ Get Started"}
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {error && (
        <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <SubscriptionContent />
    </Suspense>
  );
}
