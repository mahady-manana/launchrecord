import { FeaturedPlacementCard } from "@/components/launchrecord/featured-placement-card";
import { Button } from "@/components/ui/button";
import { Placement } from "@/types/placement";
import { ArrowRight, Info } from "lucide-react";

interface HeroSectionProps {
  heroPlacements: Placement[];
  onOpenLaunchModal: () => void;
}

export function HeroSection({
  heroPlacements,
  onOpenLaunchModal,
}: HeroSectionProps) {
  return (
    <section className="mx-auto grid w-full max-w-8xl gap-4 px-4 py-8 sm:px-6 lg:grid-cols-3">
      <div className="p-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-primary">
          Build in public
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Launch your product. Get discovered. Gain momentum.
        </h1>
        <p className="my-4 text-sm text-muted-foreground">
          Get discovered by founders, makers, and early adopters. No tedious
          forms, instant visibility.
        </p>
        <p className="flex items-center text-xs gap-4 bg-blue-900 p-2 px-4 rounded-lg">
          <Info />
          <span>
            Every new product gets a fair shot. LaunchRecord rewards quality and
            real engagement — not popularity contests or upvote games.
          </span>
        </p>
      </div>
      <FeaturedPlacementCard placements={heroPlacements} />

      <div className="p-4">
        <h2 className="text-lg font-semibold">Ready to launch?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Submit now to appear in listings, featured placements, and upcoming
          curated collections.
        </p>
        <div>
          <ul className="text-sm py-4">
            <li>🧑‍💻 Built by founders, for founders.</li>
            <li>🚀 Free featured placement.</li>
            <li>🔗 Real traffic. Real backlink.</li>
            <li>🌍 Permanent launch page.</li>
            <li>📊 No vanity metrics.</li>
          </ul>
        </div>
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
