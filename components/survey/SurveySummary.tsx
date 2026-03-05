import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Globe } from "lucide-react";

interface SurveyAnswers {
  founderName: string;
  saasName: string;
  saasUrl: string;
  role: string;
  teamSize: string;
  revenue: string;
  biggestChallenge: string;
  aeoAwareness: string;
  description: string;
  willingToInvest: string;
}

interface SurveySummaryProps {
  answers: SurveyAnswers;
  onBack: () => void;
  onNext: () => void;
}

export function SurveySummary({ answers, onBack, onNext }: SurveySummaryProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Summary Card */}
        <Card className="border-2 border-orange-200 mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Your Audit Summary</CardTitle>
            <CardDescription>
              Review your answers before creating your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Product</div>
                <div className="font-semibold">
                  {answers.saasName || "Not provided"}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">URL</div>
                <div className="font-semibold flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  {answers.saasUrl}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Founder</div>
                <div className="font-semibold">
                  {answers.founderName || "Not provided"}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Role</div>
                <div className="font-semibold capitalize">
                  {answers.role
                    ? answers.role.replace("-", " ")
                    : "Not provided"}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Team Size</div>
                <div className="font-semibold">
                  {answers.teamSize
                    ? answers.teamSize.replace("-", " ")
                    : "Not provided"}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">MRR</div>
                <div className="font-semibold">
                  {answers.revenue || "Not provided"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card className="border border-border shadow-lg">
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <Button
                onClick={onBack}
                variant="outline"
                className="flex-1 h-12"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={onNext}
                className="flex-1 h-12 bg-orange-600 hover:bg-orange-700"
              >
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Continue - One last Step
                </>
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          🔒 Your data is secure. Create an account to access your personalized
          audit report.
        </p>
      </div>
    </div>
  );
}
