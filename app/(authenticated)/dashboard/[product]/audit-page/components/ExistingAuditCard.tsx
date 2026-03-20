import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";

interface ExistingAuditCardProps {
  productId: string;
  onViewResults: () => void;
  onStartAudit: () => void;
}

export function ExistingAuditCard({
  productId,
  onViewResults,
  onStartAudit,
}: ExistingAuditCardProps) {
  const router = useRouter();

  return (
    <Card className="border-2 border-green-200 bg-green-50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <CardTitle>Audit Already Completed</CardTitle>
        </div>
        <CardDescription className="text-green-700 text-base">
          You&apos;ve already run a comprehensive SIO-V5 audit for this
          product. View your results to see actionable insights on positioning,
          AEO visibility, and defensibility.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          <Button onClick={onViewResults} variant="outline">
            View Full Results
          </Button>
          <Button
            onClick={onStartAudit}
            variant="secondary"
            className="text-white"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Run New Audit
          </Button>
        </div>
        <p className="text-xs text-green-600 mt-4">
          💡 Tip: Re-run your audit after making significant changes to your
          website or messaging
        </p>

        {/* Upgrade CTA */}
        <div className="mt-4 pt-4 border-t border-green-200">
          <p className="text-xs text-green-700 font-medium mb-2">
            🔓 Want to track changes over time?
          </p>
          <p className="text-xs text-green-600 mb-3">
            Upgrade to run more audits and monitor your SIO-V5 score trends
          </p>
          <Button
            onClick={() => router.push(`/dashboard/${productId}/subscription`)}
            size="sm"
            variant="outline"
            className="border-green-300 text-green-700 hover:bg-green-100"
          >
            View Plans
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
