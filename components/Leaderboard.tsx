"use client";

import { ProductCard, ProductItem } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
  slug: string;
}

interface LeaderboardProps {
  products: LeaderboardEntry[];
  showFull?: boolean;
}

export function Leaderboard({ products, showFull = false }: LeaderboardProps) {
  const displayProducts = showFull ? products : products.slice(0, 100);

  // Transform to ProductItem interface
  const productItems: ProductItem[] = displayProducts.map((product) => ({
    _id: product._id,
    name: product.name,
    tagline: product.tagline,
    website: product.website,
    logo: product.logo,
    score: product.score || 0,
    rank: product.rank,
    topics: product.topics,
    slug: product.slug,
  }));

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
          {productItems.map((product) => (
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
