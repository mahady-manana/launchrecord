import { AlertCircle, CheckCircle2 } from "lucide-react";

interface MetricsSectionProps {
  metrics?: Record<string, { check: boolean; statement: string }>;
}

export function MetricsSection({ metrics }: MetricsSectionProps) {
  if (!metrics || Object.keys(metrics).length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          No metrics data available for this report.
        </p>
      </div>
    );
  }

  const sortedKeys = Object.keys(metrics).sort((a, b) => {
    // Show failed checks first, then sort alphabetically
    if (metrics[a].check === metrics[b].check) {
      return a.localeCompare(b);
    }
    return metrics[a].check ? 1 : -1;
  });

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 inline-block text-transparent bg-clip-text">
          Audit Metrics Checklist
        </h2>
        <p className="text-slate-500 mt-2">
          A purely diagnostic look at all evaluation checkpoints covering your
          pages explicit messaging structure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedKeys.map((key) => {
          const metric = metrics[key];
          const isPass = metric.check;

          // Format key nicely (e.g., category_ownership -> Category Ownership)
          const formattedKey = key
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

          const containerClass = isPass
            ? "bg-green-50/50 border-green-100"
            : "bg-red-50/50 border-red-100";

          const titleClass = isPass ? "text-green-900" : "text-red-900";
          const descClass = isPass ? "text-green-700" : "text-red-700";

          return (
            <div
              key={key}
              className={`flex items-start p-4 rounded-xl border ${containerClass}`}
            >
              <div className="mt-0.5 mr-3 flex-shrink-0">
                {isPass ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
              <div>
                <h4 className={`text-sm font-semibold mb-1 ${titleClass}`}>
                  {formattedKey}
                </h4>
                <p className={`text-sm ${descClass}`}>{metric.statement}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
