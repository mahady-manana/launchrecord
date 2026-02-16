"use client";

import { mockFeaturedPlacements, mockPlacements } from "@/mocks/launch.mocks";
import { slotsLeft, slotsRight } from "@/services/slots-ids";
import { useLaunchStore } from "@/stores/use-launch.store";
import { Placement } from "@/types/placement";
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
        const mocks = mockPlacements;
        const mocksHero = mockFeaturedPlacements;

        if (result.success && result.placements) {
          const allPlacements: Placement[] = result.placements;
          const heroPlacements = allPlacements.filter(
            (p) =>
              p.codeName === "HERO-001" ||
              p.codeName === "HERO-002" ||
              p.codeName === "HERO-003",
          );
          const leftPlacements = allPlacements.filter((p) =>
            slotsLeft.includes(p.codeName),
          );
          const rightPlacements = allPlacements.filter((p) =>
            slotsRight.includes(p.codeName),
          );

          const heroes = [...heroPlacements, ...mocksHero].slice(0, 2);
          const lefts = [...leftPlacements, ...mocks].slice(0, 4);
          const rights = [...rightPlacements, ...mocks].slice(0, 4);

          setPlacementsData({
            heroPlacements: heroes,
            leftPlacements: lefts,
            rightPlacements: rights,
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
  }, []);

  return null;
}
