"use client";

import { useState, useEffect } from "react";
import { Leaderboard } from "@/components/Leaderboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Trophy, TrendingUp, Shield, Zap, Brain } from "lucide-react";
import Link from "next/link";

interface LeaderboardEntry {
  _id: string;
  name: string;
  tagline?: string | null;
  website?: string | null;
  score?: number | null;
  rank: number;
}

export default function LeaderboardPage() {
  const [products, setProducts] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    fetchLeaderboard(page);
  }, [page]);

  const fetchLeaderboard = async (pageNum: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/leaderboard?limit=100&page=${pageNum}`);
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

  const topThree = products.slice(0, 3);
  const restProducts = products.slice(3);

  return (
    <div className="space-y-12 py-10">
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
          The definitive ranking of SaaS products by defensibility. See who's
          untouchable and who's just another ghost.
        </p>

        <div className="flex justify-center gap-4 pt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>{totalProducts} Products Audited</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>Updated Real-time</span>
          </div>
        </div>
      </section>

      {/* Top 3 Podium */}
      {!loading && topThree.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 2nd Place */}
          {topThree[1] && (
            <Card className="border-2 border-gray-400 bg-gradient-to-b from-gray-50 to-white order-2 md:order-1">
              <CardHeader className="text-center pb-2">
                <Trophy className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <CardTitle className="text-gray-700">#2</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-2">
                <p className="font-bold text-lg">{topThree[1].name}</p>
                {topThree[1].tagline && (
                  <p className="text-sm text-muted-foreground">
                    {topThree[1].tagline}
                  </p>
                )}
                {topThree[1].score !== null && (
                  <div
                    className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-400 text-white font-bold"
                  >
                    {topThree[1].score}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* 1st Place */}
          {topThree[0] && (
            <Card className="border-2 border-yellow-500 bg-gradient-to-b from-yellow-50 to-white order-1 md:order-2 scale-105 shadow-lg">
              <CardHeader className="text-center pb-2">
                <Trophy className="h-10 w-10 text-yellow-500 mx-auto mb-2" />
                <CardTitle className="text-yellow-700">#1</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-2">
                <p className="font-bold text-xl">{topThree[0].name}</p>
                {topThree[0].tagline && (
                  <p className="text-sm text-muted-foreground">
                    {topThree[0].tagline}
                  </p>
                )}
                {topThree[0].score !== null && (
                  <div
                    className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-yellow-500 text-white font-bold text-lg"
                  >
                    {topThree[0].score}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* 3rd Place */}
          {topThree[2] && (
            <Card className="border-2 border-orange-600 bg-gradient-to-b from-orange-50 to-white order-3">
              <CardHeader className="text-center pb-2">
                <Trophy className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <CardTitle className="text-orange-700">#3</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-2">
                <p className="font-bold text-lg">{topThree[2].name}</p>
                {topThree[2].tagline && (
                  <p className="text-sm text-muted-foreground">
                    {topThree[2].tagline}
                  </p>
                )}
                {topThree[2].score !== null && (
                  <div
                    className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-600 text-white font-bold"
                  >
                    {topThree[2].score}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </section>
      )}

      {/* Full Leaderboard */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">Full Rankings</h2>
            <p className="text-muted-foreground">
              Showing {products.length} of {totalProducts} products
            </p>
          </div>
          <Link href="/survey">
            <Button className="gap-2">
              <Brain className="h-4 w-4" />
              Get Audited
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
                    setPage((p) => Math.max(1, p - 1));
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
                        setPage(pageNum);
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
                    setPage((p) => Math.min(totalPages, p + 1));
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
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { status: "UNTOUCHABLE", score: "90-100", color: "bg-purple-500" },
          { status: "LETHAL", score: "70-89", color: "bg-green-400" },
          { status: "PLASTIC", score: "40-69", color: "bg-blue-400" },
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
