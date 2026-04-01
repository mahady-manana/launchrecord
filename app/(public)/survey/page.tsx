"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function SurveyRedirectContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      // Not logged in - redirect to login with callback
      const url = searchParams.get("url");
      const pillar = searchParams.get("pillar");
      const params = new URLSearchParams();
      if (url) params.set("url", url);
      if (pillar) params.set("pillar", pillar);
      const callbackUrl = params.toString()
        ? `/sio-audit?${params.toString()}`
        : "/sio-audit";
      router.push(callbackUrl);
    } else if (status === "authenticated") {
      // Already logged in - redirect to dashboard survey
      const url = searchParams.get("url");
      const pillar = searchParams.get("pillar");
      const params = new URLSearchParams();
      if (url) params.set("url", url);
      if (pillar) params.set("pillar", pillar);
      const targetUrl = params.toString()
        ? `/dashboard/survey?${params.toString()}`
        : "/dashboard/survey";
      router.push(targetUrl);
    }
  }, [status, router, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto" />
        <p className="text-muted-foreground">
          {status === "unauthenticated"
            ? "Redirecting to login..."
            : "Loading survey..."}
        </p>
      </div>
    </div>
  );
}

export default function SurveyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <SurveyRedirectContent />
    </Suspense>
  );
}
