"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getStatusColorHex } from "@/lib/product-status";
import clsx from "clsx";
import { ExternalLink, Trophy } from "lucide-react";
import Link from "next/link";

interface LeaderboardEntry {
  _id: string;
  name: string;
  tagline?: string | null;
  website?: string | null;
  logo?: string | null;
  score?: number | null;
  rank: number;
  topics?: Array<{ _id: string; name: string }>;
}

interface LeaderboardProps {
  products: LeaderboardEntry[];
  showFull?: boolean;
}

export function Leaderboard({ products, showFull = false }: LeaderboardProps) {
  const displayProducts = showFull ? products : products.slice(0, 100);

  const getRankBadge = (rank: number) => {
    if (rank === 1)
      return (
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span className="font-bold text-lg">#1</span>
        </div>
      );
    if (rank === 2)
      return (
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-gray-400" />
          <span className="font-bold">#2</span>
        </div>
      );
    if (rank === 3)
      return (
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-orange-600" />
          <span className="font-bold">#3</span>
        </div>
      );
    return <span className="font-mono text-muted-foreground">#{rank}</span>;
  };

  const getScoreDisplay = (score: number | null | undefined) => {
    if (score === null || score === undefined) {
      return (
        <Badge variant="outline" className="text-xs">
          Not Ranked
        </Badge>
      );
    }

    const colorHex = getStatusColorHex(score);

    return (
      <div
        className="w-10 h-10 rounded-full flex border-2 items-center justify-center font-bold text-white text-sm"
        style={{ borderColor: colorHex, color: colorHex }}
      >
        {score}
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="p-0">
        {/* Header - Hidden on mobile */}
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b bg-muted/30 text-sm font-medium text-muted-foreground">
          <div className="col-span-1 text-center">Rank</div>
          <div className="col-span-8">Product</div>
          <div className="col-span-3 text-right">Score</div>
        </div>

        {/* Products List */}
        <div className="divide-y">
          {displayProducts.map((product, index) => (
            <div
              key={product._id}
              className="group p-4 hover:bg-muted/50 transition-colors"
            >
              {/* Mobile Layout */}
              <div className="md:hidden space-y-3">
                <div className="flex items-start gap-3">
                  {/* Rank */}
                  <div className="flex-shrink-0 w-12 text-center">
                    {getRankBadge(index + 1)}
                  </div>

                  {/* Logo */}
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center bg-muted">
                    <img
                      src={product.logo || "/logo.svg"}
                      alt={product.name}
                      height={48}
                      width={48}
                      className={clsx(
                        "object-contain p-1",
                        !product.logo && "opacity-50",
                        product.logo?.includes("google.com")
                          ? "h-6 w-6"
                          : "h-8 w-8",
                      )}
                    />
                  </div>

                  {/* Score - Mobile */}
                  <div className="ml-auto flex-shrink-0">
                    {getScoreDisplay(product.score)}
                  </div>
                </div>

                {/* Product Info - Mobile */}
                <div className="ml-15 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-base">
                      {product.name}
                    </span>
                    {product.website && (
                      <a
                        href={product.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  {product.tagline && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {product.tagline}
                    </p>
                  )}
                  {product.topics && product.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {product.topics.slice(0, 3).map((topic) => (
                        <Badge
                          key={topic._id}
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0 h-5 bg-slate-100 text-slate-700"
                        >
                          {topic.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                {/* Rank */}
                <div className="col-span-1 text-center">
                  {getRankBadge(index + 1)}
                </div>

                {/* Product Info */}
                <div className="col-span-8">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center bg-muted">
                      <img
                        src={product.logo || "/logo.svg"}
                        alt={product.name}
                        height={40}
                        width={40}
                        className={clsx(
                          "object-contain p-1",
                          !product.logo && "opacity-50",
                          product.logo?.includes("google.com")
                            ? "h-6 w-6"
                            : "",
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold truncate">
                          {product.name}
                        </span>
                        {product.website && (
                          <a
                            href={product.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary flex-shrink-0"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                      {product.tagline && (
                        <p className="text-sm text-muted-foreground truncate">
                          {product.tagline}
                        </p>
                      )}
                      {product.topics && product.topics.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {product.topics.slice(0, 3).map((topic) => (
                            <Badge
                              key={topic._id}
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0 h-5 bg-slate-100 text-slate-700"
                            >
                              {topic.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div className="col-span-3 text-right">
                  {getScoreDisplay(product.score)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {!showFull && products.length > 10 && (
          <div className="p-4 text-center border-t">
            <Link href="/leaderboard">
              <Badge variant="outline" className="gap-2 cursor-pointer">
                View Full Leaderboard
              </Badge>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
