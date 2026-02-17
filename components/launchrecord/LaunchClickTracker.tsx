"use client";

import { useClickTracking } from "@/hooks/use-click-tracking";
import { useEffect, useRef } from "react";

interface LaunchClickTrackerProps {
  productId: string;
  enabled?: boolean;
}

const DWELL_TIME_THRESHOLD = 5000; // 7 seconds

/**
 * Click tracking component for launch pages
 * - Records a visit click automatically after dwell time threshold
 * - Records outbound clicks when user clicks external links
 */
export function LaunchClickTracker({
  productId,
  enabled = true,
}: LaunchClickTrackerProps) {
  const { recordClick } = useClickTracking({
    productId,
    enabled,
  });

  const trackedRef = useRef(false);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!enabled || !productId) return;

    console.log("[LaunchClickTracker] Initialized for product:", productId);
    startTimeRef.current = Date.now();

    // Record visit automatically after dwell time threshold
    const recordVisit = () => {
      if (trackedRef.current) return;

      const dwellTime = Date.now() - startTimeRef.current;

      if (dwellTime >= DWELL_TIME_THRESHOLD) {
        trackedRef.current = true;
        console.log(
          "[LaunchClickTracker] Recording visit - dwell time:",
          dwellTime,
          "ms",
        );
        recordClick("click");
      } else {
        console.log(
          "[LaunchClickTracker] Skipping visit - dwell time too short:",
          dwellTime,
          "ms",
        );
      }
    };

    // Set timer to automatically record visit after threshold
    const timerId = setTimeout(() => {
      recordVisit();
    }, DWELL_TIME_THRESHOLD);

    // Cleanup: if component unmounts before timer fires, record immediately
    return () => {
      const dwellTime = Date.now() - startTimeRef.current;
      if (!trackedRef.current && dwellTime >= DWELL_TIME_THRESHOLD) {
        // Already qualified, just mark as tracked
        trackedRef.current = true;
      } else if (!trackedRef.current) {
        // Haven't recorded yet and user is leaving - record now
        trackedRef.current = true;
        console.log(
          "[LaunchClickTracker] Unmount - recording visit with dwell time:",
          dwellTime,
          "ms",
        );
        recordClick("click");
      }
      clearTimeout(timerId);
    };
  }, [enabled, productId, recordClick]);

  return null;
}

/**
 * Hook to track outbound link clicks (e.g., "Visit Website" button)
 */
export function useOutboundClick(productId: string) {
  const { recordClick } = useClickTracking({
    productId,
    enabled: true,
  });

  const handleOutboundClick = () => {
    console.log("[OutboundClick] Recording outbound click for:", productId);
    recordClick("outbound");
  };

  return handleOutboundClick;
}
