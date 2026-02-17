"use client";

import { LaunchCard } from "@/components/launchrecord/launch-card";
import { PlacementCard } from "@/components/launchrecord/placement-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LAUNCH_CATEGORIES, Launch, PaginationMeta } from "@/types";
import { Placement } from "@/types/placement";
import { useEffect, useState } from "react";

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
  timeFilter: "all" | "today" | "week" | "month";
  prelaunchOnly: boolean;
  isLoading: boolean;
  onQueryChange: (query: string) => void;
  onCategoryChange: (
    category:
      | "all"
      | (typeof LAUNCH_CATEGORIES)[number]
      | (typeof LAUNCH_CATEGORIES)[number][],
  ) => void;
  onTimeFilterChange: (timeFilter: "all" | "today" | "week" | "month") => void;
  onPrelaunchOnlyChange: (prelaunchOnly: boolean) => void;
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

interface SidebarFiltersProps {
  category:
    | "all"
    | (typeof LAUNCH_CATEGORIES)[number]
    | (typeof LAUNCH_CATEGORIES)[number][];
  timeFilter: "all" | "today" | "week" | "month";
  prelaunchOnly: boolean;
  onCategoryChange: (
    category:
      | "all"
      | (typeof LAUNCH_CATEGORIES)[number]
      | (typeof LAUNCH_CATEGORIES)[number][],
  ) => void;
  onTimeFilterChange: (timeFilter: "all" | "today" | "week" | "month") => void;
  onPrelaunchOnlyChange: (prelaunchOnly: boolean) => void;
}

function SidebarFilters({
  category,
  timeFilter,
  prelaunchOnly,
  onCategoryChange,
  onTimeFilterChange,
  onPrelaunchOnlyChange,
}: SidebarFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
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

  return (
    <div className="space-y-4 mb-4">
      {/* Time Filter */}
      <div>
        <h4 className="text-sm font-medium mb-2">Time Filter</h4>
        <div className="space-y-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="timeFilter"
              checked={timeFilter === "all"}
              onChange={() => onTimeFilterChange("all")}
              className="h-4 w-4"
            />
            <span className="text-sm">All time</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="timeFilter"
              checked={timeFilter === "today"}
              onChange={() => onTimeFilterChange("today")}
              className="h-4 w-4"
            />
            <span className="text-sm">Today</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="timeFilter"
              checked={timeFilter === "week"}
              onChange={() => onTimeFilterChange("week")}
              className="h-4 w-4"
            />
            <span className="text-sm">This week</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="timeFilter"
              checked={timeFilter === "month"}
              onChange={() => onTimeFilterChange("month")}
              className="h-4 w-4"
            />
            <span className="text-sm">This month</span>
          </label>
        </div>
      </div>

      {/* Prelaunch Filter */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={prelaunchOnly}
            onChange={() => onPrelaunchOnlyChange(!prelaunchOnly)}
            className="h-4 w-4"
          />
          <span className="text-sm font-medium">Prelaunch only</span>
        </label>
      </div>

      {/* Categories Filter */}
      <div>
        <h4 className="text-sm font-medium mb-2">Categories</h4>
        <div
          className={`space-y-1 ${!isExpanded ? "max-h-[400px] overflow-hidden relative" : ""}`}
        >
          {/* Select All Categories - means no filter */}
          <label className="flex items-center gap-2 cursor-pointer font-medium">
            <input
              type="checkbox"
              checked={localCategories.length === 0}
              onChange={(e) => {
                if (e.target.checked) {
                  setLocalCategories([]);
                  onCategoryChange("all");
                }
              }}
              className="h-4 w-4"
            />
            <span className="text-sm">All categories</span>
          </label>

          <div className={!isExpanded ? "mask-image-gradient" : ""}>
            {LAUNCH_CATEGORIES.map((cat) => (
              <label
                key={cat}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={localCategories.includes(cat)}
                  onChange={() => handleCategoryToggle(cat)}
                  className="h-4 w-4"
                />
                <span className="text-sm">{cat}</span>
              </label>
            ))}
          </div>
          {!isExpanded && (
            <>
              <div
                className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none"
                style={{ maxHeight: "80px" }}
              />
              <Button
                variant="link"
                className="w-full mt-2"
                onClick={() => setIsExpanded(true)}
              >
                Expand all categories
              </Button>
            </>
          )}
        </div>
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
  timeFilter,
  prelaunchOnly,
  isLoading,
  onQueryChange,
  onCategoryChange,
  onTimeFilterChange,
  onPrelaunchOnlyChange,
  onPageChange,
}: LaunchListingSectionProps) {
  // Local state for the search input with debouncing
  const [localQuery, setLocalQuery] = useState(query);
  const [debouncedQuery, setDebouncedQuery] = useState(query);

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
  return (
    <section className="mx-auto grid w-full max-w-8xl gap-4 px-4 pb-10 sm:px-10 lg:grid-cols-[260px_1fr_260px]">
      <aside className="hidden lg:block">
        <div className="sticky top-20 space-y-4">
          <SidebarFilters
            category={category}
            timeFilter={timeFilter}
            prelaunchOnly={prelaunchOnly}
            onCategoryChange={onCategoryChange}
            onTimeFilterChange={onTimeFilterChange}
            onPrelaunchOnlyChange={onPrelaunchOnlyChange}
          />
          {/* <TenPlacementCards placements={leftPlacements} /> */}
        </div>
      </aside>

      <main className="space-y-4 py-4 bg-card px-0 rounded-xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-center px-6">
          <Input
            value={localQuery}
            onChange={(event) => {
              // Update local state immediately
              setLocalQuery(event.target.value);
            }}
            placeholder="Search by launch name or description (min 3 chars)"
            className="md:w-1/3"
          />

          <div className="flex flex-wrap gap-2 md:gap-3">
            <Select
              value={category as unknown as string}
              onValueChange={(value) =>
                onCategoryChange(value as LaunchListingSectionProps["category"])
              }
            >
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {LAUNCH_CATEGORIES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={timeFilter}
              onValueChange={(value) =>
                onTimeFilterChange(value as "all" | "today" | "week" | "month")
              }
            >
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Time filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This week</SelectItem>
                <SelectItem value="month">This month</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant={prelaunchOnly ? "default" : "outline"}
              onClick={() => onPrelaunchOnlyChange(!prelaunchOnly)}
              className="w-full md:w-auto"
            >
              Prelaunch
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setLocalQuery("");
                onQueryChange("");
                onCategoryChange("all");
                onTimeFilterChange("all");
                onPrelaunchOnlyChange(false);
              }}
              className="w-full md:w-auto"
            >
              Clear All
            </Button>
          </div>
        </div>

        {isLoading ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Loading launches...
          </p>
        ) : launches.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No launches found for this filter.
          </p>
        ) : (
          <>
            <div className="">
              {launches.map((launch) => (
                <LaunchCard key={launch._id} launch={launch} />
              ))}
            </div>
          </>
        )}

        <div className="flex items-center justify-between pt-4">
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
      </main>

      <aside className="hidden lg:block">
        <div className="sticky top-20">
          <TenPlacementCards placements={rightPlacements} />
        </div>
      </aside>
    </section>
  );
}
