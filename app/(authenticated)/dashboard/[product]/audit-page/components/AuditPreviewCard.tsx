import type { SIOV2Report } from "@/components/audit";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { SIOV5Report } from "@/services/sio-report/schema";

interface AuditPreviewCardProps {
  report: SIOV5Report | SIOV2Report;
}

export function AuditPreviewCard({ report }: AuditPreviewCardProps) {
  const isV2 = (report as any).version === 2;

  const scores = isV2
    ? {
        overall: (report as SIOV2Report).overallScore,
        firstImpression: (report as SIOV2Report).scoring.first_impression,
        positioning: (report as SIOV2Report).scoring.positioning,
        clarity: (report as SIOV2Report).scoring.clarity,
        aeo: (report as SIOV2Report).scoring.aeo,
      }
    : {
        overall: (report as SIOV5Report).overallScore,
        firstImpression: (report as SIOV5Report).firstImpression.score,
        positioning: (report as SIOV5Report).positioning.score,
        clarity: (report as SIOV5Report).clarity.score,
        aeo: (report as SIOV5Report).aeo.score,
      };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Audit Summary</CardTitle>
        <CardDescription>Quick overview of your SIO-V5 scores</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          <ScoreCard label="Overall" score={scores.overall} color="slate" />
          <ScoreCard
            label="First Impression"
            score={scores.firstImpression}
            color="blue"
          />
          <ScoreCard
            label="Positioning"
            score={scores.positioning}
            color="purple"
          />
          <ScoreCard label="Clarity" score={scores.clarity} color="green" />
          <ScoreCard label="AEO" score={scores.aeo} color="red" />
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
