"use client";

import { LaunchCard } from "@/components/launchrecord/launch-card";
import { Button } from "@/components/ui/button";
import { useLaunchStore } from "@/stores/use-launch.store";
import {
  FeaturedLaunch,
  LAUNCH_CATEGORIES,
  Launch,
  PaginationMeta,
} from "@/types";
import { Placement } from "@/types/placement";
import { useEffect, useState } from "react";
import { SidebarRight } from "./sidebar-right";

interface LaunchListingSectionProps {
  launches: Launch[];
  featuredLaunches: FeaturedLaunch[];
  leftPlacements: Placement[];
  rightPlacements: Placement[];
  pagination: PaginationMeta;
  query: string;
  category:
    | "all"
    | (typeof LAUNCH_CATEGORIES)[number]
    | (typeof LAUNCH_CATEGORIES)[number][];
  isLoading: boolean;
  onQueryChange: (query: string) => void;
  onCategoryChange: (
    category:
      | "all"
      | (typeof LAUNCH_CATEGORIES)[number]
      | (typeof LAUNCH_CATEGORIES)[number][],
  ) => void;
  onPageChange: (page: number) => void;
}

interface HorizontalFiltersProps {
  category:
    | "all"
    | (typeof LAUNCH_CATEGORIES)[number]
    | (typeof LAUNCH_CATEGORIES)[number][];
  onCategoryChange: (
    category:
      | "all"
      | (typeof LAUNCH_CATEGORIES)[number]
      | (typeof LAUNCH_CATEGORIES)[number][],
  ) => void;
}

function HorizontalFilters({
  category,
  onCategoryChange,
}: HorizontalFiltersProps) {
  const [localCategories, setLocalCategories] = useState<
    (typeof LAUNCH_CATEGORIES)[number][]
  >([]);

  const handleCategoryToggle = (cat: (typeof LAUNCH_CATEGORIES)[number]) => {
    const newCategories = localCategories.includes(cat)
      ? localCategories.filter((c) => c !== cat)
      : [...localCategories, cat];

    setLocalCategories(newCategories);
    onCategoryChange(newCategories.length === 0 ? "all" : newCategories);
  };

  const isActive = (cat: (typeof LAUNCH_CATEGORIES)[number]) => {
    return localCategories.includes(cat);
  };
  return (
    <div className="mb-6">
      <div
        className={`flex md:flex-col md:items-start px-2 items-center gap-2 flex-wrap relative`}
      >
        <button
          onClick={() => {
            setLocalCategories([]);
            onCategoryChange("all");
          }}
          className={`px-4 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
            localCategories.length === 0
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-gray-600/50 text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <span className="flex items-center gap-1.5">All</span>
        </button>

        {/* Category Pills */}
        {LAUNCH_CATEGORIES.map((cat) => {
          const active = isActive(cat);
          return (
            <button
              key={cat}
              onClick={() => handleCategoryToggle(cat)}
              className={`px-4 py-1 rounded-md whitespace-nowrap
 text-xs font-medium transition-all duration-200 ${
   active
     ? "bg-primary text-primary-foreground shadow-md"
     : "bg-gray-600/50 text-muted-foreground hover:bg-muted/80"
 }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function LaunchListingSection({
  launches,

  pagination,
  query,
  category,
  isLoading,
  onQueryChange,
  onCategoryChange,
  onPageChange,
}: LaunchListingSectionProps) {
  // Local state for the search input with debouncing
  const [localQuery, setLocalQuery] = useState(query);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const featuredLaunches = useLaunchStore((s) => s.featuredLaunches);
  // Debounce the query input
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only trigger search if query is at least 3 characters or empty
      if (localQuery.length >= 3 || localQuery === "") {
        setDebouncedQuery(localQuery);
      }
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [localQuery]);

  // Sync debounced query to parent when it changes
  useEffect(() => {
    if (debouncedQuery !== query) {
      onQueryChange(debouncedQuery);
    }
  }, [debouncedQuery, query, onQueryChange]);

  console.log("====================================");
  console.log({ featuredLaunches });
  console.log("====================================");
  return (
    <section className="max-w-7xl mx-auto py-8 border-gray-800 grid grid-cols-1 lg:grid-cols-3 gap-10 w-full pb-10 px-4">
      <main className="space-y-4 py-4 px-0 md:col-span-2">
        <div className="grid md:grid-cols-[140px_1fr] md:gap-6 ">
          <HorizontalFilters
            category={category}
            onCategoryChange={onCategoryChange}
          />
          <div>
            {isLoading ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                Loading launches...
              </p>
            ) : launches.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No launches found for this filter.
              </p>
            ) : (
              <div>
                <div className="mb-6">
                  <div className="space-y-4">
                    {launches.map((launch) => (
                      <LaunchCard key={launch._id} launch={launch} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 ">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(pagination.page - 1)}
                    disabled={!pagination.hasPreviousPage}
                  >
                    Previous
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Page {pagination.page} of {pagination.totalPages} (
                    {pagination.total} launches)
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(pagination.page + 1)}
                    disabled={!pagination.hasNextPage}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <aside className="hidden lg:block md:col-span-1 py-4">
        <SidebarRight
          featuredLaunches={featuredLaunches.map((f) => f.launch!)}
          todayLaunches={launches}
        ></SidebarRight>
      </aside>
    </section>
  );
}
