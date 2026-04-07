import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface AuditErrorCardProps {
  errorMessage: string;
  onRetry: () => void;
  onBack: () => void;
}

export function AuditErrorCard({
  errorMessage,
  onRetry,
  onBack,
}: AuditErrorCardProps) {
  return (
    <Card className="border-2 border-red-200 bg-red-50 mb-6">
      <CardHeader>
        <div className="flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-red-600" />
          <CardTitle className="text-red-800">
            Unable to Complete Audit
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-red-800 font-medium">
            We encountered an issue while analyzing your SaaS
          </p>
          <p className="text-red-700 text-sm whitespace-pre-line">
            {errorMessage.includes("network") || errorMessage.includes("fetch")
              ? "We couldn&apos;t access your website. Please verify the URL is correct and publicly accessible."
              : errorMessage.includes("timeout")
                ? "The analysis took too long to complete. This can happen with complex websites."
                : errorMessage.includes("client-side") ||
                    errorMessage.includes("insufficient content")
                  ? errorMessage
                  : "Something went wrong on our end. Our team has been notified."}
          </p>
        </div>
        <div className="bg-red-100 rounded-lg p-3">
          <p className="text-xs text-red-600 font-mono break-all">
            Technical details: {errorMessage}
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={onRetry}
            variant="outline"
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Try Again
          </Button>
          <Button onClick={onBack} variant="outline">
            Back to Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
