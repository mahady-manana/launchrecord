"use client";

import { useProducts } from "@/hooks/use-products";
import {
  ArrowRight,
  BarChart3,
  Check,
  Eye,
  Loader2,
  Target,
  Zap,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

// Available audit tools
const AUDIT_TOOLS = [
  {
    id: "sio",
    name: "SIO Audit",
    description: "Comprehensive 5-pillar startup intelligence audit",
    icon: BarChart3,
    color: "from-blue-500 to-indigo-600",
    recommended: true,
  },
  {
    id: "aeo",
    name: "AEO Audit",
    description: "Optimize for AI search engines (ChatGPT, Claude, Perplexity)",
    icon: Zap,
    color: "from-cyan-500 to-blue-600",
    recommended: false,
  },
  {
    id: "positioning",
    name: "Positioning Audit",
    description: "Measure category ownership and market differentiation",
    icon: Target,
    color: "from-purple-500 to-pink-600",
    recommended: false,
  },
  {
    id: "clarity",
    name: "Clarity Audit",
    description: "5-second test for instant value comprehension",
    icon: Eye,
    color: "from-green-500 to-emerald-600",
    recommended: false,
  },
];

// Pillars that should skip tool selection
const DIRECT_PILLARS = ["aeo", "positioning", "clarity"];

function DashboardSurveyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const { fetchProducts } = useProducts();

  const [startupName, setStartupName] = useState("");
  const [startupUrl, setStartupUrl] = useState(searchParams.get("url") || "");
  const [isLoading, setIsLoading] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [step, setStep] = useState<"input" | "select">("input");
  const pillar = (searchParams.get("pillar") || "").toLowerCase();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status]);

  // Check if we should go directly to audit
  useEffect(() => {
    if (pillar && DIRECT_PILLARS.includes(pillar)) {
      // Direct pillar - will skip tool selection after product creation
      return;
    }
  }, [pillar]);

  const handleCreateProduct = async () => {
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
        setProductId(data.productId);

        // If pillar is specified and valid, go directly to audit
        const pillarRoutes: Record<string, string> = {
          positioning: "positioning",
          clarity: "clarity",
          aeo: "aeo",
        };
        const pillarSlug = pillarRoutes[pillar];

        if (pillarSlug) {
          const params = new URLSearchParams();
          if (pillarSlug === "positioning" || pillarSlug === "clarity") {
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
          // No valid pillar - show tool selection
          setStep("select");
        }
      }
    } catch (error) {
      console.error("Error initializing audit:", error);
      alert("Failed to create product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTool = (toolId: string) => {
    if (!productId) return;

    const toolRoutes: Record<string, string> = {
      sio: "sio",
      aeo: "aeo",
      positioning: "positioning",
      clarity: "clarity",
    };

    if (toolId === "sio") {
      router.push(`/dashboard/${productId}/audit-page?auto=true`);
      return;
    }
    const route = toolRoutes[toolId];
    if (route) {
      const params = new URLSearchParams();
      if (route === "positioning" || route === "clarity") {
        params.set("autorun", "1");
        if (startupUrl) {
          params.set("url", startupUrl);
        }
      }
      const query = params.toString();
      router.push(
        `/dashboard/${productId}/audit/${route}${query ? `?${query}` : ""}`,
      );
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

  // Step 1: Input form
  if (step === "input") {
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
                onClick={handleCreateProduct}
                disabled={!startupName || !startupUrl || isLoading}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Tool selection
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Check className="h-6 w-6 text-green-600" />
              <span className="text-green-600 font-medium">
                {startupName} added successfully
              </span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Choose Your Audit
            </h1>
            <p className="text-muted-foreground">
              Select the audit you want to run to uncover blind spots and boost
              your startup’s growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {AUDIT_TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => handleSelectTool(tool.id)}
                  className="relative p-6 rounded-xl border-2 border-gray-200 hover:border-orange-500 transition-all text-left group"
                >
                  {tool.recommended && (
                    <div className="absolute -top-3 -right-3 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Not sure, start SIO Audit
                    </div>
                  )}
                  <div
                    className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${tool.color} text-white mb-4`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-orange-600 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {tool.description}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              Not sure? Start with{" "}
              <span className="font-semibold text-orange-600">SIO Audit</span> -
              it covers all 5 pillars of startup intelligence
            </p>
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
