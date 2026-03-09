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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useCancelSubscription } from "@/hooks/use-cancel-subscription";
import { useProducts } from "@/hooks/use-products";
import { useSubscribe } from "@/hooks/use-subscribe";
import { useSubscription } from "@/hooks/use-subscription";
import { useProductStore } from "@/stores/product-store";
import {
  AlertCircle,
  AlertTriangle,
  Archive,
  ArrowLeft,
  Check,
  Crown,
  Frown,
  Globe,
  Loader2,
  Lock,
  Shield,
  TrendingDown,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
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
      monthly: 10,
      weekly: 1,
    },
    features: [
      "1 Auto Audit / Week",
      "10 Audits / Month",
      "1 Product",
      "5 Team Members",
      "5 Competitors",
      "Weekly Auto Audit",
      "Competitor Spy",
      "Private Audit Mode",
      "Historical Analytics",
      "Strategy Recommendations",
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
      "Competitive Gap Analysis",
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
      "Market Intelligence Briefs",
    ],
  },
];

const cancellationReasons = [
  "Too expensive",
  "Not using the features",
  "Found an alternative",
  "Product no longer active",
  "Temporary pause needed",
  "Other",
];

const whatYouLose = [
  { icon: TrendingDown, text: "All historical audit data will be archived" },
  { icon: Archive, text: "Loss of competitor tracking and alerts" },
  { icon: Frown, text: "No more strategic recommendations" },
  { icon: Lock, text: "Private audit mode will be disabled" },
  { icon: AlertTriangle, text: "Your defensibility score will stop updating" },
];

