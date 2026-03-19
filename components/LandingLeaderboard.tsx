import { GradeBadge } from "@/components/GradeBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { appLogo } from "@/lib/logo";
import clsx from "clsx";
import { TrendingUp, Trophy } from "lucide-react";
import Link from "next/link";
import { cache } from "react";

interface LeaderboardEntry {
  _id: string;
  name: string;
  tagline?: string | null;
  website?: string | null;
  logo?: string | null;
  score?: number | null;
  grade?: string;
  rank?: number;
  slug: string;
}

interface Topic {
  _id: string;
  name: string;
  slug: string;
  count: number;
  short_description?: string;
}

const fetchLeaderboard = cache(async (): Promise<LeaderboardEntry[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/leaderboard?limit=12`,
      { cache: "no-store" },
    );
    const data = await response.json();
    if (data.success) {
      return data.data.products;
    }
  } catch (error) {
    console.error("Failed to fetch leaderboard:", error);
  }
  return [];
});

const fetchTopTopics = cache(async (): Promise<Topic[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/topics?top=10`,
      { cache: "no-store" },
    );
    const data = await response.json();
    if (data.success) {
      return data.topics;
    }
  } catch (error) {
    console.error("Failed to fetch topics:", error);
  }
  return [];
});

export async function LandingLeaderboard() {
  const [leaderboardProducts, topTopics] = await Promise.all([
    fetchLeaderboard(),
    fetchTopTopics(),
  ]);

  return (
    <section className="bg-slate-100 pb-10">
      <div>
        {topTopics.length > 0 && (
          <div className="bg-slate-800 overflow-x-auto from-black to-transparent -mx-4 px-4 backdrop-blur-sm">
            <div className="flex gap-0 justify-center">
              {topTopics.map((topic) => (
                <Link
                  key={topic._id}
                  href={`/categories/${topic.slug}`}
                  className="inline-flex text-xs items-center gap-2 px-4 py-2  hover:bg-slate-700 border border-slate-700 text-sm transition-colors whitespace-nowrap"
                >
                  <span className="font-medium text-slate-200">
                    {topic.name}
                  </span>
                  <span className="text-xs text-slate-400">
                    ({topic.count})
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="max-w-6xl mx-auto">
        {/* Sticky Categories Tabs */}
        <div className="py-8">
          <h2 className="text-4xl font-bold">
            Discovers top products on our Record
          </h2>
          <p>
            As part of our effort to give founders a maximum visibility, premium
            tools we offers them a free listing and backlink from our platform
          </p>
          <p className="text-slate-500 ">
            Note: Only Startup fully Audited are eligible to show on our
            featured Records.
          </p>
        </div>
        {leaderboardProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {leaderboardProducts.map((product, index) => {
              const rank = index + 1;
              const isTopThree = rank <= 3;
              return (
                <Link
                  href={"/products/" + product.slug}
                  key={product._id}
                  className={`relative h-full flex flex-col justify-between border bg-white rounded-md py-2 overflow-hidden ${
                    isTopThree
                      ? rank === 1
                        ? "border-yellow-500 border-2"
                        : rank === 2
                          ? "border-gray-400 border-2"
                          : "border-orange-600 border-2"
                      : "border-border"
                  }`}
                >
                  <CardContent className="px-2 w-full border-b">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 space-y-2 w-full">
                        <div className="flex items-center gap-2">
                          <div className="relative w-12 h-12 flex items-center justify-center rounded-md overflow-hidden flex-shrink-0 bg-white">
                            <img
                              src={appLogo({
                                logo: product.logo || "/logo.svg",
                              })}
                              alt={product.name}
                              height={30}
                              width={30}
                              className={clsx(
                                "object-contain",
                                !product.logo && "opacity-50",
                                product.logo?.includes("google.com")
                                  ? "h-[30px] w-[30px]"
                                  : "",
                              )}
                            />
                          </div>
                          <p className="font-semibold text-sm truncate">
                            {product.name}
                          </p>
                        </div>

                        <div className="absolute top-0.5 right-1">
                          <GradeBadge
                            score={product.score}
                            grade={product.grade}
                            size="sm"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <div className="py-2 px-4">
                    {product.tagline && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.tagline}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No products ranked yet. Be the first to get audited.</p>
            </CardContent>
          </Card>
        )}
        <div className="flex justify-center pt-8">
          <Link href="/leaderboard">
            <Button variant="outline" className="gap-2">
              View all products
              <TrendingUp className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
