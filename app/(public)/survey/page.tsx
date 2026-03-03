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
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

interface SurveyAnswers {
  email: string;
  founderName: string;
  saasName: string;
  saasUrl: string;
  role: string;
  teamSize: string;
  revenue: string;
  biggestChallenge: string;
  aeoAwareness: string;
  competitorThreat: string;
  willingToInvest: string;
}

function LaunchRecordSurveyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [answers, setAnswers] = useState<SurveyAnswers>({
    email: searchParams.get("email") || "",
    founderName: "",
    saasName: "",
    saasUrl: "",
    role: "",
    teamSize: "",
    revenue: "",
    biggestChallenge: "",
    aeoAwareness: "",
    competitorThreat: "",
    willingToInvest: "",
  });

  useEffect(() => {
    const prefillEmail = searchParams.get("email");
    if (prefillEmail) {
      setAnswers((prev) => ({ ...prev, email: prefillEmail }));
    }
  }, [searchParams]);

  const questions = [
    {
      title: "What's your founder name?",
      key: "founderName",
      type: "text",
      description: "This will appear on your War Briefing",
      placeholder: "e.g., John Smith",
    },
    {
      title: "What's your SaaS called?",
      key: "saasName",
      type: "text",
      description: "The product we'll be analyzing",
      placeholder: "e.g., Acme Analytics",
    },
    {
      title: "What's your product URL?",
      key: "saasUrl",
      type: "url",
      description: "We'll run a free Genericity Score audit on this",
      placeholder: "https://acmeanalytics.com",
    },
    {
      title: "What's your current role?",
      key: "role",
      type: "radio",
      description: "Where do you sit in the company?",
      options: [
        { value: "solo-founder", label: "👤 Solo Founder" },
        { value: "co-founder-ceo", label: "👔 Co-Founder & CEO" },
        { value: "co-founder-cto", label: "⚙️ Co-Founder & CTO" },
        { value: "co-founder-product", label: "📦 Co-Founder (Product)" },
        { value: "founder-other", label: "🎯 Founder (Other role)" },
      ],
    },
    {
      title: "How big is your team?",
      key: "teamSize",
      type: "radio",
      description: "Full-time employees (including founders)",
      options: [
        { value: "just-me", label: "👤 Just me (solo)" },
        { value: "2-5", label: "👥 2-5 people" },
        { value: "6-15", label: "🏢 6-15 people" },
        { value: "16-50", label: "🏭 16-50 people" },
        { value: "50+", label: "🏢 50+ people" },
      ],
    },
    {
      title: "What's your current MRR?",
      key: "revenue",
      type: "radio",
      description: "Monthly Recurring Revenue (be honest - this is private)",
      options: [
        { value: "pre-revenue", label: "💸 Pre-revenue" },
        { value: "0-5k", label: "📈 $0 - $5K" },
        { value: "5k-20k", label: "📈 $5K - $20K" },
        { value: "20k-50k", label: "📈 $20K - $50K" },
        { value: "50k-100k", label: "📈 $50K - $100K" },
        { value: "100k+", label: "📈 $100K+" },
      ],
    },
    {
      title: "What's your biggest positioning challenge?",
      key: "biggestChallenge",
      type: "radio",
      description: "What keeps you up at night?",
      options: [
        {
          value: "invisible-llms",
          label: "🔍 Invisible in LLM recommendations (AEO problem)",
        },
        {
          value: "commodity-feeling",
          label: "⚠️ Feeling like a commodity vs. category leader",
        },
        {
          value: "competitor-overlap",
          label: "🎯 Competitors copying my positioning",
        },
        {
          value: "unclear-messaging",
          label: "📢 Buyers don't understand what I do in 10 seconds",
        },
        {
          value: "ai-threat",
          label: "😰 Worried AI will make my product obsolete",
        },
      ],
    },
    {
      title: "Have you heard of AEO (Answer Engine Optimization)?",
      key: "aeoAwareness",
      type: "radio",
      description: "How visible are you in ChatGPT, Claude, Perplexity?",
      options: [
        {
          value: "never-heard",
          label: "❌ Never heard of it",
        },
        {
          value: "heard-but-not-tracking",
          label: "🤔 Heard of it, but not tracking it",
        },
        {
          value: "tracking-manually",
          label: "📊 Tracking it manually (spreadsheets, etc.)",
        },
        {
          value: "using-tools",
          label: "🛠️ Using tools to optimize for it",
        },
      ],
    },
    {
      title: "How threatened do you feel by AI companies?",
      key: "competitorThreat",
      type: "radio",
      description: "OpenAI, Google, etc. building native versions of your product",
      options: [
        {
          value: "not-worried",
          label: "😌 Not worried - our moat is strong",
        },
        {
          value: "somewhat-concerned",
          label: "😐 Somewhat concerned",
        },
        {
          value: "very-concerned",
          label: "😰 Very concerned - it's on my roadmap",
        },
        {
          value: "existential-threat",
          label: "🚨 Existential threat - could kill our business",
        },
      ],
    },
    {
      title: "If LaunchRecord could solve this, what would you invest?",
      key: "willingToInvest",
      type: "radio",
      description: "Monthly investment to become irreplaceable",
      options: [
        {
          value: "49-tier",
          label: "💰 $49/mo (AEO Tracker + War Briefing)",
        },
        {
          value: "99-tier",
          label: "💰💰 $99/mo (+ Founder Proof Vault + Leaderboard)",
        },
        {
          value: "299-tier",
          label: "💰💰💰 $299/mo (+ Strategy Calls + Emergency Pivot)",
        },
        {
          value: "need-more-info",
          label: "🤔 Need to see more before committing",
        },
      ],
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

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleAnswer(e.target.value);
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
      const response = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });

      if (!response.ok) throw new Error("Survey submission failed");

      const data = await response.json();
      if (data.sessionId) {
        router.push(`/survey/audit?session=${data.sessionId}`);
      }
    } catch (error) {
      console.error("Error submitting survey:", error);
      alert("Error submitting survey. Please try again.");
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
                    answers[currentQuestion.key as keyof SurveyAnswers]
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
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    Generate Audit Report
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
            This survey takes about 3 minutes. Your answers are private and used
            to personalize your War Briefing.
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
