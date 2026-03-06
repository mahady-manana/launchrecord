"use client";

import { SurveyQuestion } from "@/components/survey/SurveyQuestion";
import { questions, type SurveyAnswers } from "@/lib/survey-constants";
import { useRouter, useParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

function StepPageContent() {
  const router = useRouter();
  const params = useParams();
  const stepParam = params.step as string;
  const step = parseInt(stepParam, 10);

  const [answers, setAnswers] = useState<SurveyAnswers | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load answers from localStorage
    const stored = localStorage.getItem("survey_answers");
    if (stored) {
      setAnswers(JSON.parse(stored));
    } else {
      // Initialize with empty answers
      const emptyAnswers: SurveyAnswers = {
        founderName: "",
        saasName: "",
        saasUrl: "",
        role: "",
        teamSize: "",
        revenue: "",
        biggestChallenge: "",
        aeoAwareness: "",
        description: "",
        willingToInvest: "",
      };
      setAnswers(emptyAnswers);
      localStorage.setItem("survey_answers", JSON.stringify(emptyAnswers));
    }
    setIsLoading(false);
  }, []);

  const handleAnswer = useCallback((value: string, questionKey: string) => {
    setAnswers((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, [questionKey]: value };
      localStorage.setItem("survey_answers", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleNext = useCallback(() => {
    if (step < questions.length - 1) {
      router.push(`/survey/${step + 1}`);
    } else {
      // All questions complete, go to summary
      router.push("/survey/summary");
    }
  }, [step, router]);

  const handlePrev = useCallback(() => {
    if (step > 0) {
      router.push(`/survey/${step - 1}`);
    } else {
      // Go back to hero
      router.push("/survey");
    }
  }, [step, router]);

  if (isLoading || !answers) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto" />
          <p className="text-muted-foreground">Loading question...</p>
        </div>
      </div>
    );
  }

  if (isNaN(step) || step < 0 || step >= questions.length) {
    router.push("/survey");
    return null;
  }

  const currentQuestion = questions[step];
  const currentValue = answers[currentQuestion.key] || "";

  return (
    <SurveyQuestion
      question={currentQuestion}
      answer={currentValue}
      onAnswer={(value) => handleAnswer(value, currentQuestion.key)}
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

export default function SurveyStepPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <StepPageContent />
    </Suspense>
  );
}
