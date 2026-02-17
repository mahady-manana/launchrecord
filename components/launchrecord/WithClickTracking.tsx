"use client";

import { useClickTracking } from "@/hooks/use-click-tracking";
import React, { ReactNode, useCallback, useEffect } from "react";

interface WithClickTrackingProps {
  productId: string;
  children?: ReactNode;
  onRecordSuccess?: (data: any) => void;
  onRecordError?: (error: string) => void;
  enabled?: boolean;
}

/**
 * Higher-order component wrapper for click tracking
 * Automatically tracks dwell time and records clicks when user navigates away
 */
export function WithClickTracking({
  productId,
  children,
  onRecordSuccess,
  onRecordError,
  enabled = true,
}: WithClickTrackingProps) {
  const { startTracking, stopTracking, recordClick } = useClickTracking({
    productId,
    enabled,
    onRecordSuccess,
    onRecordError,
  });

  // Start tracking when component mounts
  useEffect(() => {
    if (enabled) {
      startTracking();
    }

    // Record click on page unload/navigation
    const handleBeforeUnload = () => {
      stopTracking();
      recordClick("click");
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        stopTracking();
        recordClick("click");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopTracking();
    };
  }, [enabled]);

  return <>{children}</>;
}

/**
 * Hook for tracking outbound link clicks
 * Use this on external links to track outbound clicks
 */
export function useOutboundClickTracker(productId: string) {
  const { recordClick } = useClickTracking({ productId, enabled: true });

  const handleOutboundClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      // Record the outbound click
      recordClick("outbound");
      // Note: We don't prevent default - let the navigation happen
    },
    [recordClick],
  );

  return handleOutboundClick;
}
