import DashboardSIOReport from "@/components/sio-report/DashboardSIOReport";
import { DashboardSIOReportV2 } from "@/components/sio-report/dashboardV2";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

export const ReportAdmin = ({ report, onClose }: any) => {
  if (!report) return null;
  return (
    <div className="block">
      <div
        className={clsx(
          report ? "fixed top-0 left-0" : "hidden",
          "z-999  overflow-y-auto max-h-screen mt-4 bg-white p-4 rounded shadow-lg w-full",
        )}
      >
        <div>
          <Button onClick={() => onClose()}>x</Button>
        </div>
        <div className="flex">
          {(report as any).version === 2 ? (
            <DashboardSIOReportV2 report={report} />
          ) : (
            <DashboardSIOReport report={report} />
          )}
        </div>
      </div>
    </div>
  );
};
