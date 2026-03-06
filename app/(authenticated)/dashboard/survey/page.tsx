"use client";

import { SurveyHero, SurveyQuestion, SurveySummary } from "@/components/survey";
import { questions, type SurveyAnswers } from "@/lib/survey-constants";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function DashboardSurveyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const [step, setStep] = useState(-1);
  const [isInitialized, setIsInitialized] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [checkingProduct, setCheckingProduct] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);

  const initialURL = searchParams.get("url");
  const [saasUrl, setSaasUrl] = useState(initialURL || "");

  const [answers, setAnswers] = useState<SurveyAnswers>({
    founderName: "",
    saasName: "",
    saasUrl: initialURL || "",
    role: "",
    teamSize: "",
    revenue: "",
    biggestChallenge: "",
    aeoAwareness: "",
    description: "",
    willingToInvest: "",
  });

  // Wait for session to load
  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    setIsInitialized(true);
  }, [status]);

  const initializeSurvey = async (url: string) => {
    setCheckingProduct(true);
    setClaimError(null);

    try {
      const response = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          saasName: "Unknown",
          saasUrl: url,
          founderName: session?.user?.name || "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.alreadyClaimed) {
          setClaimError(data.error || "This product has already been claimed");
          return;
        }
        throw new Error(data.error || "Failed to initialize survey");
      }

      // Product exists or created successfully
      if (data.productId) {
        setProductId(data.productId);
        localStorage.setItem("survey_product_id", data.productId);

        // If existing product with audit, redirect
        if (data.existing) {
          const auditResponse = await fetch(
            `/api/audit?productId=${data.productId}`,
          );
          const auditData = await auditResponse.json();

          if (auditData.success && auditData.data?.existing) {
            router.push(`/dashboard/audit?product=${data.productId}`);
            return;
          }
        }

        // Move to first question
        setStep(0);
      }
    } catch (error) {
      console.error("Error initializing survey:", error);
      setStep(0);
    } finally {
      setCheckingProduct(false);
    }
  };

  // Save progress to DB
  const saveProgress = async (currentAnswers: SurveyAnswers) => {
    if (!productId) return;

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
    if (step < 0 || step >= questions.length) return;
    const updated = {
      ...answers,
      [questions[step].key]: value,
    };
    setAnswers(updated);
    saveProgress(updated);
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // All questions complete - redirect to audit
      if (productId) {
        router.push(`/dashboard/audit?product=${productId}`);
      }
    }
  };

  const handlePrev = () => {
    if (step === 0) {
      setStep(-1);
    } else if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleInitialSubmit = async () => {
    if (!saasUrl) return;

    if (productId) {
      setAnswers((prev) => ({ ...prev, saasUrl }));
      saveProgress({ ...answers, saasUrl });
      setStep(0);
      return;
    }

    await initializeSurvey(saasUrl);
  };

  // Show loading while checking session
  if (status === "loading" || !isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto" />
          <p className="text-muted-foreground">Loading survey...</p>
        </div>
      </div>
    );
  }

  // Show error if product is already claimed
  if (claimError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Product Already Claimed
            </h2>
            <p className="text-muted-foreground">{claimError}</p>
            <p className="text-sm text-muted-foreground">
              If you believe this is an error, please contact{" "}
              <a
                href="mailto:hello@launchrecord.com"
                className="text-orange-600 hover:underline"
              >
                hello@launchrecord.com
              </a>
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show summary step after all questions
  if (step === questions.length) {
    return (
      <SurveySummary
        answers={answers}
        onBack={handlePrev}
        onNext={handleNext}
      />
    );
  }

  // Show initial hero with website URL
  if (step === -1) {
    return (
      <SurveyHero
        saasUrl={saasUrl}
        onUrlChange={(url) => setSaasUrl(url)}
        onSubmit={handleInitialSubmit}
        isLoading={false}
        checkingProduct={checkingProduct}
      />
    );
  }

  // Regular survey steps
  const currentQuestion = questions[step];
  const currentValue = answers[currentQuestion.key] || "";

  return (
    <SurveyQuestion
      question={currentQuestion}
      answer={currentValue}
      onAnswer={handleAnswer}
      onNext={handleNext}
      onPrev={handlePrev}
      step={step}
      totalSteps={questions.length}
      canContinue={!!currentValue}
      isLoading={false}
      isLastQuestion={step === questions.length - 1}
    />
  );
}

export default function DashboardSurvey() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <DashboardSurveyContent />
    </Suspense>
  );
}
