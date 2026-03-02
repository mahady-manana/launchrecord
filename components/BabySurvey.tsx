"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SurveyAnswers {
  transport: string;
  homeLayout: string;
  feedingPlan: string;
  philosophy: string;
  marketComfort: string;
  babyAge: string;
  email: string;
}

export default function BabySurvey() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [answers, setAnswers] = useState<SurveyAnswers>({
    transport: "",
    homeLayout: "",
    feedingPlan: "",
    philosophy: "",
    marketComfort: "",
    babyAge: "",
    email: "",
  });

  const questions = [
    {
      title: "When is your due date (or when was baby born)?",
      key: "babyAge",
      type: "radio",
      description: "This helps us prioritize what you need month by month",
      options: [
        { value: "pre-birth", label: "📅 Due within 3 months (pre-birth)" },
        { value: "newborn", label: "👶 Just born (0-1 month)" },
        { value: "1-3-months", label: "👶 1-3 months old" },
      ],
    },
    {
      title: "How do you get around?",
      description:
        "This helps us recommend the right stroller & car seat setup",
      key: "transport",
      type: "radio",
      options: [
        {
          value: "city-walking",
          label: "🚶 City/Walking (public transit or on foot)",
        },
        { value: "suburb-car", label: "🚗 Suburbs (car-dependent)" },
        { value: "mixed", label: "🔄 Mixed (both)" },
      ],
    },
    {
      title: "What's your home layout?",
      description: "This affects where you'll need gear to be stored",
      key: "homeLayout",
      type: "radio",
      options: [
        { value: "apartment", label: "🏢 Apartment (limited space)" },
        { value: "house-single", label: "🏠 Single-floor house" },
        {
          value: "house-multi",
          label: "🏘️ Multi-floor house (stairs involved)",
        },
      ],
    },
    {
      title: "How do you plan to feed?",
      description: "Feeding method shapes your need for bottles, pumps, etc.",
      key: "feedingPlan",
      type: "radio",
      options: [
        { value: "nursing", label: "🤱 Nursing (breast only)" },
        { value: "pumping", label: "🍼 Pumping & bottles" },
        { value: "formula", label: "🥛 Formula feeding" },
        { value: "combination", label: "🔄 Combination (nursing + formula)" },
        { value: "undecided", label: "❓ Still deciding" },
      ],
    },
    {
      title: "What's your gear philosophy?",
      description: "Are you keeping it simple or going all-in?",
      key: "philosophy",
      type: "radio",
      options: [
        { value: "minimalist", label: "✨ Minimalist (only true essentials)" },
        {
          value: "balanced",
          label: "⚖️ Balanced (essentials + helpful extras)",
        },
        {
          value: "fully-equipped",
          label: "🌟 Fully Equipped (best of everything)",
        },
      ],
    },
    {
      title: "What's your comfort with used items?",
      description: "Big difference in your total spend",
      key: "marketComfort",
      type: "radio",
      options: [
        { value: "new-only", label: "🆕 New only (safety first)" },
        {
          value: "open-used",
          label: "♻️ Open to used (especially monitors, swaddles)",
        },
        { value: "buy-used", label: "🤝 Prefer used when possible" },
      ],
    },
    {
      title: "Almost done! What's your email?",
      key: "email",
      type: "email",
      description:
        "We'll save your personalized plan and send you updates here",
      options: null,
    },
  ];

  const currentQuestion = questions[step];
  const isAnswered = answers[currentQuestion.key as keyof SurveyAnswers];
  const canContinue = Boolean(isAnswered);
  const handleAnswer = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.key]: value,
    });
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Send survey data to API - creates account in background
      const response = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });

      if (!response.ok) throw new Error("Survey submission failed");

      const data = await response.json();
      // Redirect to loading/analysis page with survey session ID
      if (data.sessionId) {
        router.push(`/loading?session=${data.sessionId}`);
      }
    } catch (error) {
      console.error("Error submitting survey:", error);
      alert("Error submitting survey. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
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
              className="h-full bg-green-600 transition-all duration-300"
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
            {currentQuestion.type === "email" ? (
              <input
                type="email"
                placeholder="you@example.com"
                value={answers.email}
                onChange={(e) => handleAnswer(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-base"
              />
            ) : currentQuestion.type === "radio" ? (
              <RadioGroup
                value={answers[currentQuestion.key as keyof SurveyAnswers]}
                onValueChange={handleAnswer}
              >
                <div className="space-y-3">
                  {currentQuestion.options?.map((option) => (
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
                className="flex-1 h-12 bg-green-600 hover:bg-green-700"
              >
                {step === questions.length - 1 ? "Complete Survey" : "Next"}
                {step !== questions.length - 1 && (
                  <ArrowRight className="ml-2 h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Friendly message */}
        <div className="mt-8 text-center text-muted-foreground">
          <p className="text-sm">
            This survey takes about 2 minutes. We use your answers to
            personalize your gear list.
          </p>
        </div>
      </div>
    </div>
  );
}
