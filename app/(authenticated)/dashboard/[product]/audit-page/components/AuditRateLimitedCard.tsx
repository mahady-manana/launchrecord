import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

interface AuditRateLimitedCardProps {
  errorMessage: string;
  retryAt: Date | null;
  countdown: string;
  productId: string;
  onRetry: () => void;
}

export function AuditRateLimitedCard({
  errorMessage,
  retryAt,
  countdown,
  productId,
  onRetry,
}: AuditRateLimitedCardProps) {
  const router = useRouter();
  const isCapacityError =
    errorMessage.includes("capacity") ||
    errorMessage.includes("System at capacity");

  return (
    <Card className="border-2 border-orange-200 bg-orange-50 mb-6">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Clock className="h-6 w-6 text-orange-600" />
          <CardTitle className="text-orange-800">
            Audit Temporarily Unavailable
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-orange-800 font-medium">
            {isCapacityError
              ? "Our AI analysis system is currently at full capacity"
              : "You've reached your audit limit for this period"}
          </p>
          <p className="text-orange-700 text-sm">
            {isCapacityError
              ? "To ensure high-quality analysis for all users, we process audits sequentially. " +
                "Your audit has been queued and will run automatically when capacity becomes available."
              : "This prevents overuse and ensures fair access for all founders. " +
                "Your audit will be available again shortly."}
          </p>
        </div>
        {retryAt && (
          <div className="bg-orange-100 rounded-lg p-4">
            <div className="text-sm text-orange-600 mb-2 font-medium">
              {isCapacityError ? "Automatic retry in" : "You can run another audit in"}
            </div>
            <div className="text-4xl font-bold text-orange-700 font-mono">
              {countdown}
            </div>
            <p className="text-xs text-orange-600 mt-2">
              This page will automatically refresh when ready
            </p>
          </div>
        )}

        {/* Upgrade CTA - Only show for rate limits, not capacity */}
        {!isCapacityError && (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-purple-800">
                  Need More Audits?
                </h4>
                <p className="text-sm text-purple-700 mt-1">
                  Upgrade to Founder or Growth plan for more monthly audits,
                  weekly audits, and advanced features like competitive tracking
                  and trend analysis.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                    📊 Founder: 15 audits/month + 1 auto /week
                  </div>
                  <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                    🚀 Growth: 30 audits/month + 5/week
                  </div>
                  <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                    👑 Sovereign: Unlimited audits
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Button
                onClick={() => router.push(`/dashboard/${productId}/subscription`)}
                className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
              >
                Upgrade Plan
              </Button>
            </div>
          </div>
        )}

        <Button
          onClick={onRetry}
          disabled={!!retryAt && countdown !== "Retry available"}
          variant="outline"
          className="w-full sm:w-auto"
        >
          {countdown !== "Retry available" ? "Waiting for Retry..." : "Try Again Now"}
        </Button>
      </CardContent>
    </Card>
  );
}
