"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { runStandaloneAEOAudit } from "@/services/aeo-audit/aeo-audit-standalone";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Loader2,
  Sparkles,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AuditSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  websiteUrl: string;
}

export function AuditSelectionModal({
  open,
  onOpenChange,
  websiteUrl,
}: AuditSelectionModalProps) {
  const router = useRouter();
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState("");

  const handleFreeAudit = async () => {
    setIsAuditing(true);
    setAuditProgress("Initializing audit...");

    try {
      const result = await runStandaloneAEOAudit({
        url: websiteUrl.startsWith("http")
          ? websiteUrl
          : `https://${websiteUrl}`,
      });

      sessionStorage.setItem(
        "freeAuditResult",
        JSON.stringify({
          ...result,
          timestamp: new Date().toISOString(),
        }),
      );

      router.push(
        `/aeo-audit/free-audit?url=${encodeURIComponent(websiteUrl)}`,
      );
    } catch (error) {
      console.error("Free audit failed:", error);
      setAuditProgress("Audit failed. Please try again.");
      setTimeout(() => {
        setIsAuditing(false);
      }, 2000);
    }
  };

  const handleAdvancedAudit = () => {
    window.location.href = `/survey/audit?url=${encodeURIComponent(websiteUrl)}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-5xl">
        {isAuditing ? (
          <div className="py-12 space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <Loader2 className="h-16 w-16 text-orange-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Cpu className="h-8 w-8 text-orange-300" />
                </div>
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-slate-800">
                Running Technical Audit
              </h3>
              <p className="text-slate-600">{auditProgress}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <DialogHeader className="space-y-2 text-center">
              <div className="inline-flex items-center gap-2 bg-purple-100 px-3 py-1 rounded-md text-purple-700 text-xs font-medium w-fit mx-auto">
                <Zap className="h-3 w-3" />
                <span>Choose Your Audit Type</span>
              </div>
              <DialogTitle className="text-xl font-bold">
                Select AEO Audit Type
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-600">
                AEO is complex—it doesn't rely on technical implementation
                alone. Many factors affect AI visibility including semantic
                authority, entity recognition, external mentions, and AI
                training data.
              </DialogDescription>
            </DialogHeader>

            <div className="grid md:grid-cols-2 gap-4 py-2">
              {/* Free Audit Option */}
              <div className="border-2 border-slate-200 rounded-xl p-5 space-y-4 hover:border-green-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">
                      Technical Audit
                    </h3>
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                      FREE
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  Instant technical analysis of your website's AEO readiness.
                  Checks structure, crawlability, schema markup, and content
                  formatting.
                </p>

                <div className="flex items-center gap-2 text-amber-700 bg-amber-50 px-3 py-2 rounded-md">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <p className="text-xs leading-relaxed">
                    Technical factors only. Doesn't analyze AI engine presence
                    or semantic authority.
                  </p>
                </div>

                <Button
                  onClick={handleFreeAudit}
                  className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-semibold"
                >
                  Start Free Audit
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>

              {/* Advanced Audit Option */}
              <div className="border-2 border-orange-200 rounded-xl p-5 space-y-4 bg-gradient-to-br from-orange-50 to-red-50">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-800">
                        Advanced AI Audit
                      </h3>
                      <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                        Recommended
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Comprehensive with AI insights
                    </p>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  Complete AI-powered analysis including actual visibility in AI
                  engines, semantic authority, competitive gaps, and prioritized
                  recommendations.
                </p>

                <div className="flex items-center gap-2 text-blue-700 bg-blue-50 px-3 py-2 rounded-md">
                  <Sparkles className="h-4 w-4 flex-shrink-0" />
                  <p className="text-xs leading-relaxed">
                    Best for founders wanting actionable AEO strategy.
                  </p>
                </div>

                <Button
                  onClick={handleAdvancedAudit}
                  className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white font-semibold"
                >
                  Get Advanced Audit
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
