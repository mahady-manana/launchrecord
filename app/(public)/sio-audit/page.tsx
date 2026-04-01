import PublicAuditPage from "@/components/audit/PublicAuditPage";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Free SIO-V5 Audit - Instant Startup Report",
  description:
    "Run a free SIO-V5 audit to see your positioning, clarity, and AI visibility score. Get a shareable report in 2-4 minutes.",
};

export default function SIOAuditPage() {
  return (
    <Suspense>
      <PublicAuditPage />
    </Suspense>
  );
}
