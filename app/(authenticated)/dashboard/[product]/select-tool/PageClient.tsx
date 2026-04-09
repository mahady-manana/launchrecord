"use client";

import { useProducts } from "@/hooks/use-products";
import { useProductStore } from "@/stores/product-store";
import { BarChart3, Check, Zap } from "lucide-react";
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
  const product = useProductStore((d) => d.selectedProduct);
  const [step, setStep] = useState<"input" | "select">("input");
  const pillar = (searchParams.get("pillar") || "").toLowerCase();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status]);

  const handleSelectTool = (toolId: string) => {
    const toolRoutes: Record<string, string> = {
      sio: "sio",
      aeo: "aeo",
      positioning: "positioning",
      clarity: "clarity",
    };

    if (toolId === "sio") {
      router.push(
        `/dashboard/${product?._id}/audit-page?product=${product?._id}`,
      );
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
        `/dashboard/${product?._id}/audit/${route}${query ? `?${query}` : ""}`,
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
