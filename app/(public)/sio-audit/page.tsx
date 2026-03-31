import { Metadata } from "next";
import PublicAuditPage from "@/components/audit/PublicAuditPage";

export const metadata: Metadata = {
  title: "Free SIO-V5 Audit - Instant Startup Report",
  description:
    "Run a free SIO-V5 audit to see your positioning, clarity, and AI visibility score. Get a shareable report in minutes.",
};

export default function SIOAuditPage() {
  return <PublicAuditPage />;
}
