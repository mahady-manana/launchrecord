"use client";

import { SurveyHero, SurveyQuestion, SurveySummary } from "@/components/survey";
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
  const [showEmailStep, setShowEmailStep] = useState(false);
  const [email, setEmail] = useState("");
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
      setShowEmailStep(true);
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
    if (showEmailStep) {
      setShowEmailStep(false);
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

  // Final submission with email
  const handleSubmitWithEmail = async () => {
    if (!email || !productId) return;

    setIsLoading(true);
    try {
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

  // Show email collection step
  if (showEmailStep) {
    return (
      <SurveySummary
        answers={answers}
        email={email}
        onEmailChange={setEmail}
        onBack={handlePrev}
        onSubmit={handleSubmitWithEmail}
        isLoading={isLoading}
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
