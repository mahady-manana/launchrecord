import clsx from "clsx";

interface MetricStatementProps {
  statement: string;
  className?: string;
}

/**
 * Always-visible diagnostic statement for any metric.
 * Visible to guest, free, and paid users.
 */
export function MetricStatement({ statement, className }: MetricStatementProps) {
  if (!statement) return null;

  return (
    <p className={clsx("text-slate-600 leading-relaxed", className)}>
      {statement}
    </p>
  );
}
