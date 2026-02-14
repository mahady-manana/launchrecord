"use client";

import { HeroSection } from "@/components/launchrecord/hero-section";
import { LaunchListingSection } from "@/components/launchrecord/launch-listing-section";
import { LaunchModal } from "@/components/launchrecord/launch-modal";
import { Navbar } from "@/components/launchrecord/navbar";
import { useLaunches } from "@/hooks/use-launches";
import { useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface HomePageProps {
  initialQuery?: string;
}

export function HomePage({ initialQuery }: HomePageProps) {
  const router = useRouter();
  const { user, authStatus } = useUser();
  const launchStore = useLaunches();
  const [isLaunchModalOpen, setLaunchModalOpen] = useState(false);
  const hasSyncedInitialQuery = useRef(false);

  useEffect(() => {
    if (hasSyncedInitialQuery.current) {
      return;
    }

    hasSyncedInitialQuery.current = true;

    const query = initialQuery?.trim();

    if (query) {
      launchStore.setQuery(query);
    }
  }, [initialQuery, launchStore]);

  const handleOpenLaunchModal = () => {
    if (authStatus !== "authenticated") {
      router.push("/auth/signin?callbackUrl=/");
      return;
    }

    setLaunchModalOpen(true);
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <Navbar
        query={launchStore.filters.query}
        onQueryChange={launchStore.setQuery}
        onOpenLaunchModal={handleOpenLaunchModal}
        user={user}
        authStatus={authStatus}
      />

      <HeroSection
        heroPlacements={launchStore.heroPlacements}
        onOpenLaunchModal={handleOpenLaunchModal}
      />

      <LaunchListingSection
        launches={launchStore.launches}
        leftPlacements={launchStore.leftPlacements}
        rightPlacements={launchStore.rightPlacements}
        pagination={launchStore.launchesPagination}
        query={launchStore.filters.query}
        category={launchStore.filters.category}
        isLoading={launchStore.launchesLoading}
        onQueryChange={launchStore.setQuery}
        onCategoryChange={launchStore.setCategory}
        onPageChange={launchStore.setLaunchesPage}
      />

      <LaunchModal
        open={isLaunchModalOpen}
        onOpenChange={setLaunchModalOpen}
        onSubmit={launchStore.createLaunch}
        onCompleteDetails={launchStore.updateLaunch}
      />
    </div>
  );
}
