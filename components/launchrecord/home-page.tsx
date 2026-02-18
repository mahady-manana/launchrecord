"use client";

import { HeroSection } from "@/components/launchrecord/hero-section";
import { LaunchListingSection } from "@/components/launchrecord/launch-listing-section";
import { LaunchModal } from "@/components/launchrecord/launch-modal";
import { Navbar } from "@/components/launchrecord/navbar";
import { useLaunches } from "@/hooks/use-launches";
import { useUser } from "@/hooks/use-user";
import { Launch, PaginationMeta } from "@/types";
import { MessageCircle, Rocket, TrendingUp, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface HomePageProps {
  initialQuery?: string;
  initialLaunches: Launch[];
  initialPagination: PaginationMeta;
}

export function HomePage({
  initialQuery,
  initialLaunches,
  initialPagination,
}: HomePageProps) {
  const router = useRouter();
  const { user, authStatus } = useUser();
  const launchStore = useLaunches();
  const [isLaunchModalOpen, setLaunchModalOpen] = useState(false);
  const hasInitialized = useRef(false);

  // Initialize store with server-fetched data
  useEffect(() => {
    if (hasInitialized.current) {
      return;
    }
    hasInitialized.current = true;

    // Set initial query if provided
    const query = initialQuery?.trim();
    if (query) {
      launchStore.setQuery(query);
    }
  }, [initialPagination, initialQuery, launchStore]);

  const handleOpenLaunchModal = () => {
    if (authStatus !== "authenticated") {
      router.push("/auth/signin?callbackUrl=/");
      return;
    }

    setLaunchModalOpen(true);
  };

  const handleCTAClick = () => {
    if (authStatus !== "authenticated") {
      router.push("/auth/signin?callbackUrl=/");
      return;
    }
    handleOpenLaunchModal();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <Navbar
        query={launchStore.filters.query}
        onQueryChange={launchStore.setQuery}
        user={user}
        authStatus={authStatus}
      />

      <HeroSection
        heroPlacements={launchStore.heroPlacements}
        onOpenLaunchModal={handleOpenLaunchModal}
      />

      <LaunchListingSection
        launches={
          launchStore.launches.length ? launchStore.launches : initialLaunches
        }
        featuredLaunches={launchStore.featuredLaunches}
        leftPlacements={launchStore.leftPlacements}
        rightPlacements={launchStore.rightPlacements}
        pagination={launchStore.launchesPagination}
        query={launchStore.filters.query}
        category={launchStore.filters.category}
        isLoading={launchStore.launchesLoading}
        onQueryChange={launchStore.setQuery}
        onCategoryChange={launchStore.setCategory as unknown as any}
        onPageChange={launchStore.setLaunchesPage}
      />

      {/* CTA + Info Section */}
      <section className="border-t border-gray-800 bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Info Section */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">
                Discover Amazing Products
              </h2>
              <p className="text-gray-400 leading-relaxed">
                LaunchRecord is your go-to platform for discovering the latest
                and greatest products, startups, and tools. Join our community
                of makers and early adopters to stay ahead of the curve.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Rocket className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">New Launches</h3>
                    <p className="text-sm text-gray-400">
                      Fresh products daily
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Trending</h3>
                    <p className="text-sm text-gray-400">Hot products rising</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Community</h3>
                    <p className="text-sm text-gray-400">Connect with makers</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Discussions</h3>
                    <p className="text-sm text-gray-400">Share your thoughts</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="flex flex-col justify-center">
              <div className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Ready to Launch Your Product?
                </h3>
                <p className="text-gray-400 mb-6">
                  Share your product with thousands of early adopters and get
                  the feedback you need to succeed.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-gray-300">
                    <svg
                      className="h-5 w-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Reach engaged audience
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <svg
                      className="h-5 w-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Get valuable feedback
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <svg
                      className="h-5 w-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Boost your visibility
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <svg
                      className="h-5 w-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Free to get started
                  </li>
                </ul>
                <button
                  onClick={handleCTAClick}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25"
                >
                  <Rocket className="h-5 w-5" />
                  Launch Your Product
                </button>
                <p className="text-xs text-gray-500 text-center mt-4">
                  Join {authStatus === "authenticated" ? "our" : "the"}{" "}
                  community of makers today
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LaunchModal
        open={isLaunchModalOpen}
        onOpenChange={setLaunchModalOpen}
        onSubmit={launchStore.createLaunch}
        onCompleteDetails={launchStore.updateLaunch}
      />
    </div>
  );
}
