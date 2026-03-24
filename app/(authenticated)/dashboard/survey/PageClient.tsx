"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useProducts } from "@/hooks/use-products";

function DashboardSurveyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const { fetchProducts } = useProducts();

  const [startupName, setStartupName] = useState("");
  const [startupUrl, setStartupUrl] = useState(searchParams.get("url") || "");
  const [isLoading, setIsLoading] = useState(false);
  const pillar = (searchParams.get("pillar") || "").toLowerCase();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status]);

  const handleAudit = async () => {
    if (!startupName || !startupUrl) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          saasName: startupName,
          saasUrl: startupUrl,
          founderName: session?.user?.name || "",
          pillar: pillar || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.alreadyClaimed) {
          router.push(
            `/survey/claim?product=${data.productId}&name=${encodeURIComponent(startupName)}&website=${encodeURIComponent(startupUrl)}`,
          );
          return;
        }
        throw new Error(data.error || "Failed to initialize audit");
      }

      if (data.productId) {
        await fetchProducts(data.productId);
        const pillarRoutes: Record<string, string> = {
          positioning: "positioning",
          clarity: "clarity",
          momentum: "momentum",
          "founder-proof": "founder-proof",
          founderproof: "founder-proof",
          aeo: "aeo",
        };
        const pillarSlug = pillarRoutes[pillar];
        if (pillarSlug) {
          const params = new URLSearchParams();
          if (pillarSlug === "positioning") {
            params.set("autorun", "1");
            if (startupUrl) {
              params.set("url", startupUrl);
            }
          }
          const query = params.toString();
          router.push(
            `/dashboard/${data.productId}/audit/${pillarSlug}${
              query ? `?${query}` : ""
            }`,
          );
        } else {
          router.push(`/dashboard/audit?product=${data.productId}`);
        }
      }
    } catch (error) {
      console.error("Error initializing audit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              Startup Audit
            </h1>
            <p className="text-muted-foreground">
              Enter your startup details to begin the audit
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="startup-name"
                className="text-sm font-medium text-foreground"
              >
                Startup Name
              </label>
              <input
                id="startup-name"
                type="text"
                value={startupName}
                onChange={(e) => setStartupName(e.target.value)}
                placeholder="Enter startup name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="startup-url"
                className="text-sm font-medium text-foreground"
              >
                Startup URL
              </label>
              <input
                id="startup-url"
                type="url"
                value={startupUrl}
                onChange={(e) => setStartupUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleAudit}
              disabled={!startupName || !startupUrl || isLoading}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              {isLoading ? "Auditing..." : "Audit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardSurvey() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <DashboardSurveyContent />
    </Suspense>
  );
}
