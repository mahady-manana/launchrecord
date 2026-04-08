import DashboardSIOReportClient from "./dashboard-sio-report-client";

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ product: string; report: string }>;
}) {
  const resolvedParams = await params;

  return <DashboardSIOReportClient params={resolvedParams} />;
}
