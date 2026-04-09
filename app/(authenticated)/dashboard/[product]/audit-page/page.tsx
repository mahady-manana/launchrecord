"use client";

import { AuditLoader, useAudit } from "@/components/audit";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/use-products";
import type { SIOV5Report } from "@/services/sio-report/schema";
import { useProductStore } from "@/stores/product-store";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  AuditErrorCard,
  AuditPreviewCard,
  AuditRateLimitedCard,
  AuditStartCard,
  AuditSuccessCard,
  AuditUpgradeCard,
  ExistingAuditCard,
} from "./components";

interface AuditPageProps {
  params: Promise<{ product: string }>;
}

type AuditStatus =
  | "idle"
  | "running"
  | "success"
  | "error"
  | "rate-limited"
  | "upgrade-required";

interface AuditLimitError {
  message: string;
  limitType?: "monthly" | "weekly" | "total" | "free";
  used?: number;
  limit?: number;
  resetAt?: string | null;
  upgradeRequired?: boolean;
}

function ProductAuditPageContent({ params }: AuditPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const autoRun = searchParams.get("auto") === "true";

  const { products, selectedProduct, setSelectedProduct } = useProductStore();
  const { fetchProducts } = useProducts();

  const [product, setProduct] = useState<typeof selectedProduct>(null);
  const [existingReport, setExistingReport] = useState<SIOV5Report | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [auditStatus, setAuditStatus] = useState<AuditStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [limitError, setLimitError] = useState<AuditLimitError | null>(null);
  const [retryAt, setRetryAt] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState<string>("");
  const [hasAutoRun, setHasAutoRun] = useState(false);

  // Use the new multi-step audit hook
  const {
    status: auditProgress,
    startAudit: startMultiStepAudit,
    isRunning,
    isComplete,
    isFailed,
  } = useAudit({
    isGuest: false,
    onComplete: async (report: SIOV5Report) => {
      setAuditStatus("success");
      setExistingReport(report);
      await fetchProducts();
      // Auto-redirect after short delay
      setTimeout(() => {
        if (product) {
          router.push(`/dashboard/${product.id}`);
        }
      }, 3000);
    },
    onError: (error: string) => {
      // Check if it's a rate limit error
      if (
        error.includes("limit") ||
        error.includes("capacity") ||
        error.includes("rate")
      ) {
        setAuditStatus("rate-limited");
        setErrorMessage(error);
        setRetryAt(new Date(Date.now() + 60000)); // 1 minute retry
      } else {
        setAuditStatus("error");
        setErrorMessage(error);
      }
    },
    onLimitReached: (error) => {
      setLimitError(error as any);
      setAuditStatus("upgrade-required");
    },
  });

  useEffect(() => {
    async function loadProduct() {
      const { product: productId } = await params;
      await fetchProducts();

      const foundProduct = products.find(
        (p) => p.id === productId || p._id === productId,
      );
      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedProduct(foundProduct);
        await checkExistingAudit(productId);
      } else {
        router.push("/dashboard");
      }
    }
    loadProduct();
  }, [params]);

  // Auto-run audit if ?auto=true
  useEffect(() => {
    if (!autoRun || !product || !product.website || hasAutoRun) return;

    // Don't auto-run if there's an existing recent report
    if (existingReport) return;

    setHasAutoRun(true);
    handleStartAudit();
  }, [autoRun, product, existingReport, hasAutoRun]);

  useEffect(() => {
    if (!retryAt) return;

    const updateCountdown = () => {
      const now = new Date();
      const diff = retryAt.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown("Retry available");
        setAuditStatus("idle");
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setCountdown(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [retryAt]);

  const checkExistingAudit = async (productId: string) => {
    try {
      const response = await fetch(
        `/api/products/${productId}/sio-v5-reports/latest`,
      );
      if (response.ok) {
        const data = await response.json();
        setExistingReport(data.report || null);
      }
    } catch (error) {
      console.error("Error checking existing audit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartAudit = async () => {
    if (!product || !product.website) return;

    setAuditStatus("running");
    await startMultiStepAudit(product.website, product.id);
  };

  const handleBack = () => {
    if (product) {
      router.push(`/dashboard/${product.id}`);
    } else {
      router.push("/dashboard");
    }
  };

  const handleViewResults = () => {
    if (product) {
      router.push(`/dashboard/${product.id}`);
    }
  };

  const handleRetry = () => {
    setAuditStatus("idle");
    setErrorMessage("");
    setRetryAt(null);
  };

  if (isLoading || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-orange-600 border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">SIO-V5 Audit</h1>
            <p className="text-muted-foreground">{product.name}</p>
          </div>
        </div>

        {/* Status Messages */}
        {auditStatus === "success" && (
          <AuditSuccessCard
            onViewResults={handleViewResults}
            onRetry={handleRetry}
          />
        )}

        {auditStatus === "rate-limited" && (
          <AuditRateLimitedCard
            errorMessage={errorMessage}
            retryAt={retryAt}
            countdown={countdown}
            productId={product.id}
            onRetry={handleRetry}
          />
        )}

        {auditStatus === "error" && (
          <AuditErrorCard
            errorMessage={errorMessage}
            onRetry={handleRetry}
            onBack={handleBack}
          />
        )}

        {auditStatus === "upgrade-required" && (
          <AuditUpgradeCard
            planType={limitError?.limitType === "free" ? "free" : "onetime"}
            used={limitError?.used || 0}
            limit={limitError?.limit || 1}
            errorMessage={limitError?.message || errorMessage}
            productId={product.id}
            onBack={handleBack}
          />
        )}

        {/* Running State - Terminal Loader */}
        {auditStatus === "running" && product.website && (
          <AuditLoader
            currentProgress={
              isFailed
                ? "failed"
                : isComplete
                  ? "complete"
                  : auditProgress.progress === "idle"
                    ? "content_fetched"
                    : auditProgress.progress
            }
            url={product.website}
            className="max-w-none"
          />
        )}

        {/* Main Content */}
        {!existingReport && auditStatus === "idle" ? (
          <AuditStartCard onStartAudit={handleStartAudit} />
        ) : existingReport && auditStatus === "idle" ? (
          <div className="space-y-6">
            <ExistingAuditCard
              productId={product.id}
              onViewResults={handleViewResults}
              onStartAudit={handleStartAudit}
            />
            <AuditPreviewCard report={existingReport} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function ProductAuditPage(props: AuditPageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="animate-spin h-8 w-8 border-4 border-orange-600 border-t-transparent rounded-full mx-auto" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <ProductAuditPageContent {...props} />
    </Suspense>
  );
}
