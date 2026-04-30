import { AlertCircle, CheckCircle2 } from "lucide-react";

interface MetricsSectionProps {
  metrics?: Array<{ name: string; check: boolean; statement: string }>;
}

export function MetricsSection({ metrics }: MetricsSectionProps) {
  if (!metrics || metrics.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          No metrics data available for this report.
        </p>
      </div>
    );
  }

  const sortedMetrics = [...metrics].sort((a, b) => {
    // Show failed checks first, then sort alphabetically
    if (a.check === b.check) {
      return a.name.localeCompare(b.name);
    }
    return a.check ? 1 : -1;
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
        {sortedMetrics.map((metric) => {
          const isPass = metric.check;

          // Format key nicely (e.g., category_ownership -> Category Ownership)
          const formattedKey = metric.name
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

          const containerClass = isPass
            ? "bg-green-50/50 border-green-100"
            : "bg-red-50/50 border-red-100";

          const titleClass = isPass ? "text-green-900" : "text-red-900";

          return (
            <div
              key={metric.name}
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
