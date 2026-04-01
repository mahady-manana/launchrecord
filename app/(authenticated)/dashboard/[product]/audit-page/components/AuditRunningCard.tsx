import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Loader2 } from "lucide-react";

interface AuditRunningCardProps {
  progress: number;
}

export function AuditRunningCard({ progress }: AuditRunningCardProps) {
  return (
    <Card className="border-2 border-orange-200 bg-orange-50 mb-6">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 text-orange-600 animate-spin" />
          <CardTitle className="text-orange-800">
            Running Your SIO-V5 Audit
          </CardTitle>
        </div>
        <div className="flex justify-center mb-8">
          <div className="relative">
            <p className="text-xl">It may take 2 to 5 minutes to complete</p>
          </div>
        </div>
        <CardDescription className="text-orange-700 text-base">
          Our AI is analyzing your SaaS across 6 critical dimensions. This deep
          analysis typically takes 30-60 seconds to ensure comprehensive
          insights.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-orange-600 font-medium">
              Analysis Progress
            </span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-orange-600">
            <Loader2 className="h-3 w-3 animate-spin" />
            Website Analysis
          </div>
          <div className="flex items-center gap-2 text-xs text-orange-600">
            <Loader2 className="h-3 w-3 animate-spin" />
            AEO Detection
          </div>
          <div className="flex items-center gap-2 text-xs text-orange-600">
            <Loader2 className="h-3 w-3 animate-spin" />
            Positioning Check
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-100 rounded-lg p-3">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          Please keep this window open. Closing will interrupt the analysis.
        </div>
      </CardContent>
    </Card>
  );
}
