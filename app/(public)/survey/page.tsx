"use client";

import { SurveyHero, SurveyQuestion, SurveySummary, SurveyAuth } from "@/components/survey";
import { questions, type SurveyAnswers } from "@/lib/survey-constants";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function LaunchRecordSurveyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(-1);
  const [isInitialized, setIsInitialized] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [showAuthStep, setShowAuthStep] = useState(false);
  const initialURL = searchParams.get("url");

  // Claim flow state
  const [existingProduct, setExistingProduct] = useState<{
    id: string;
    name: string;
    website: string;
    addedByAdmin: boolean;
  } | null>(null);
  const [showClaimDialog, setShowClaimDialog] = useState(false);
  const [checkingProduct, setCheckingProduct] = useState(false);

  // Error state for already claimed products
  const [claimError, setClaimError] = useState<string | null>(null);

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

  // Initialize survey - check for existing product
  useEffect(() => {
    if (initialURL && !isInitialized) {
      setIsInitialized(true);
      setAnswers((prev) => ({ ...prev, saasUrl: initialURL }));
      initializeSurvey(initialURL);
    } else if (!initialURL) {
      setIsInitialized(true);
      setStep(-1); // Show hero
    }
  }, [initialURL]);

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
          founderName: "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle already claimed error
        if (data.alreadyClaimed) {
          setClaimError(data.error || "This product has already been claimed");
          return;
        }
        throw new Error(data.error || "Failed to initialize survey");
      }

      // Handle claim required
      if (data.requiresClaim && data.productId) {
        setExistingProduct({
          id: data.productId,
          name: data.productName || "Unknown",
          website: data.productWebsite || url,
          addedByAdmin: true,
        });
        setShowClaimDialog(true);
        setStep(-1); // Stay on hero
        return;
      }

      // Product exists or created successfully
      if (data.productId) {
        setProductId(data.productId);

        // If existing product with audit, redirect
        if (data.existing) {
          const auditResponse = await fetch(
            `/api/audit?productId=${data.productId}`,
          );
          const auditData = await auditResponse.json();

          if (auditData.success && auditData.data?.existing) {
            router.push(`/survey/audit?product=${data.productId}`);
            return;
          }
        }

        // Move to first question
        setStep(0);
      }
    } catch (error) {
      console.error("Error initializing survey:", error);
      // Still allow user to continue even if initialization fails
      setStep(0);
    } finally {
      setCheckingProduct(false);
    }
  };

  const currentQuestion = questions[step];
  const isAnswered =
    step >= 0 ? answers[currentQuestion?.key as keyof SurveyAnswers] : true;
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
    if (!currentQuestion) return;
    const updated = {
      ...answers,
      [currentQuestion.key]: value,
    };
    setAnswers(updated);
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
      // Show summary step before auth
      setStep(questions.length);
    }
    if (productId) {
      saveProgress(answers);
    }
  };

  const handlePrev = () => {
    if (step === 0) {
      setStep(-1);
      return;
    }
    if (step === questions.length) {
      // From summary back to last question
      setShowAuthStep(false);
      setStep(questions.length - 1);
    } else if (step > 0) {
      setStep(step - 1);
    }
  };

  // Handle initial submit from hero
  const handleInitialSubmit = async () => {
    if (!answers.saasUrl) return;

    // If we already have a product ID, just continue
    if (productId) {
      await saveProgress(answers);
      setStep(0);
      return;
    }

    // Initialize/check product
    await initializeSurvey(answers.saasUrl);
  };

  // Handle claim success
  const handleClaimSuccess = async () => {
    setShowClaimDialog(false);
    setExistingProduct(null);
    // After claim, re-initialize to get the product
    if (answers.saasUrl) {
      await initializeSurvey(answers.saasUrl);
    }
  };

  // Handle auth complete - redirect to dashboard to perform audit
  const handleAuthComplete = () => {
    // After auth completes, user will be redirected to dashboard/audit
    // where the audit will be generated
    router.push("/dashboard/audit");
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

  // Show loading state only during initial initialization
  if (!isInitialized) {
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
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground">Product Already Claimed</h2>
            <p className="text-muted-foreground">{claimError}</p>
            <p className="text-sm text-muted-foreground">
              This product URL has already been claimed by another user. Please use a different product URL or contact support if you believe this is an error.
            </p>
            <button
              onClick={() => {
                setClaimError(null);
                setStep(-1);
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

  // Show auth step at the end
  if (showAuthStep) {
    return (
      <SurveyAuth
        answers={answers}
        productId={productId}
        onBack={handlePrev}
        onAuthComplete={handleAuthComplete}
      />
    );
  }

  // Show summary step after all questions
  if (step === questions.length) {
    return (
      <SurveySummary
        answers={answers}
        onBack={handlePrev}
        onNext={() => setShowAuthStep(true)}
      />
    );
  }

  // Show initial hero with website URL on first step
  if (step === -1) {
    return (
      <SurveyHero
        saasUrl={answers.saasUrl}
        onUrlChange={(url) => setAnswers({ ...answers, saasUrl: url })}
        onSubmit={handleInitialSubmit}
        isLoading={isLoading}
        checkingProduct={checkingProduct}
        existingProduct={existingProduct}
        showClaimDialog={showClaimDialog}
        onClaimDialogChange={setShowClaimDialog}
        onClaimSuccess={handleClaimSuccess}
      />
    );
  }

  // Regular survey steps
  return (
    <SurveyQuestion
      question={currentQuestion}
      answer={answers[currentQuestion.key as keyof SurveyAnswers] || ""}
      onAnswer={handleAnswer}
      onNext={handleNext}
      onPrev={handlePrev}
      onTextChange={handleTextChange}
      onKeyDown={handleKeyDown}
      step={step}
      totalSteps={questions.length}
      canContinue={canContinue}
      isLoading={isLoading}
      isLastQuestion={step === questions.length - 1}
    />
  );
}

export default function LaunchRecordSurvey() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <LaunchRecordSurveyContent />
    </Suspense>
  );
}
