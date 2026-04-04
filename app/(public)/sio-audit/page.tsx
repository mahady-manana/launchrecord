import PublicAuditPage from "@/components/audit/PublicAuditPage";
import { getUserSession } from "@/lib/session";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Free SIO-V5 Audit - Instant Startup Report",
  description:
    "Run a free SIO-V5 audit to see your positioning, clarity, and AI visibility score. Get a shareable report in 2-4 minutes.",
};

export default async function SIOAuditPage() {
  // Check if user is already authenticated
  const { user } = await getUserSession();

  // If user is logged in, redirect to dashboard
  if (user?._id) {
    redirect("/dashboard");
  }

  return (
    <Suspense>
      <PublicAuditPage />
    </Suspense>
  );
}
