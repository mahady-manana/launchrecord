"use client";

import { usePlacementActions } from "@/hooks/use-placement-actions";
import { useLaunchStore } from "@/stores/use-launch.store";
import { useCallback, useEffect } from "react";

export function usePlacements() {
  const store = useLaunchStore();
  const actions = usePlacementActions();

  const loadPlacements = useCallback(async () => {
    // Determine if we should use mock data
    const useMockData =
      process.env.NODE_ENV === "development" &&
      typeof window !== "undefined" &&
      localStorage.getItem("useMockData") === "true";

    if (useMockData) {
      // Mock data is handled in the store's setMockData function
    } else {
      store.setPlacementsLoading(true);

      try {
        // Fetch all placements
        const data = await actions.fetchPlacements({
          page: store.filters.page,
          limit: store.filters.limit,
        });

        if (data.success) {
          // Separate placements by position
          const allPlacements = data.placements || [];

          const heroPlacements = allPlacements.filter(
            (p) => p.position === "hero",
          );
          const leftPlacements = allPlacements.filter(
            (p) => p.position === "left",
          );
          const rightPlacements = allPlacements.filter(
            (p) => p.position === "right",
          );

          store.setPlacementsData({
            heroPlacements,
            leftPlacements,
            rightPlacements,
            pagination: data.pagination || {
              page: 1,
              limit: 20,
              total: 0,
              totalPages: 1,
              hasNextPage: false,
              hasPreviousPage: false,
            },
          });
        } else {
          store.setError(data.message || "Failed to fetch placements");
        }
      } catch (error) {
        console.error("Error fetching placements:", error);
        store.setError("Failed to fetch placements");
      } finally {
        store.setPlacementsLoading(false);
      }
    }
  }, [actions, store]);

  useEffect(() => {
    // Load placements on mount
    loadPlacements();
  }, [loadPlacements]);

  // Add a function to reload placements when needed
  const refreshPlacements = useCallback(async () => {
    await loadPlacements();
  }, [loadPlacements]);

  return {
    ...store,
    createPlacement: actions.createPlacement,
    updatePlacement: actions.updatePlacement,
    fetchPlacements: actions.fetchPlacements,
    fetchPlacementSlots: actions.fetchPlacementSlots,
    refreshPlacements,
  };
}
