"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getStatusColorHex } from "@/lib/product-status";
import clsx from "clsx";
import { ExternalLink, TrendingUp, Trophy } from "lucide-react";
import Link from "next/link";

interface LeaderboardEntry {
  _id: string;
  name: string;
  tagline?: string | null;
  website?: string | null;
  logo?: string | null;
  score?: number | null;
  rank: number;
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
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs">
            Not Ranked
          </Badge>
        </div>
      );
    }

    const colorHex = getStatusColorHex(score);

    return (
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
          style={{ backgroundColor: colorHex }}
        >
          {score}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-muted">
              <TableHead className="w-20 text-center">Rank</TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayProducts.map((product, index) => (
              <TableRow
                key={product._id}
                className="hover:bg-muted/50 transition-colors"
              >
                <TableCell className="text-center">
                  {getRankBadge(index + 1)}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="relative w-8 h-8 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
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
                      <span className="font-semibold">{product.name}</span>
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
                      <p className="text-sm text-muted-foreground">
                        {product.tagline}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {getScoreDisplay(product.score)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {!showFull && products.length > 10 && (
          <div className="p-4 text-center border-t">
            <Link href="/leaderboard">
              <Badge variant="outline" className="gap-2 cursor-pointer">
                View Full Leaderboard
                <TrendingUp className="h-3 w-3" />
              </Badge>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
