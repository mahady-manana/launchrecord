import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuditReportV1 } from "@/types/audit-report-v1";

interface AuditPreviewCardProps {
  report: AuditReportV1;
}

export function AuditPreviewCard({ report }: AuditPreviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Audit Summary</CardTitle>
        <CardDescription>Quick overview of your SIO-V5 scores</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-4">
          <ScoreCard
            label="AEO Index"
            score={report.aeo_index.score}
            color="blue"
          />
          <ScoreCard
            label="Positioning"
            score={report.positioning_sharpness.score}
            color="purple"
          />
          <ScoreCard
            label="Clarity"
            score={report.clarity_velocity.score}
            color="green"
          />
          <ScoreCard
            label="Momentum"
            score={report.momentum_signal.score}
            color="orange"
          />
          <ScoreCard
            label="Proof"
            score={report.founder_proof_vault.score}
            color="red"
          />
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
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200",
    green: "bg-green-100 text-green-700 border-green-200",
    orange: "bg-orange-100 text-orange-700 border-orange-200",
    red: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <div className={`p-4 rounded-lg border text-center ${colorClasses[color]}`}>
      <div className="text-3xl font-bold">{score}</div>
      <div className="text-xs mt-1">{label}</div>
    </div>
  );
}
