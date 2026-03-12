"use client";

import { GradeBadge } from "@/components/GradeBadge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Crown,
  Medal,
  Minus,
  TrendingDown,
  TrendingUp,
  Trophy,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface ProductItem {
  _id: string;
  name: string;
  tagline?: string | null;
  website?: string | null;
  logo?: string | null;
  score?: number | null;
  grade?: string;
  rank?: number;
  topics?: Array<{ _id: string; name: string }>;
  scoreDiff?: number;
  slug: string;
}

interface ProductCardProps {
  product: ProductItem;
  variant?: "default" | "compact" | "leaderboard";
  showRank?: boolean;
  showTrend?: boolean;
  className?: string;
}

export function ProductCard({
  product,
  variant = "leaderboard",
  showRank = false,
  showTrend = false,
  className,
}: ProductCardProps) {
  const score = product.score || 0;
  const rank = product.rank || 0;
  const scoreDiff = product.scoreDiff || 0;

  const getRankBadge = (rank: number) => {
    if (rank === 1)
      return (
        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          <span className="font-bold text-lg">#1</span>
        </div>
      );
    if (rank === 2)
      return (
        <div className="flex items-center gap-2">
          <Medal className="h-4 w-4 text-gray-400" />
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

  const getTrendIcon = () => {
    if (scoreDiff > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (scoreDiff < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-slate-400" />;
  };

  // Compact variant for dense layouts
  if (variant === "compact") {
    return (
      <Link
        href={"/products/" + product.slug}
        className={cn("block hover:shadow-md transition-shadow", className)}
      >
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            {showRank && rank && (
              <div className="flex-shrink-0 w-8 text-center">
                {getRankBadge(rank)}
              </div>
            )}

            <div className="relative flex items-center justify-center md:h-10 md:w-10 w-6 h-6  overflow-hidden flex-shrink-0 bg-white">
              {product.logo ? (
                <Image
                  src={product.logo}
                  alt={product.name}
                  width={32}
                  height={32}
                  className="object-cover w-8 h-8 p-1"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/20">
                  <Crown className="h-5 w-5 text-primary" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm truncate hover:text-primary transition-colors">
                {product.name}
              </h4>

              {product.tagline && (
                <p className="text-xs text-muted-foreground">
                  {product.tagline}
                </p>
              )}
            </div>

            <GradeBadge score={score} grade={product.grade} size="sm" />
          </div>
        </CardContent>
      </Link>
    );
  }

  // Default/Desktop variant
  return (
    <Link
      href={"/products/" + product.slug}
      className={cn(
        "group block hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-transparent hover:border-l-primary overflow-hidden",
        className,
      )}
    >
      <CardContent className="p-0">
        <div className="flex items-stretch">
          {/* Product Info */}
          <div className="flex-1 p-4 flex gap-4">
            {/* Logo */}
            <div className="relative flex items-center justify-center md:h-10 md:w-10 w-6 h-6  overflow-hidden flex-shrink-0 bg-white">
              {product.logo ? (
                <Image
                  src={product.logo}
                  alt={product.name}
                  width={32}
                  height={32}
                  className="object-cover w-8 h-8"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/20">
                  <Crown className="h-8 w-8 text-primary" />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-slate-900 truncate hover:text-primary transition-colors">
                {product.name}
              </h3>
              {product.tagline && (
                <p className="text-sm text-slate-500">{product.tagline}</p>
              )}
              <div className="flex items-center gap-4 mt-2">
                {product.topics && product.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1">
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

            {/* Grade */}
            <GradeBadge score={score} grade={product.grade} size="md" />
          </div>
        </div>
      </CardContent>
    </Link>
  );
}

// Legacy Leaderboard component for backward compatibility
export function LeaderboardList({
  products,
  showFull = false,
}: {
  products: ProductItem[];
  showFull?: boolean;
}) {
  const displayProducts = showFull ? products : products.slice(0, 100);

  return (
    <Card>
      <CardContent className="p-0">
        {/* Header - Hidden on mobile */}
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b bg-muted/30 text-sm font-medium text-muted-foreground">
          <div className="col-span-1 text-center">Rank</div>
          <div className="col-span-8">Product</div>
          <div className="col-span-3 text-right">Grade</div>
        </div>

        {/* Products List */}
        <div className="divide-y">
          {displayProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              variant="leaderboard"
              showRank
            />
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
