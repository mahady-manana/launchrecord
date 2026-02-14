"use client";

import { useLaunchStore } from "@/stores/use-launch.store";
import { useEffect } from "react";

export function PlacementDataLoader() {
  const { setPlacementsData } = useLaunchStore();

  useEffect(() => {
    // Load active placements when the component mounts
    const loadPlacements = async () => {
      try {
        // Fetch active placements from the public API
        const response = await fetch("/api/placements/public-active");
        const result = await response.json();

        if (result.success && result.placements) {
          // Separate placements by position
          const allPlacements = result.placements;
          const heroPlacements = allPlacements.filter(
            (p: any) => p.position === "hero",
          );
          const leftPlacements = allPlacements.filter(
            (p: any) => p.position === "left",
          );
          const rightPlacements = allPlacements.filter(
            (p: any) => p.position === "right",
          );

          setPlacementsData({
            heroPlacements,
            leftPlacements,
            rightPlacements,
            pagination: {
              page: 1,
              limit: 20,
              total: allPlacements.length,
              totalPages: Math.ceil(allPlacements.length / 20),
              hasNextPage: false,
              hasPreviousPage: false,
            },
          });
        }
      } catch (error) {
        console.error("Error loading placements:", error);
      }
    };

    loadPlacements();
  }, [setPlacementsData]);

  return null;
}
