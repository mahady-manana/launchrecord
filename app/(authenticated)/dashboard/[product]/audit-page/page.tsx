"use client";

import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/use-products";
import type { ISIOReport } from "@/models/sio-report";
import { useProductStore } from "@/stores/product-store";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AuditErrorCard,
  AuditPreviewCard,
  AuditRateLimitedCard,
  AuditRunningCard,
  AuditStartCard,
  AuditSuccessCard,
  ExistingAuditCard,
} from "./components";

interface AuditPageProps {
  params: Promise<{ product: string }>;
}

type AuditStatus = "idle" | "running" | "success" | "error" | "rate-limited";

export default function ProductAuditPage({ params }: AuditPageProps) {
  const router = useRouter();
  const { products, selectedProduct, setSelectedProduct } = useProductStore();
  const { fetchProducts } = useProducts();

  const [product, setProduct] = useState<typeof selectedProduct>(null);
  const [existingReport, setExistingReport] = useState<ISIOReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [auditStatus, setAuditStatus] = useState<AuditStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [retryAt, setRetryAt] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState<string>("");

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
    if (!product) return;

    setAuditStatus("running");
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 10000);

    try {
      if (!product.website) {
        throw new Error("Product website is required to run an audit");
      }

      const response = await fetch("/api/sio-v5-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          url: product.website,
        }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      const data = await response.json();

      if (response.ok) {
        setAuditStatus("success");
        setExistingReport(data.data || null);
        await fetchProducts();
        router.push("/dashboard/" + product.id);
      } else if (response.status === 403) {
        setAuditStatus("rate-limited");
        setErrorMessage(data.error || "Audit limit reached");
      } else if (response.status === 429) {
        setAuditStatus("rate-limited");
        setErrorMessage(data.error || "Rate limit exceeded");
        if (data.retryAt) {
          setRetryAt(new Date(data.retryAt));
        }
      } else if (response.status === 503 && data.retry) {
        setAuditStatus("rate-limited");
        setErrorMessage(data.error || "System at capacity");
        if (data.retryAt) {
          setRetryAt(new Date(data.retryAt));
        }
      } else {
        setAuditStatus("error");
        setErrorMessage(data.error || "Failed to run audit");
      }
    } catch (err: any) {
      clearInterval(progressInterval);
      setAuditStatus("error");
      setErrorMessage(err.message || "Failed to run audit");
    }
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

        {/* Running State */}
        {auditStatus === "running" && <AuditRunningCard progress={progress} />}

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
