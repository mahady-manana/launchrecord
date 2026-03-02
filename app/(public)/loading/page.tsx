"use client";

import { Card } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function LoadingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session");
  const [step, setStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const steps = [
    { emoji: "📊", text: "Analyzing your answers...", duration: 1500 },
    { emoji: "👶", text: "Building your baby gear profile...", duration: 1500 },
    { emoji: "💰", text: "Calculating your savings...", duration: 1500 },
    { emoji: "🔐", text: "Creating your account...", duration: 1500 },
  ];

  useEffect(() => {
    if (step < steps.length) {
      const timer = setTimeout(() => {
        setStep(step + 1);
      }, steps[step].duration);
      return () => clearTimeout(timer);
    } else {
      // All steps complete, redirect to payment preview
      const timer = setTimeout(() => {
        setIsComplete(true);
        router.push(`/payment-preview?session=${sessionId}`);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [step, router, sessionId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo/Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Getting Ready for You
          </h1>
          <p className="text-muted-foreground">
            Personalizing your gear recommendations...
          </p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-4">
          {steps.map((s, idx) => (
            <Card
              key={idx}
              className={`p-4 transition-all duration-500 ${
                idx < step
                  ? "bg-green-50 border-green-300"
                  : idx === step
                    ? "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300"
                    : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`text-3xl ${
                    idx <= step ? "animate-pulse" : "opacity-50"
                  }`}
                >
                  {s.emoji}
                </div>
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      idx < step ? "text-green-700" : "text-foreground"
                    }`}
                  >
                    {s.text}
                  </p>
                  {idx < step && (
                    <p className="text-sm text-green-600">✅ Complete</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-2 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-green-600 transition-all duration-500"
              style={{ width: `${(step / steps.length) * 100}%` }}
            />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            {Math.min(step, steps.length - 1) + 1} of {steps.length}
          </p>
        </div>

        {/* Hint */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-sm text-blue-800">
            💡 Your personalized gear list is being created with your answers.
            You're seconds away from your custom recommendations!
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoadingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoadingContent />
    </Suspense>
  );
}
