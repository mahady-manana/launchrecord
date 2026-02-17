"use client";

import { useClickStore } from "@/stores/use-click.store";
import { useCallback, useEffect, useRef } from "react";

interface UseClickTrackingOptions {
  productId: string;
  enabled?: boolean;
  onRecordSuccess?: (data: any) => void;
  onRecordError?: (error: string) => void;
}

interface UseClickTrackingReturn {
  startTracking: () => void;
  stopTracking: () => void;
  recordClick: (type?: "click" | "outbound") => Promise<boolean>;
  isTracking: boolean;
  hasRecorded: boolean;
  dwellTime: number;
  loading: boolean;
  error: string | null;
}

// Generate a unique session ID (persists for the browser session)
function getSessionId(): string {
  if (typeof window === "undefined") {
    return "server-session";
  }

  let sessionId = sessionStorage.getItem("click_session_id");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem("click_session_id", sessionId);
  }
  return sessionId;
}

export function useClickTracking({
  productId,
  enabled = true,
  onRecordSuccess,
  onRecordError,
}: UseClickTrackingOptions): UseClickTrackingReturn {
  const store = useClickStore();
  const visibilityRef = useRef<boolean>(true);
  const startTimeRef = useRef<number | null>(null);
  const trackingRef = useRef<boolean>(false);
  const recordedRef = useRef<boolean>(false);

  // Initialize product state
  useEffect(() => {
    if (enabled && productId) {
      store.initializeProduct(productId);
    }
  }, [productId, enabled]);

  // Track visibility changes
  useEffect(() => {
    if (!enabled || !productId) return;

    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === "visible";
      visibilityRef.current = isVisible;
      store.setVisibility(productId, isVisible);

      // If tab becomes hidden, record the dwell time up to this point
      if (!isVisible && startTimeRef.current !== null && trackingRef.current) {
        const dwellTime = Date.now() - startTimeRef.current;
        store.setDwellTime(productId, dwellTime);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [productId, enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (trackingRef.current && startTimeRef.current !== null) {
        const dwellTime = Date.now() - startTimeRef.current;
        store.setDwellTime(productId, dwellTime);
      }
    };
  }, [productId]);

  const startTracking = useCallback(() => {
    if (!enabled || !productId || trackingRef.current) return;

    trackingRef.current = true;
    startTimeRef.current = Date.now();
    store.setStartTime(productId, startTimeRef.current);
    store.setVisibility(productId, document.visibilityState === "visible");
  }, [productId, enabled]);

  const stopTracking = useCallback(() => {
    if (!enabled || !productId || !trackingRef.current) return;

    const dwellTime = Date.now() - startTimeRef.current!;
    store.setDwellTime(productId, dwellTime);
    trackingRef.current = false;
  }, [productId, enabled]);

  const recordClick = useCallback(
    async (type: "click" | "outbound" = "click"): Promise<boolean> => {
      if (!enabled || !productId) return false;

      const state = store.productStates.get(productId);
      if (state?.recorded) {
        return false;
      }

      // Calculate final dwell time
      const dwellTime = startTimeRef.current
        ? Date.now() - startTimeRef.current
        : 0;

      // Check if tab is visible
      if (!visibilityRef.current) {
        return false;
      }

      store.setLoading(productId, true);
      store.setError(productId, null);

      try {
        const sessionId = getSessionId();
        const response = await fetch("/api/record", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
            sessionId,
            type,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to record click");
        }

        if (result.success && !result.duplicate) {
          store.markAsRecorded(productId);
          recordedRef.current = true;

          return true;
        } else if (result.duplicate) {
          store.markAsRecorded(productId);
          recordedRef.current = true;

          return false;
        }

        return false;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";

        store.setError(productId, errorMessage);
        onRecordError?.(errorMessage);
        return false;
      } finally {
        store.setLoading(productId, false);
        trackingRef.current = false;
      }
    },
    [productId, enabled, onRecordSuccess, onRecordError],
  );

  // Get current state from store
  const state = store.productStates.get(productId);

  return {
    startTracking,
    stopTracking,
    recordClick,
    isTracking: trackingRef.current,
    hasRecorded: state?.recorded || recordedRef.current || false,
    dwellTime: state?.dwellTime || 0,
    loading: state?.loading || false,
    error: state?.error || null,
  };
}

/**
 * Hook to fetch click statistics for a product
 */
export function useClickStats(productId: string, enabled: boolean = true) {
  const store = useClickStore();

  useEffect(() => {
    if (!enabled || !productId) return;

    const fetchStats = async () => {
      const cached = store.getCachedData(productId);
      if (cached) return;

      try {
        const response = await fetch(`/api/record?productId=${productId}`);
        const result = await response.json();

        if (result.success && result.data) {
          store.setClickData(productId, result.data);
        }
      } catch (error) {
        console.error("Failed to fetch click stats:", error);
      }
    };

    fetchStats();
  }, [productId, enabled]);

  return store.getCachedData(productId);
}
