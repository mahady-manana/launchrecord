"use client";

import { Leaderboard } from "@/components/Leaderboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { HelpCircle, TrendingUp, Trophy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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

interface LeaderboardPageClientProps {
  initialProducts: LeaderboardEntry[];
  initialPage: number;
  initialTotalPages: number;
  initialTotalProducts: number;
}

export default function LeaderboardPageClient({
  initialProducts,
  initialPage,
  initialTotalPages,
  initialTotalProducts,
}: LeaderboardPageClientProps) {
  const [products, setProducts] = useState<LeaderboardEntry[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [totalProducts, setTotalProducts] = useState(initialTotalProducts);

  const fetchLeaderboard = async (pageNum: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/leaderboard?limit=100&page=${pageNum}`,
      );
      const data = await response.json();

      if (data.success) {
        setProducts(data.data.products);
        setTotalPages(data.data.pagination.pages);
        setTotalProducts(data.data.pagination.total);
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchLeaderboard(newPage);
  };

  const restProducts = products.slice(3);

  return (
    <div className="space-y-12 py-10 px-4">
      {/* Hero Section */}
      <section className="space-y-6 text-center">
        <Badge
          variant="outline"
          className="font-mono text-xs tracking-[0.2em] uppercase py-1.5 px-6 border-primary/50 text-primary bg-primary/5"
        >
          SOVEREIGN 100
        </Badge>

        <h1 className="text-5xl md:text-6xl font-black tracking-tighter">
          Sovereign Leaderboard
        </h1>

        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          The definitive ranking of SaaS products by defensibility. See
          who&apos;s untouchable and who&apos;s just another ghost.
        </p>

        <div className="flex justify-center gap-4 pt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>Updated Real-time</span>
          </div>
        </div>
      </section>

      {/* Full Leaderboard */}
      <section className="space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">Full Rankings</h2>
            <p className="text-muted-foreground">
              Showing {products.length} of {totalProducts} products
            </p>
          </div>
          <Link href="/how-score-works">
            <Button variant="outline" className="gap-2">
              <HelpCircle className="h-4 w-4" />
              How the Score Works
            </Button>
          </Link>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
            </CardContent>
          </Card>
        ) : restProducts.length > 0 ? (
          <Leaderboard products={products} showFull />
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No products ranked yet. Be the first to get audited.</p>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(Math.max(1, page - 1));
                  }}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5) {
                  if (page > 3) {
                    pageNum = page - 2 + i;
                  }
                  if (pageNum > totalPages) {
                    pageNum = totalPages - 4 + i;
                  }
                }
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(pageNum);
                      }}
                      isActive={page === pageNum}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(Math.min(totalPages, page + 1));
                  }}
                  className={
                    page === totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </section>

      {/* Status Legend */}
      <section className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { status: "UNTOUCHABLE", score: "90-100", color: "bg-purple-500" },
          { status: "LETHAL", score: "70-89", color: "bg-green-700" },
          { status: "PLASTIC", score: "40-69", color: "bg-yellow-500" },
          { status: "ZOMBIE", score: "20-39", color: "bg-orange-600" },
          { status: "GHOST", score: "1-19", color: "bg-red-600" },
        ].map((item) => (
          <Card key={item.status}>
            <CardContent className="py-4 text-center space-y-2">
              <div className={`w-8 h-8 rounded-full ${item.color} mx-auto`} />
              <p className="font-bold text-sm">{item.status}</p>
              <p className="text-xs text-muted-foreground">{item.score}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