function ProductSubscriptionContent() {
  const params = useParams();
  const productId = params.product as string;
  const searchParams = useSearchParams();
  const { products } = useProductStore();
  const { loadAllProductsData } = useProducts();
  const { subscription, fetchSubscription } = useSubscription();
  const { startSubscription, isLoading } = useSubscribe();
  const { cancelSubscription, isLoading: isCanceling } =
    useCancelSubscription();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Cancellation flow state
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelStep, setCancelStep] = useState(1);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelFeedback, setCancelFeedback] = useState("");
  const [confirmCheckboxes, setConfirmCheckboxes] = useState({
    understand: false,
    loseData: false,
    sure: false,
  });
  const [typeToConfirm, setTypeToConfirm] = useState("");

  useEffect(() => {
    loadAllProductsData();
  }, [loadAllProductsData]);

  useEffect(() => {
    fetchSubscription(productId);
  }, [fetchSubscription, productId]);

  useEffect(() => {
    // Handle success/cancel from Stripe redirect
    if (searchParams.get("success") === "true") {
      toast.success("Subscription activated successfully!");
      fetchSubscription(productId);
    } else if (searchParams.get("canceled") === "true") {
      toast.error("Checkout was canceled. No charges were made.");
    }
  }, [searchParams, fetchSubscription, productId]);

  const handleSubscribe = async (
    planType: "founder" | "growth" | "sovereign",
  ) => {
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

  const initiateCancel = () => {
    setShowCancelDialog(true);
    setCancelStep(1);
    setCancelReason("");
    setCancelFeedback("");
    setConfirmCheckboxes({ understand: false, loseData: false, sure: false });
    setTypeToConfirm("");
  };

  const handleCancelStep1 = () => {
    setCancelStep(2);
  };

  const handleCancelStep2 = () => {
    if (!cancelReason) {
      toast.error("Please select a reason");
      return;
    }
    setCancelStep(3);
  };

  const handleCancelStep3 = () => {
    if (
      !confirmCheckboxes.understand ||
      !confirmCheckboxes.loseData ||
      !confirmCheckboxes.sure
    ) {
      toast.error("Please confirm all checkboxes to continue");
      return;
    }
    setCancelStep(4);
  };

  const handleCancelStep4 = () => {
    if (typeToConfirm !== "CANCEL MY SUBSCRIPTION") {
      toast.error("Please type 'CANCEL MY SUBSCRIPTION' exactly");
      return;
    }
    setCancelStep(5);
  };

  const handleFinalCancel = async () => {
    const result = await cancelSubscription({
      productId,
      immediate: false,
      feedback: { reason: cancelReason, feedback: cancelFeedback },
    });
    if (result.ok) {
      toast.success(result.message || "Subscription canceled successfully");
      fetchSubscription(productId);
      setShowCancelDialog(false);
    } else {
      toast.error(result.error || "Failed to cancel subscription");
    }
  };

  const currentPlan = subscription?.planType || null;

  // Find the current product
  const product = products.find(
    (p) => p.id === productId || p._id === productId,
  );

  return (
    <div className="space-y-6">
      {/* Header with Product Info */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/dashboard/${productId}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                {product?.logo ? (
                  <img
                    src={product.logo}
                    alt={product.name}
                    className="h-12 w-12 rounded-lg object-cover border-2 border-primary/20"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold">{product?.name}</h1>
                    {subscription?.status === "active" && (
                      <Badge className={getStatusColor(subscription.status)}>
                        <span className="capitalize">
                          {subscription.planType} Plan
                        </span>
                      </Badge>
                    )}
                  </div>
                  {product?.website && (
                    <p className="text-sm text-muted-foreground">
                      {product.website}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                Current Period Ends
              </p>
              <p className="text-lg font-semibold">
                {subscription?.currentPeriodEnd
                  ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                  : "No active subscription"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Subscription Status */}
      {subscription && (
        <Card className="border-border">
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

            {/* Manage Subscription Button */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() =>
                  document
                    .getElementById("plan-selection")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="flex-1 sm:flex-none"
              >
                <Crown className="h-4 w-4 mr-2" />
                {currentPlan ? "Change Plan" : "Select Plan"}
              </Button>
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
      <div id="plan-selection">
        <h2 className="text-xl font-semibold mb-4">
          {subscription ? "Change Plan" : "Choose a Plan"}
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const isCurrentPlan = currentPlan === plan.id;
            const isUpgrade = plan.id === "growth" && currentPlan === "founder";
            const isDowngrade =
              plan.id === "founder" && currentPlan === "growth";
            const PlanIcon = plan.icon;
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
                    variant={
                      plan.isFeatured && !isComingSoon ? "default" : "outline"
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
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Multi-Step Cancellation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-6 w-6" />
              Cancel Subscription
            </DialogTitle>
            <DialogDescription>
              We're sorry to see you go. Let's understand why you're leaving.
            </DialogDescription>
          </DialogHeader>

          {/* Step 1: Warning */}
          {cancelStep === 1 && (
            <div className="space-y-4">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 space-y-4">
                <h3 className="font-bold text-lg text-destructive flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Wait! Before you cancel...
                </h3>
                <p className="text-sm text-destructive/80">
                  You're about to lose access to all premium features. Are you
                  sure you want to continue?
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">What you'll lose:</h4>
                {whatYouLose.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-3 text-sm text-destructive/80"
                    >
                      <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{item.text}</span>
                    </div>
                  );
                })}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowCancelDialog(false)}
                >
                  Nevermind, Keep My Subscription
                </Button>
                <Button variant="destructive" onClick={handleCancelStep1}>
                  Continue to Cancel
                </Button>
              </DialogFooter>
            </div>
          )}

          {/* Step 2: Reason */}
          {cancelStep === 2 && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  💡 Did you know? You can downgrade to a lower plan instead of
                  canceling completely.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-3 block">
                  Why are you canceling?
                </label>
                <div className="grid gap-2">
                  {cancellationReasons.map((reason) => (
                    <button
                      key={reason}
                      onClick={() => setCancelReason(reason)}
                      className={`p-3 rounded-lg border text-left text-sm transition-all ${
                        cancelReason === reason
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Additional feedback (optional)
                </label>
                <Textarea
                  value={cancelFeedback}
                  onChange={(e) => setCancelFeedback(e.target.value)}
                  placeholder="Help us improve..."
                  rows={3}
                />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setCancelStep(1)}>
                  Back
                </Button>
                <Button variant="destructive" onClick={handleCancelStep2}>
                  Continue
                </Button>
              </DialogFooter>
            </div>
          )}

          {/* Step 3: Confirmations */}
          {cancelStep === 3 && (
            <div className="space-y-4">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-destructive">
                  Please confirm the following:
                </h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="understand"
                      checked={confirmCheckboxes.understand}
                      onCheckedChange={(checked) =>
                        setConfirmCheckboxes({
                          ...confirmCheckboxes,
                          understand: checked as boolean,
                        })
                      }
                    />
                    <label
                      htmlFor="understand"
                      className="text-sm leading-none"
                    >
                      I understand that my subscription will remain active until
                      the end of the current billing period
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="loseData"
                      checked={confirmCheckboxes.loseData}
                      onCheckedChange={(checked) =>
                        setConfirmCheckboxes({
                          ...confirmCheckboxes,
                          loseData: checked as boolean,
                        })
                      }
                    />
                    <label htmlFor="loseData" className="text-sm leading-none">
                      I understand that I will lose access to all premium
                      features and historical data will be archived
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="sure"
                      checked={confirmCheckboxes.sure}
                      onCheckedChange={(checked) =>
                        setConfirmCheckboxes({
                          ...confirmCheckboxes,
                          sure: checked as boolean,
                        })
                      }
                    />
                    <label
                      htmlFor="sure"
                      className="text-sm leading-none font-semibold text-destructive"
                    >
                      I am absolutely sure I want to cancel my subscription
                    </label>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setCancelStep(2)}>
                  Back
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleCancelStep3}
                  disabled={
                    !confirmCheckboxes.understand ||
                    !confirmCheckboxes.loseData ||
                    !confirmCheckboxes.sure
                  }
                >
                  Continue
                </Button>
              </DialogFooter>
            </div>
          )}

          {/* Step 4: Type to confirm */}
          {cancelStep === 4 && (
            <div className="space-y-4">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center space-y-4">
                <Lock className="h-12 w-12 text-destructive mx-auto" />
                <h3 className="font-bold text-lg text-destructive">
                  Final Confirmation Required
                </h3>
                <p className="text-sm text-destructive/80">
                  To prevent accidental cancellations, please type the following
                  exactly:
                </p>
                <p className="font-mono font-bold text-destructive bg-destructive/20 py-2 px-4 rounded inline-block">
                  CANCEL MY SUBSCRIPTION
                </p>
              </div>

              <div>
                <input
                  type="text"
                  value={typeToConfirm}
                  onChange={(e) => setTypeToConfirm(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-destructive focus:border-destructive"
                  placeholder="Type here..."
                />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setCancelStep(3)}>
                  Back
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleCancelStep4}
                  disabled={typeToConfirm !== "CANCEL MY SUBSCRIPTION"}
                >
                  Confirm Cancellation
                </Button>
              </DialogFooter>
            </div>
          )}

          {/* Step 5: Final warning */}
          {cancelStep === 5 && (
            <div className="space-y-4">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center space-y-4">
                <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
                <h3 className="font-bold text-xl text-destructive">
                  This action cannot be undone
                </h3>
                <p className="text-sm text-destructive/80">
                  After clicking the button below, your subscription will be
                  scheduled for cancellation.
                </p>
                <div className="text-left bg-white/50 rounded-lg p-4 space-y-2">
                  <p className="text-sm">
                    <strong>Plan:</strong> {subscription?.planType}
                  </p>
                  <p className="text-sm">
                    <strong>Reason:</strong> {cancelReason}
                  </p>
                  {cancelFeedback && (
                    <p className="text-sm">
                      <strong>Feedback:</strong> {cancelFeedback}
                    </p>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setCancelStep(4)}>
                  Go Back
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleFinalCancel}
                  disabled={isCanceling}
                >
                  {isCanceling ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Yes, Cancel My Subscription
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {subscription?.status === "active" && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={initiateCancel}
            disabled={isCanceling}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            {isCanceling ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

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
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <ProductSubscriptionContent />
    </Suspense>
  );
}
