"use client";

import { SurveySummary } from "@/components/survey/SurveySummary";
import { questions, type SurveyAnswers } from "@/lib/survey-constants";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function SummaryPageContent() {
  const router = useRouter();
  const [answers, setAnswers] = useState<SurveyAnswers | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("survey_answers");
    if (stored) {
      setAnswers(JSON.parse(stored));
    } else {
      router.push("/survey");
    }
    setIsLoading(false);
  }, [router]);

  const handleBack = () => {
    router.push(`/survey/${questions.length - 1}`);
  };

  const handleNext = () => {
    router.push("/survey/auth");
  };

  if (isLoading || !answers) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto" />
          <p className="text-muted-foreground">Loading summary...</p>
        </div>
      </div>
    );
  }

  return (
    <SurveySummary
      answers={answers}
      onBack={handleBack}
      onNext={handleNext}
    />
  );
}

export default function SurveySummaryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <SummaryPageContent />
    </Suspense>
  );
}
