"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getStatusColorHex } from "@/lib/product-status";
import clsx from "clsx";
import { TrendingUp, Trophy } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface LeaderboardEntry {
  _id: string;
  name: string;
  tagline?: string | null;
  website?: string | null;
  logo?: string | null;
  score?: number | null;
  rank?: number;
}

export function LandingLeaderboard() {
  const [leaderboardProducts, setLeaderboardProducts] = useState<
    LeaderboardEntry[]
  >([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoadingLeaderboard(true);
    try {
      const response = await fetch("/api/leaderboard?limit=100");
      const data = await response.json();
      if (data.success) {
        setLeaderboardProducts(data.data.products);
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-4">
          <Trophy className="h-8 w-8 text-orange-600" />
          <h2 className="text-4xl font-bold text-foreground">SIO V5 Ranking</h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          See who's climbing the ranks. The top 100 products ranked by
          defensibility score.
        </p>
      </div>

      {loadingLeaderboard ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          </CardContent>
        </Card>
      ) : leaderboardProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {leaderboardProducts.slice(0, 10).map((product, index) => {
            const rank = index + 1;
            const isTopThree = rank <= 3;
            const colorHex = getStatusColorHex(product.score || 0);
            return (
              <Card
                key={product._id}
                className={`relative py-2 overflow-hidden ${
                  isTopThree
                    ? rank === 1
                      ? "border-yellow-500 border-2"
                      : rank === 2
                        ? "border-gray-400 border-2"
                        : "border-orange-600 border-2"
                    : "border-border"
                }`}
              >
                <CardContent className="px-4 w-full">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2 w-full">
                      <div className="flex items-center gap-2">
                        <div className="relative w-8 h-8 flex items-center justify-center rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={product.logo || "/logo.svg"}
                            alt={product.name}
                            height={40}
                            width={40}
                            className={clsx(
                              "object-contain",
                              !product.logo && "opacity-50",
                              product.logo?.includes("google.com")
                                ? "h-6 w-6"
                                : "",
                            )}
                          />
                        </div>
                        <p className="font-semibold text-sm truncate">
                          {product.name}
                        </p>
                      </div>
                      {product.tagline && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {product.tagline}
                        </p>
                      )}
                      <div className="absolute top-2 right-2">
                        {product.score !== null &&
                        product.score !== undefined ? (
                          <div
                            className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-white font-bold text-xs`}
                            style={{ background: colorHex }}
                          >
                            {product.score}
                          </div>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            Not Ranked
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
      <div className="flex justify-center">
        <Link href="/leaderboard">
          <Button variant="outline" className="gap-2">
            View Full Leaderboard
            <TrendingUp className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
