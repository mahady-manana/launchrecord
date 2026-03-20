import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface AuditSuccessCardProps {
  onViewResults: () => void;
  onRetry: () => void;
}

export function AuditSuccessCard({
  onViewResults,
  onRetry,
}: AuditSuccessCardProps) {
  return (
    <Card className="border-2 border-green-200 bg-green-50 mb-6">
      <CardHeader>
        <div className="flex items-center gap-3">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <CardTitle className="text-green-800">
            Audit Completed Successfully!
          </CardTitle>
        </div>
        <CardDescription className="text-green-700 text-base">
          Your comprehensive SIO-V5 analysis is complete. We&apos;ve analyzed
          your positioning, AEO visibility, messaging clarity, momentum signals,
          and competitive landscape.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <Button
            onClick={onViewResults}
            className="bg-green-800 hover:bg-green-700"
          >
            View Full Results
          </Button>
          <Button onClick={onRetry} variant="outline">
            Run Another Audit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
