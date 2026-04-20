"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type Audit2Progress =
  | "idle"
  | "content_fetched"
  | "issues_generated"
  | "scoring_complete"
  | "complete"
  | "failed";

export interface SIOV2Report {
  reportId: string;
  version: 2;
  url: string;
  overallScore: number;
  statement: string;
  firstImpression: string;
  reportBand: "Dominant" | "Strong" | "Average" | "Weak" | "Ghost";
  websiteSummary: {
    overview: string;
    problems: string[];
    solutions: string[];
  };
  issues: Array<{
    id: string;
    category: "positioning" | "clarity" | "first_impression" | "aeo";
    metricKey?:
      | "headline"
      | "subheadline"
      | "cta"
      | "category_ownership"
      | "unique_value_proposition"
      | "competitive_differentiation"
      | "target_audience"
      | "problem_solution_fit"
      | "messaging_consistency"
      | "headline_clarity"
      | "value_proposition"
      | "feature_benefit_mapping"
      | "visual_hierarchy"
      | "cta_clarity"
      | "proof_placement";
    severity: "critical" | "medium" | "low";
    statement: string;
    explanation?: string;
    current?: string;
    recommendations: string[];
    fixes: string[];
    isVisibleInFree?: boolean;
    isFixLocked?: boolean;
    impactScore?: number;
  }>;
  strengths: Array<{
    statement: string;
    impact: string;
  }>;
  scoring: {
    overall: number;
    positioning: number;
    clarity: number;
    first_impression: number;
    aeo: number;
  };
  categoryInsights: {
    positioning: { statement: string; summary: string };
    clarity: { statement: string; summary: string };
    first_impression: { statement: string; summary: string };
    aeo: { statement: string; summary: string };
  };
  progress: Audit2Progress;
  createdAt?: string;
  updatedAt?: string;
}

export interface Audit2Status {
  progress: Audit2Progress;
  reportId: string | null;
  overallScore: number | null;
  data: SIOV2Report | null;
  error: string | null;
  failedAt: string | null;
  contentSummary: {
    contentLength: number | null;
    hasSitemap: boolean | null;
    hasRobots: boolean | null;
  } | null;
}

export interface UseAudit2Options {
  productId?: string;
  isGuest?: boolean;
  pollInterval?: number;
  onComplete?: (report: SIOV2Report) => void;
  onError?: (error: string) => void;
  onLimitReached?: (error: {
    message: string;
    limitType?: string;
    used?: number;
    limit?: number;
    resetAt?: string | null;
    upgradeRequired?: boolean;
  }) => void;
}

