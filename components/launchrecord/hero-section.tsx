import { FeaturedPlacementCard } from "@/components/launchrecord/featured-placement-card";
import { Button } from "@/components/ui/button";
import { Placement } from "@/types/placement";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  heroPlacements: Placement[];
  onOpenLaunchModal: () => void;
}

export function HeroSection({
  heroPlacements,
  onOpenLaunchModal,
}: HeroSectionProps) {
  return (
    <section className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-8 sm:px-6 lg:grid-cols-3">
      <div className="rounded-2xl border bg-card p-6">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-primary">
          Launch in public
        </p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Get Your First Customers, Sales, Traffic and a free Backlink
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Get discovered by founders, makers, and early adopters. No tedious
          forms, instant visibility.
        </p>
      </div>

      <FeaturedPlacementCard placements={heroPlacements} />

      <div className="rounded-2xl border bg-card p-6">
        <h2 className="text-lg font-semibold">Ready to launch?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Submit now to appear in listings, featured placements, and upcoming
          curated collections.
        </p>
        <Button
          className="mt-5 w-full justify-between"
          onClick={onOpenLaunchModal}
        >
          Submit new launch
          <ArrowRight className="h-4 w-4" />
        </Button>
        <p className="mt-4 text-xs text-muted-foreground">
          MVP includes launch listings, filters, placements, and authentication.
        </p>
      </div>
    </section>
  );
}
