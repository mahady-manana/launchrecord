"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuditReportPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/sio-audit");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-sm text-muted-foreground">
        Redirecting to the SIO audit...
      </div>
    </div>
  );
}
