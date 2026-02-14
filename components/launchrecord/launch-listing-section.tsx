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
  const slots = Array.from({ length: 5 }, (_, index) => placements[index]);

  return (
    <div className="space-y-3">
      {slots.map((placement, index) => {
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
  return (
    <section className="mx-auto grid w-full max-w-7xl gap-4 px-4 pb-10 sm:px-6 lg:grid-cols-[260px_1fr_260px]">
      <aside className="hidden lg:block">
        <TenPlacementCards placements={leftPlacements} />
      </aside>

      <main className="space-y-4 rounded-2xl border bg-card p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <Input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search by launch name or description"
          />
          <Select
            value={category}
            onValueChange={(value) =>
              onCategoryChange(value as LaunchListingSectionProps["category"])
            }
          >
            <SelectTrigger className="w-full md:w-56">
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
          <div className="space-y-3">
            {launches.map((launch) => (
              <LaunchCard key={launch._id} launch={launch} />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between border-t pt-4">
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
        <TenPlacementCards placements={rightPlacements} />
      </aside>
    </section>
  );
}
