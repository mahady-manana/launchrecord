"use client";

import { LaunchCard } from "@/components/launchrecord/launch-card";
import { PlacementCard } from "@/components/launchrecord/placement-card";
import { Button } from "@/components/ui/button";
import { LAUNCH_CATEGORIES, Launch, PaginationMeta } from "@/types";
import { Placement } from "@/types/placement";
import { useEffect, useState } from "react";
import { SidebarRight } from "./sidebar-right";

interface LaunchListingSectionProps {
  launches: Launch[];
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

function TenPlacementCards({ placements }: { placements: Placement[] }) {
  return (
    <div className="space-y-3">
      {placements.map((placement, index) => {
        if (!placement) {
          // Render empty placeholder if no placement exists at this index
          return (
            <div
              key={`placeholder-${index}`}
              className="border-dashed border rounded-xl h-24 flex items-center justify-center bg-muted"
            >
              <span className="text-muted-foreground text-sm">
                Available Slot
              </span>
            </div>
          );
        }

        return <PlacementCard key={placement._id} placement={placement} />;
      })}
    </div>
  );
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
  const [isExpanded, setIsExpanded] = useState(false);

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
        {/* All Categories Button */}
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
  leftPlacements,
  rightPlacements,
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
  const [expandedSections, setExpandedSections] = useState<{
    featured: boolean;
    today: boolean;
    week: boolean;
    month: boolean;
  }>({
    featured: false,
    today: false,
    week: false,
    month: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const ITEMS_PER_SECTION = 3;

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

  const LaunchSection = ({
    title,
    sectionKey,
  }: {
    title: string;
    sectionKey: keyof typeof expandedSections;
  }) => {
    const isExpanded = expandedSections[sectionKey];
    const displayedLaunches = isExpanded
      ? launches
      : launches.slice(0, ITEMS_PER_SECTION);

    return (
      <div className="mb-6">
        <div className="space-y-4">
          {displayedLaunches.map((launch) => (
            <LaunchCard key={launch._id} launch={launch} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="max-w-7xl mx-auto py-8 border-gray-800 grid grid-cols-1 lg:grid-cols-3 gap-6 w-full gap-4 pb-10 px-4">
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
                <LaunchSection title="Featured launch" sectionKey="featured" />
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

      <aside className="hidden lg:block md:col-span-1 px-6 py-4">
        <SidebarRight
          featuredLaunches={launches}
          todayLaunches={launches}
        ></SidebarRight>
      </aside>
    </section>
  );
}
