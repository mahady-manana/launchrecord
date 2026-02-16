"use client";

import { useLaunchActions } from "@/hooks/use-launch-actions";
import { useLaunchStore } from "@/stores/use-launch.store";
import { useEffect } from "react";

export function useLaunches() {
  const store = useLaunchStore();
  const actions = useLaunchActions();

  useEffect(() => {
    // Determine if we should use mock data
    const useMockData =
      process.env.NODE_ENV === "development" &&
      typeof window !== "undefined" &&
      localStorage.getItem("useMockData") === "true";

    if (useMockData) {
    } else {
      store.setLaunchesLoading(true);
      store.setPlacementsLoading(true);
      actions
        .fetchLaunches({
          query: store.filters.query,
          category: store.filters.category,
          timeFilter: store.filters.timeFilter,
          prelaunchOnly: store.filters.prelaunchOnly,
          page: store.filters.page,
          limit: store.filters.limit,
        })
        .then((data) => {
          if (data.success) {
            // Separate launches by placement type
            const launches = data.launches || [];

            store.setLaunchesData({
              launches: launches,
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
            store.setError(data.message || "Failed to fetch launches");
          }
        });
    }
  }, [
    store.filters.query,
    store.filters.category,
    store.filters.timeFilter,
    store.filters.prelaunchOnly,
    store.filters.page,
    store.filters.limit,
  ]);

  return {
    ...store,
    createLaunch: actions.createLaunch,
    updateLaunch: actions.updateLaunch,
    fetchLaunches: actions.fetchLaunches,
    setTimeFilter: store.setTimeFilter,
    setPrelaunchOnly: store.setPrelaunchOnly,
  };
}
