import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

interface Question {
  title: string;
  key: string;
  type: "text" | "textarea" | "radio" | "url";
  description?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

interface SurveyAnswers {
  [key: string]: string;
}

interface SurveyQuestionProps {
  question: Question;
  answer: string;
  onAnswer: (value: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onTextChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent, value: string) => void;
  step: number;
  totalSteps: number;
  canContinue: boolean;
  isLoading: boolean;
  isLastQuestion: boolean;
}

export function SurveyQuestion({
  question,
  answer,
  onAnswer,
  onNext,
  onPrev,
  onTextChange,
  onKeyDown,
  step,
  totalSteps,
  canContinue,
  isLoading,
  isLastQuestion,
}: SurveyQuestionProps) {
  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Question {step + 1} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full h-2 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card className="border border-border shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl text-foreground">
              {question.title}
            </CardTitle>
            {question.description && (
              <CardDescription className="text-base mt-2">
                {question.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {question.type === "textarea" && (
              <textarea
                placeholder={question.placeholder || "Enter your answer"}
                value={answer}
                onChange={onTextChange}
                onKeyDown={(e) => onKeyDown(e, answer)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-base"
                autoFocus
                rows={5}
              />
            )}

            {(question.type === "text" || question.type === "url") && (
              <input
                type={question.type}
                placeholder={question.placeholder || "Enter your answer"}
                value={answer}
                onChange={onTextChange}
                onKeyDown={(e) => onKeyDown(e, answer)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-base"
                autoFocus
              />
            )}

            {question.type === "radio" && question.options && (
              <RadioGroup value={answer} onValueChange={onAnswer}>
                <div className="space-y-3">
                  {question.options.map((option) => (
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
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-6 border-t border-border">
              <Button
                onClick={onPrev}
                variant="outline"
                className="flex-1 h-12"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={onNext}
                disabled={!canContinue || isLoading}
                className="flex-1 h-12 bg-orange-600 hover:bg-orange-700"
              >
                {isLastQuestion ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Review & Continue
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
            Your answers are private and used to personalize your War Briefing.
          </p>
        </div>
      </div>
    </div>
  );
}
