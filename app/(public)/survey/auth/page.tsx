"use client";

import { SurveyAuth } from "@/components/survey/SurveyAuth";
import { type SurveyAnswers } from "@/lib/survey-constants";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function AuthPageContent() {
  const router = useRouter();
  const [answers, setAnswers] = useState<SurveyAnswers | null>(null);
  const [productId, setProductId] = useState<string | null>(null);
  const [isClaimFlow, setIsClaimFlow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("survey_answers");
    const storedProductId = localStorage.getItem("survey_product_id");

    if (stored) {
      const parsedAnswers = JSON.parse(stored);
      setAnswers(parsedAnswers);
      // Check if this is a claim flow (minimal answers, has product ID)
      setIsClaimFlow(!!storedProductId && !parsedAnswers.founderName);
    } else {
      router.push("/survey");
      return;
    }

    if (storedProductId) {
      setProductId(storedProductId);
    }

    setIsLoading(false);
  }, [router]);

  const handleBack = () => {
    if (isClaimFlow) {
      router.push("/survey");
    } else {
      router.push("/survey/summary");
    }
  };

  const handleAuthComplete = () => {
    // Clear survey data after auth
    localStorage.removeItem("survey_answers");
    localStorage.removeItem("survey_product_id");
    
    // Redirect to dashboard to complete product info and perform audit
    router.push("/dashboard/audit");
  };

  if (isLoading || !answers) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto" />
          <p className="text-muted-foreground">Loading auth...</p>
        </div>
      </div>
    );
  }

  return (
    <SurveyAuth
      answers={answers}
      productId={productId}
      onBack={handleBack}
      onAuthComplete={handleAuthComplete}
      isClaimFlow={isClaimFlow}
    />
  );
}

export default function SurveyAuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <AuthPageContent />
    </Suspense>
  );
}
