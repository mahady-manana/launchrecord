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
import {
  AlertCircle,
  AlertTriangle,
  Check,
  CreditCard,
  History,
  Loader2,
  Shield,
  XCircle,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const plans = [
  {
    id: "onetime",
    name: "One-Time Pass",
    price: "$29",
    period: "one-time",
    description: "5 full audits with positioning & messaging fixes.",
    icon: CreditCard,
    features: [
      "5 full SIO-V5 audits",
      "Complete reports with all insights",
      "Positioning insights & fixes",
      "Messaging insights & fixes",
      "Positioning analysis",
      "Clarity analysis",
      "AEO presence check",
      "Actionable recommendations",
    ],
  },
  {
    id: "founder",
    name: "Founder Plan",
    price: "$49",
    period: "/month",
    description: "Continuous audits + weekly auto-audits + competitor intel.",
    icon: Zap,
    isFeatured: true,
    limits: {
      monthly: 9999,
      weekly: 5,
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
      "Messaging insights & fixes",
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
  const [cancelStep, setCancelStep] = useState<number>(0); // 0 = not canceling, 1-5 = steps
  const [cancelConfirmed, setCancelConfirmed] = useState(false);

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

  const handleSubscribe = async (planType: "onetime" | "founder") => {
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
    if (cancelStep === 5 && cancelConfirmed) {
      const result = await cancelSubscription({ productId, immediate: false });
      if (result.ok) {
        toast.success(result.message || "Subscription canceled successfully");
        fetchSubscription(productId);
        setCancelStep(0);
        setCancelConfirmed(false);
      } else {
        toast.error(result.error || "Failed to cancel subscription");
      }
      return;
    }

    setCancelStep((prev) => prev + 1);
  };

  const handleCancelClose = () => {
    setCancelStep(0);
    setCancelConfirmed(false);
  };

  const handleCancelBack = () => {
    if (cancelStep > 1) {
      setCancelStep((prev) => prev - 1);
    }
  };

  const currentPlan = subscription?.planType || null;

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
                          : "bg-orange-50 text-orange-600"
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
                        plan.isFeatured ? "text-primary" : "text-orange-600"
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
                            plan.isFeatured ? "text-primary" : "text-orange-600"
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
                        : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg"
                    }`}
                    variant={plan.isFeatured ? "default" : "default"}
                    disabled={isCurrentPlan || isLoading}
                    onClick={() =>
                      plan.id === "founder"
                        ? handleSubscribe("founder")
                        : plan.id === "onetime"
                          ? handleSubscribe("onetime")
                          : null
                    }
                  >
                    {isLoading && selectedPlan === plan.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : isCurrentPlan ? (
                      "Current Plan"
                    ) : plan.id === "onetime" ? (
                      "Get one time pass - $29"
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

      {/* Cancel Subscription - Bottom Right */}
      {subscription?.status === "active" &&
        subscription.planType === "founder" &&
        cancelStep === 0 && (
          <div className="flex justify-end pt-4">
            <button
              onClick={() => setCancelStep(1)}
              disabled={isCanceling}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel subscription
            </button>
          </div>
        )}

      {/* Multi-Step Cancel Modal */}
      {cancelStep > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Progress Bar */}
            <div className="h-1 bg-slate-100">
              <div
                className="h-full bg-red-500 transition-all duration-500"
                style={{ width: `${(cancelStep / 5) * 100}%` }}
              />
            </div>

            {/* Content */}
            <div className="p-6">
              {cancelStep === 1 && (
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
                    <AlertTriangle className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Are you sure?
                  </h3>
                  <p className="text-slate-600">
                    We're sorry to see you go. Your subscription gives you
                    unlimited audits and powerful features. Are you absolutely
                    certain you want to lose access?
                  </p>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-left">
                    <p className="text-sm text-amber-800 font-medium">
                      💡 You have unlimited audits remaining! Why not keep
                      going?
                    </p>
                  </div>
                </div>
              )}

              {cancelStep === 2 && (
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                    <XCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    You'll lose all audit data
                  </h3>
                  <p className="text-slate-600">
                    All your SIO-V5 audit reports, scores, and historical
                    improvements will be lost forever. This data cannot be
                    recovered.
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-left">
                    <p className="text-sm text-red-800 font-medium">
                      ⚠️ This includes all positioning insights, clarity fixes,
                      and AEO recommendations
                    </p>
                  </div>
                </div>
              )}

              {cancelStep === 3 && (
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                    <Shield className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Competitor tracking stops
                  </h3>
                  <p className="text-slate-600">
                    You'll no longer receive alerts about competitor score
                    changes, positioning shifts, or strategic moves. Your
                    competitive edge will disappear.
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-left space-y-1">
                    <p className="text-sm text-red-800">
                      • No more competitor spy alerts
                    </p>
                    <p className="text-sm text-red-800">
                      • No more positioning change notifications
                    </p>
                    <p className="text-sm text-red-800">
                      • You'll fly blind against competitors
                    </p>
                  </div>
                </div>
              )}

              {cancelStep === 4 && (
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                    <History className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Historical analytics disappear
                  </h3>
                  <p className="text-slate-600">
                    All your historical score improvements, strategy evolution
                    tracking, and timeline data will be erased. You won't be
                    able to see how far you've come.
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-left space-y-1">
                    <p className="text-sm text-red-800">
                      • Score history deleted
                    </p>
                    <p className="text-sm text-red-800">
                      • Improvement timeline lost
                    </p>
                    <p className="text-sm text-red-800">
                      • Strategy evolution erased
                    </p>
                  </div>
                </div>
              )}

              {cancelStep === 5 && (
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Final confirmation
                  </h3>
                  <p className="text-slate-600">
                    This is the last step. Once you cancel, your subscription
                    will end at the end of your current billing period. You'll
                    lose all paid features.
                  </p>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-left space-y-2">
                    <p className="text-sm font-semibold text-slate-700">
                      You will lose:
                    </p>
                    <p className="text-sm text-slate-600">• Unlimited audits</p>
                    <p className="text-sm text-slate-600">
                      • Weekly auto audits
                    </p>
                    <p className="text-sm text-slate-600">
                      • Competitor spy alerts
                    </p>
                    <p className="text-sm text-slate-600">
                      • Private audit mode
                    </p>
                    <p className="text-sm text-slate-600">
                      • Historical analytics
                    </p>
                    <p className="text-sm text-slate-600">
                      • All strategy recommendations
                    </p>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-slate-600 pt-2">
                    <input
                      type="checkbox"
                      checked={cancelConfirmed}
                      onChange={(e) => setCancelConfirmed(e.target.checked)}
                      className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                    />
                    I understand and want to proceed with cancellation
                  </label>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100">
              <button
                onClick={handleCancelClose}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Keep subscription
              </button>
              <div className="flex items-center gap-3">
                {cancelStep > 1 && (
                  <button
                    onClick={handleCancelBack}
                    disabled={isCanceling}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={handleCancel}
                  disabled={cancelStep === 5 && !cancelConfirmed}
                  className={`px-6 py-2 text-sm font-medium rounded-lg transition-all ${
                    cancelStep === 5 && !cancelConfirmed
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {cancelStep === 5 ? "Confirm cancellation" : "Continue"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
