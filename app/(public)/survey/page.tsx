"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Globe,
  Loader2,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

interface SurveyAnswers {
  founderName: string;
  saasName: string;
  saasUrl: string;
  role: string;
  teamSize: string;
  revenue: string;
  biggestChallenge: string;
  aeoAwareness: string;
  description: string;
  willingToInvest: string;
}

const questions = [
  {
    title: "Who are you ?",
    key: "founderName",
    type: "text",
    description: "Your name for the War Briefing",
    placeholder: "e.g., John Smith",
  },
  {
    title: "Startup / SaaS Name",
    key: "saasName",
    type: "text",
    description: "The product we'll analyze for insights",
    placeholder: "e.g., Acme Analytics",
  },
  {
    title: "Product Description",
    key: "description",
    type: "textarea",
    description: "What does your product do?",
    placeholder: "Describe your product...",
  },
  {
    title: "Your Role",
    key: "role",
    type: "radio",
    description: "Where do you sit in the company?",
    options: [
      { value: "solo-founder", label: "👤 Solo Founder" },
      { value: "co-founder-ceo", label: "👔 CEO" },
      { value: "co-founder-cto", label: "⚙️ CTO" },
      { value: "co-founder-product", label: "📦 Product" },
      { value: "founder-other", label: "🎯 Other" },
    ],
  },

  {
    title: "Team Size",
    key: "teamSize",
    type: "radio",
    description: "Full-time employees (including founders)",
    options: [
      { value: "just-me", label: "👤 Just me" },
      { value: "2-5", label: "👥 2-5 people" },
      { value: "6-15", label: "🏢 6-15 people" },
      { value: "16-50", label: "🏭 16-50 people" },
      { value: "50+", label: "🏢 50+ people" },
    ],
  },
  {
    title: "Monthly Revenue (MRR)",
    key: "revenue",
    type: "radio",
    description: "Be honest — this stays private",
    options: [
      { value: "pre-revenue", label: "💸 Pre-revenue" },
      { value: "0-5k", label: "📈 $0-$5K" },
      { value: "5k-20k", label: "📈 $5K-$20K" },
      { value: "20k-50k", label: "📈 $20K-$50K" },
      { value: "50k+", label: "📈 $50K+" },
    ],
  },
  {
    title: "Biggest Challenge",
    key: "biggestChallenge",
    type: "radio",
    description: "What keeps you up at night?",
    options: [
      { value: "visibility", label: "🔍 Hard to get noticed" },
      { value: "positioning", label: "⚠️ Positioning / messaging" },
      { value: "competition", label: "🎯 Competitors copying" },
      { value: "ai-risk", label: "😰 AI could replace me" },
    ],
  },
  {
    title: "AEO Awareness",
    key: "aeoAwareness",
    type: "radio",
    description: "Have you heard of Answer Engine Optimization?",
    options: [
      { value: "never-heard", label: "❌ Never heard of it" },
      {
        value: "heard-but-not-tracking",
        label: "🤔 Heard of it, not tracking",
      },
      { value: "tracking-manually", label: "📊 Tracking manually" },
      { value: "using-tools", label: "🛠️ Using tools" },
    ],
  },

  {
    title: "Investment Willingness",
    key: "willingToInvest",
    type: "radio",
    description: "What would you invest to become irreplaceable?",
    options: [
      { value: "49-tier", label: "💰 $49/mo (AEO Tracker + War Briefing)" },
      { value: "99-tier", label: "💰💰 $99/mo (+ Founder Proof Vault)" },
      { value: "299-tier", label: "💰💰💰 $299/mo (+ Strategy Calls)" },
      { value: "need-more-info", label: "🤔 Need to see more" },
    ],
  },
];
function LaunchRecordSurveyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [showEmailStep, setShowEmailStep] = useState(false);
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState<SurveyAnswers>({
    founderName: "",
    saasName: "",
    saasUrl: searchParams.get("url") || "",
    role: "",
    teamSize: "",
    revenue: "",
    biggestChallenge: "",
    aeoAwareness: "",
    description: "",
    willingToInvest: "",
  });

  // Auto-create product if URL is provided from landing page
  useEffect(() => {
    const urlParam = searchParams.get("url");
    if (urlParam && !productId && step === 0) {
      // Set the URL and create product
      const initialData = {
        founderName: "",
        saasName: "",
        saasUrl: urlParam,
        role: "",
        teamSize: "",
        revenue: "",
        biggestChallenge: "",
        aeoAwareness: "",
        description: "",
        willingToInvest: "",
      };
      setAnswers(initialData);

      // Create product with just the URL
      fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          saasName: "Unknown",
          saasUrl: urlParam,
          founderName: "",
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.productId) {
            setProductId(data.productId);

            // If product already exists with audit, redirect to audit
            if (data.existing) {
              // Check if it has an existing audit
              fetch(`/api/audit?productId=${data.productId}`)
                .then((res) => res.json())
                .then((auditData) => {
                  if (auditData.success && auditData.data?.existing) {
                    // Audit exists, redirect directly
                    router.push(`/survey/audit?product=${data.productId}`);
                  } else {
                    // No audit yet, continue with survey
                    setStep(0);
                  }
                })
                .catch(() => setStep(0));
            } else {
              // New product, continue with survey
              setStep(0);
            }
          }
        })
        .catch((err) => {
          console.error("Error creating product:", err);
          setStep(1); // Continue anyway
        });
    }
  }, []);

  const currentQuestion = questions[step];
  const isAnswered = answers[currentQuestion.key as keyof SurveyAnswers];
  const canContinue = Boolean(isAnswered);

  // Save progress to DB on every answer
  const saveProgress = async (currentAnswers: SurveyAnswers) => {
    if (!productId || !currentAnswers.saasUrl) return;

    try {
      await fetch("/api/survey/progress", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          answers: currentAnswers,
        }),
      });
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const handleAnswer = (value: string) => {
    const updated = {
      ...answers,
      [currentQuestion.key]: value,
    };
    setAnswers(updated);

    // Save progress after each answer
    if (productId) {
      saveProgress(updated);
    }
  };

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    handleAnswer(e.target.value);
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Show email step before generating report
      setShowEmailStep(true);
    }
  };

  const handlePrev = () => {
    if (showEmailStep) {
      setShowEmailStep(false);
    } else if (step > 0) {
      setStep(step - 1);
    }
  };

  // Initial survey submission - creates product and user
  const handleInitialSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...answers,
          email: "", // Email will be added later
        }),
      });

      if (!response.ok) throw new Error("Survey submission failed");

      const data = await response.json();
      setProductId(data.productId);

      // If product already exists with audit, redirect to audit
      if (data.existing) {
        // Check if it has an existing audit
        const auditResponse = await fetch(
          `/api/audit?productId=${data.productId}`,
        );
        const auditData = await auditResponse.json();

        if (auditData.success && auditData.data?.existing) {
          // Audit exists, redirect directly
          router.push(`/survey/audit?product=${data.productId}`);
          return;
        }
      }

      // Save initial answers
      await saveProgress(answers);

      // Move to next step
      setStep(step + 1);
    } catch (error) {
      console.error("Error submitting survey:", error);
      alert("Error submitting survey. Please try again.");
      setIsLoading(false);
    }
  };

  // Final submission with email
  const handleSubmitWithEmail = async () => {
    if (!email || !productId) return;

    setIsLoading(true);
    try {
      // Update with email
      const response = await fetch("/api/survey/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          email,
        }),
      });

      if (!response.ok) throw new Error("Failed to complete survey");

      router.push(`/survey/audit?product=${productId}`);
    } catch (error) {
      console.error("Error completing survey:", error);
      alert("Error completing survey. Please try again.");
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, value: string) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (value.trim()) {
        handleAnswer(value);
        setTimeout(() => handleNext(), 100);
      }
    }
  };

  // Show email collection step
  if (showEmailStep) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Summary Card */}
          <Card className="border-2 border-orange-200 mb-8 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Your Audit Summary</CardTitle>
              <CardDescription>
                Review your answers before generating the report
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Product</div>
                  <div className="font-semibold">{answers.saasName}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">URL</div>
                  <div className="font-semibold flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {answers.saasUrl}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Founder</div>
                  <div className="font-semibold">{answers.founderName}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Role</div>
                  <div className="font-semibold capitalize">
                    {answers.role.replace("-", " ")}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Team Size</div>
                  <div className="font-semibold">
                    {answers.teamSize.replace("-", " ")}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">MRR</div>
                  <div className="font-semibold">{answers.revenue}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Input Card */}
          <Card className="border border-border shadow-lg">
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-base"
                  autoFocus
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-border">
                <Button
                  onClick={handlePrev}
                  variant="outline"
                  className="flex-1 h-12"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleSubmitWithEmail}
                  disabled={!email || isLoading}
                  className="flex-1 h-12 bg-orange-600 hover:bg-orange-700"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  Generate Audit Report
                </Button>
              </div>
            </CardContent>
          </Card>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            🔒 Your data is private. We'll only use this to send your report.
          </p>
        </div>
      </div>
    );
  }

  // Show initial hero with website URL on first step (only if no URL provided)
  if (step === 0 && !productId && !answers.saasUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-foreground">
              Get Your Free SaaS Audit Report
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover your positioning weaknesses, AEO visibility, and how to
              become irreplaceable
            </p>
          </div>

          <Card className="border-2 border-orange-200 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">
                Start with your product URL
              </CardTitle>
              <CardDescription className="text-base">
                We'll analyze your website and generate a comprehensive audit
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="saasUrl" className="text-base text-left">
                  Product Website
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="saasUrl"
                    type="url"
                    placeholder="https://yourproduct.com"
                    value={answers.saasUrl}
                    onChange={(e) =>
                      setAnswers({ ...answers, saasUrl: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && answers.saasUrl) {
                        handleInitialSubmit();
                      }
                    }}
                    className="pl-10 h-12 text-base"
                    autoFocus
                  />
                </div>
              </div>

              <Button
                onClick={handleInitialSubmit}
                disabled={!answers.saasUrl || isLoading}
                className="w-full h-12 text-lg bg-orange-600 hover:bg-orange-700"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <CheckCircle className="mr-2 h-5 w-5" />
                )}
                Start Free Audit
              </Button>

              <p className="text-sm text-muted-foreground">
                ✅ No email required to start • ✅ 100% free • ✅ Instant
                insights
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6 pt-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl mb-2">🎯</div>
                <div className="font-semibold">Positioning Score</div>
                <div className="text-sm text-muted-foreground">
                  See how you compare
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl mb-2">🤖</div>
                <div className="font-semibold">AEO Visibility</div>
                <div className="text-sm text-muted-foreground">
                  AI chatbot presence
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl mb-2">📊</div>
                <div className="font-semibold">Action Plan</div>
                <div className="text-sm text-muted-foreground">
                  3 priority missions
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Regular survey steps
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Question {step + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round(((step + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-600 transition-all duration-300"
              style={{ width: `${((step + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card className="border border-border shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl text-foreground">
              {currentQuestion.title}
            </CardTitle>
            {currentQuestion.description && (
              <CardDescription className="text-base mt-2">
                {currentQuestion.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {currentQuestion.type === "textarea" ? (
              <textarea
                placeholder={
                  (currentQuestion as any).placeholder || "Enter your answer"
                }
                value={
                  answers[currentQuestion.key as keyof SurveyAnswers] || ""
                }
                name={currentQuestion.key}
                onChange={handleTextChange}
                onKeyDown={(e) =>
                  handleKeyDown(
                    e,
                    answers[currentQuestion.key as keyof SurveyAnswers],
                  )
                }
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-base"
                autoFocus
              />
            ) : null}
            {currentQuestion.type === "text" ||
            currentQuestion.type === "url" ? (
              <input
                type={currentQuestion.type}
                placeholder={
                  (currentQuestion as any).placeholder || "Enter your answer"
                }
                value={
                  answers[currentQuestion.key as keyof SurveyAnswers] || ""
                }
                onChange={handleTextChange}
                onKeyDown={(e) =>
                  handleKeyDown(
                    e,
                    answers[currentQuestion.key as keyof SurveyAnswers],
                  )
                }
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-base"
                autoFocus
              />
            ) : currentQuestion.type === "radio" ? (
              <RadioGroup
                value={answers[currentQuestion.key as keyof SurveyAnswers]}
                onValueChange={handleAnswer}
              >
                <div className="space-y-3">
                  {(currentQuestion as any).options?.map((option: any) => (
                    <div key={option.value} className="flex items-center gap-3">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label
                        htmlFor={option.value}
                        className="text-base cursor-pointer flex-1"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            ) : null}

            {/* Buttons */}
            <div className="flex gap-4 pt-6 border-t border-border">
              <Button
                onClick={handlePrev}
                disabled={step === 0}
                variant="outline"
                className="flex-1 h-12"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canContinue || isLoading}
                className="flex-1 h-12 bg-orange-600 hover:bg-orange-700"
              >
                {step === questions.length - 1 ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Review & Continue
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Friendly message */}
        <div className="mt-8 text-center text-muted-foreground">
          <p className="text-sm">
            Your answers are private and used to personalize your War Briefing.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LaunchRecordSurvey() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LaunchRecordSurveyContent />
    </Suspense>
  );
}
