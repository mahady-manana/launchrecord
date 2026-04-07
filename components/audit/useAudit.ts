"use client";

import { SIOV5Report } from "@/services/sio-report/schema";
import { useCallback, useEffect, useRef, useState } from "react";

export type AuditProgress =
  | "idle"
  | "content_fetched"
  | "summary_complete"
  | "positioning_clarity_complete"
  | "aeo_complete"
  | "scoring_complete"
  | "complete"
  | "failed";

export interface AuditStatus {
  progress: AuditProgress;
  reportId: string | null;
  overallScore: number | null;
  data: SIOV5Report | null;
  error: string | null;
  failedAt: string | null;
  contentSummary: {
    contentLength: number | null;
    hasSitemap: boolean | null;
    hasRobots: boolean | null;
  } | null;
}

export interface UseAuditOptions {
  productId?: string;
  isGuest?: boolean;
  pollInterval?: number;
  onComplete?: (report: SIOV5Report) => void;
  onError?: (error: string) => void;
}

export function useAudit(options: UseAuditOptions = {}) {
  const {
    productId: defaultProductId,
    isGuest = true,
    pollInterval = 2000,
    onComplete,
    onError,
  } = options;

  const [status, setStatus] = useState<AuditStatus>({
    progress: "idle",
    reportId: null,
    overallScore: null,
    data: null,
    error: null,
    failedAt: null,
    contentSummary: null,
  });

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRunningRef = useRef(false);

  // Clear polling
  const clearPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  // Poll status endpoint
  const pollStatus = useCallback(
    async (reportId: string) => {
      try {
        const response = await fetch(`/api/sio-audit/status/${reportId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to check status");
        }

        setStatus((prev) => ({
          ...prev,
          progress: data.progress,
          reportId,
          overallScore: data.overallScore || prev.overallScore,
          data: data.data || prev.data,
          contentSummary: data.contentSummary || prev.contentSummary,
          failedAt: data.failedAt || null,
          error: data.progress === "failed" ? data.errorMessage : prev.error,
        }));

        // Check if complete or failed
        if (data.progress === "complete") {
          clearPolling();
          isRunningRef.current = false;
          onComplete?.(data.data);
        } else if (data.progress === "failed") {
          clearPolling();
          isRunningRef.current = false;
          onError?.(data.errorMessage);
        }
      } catch (error: any) {
        console.error("Poll error:", error);
        clearPolling();
        isRunningRef.current = false;
        setStatus((prev) => ({
          ...prev,
          progress: "failed",
          error: error.message || "Failed to check audit status",
          failedAt: "polling",
        }));
        onError?.(error.message);
      }
    },
    [clearPolling, onComplete, onError],
  );

  // Run a single step (declared before startAudit)
  const runStep = useCallback(
    async (step: string, reportId: string, stepIsGuest: boolean) => {
      try {
        let response;
        try {
          response = await fetch(`/api/sio-audit/steps/${step}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reportId, isGuest: stepIsGuest }),
          });
        } catch (networkError: any) {
          throw new Error(`Network error: Unable to connect during ${step}`);
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `Failed at ${step}`);
        }

        // Update progress
        setStatus((prev) => ({
          ...prev,
          progress: data.progress,
          overallScore: data.overallScore || prev.overallScore,
        }));

        // If not complete, run next step
        if (
          data.progress !== "complete" &&
          data.progress !== "failed" &&
          data.nextStep
        ) {
          const nextStepName = data.nextStep.split("/").pop();
          if (nextStepName && nextStepName !== step) {
            await runStep(nextStepName, reportId, stepIsGuest);
          }
        } else if (data.progress === "complete") {
          isRunningRef.current = false;
          clearPolling();
          if (data.data) {
            setStatus((prev) => ({
              ...prev,
              data: data.data,
              overallScore: data.data.overallScore,
            }));
            onComplete?.(data.data);
          }
        } else if (data.progress === "failed") {
          isRunningRef.current = false;
          clearPolling();
          const failedAt = data.failedAt || step;
          setStatus((prev) => ({
            ...prev,
            progress: "failed",
            error: data.error || "Audit failed",
            failedAt,
          }));
          onError?.(data.error || "Audit failed");
        }
      } catch (error: any) {
        isRunningRef.current = false;
        clearPolling();
        const errorMessage = error.message || "Audit failed";
        const failedAtMap: Record<string, string> = {
          summary: "summary_generation",
          "positioning-clarity": "positioning_clarity_generation",
          aeo: "aeo_generation",
          scoring: "scoring",
          refine: "refinement",
        };
        setStatus((prev) => ({
          ...prev,
          progress: "failed",
          error: errorMessage,
          failedAt: failedAtMap[step] || step,
        }));
        onError?.(errorMessage);
      }
    },
    [clearPolling, onComplete, onError],
  );

  // Start audit
  const startAudit = useCallback(
    async (url: string, productId?: string) => {
      if (isRunningRef.current) return;
      isRunningRef.current = true;

      // Use provided productId or fallback to default
      const effectiveProductId = productId || defaultProductId;
      const effectiveIsGuest = isGuest && !effectiveProductId;

      // Reset status
      setStatus({
        progress: "content_fetched",
        reportId: null,
        overallScore: null,
        data: null,
        error: null,
        failedAt: null,
        contentSummary: null,
      });

      try {
        // Step 1: Init + Content
        let initResponse;
        try {
          initResponse = await fetch("/api/sio-audit/steps/init", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              url,
              productId: effectiveProductId,
              isGuest: effectiveIsGuest,
            }),
          });
        } catch (networkError: any) {
          throw new Error("Network error: Unable to connect to audit service");
        }

        const initData = await initResponse.json();

        if (!initResponse.ok) {
          // Check if it's a cached report
          if (initResponse.status === 409 && initData.cached) {
            // Fetch the cached report
            try {
              const statusResponse = await fetch(
                `/api/sio-audit/status/${initData.existingReportId}`,
              );
              const statusData = await statusResponse.json();

              if (statusData.data) {
                setStatus({
                  progress: "complete",
                  reportId: initData.existingReportId,
                  overallScore: statusData.overallScore,
                  data: statusData.data,
                  error: null,
                  failedAt: null,
                  contentSummary: null,
                });
                onComplete?.(statusData.data);
                isRunningRef.current = false;
                return;
              }
            } catch (cacheError: any) {
              throw new Error("Failed to fetch cached report");
            }
          }

          throw new Error(
            initData.error || initData.message || "Failed to initialize audit",
          );
        }

        const reportId = initData.reportId;

        setStatus((prev) => ({
          ...prev,
          reportId,
          contentSummary: initData.contentSummary,
        }));

        // Also trigger next steps sequentially
        await runStep("summary", reportId, effectiveIsGuest);
      } catch (error: any) {
        isRunningRef.current = false;
        const errorMessage = error.message || "Failed to start audit";
        setStatus((prev) => ({
          ...prev,
          progress: "failed",
          error: errorMessage,
          failedAt: prev.failedAt || "init",
        }));
        onError?.(errorMessage);
      }
    },
    [defaultProductId, isGuest, runStep, onComplete, onError],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearPolling();
    };
  }, [clearPolling]);

  return {
    status,
    startAudit,
    isRunning: isRunningRef.current,
    isComplete: status.progress === "complete",
    isFailed: status.progress === "failed",
    isIdle: status.progress === "idle",
    clearPolling,
  };
}