export function useAudit2(options: UseAudit2Options = {}) {
  const {
    productId: defaultProductId,
    isGuest = true,
    pollInterval = 2000,
    onComplete,
    onError,
    onLimitReached,
  } = options;

  const onCompleteRef = useRef(onComplete);
  const onErrorRef = useRef(onError);
  const onLimitReachedRef = useRef(onLimitReached);
  const hasCalledLimitReachedRef = useRef(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onErrorRef.current = onError;
    onLimitReachedRef.current = onLimitReached;
  }, [onComplete, onError, onLimitReached]);

  const [status, setStatus] = useState<Audit2Status>({
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

  const clearPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

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

        if (data.progress === "complete") {
          clearPolling();
          isRunningRef.current = false;
          onCompleteRef.current?.(data.data);
        } else if (data.progress === "failed") {
          clearPolling();
          isRunningRef.current = false;
          if (data.failedAt === "limit_reached" || data.limitReached) {
            if (!hasCalledLimitReachedRef.current) {
              hasCalledLimitReachedRef.current = true;
              onLimitReachedRef.current?.({
                message: data.errorMessage || "Audit limit reached",
                limitType: data.limitType,
                used: data.used,
                limit: data.limit,
                resetAt: data.resetAt,
                upgradeRequired: data.upgradeRequired,
              });
            }
          } else {
            onErrorRef.current?.(data.errorMessage);
          }
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
        onErrorRef.current?.(error.message);
      }
    },
    [clearPolling, onComplete, onError, pollInterval],
  );

  const runStep = useCallback(
    async (step: string, reportId: string, stepIsGuest: boolean) => {
      try {
        let response;
        try {
          response = await fetch(`/api/sio-audit/v2/${step}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reportId, isGuest: stepIsGuest }),
          });
        } catch (networkError: any) {
          throw new Error(`Network error: Unable to connect during ${step}`);
        }

        const data = await response.json();

        if (!response.ok) {
          if (data.limitReached) {
            isRunningRef.current = false;
            clearPolling();
            hasCalledLimitReachedRef.current = true;
            setStatus({
              progress: "failed",
              reportId: null,
              overallScore: null,
              data: null,
              error: null,
              failedAt: "limit_reached",
              contentSummary: null,
            });
            onLimitReachedRef.current?.({
              message: data.error || data.message || "Audit limit reached",
              limitType: data.limitType,
              used: data.used,
              limit: data.limit,
              resetAt: data.resetAt,
              upgradeRequired: data.upgradeRequired,
            });
            return;
          }
          throw new Error(data.error || `Failed at ${step}`);
        }

        setStatus((prev) => ({
          ...prev,
          progress: data.progress,
          overallScore:
            data.data?.overallScore || data.overallScore || prev.overallScore,
          data: data.data || prev.data,
        }));

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
            onCompleteRef.current?.(data.data);
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
          onErrorRef.current?.(data.error || "Audit failed");
        }
      } catch (error: any) {
        isRunningRef.current = false;
        clearPolling();
        const errorMessage = error.message || "Audit failed";
        const failedAtMap: Record<string, string> = {
          "summary-and-issues": "v2_summary_and_issues",
          "scoring-fixes": "v2_scoring_and_fixes",
          "validation-improvement": "v2_validation_improvement",
        };
        setStatus((prev) => ({
          ...prev,
          progress: "failed",
          error: errorMessage,
          failedAt: failedAtMap[step] || step,
        }));
        onErrorRef.current?.(errorMessage);
      }
    },
    [clearPolling, onComplete, onError, pollInterval, pollStatus],
  );

  const startAudit = useCallback(
    async (url: string, productId?: string) => {
      if (isRunningRef.current) return;
      isRunningRef.current = true;
      hasCalledLimitReachedRef.current = false;

      const effectiveProductId = productId || defaultProductId;
      const effectiveIsGuest = isGuest && !effectiveProductId;

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
        let initResponse;
        try {
          initResponse = await fetch("/api/sio-audit/v2/init", {
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
          if (initData.limitReached) {
            isRunningRef.current = false;
            clearPolling();
            hasCalledLimitReachedRef.current = true;
            setStatus({
              progress: "failed",
              reportId: null,
              overallScore: null,
              data: null,
              error: null,
              failedAt: "limit_reached",
              contentSummary: null,
            });
            onLimitReachedRef.current?.({
              message:
                initData.error || initData.message || "Audit limit reached",
              limitType: initData.limitType,
              used: initData.used,
              limit: initData.limit,
              resetAt: initData.resetAt,
              upgradeRequired: initData.upgradeRequired,
            });
            return;
          }

          if (initResponse.status === 409 && initData.cached) {
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
                onCompleteRef.current?.(statusData.data);
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

        await runStep("summary-and-issues", reportId, effectiveIsGuest);
      } catch (error: any) {
        isRunningRef.current = false;
        const errorMessage = error.message || "Failed to start audit";
        setStatus((prev) => ({
          ...prev,
          progress: "failed",
          error: errorMessage,
          failedAt: prev.failedAt || "init",
        }));
        onErrorRef.current?.(errorMessage);
      }
    },
    [defaultProductId, isGuest, runStep, onComplete, onError],
  );

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
