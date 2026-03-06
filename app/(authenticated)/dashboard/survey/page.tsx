"use client";

import { SurveyHero, SurveyQuestion } from "@/components/survey";
import { questions, type SurveyAnswers } from "@/lib/survey-constants";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type SurveyStatus = 
  | "idle"
  | "checking"
  | "ready"
  | "requires-claim"
  | "already-claimed"
  | "complete";

function DashboardSurveyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const [surveyStatus, setSurveyStatus] = useState<SurveyStatus>("checking");
  const [productId, setProductId] = useState<string | null>(null);
  const [productName, setProductName] = useState("");
  const [productWebsite, setProductWebsite] = useState("");
  const [checkingProduct, setCheckingProduct] = useState(false);

  const initialURL = searchParams.get("url");
  const [saasUrl, setSaasUrl] = useState(initialURL || "");

  const [step, setStep] = useState(-1);
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

    if (initialURL && surveyStatus === "checking") {
      initializeSurvey(initialURL);
    } else if (!initialURL && surveyStatus === "checking") {
      setSurveyStatus("ready");
      setStep(-1);
    }
  }, [status, initialURL]);

  const initializeSurvey = async (url: string) => {
    setCheckingProduct(true);
    
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
          // Product is owned by other users - cannot access
          setSurveyStatus("already-claimed");
          return;
        }
        throw new Error(data.error || "Failed to initialize survey");
      }

      // Product exists or created successfully
      if (data.productId) {
        setProductId(data.productId);
        localStorage.setItem("survey_product_id", data.productId);

        // REQUIRES CLAIM - Product exists but user hasn't claimed it yet
        // DO NOT allow access to audit, redirect to claim flow
        if (data.requiresClaim && data.existing) {
          setProductName(data.productName || "Unknown");
          setProductWebsite(data.productWebsite || url);
          setSurveyStatus("requires-claim");
          return;
        }

        // User owns this product (either new or existing with access)
        setSurveyStatus("ready");
        
        // If existing product with completed survey, redirect to audit
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

        // Start survey
        setStep(0);
      }
    } catch (error) {
      console.error("Error initializing survey:", error);
      setSurveyStatus("ready");
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

    if (productId && surveyStatus === "ready") {
      setAnswers((prev) => ({ ...prev, saasUrl }));
      saveProgress({ ...answers, saasUrl });
      setStep(0);
      return;
    }

    await initializeSurvey(saasUrl);
  };

  // Show loading while checking session/product
  if (status === "loading" || surveyStatus === "checking") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto" />
          <p className="text-muted-foreground">
            {surveyStatus === "checking" ? "Checking product..." : "Loading survey..."}
          </p>
        </div>
      </div>
    );
  }

  // REQUIRES CLAIM - User must claim product before accessing
  if (surveyStatus === "requires-claim") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Claim This Product
            </h2>
            <p className="text-muted-foreground">
              <strong>{productName}</strong> exists in our database but hasn&apos;t been claimed yet.
            </p>
            <p className="text-sm text-muted-foreground">
              To access the survey and audit, you need to verify ownership of this product.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  router.push(
                    `/survey/claim?product=${productId}&name=${encodeURIComponent(productName)}&website=${encodeURIComponent(productWebsite)}`
                  );
                }}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Claim Product
              </button>
              <button
                onClick={() => {
                  setSurveyStatus("ready");
                  setStep(-1);
                }}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg border border-gray-300 transition-colors"
              >
                Try Another Product
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ALREADY CLAIMED - Product owned by another user
  if (surveyStatus === "already-claimed") {
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Access Denied
            </h2>
            <p className="text-muted-foreground">
              This product has already been claimed by another user.
            </p>
            <p className="text-sm text-muted-foreground">
              You cannot access this product&apos;s survey or audit. 
              If you believe this is an error, please contact support.
            </p>
            <button
              onClick={() => {
                setSurveyStatus("ready");
                setStep(-1);
                setSaasUrl("");
              }}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Try Another Product
            </button>
          </div>
        </div>
      </div>
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
