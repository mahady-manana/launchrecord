import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SIOV5Report } from "@/services/sio-report/schema";

interface AuditPreviewCardProps {
  report: SIOV5Report;
}

export function AuditPreviewCard({ report }: AuditPreviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Audit Summary</CardTitle>
        <CardDescription>Quick overview of your SIO-V5 scores</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          <ScoreCard
            label="Overall"
            score={report.overallScore}
            color="slate"
          />
          <ScoreCard
            label="First Impression"
            score={report.firstImpression.score}
            color="blue"
          />
          <ScoreCard
            label="Positioning"
            score={report.positioning.score}
            color="purple"
          />
          <ScoreCard
            label="Clarity"
            score={report.clarity.score}
            color="green"
          />
          <ScoreCard label="AEO" score={report.aeo.score} color="red" />
        </div>
      </CardContent>
    </Card>
  );
}

function ScoreCard({
  label,
  score,
  color,
}: {
  label: string;
  score: number;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200",
    green: "bg-green-100 text-green-700 border-green-200",
    red: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <div className={`p-4 rounded-lg border text-center ${colorClasses[color]}`}>
      <div className="text-3xl font-bold">{score}</div>
      <div className="text-xs mt-1">{label}</div>
    </div>
  );
}
