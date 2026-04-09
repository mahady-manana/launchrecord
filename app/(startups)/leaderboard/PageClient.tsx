"use client";

import InfiniteScrollProducts from "@/components/InfiniteScrollProducts";
import { ProductItem } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { HelpCircle, TrendingUp, Trophy } from "lucide-react";
import Link from "next/link";

interface LeaderboardPageClientProps {
  initialProducts: ProductItem[];
  total: number;
}

export default function LeaderboardPageClient({
  initialProducts,
  total,
}: LeaderboardPageClientProps) {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 md:p-8 text-white">
        <div className="mb-4 inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1.5 rounded-lg">
          <Trophy className="h-4 w-4" />
          <span className="text-sm font-medium">Sovereign 100</span>
        </div>

        <h1 className="mb-3 text-3xl md:text-4xl font-black leading-tight">
          The Definitive AI Startup Rankings
        </h1>

        <p className="text-slate-300 max-w-2xl leading-relaxed">
          {total}+ products ranked by defensibility, AI visibility, and market
          strength. Discover which products are untouchable and which are just
          another ghost.
        </p>

        <div className="mt-6 flex gap-3">
          <Link href="/sio-audit">
            <Button className="h-11 px-6 bg-orange-500 hover:bg-orange-600 text-white font-bold">
              <TrendingUp className="h-4 w-4 mr-2" />
              Audit Your Startup
            </Button>
          </Link>
          <Link href="/startups">
            <Button
              variant="outline"
              className="h-11 px-6 border-white text-white hover:bg-white/10 font-bold"
            >
              Browse All Startups
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="flex items-center justify-between bg-white rounded-lg border border-slate-200 px-6 py-4">
        <div className="flex items-center gap-6">
          <div>
            <div className="text-2xl font-black text-slate-900">{total}</div>
            <div className="text-xs text-slate-600 font-medium">
              Total Products
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <div className="text-2xl font-black text-slate-900">SIO-V5</div>
            <div className="text-xs text-slate-600 font-medium">
              Scoring Engine
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <HelpCircle className="h-4 w-4" />
          <Link href="/how-score-works" className="hover:underline">
            How scoring works
          </Link>
        </div>
      </section>

      {/* Infinite Scroll Products */}
      <InfiniteScrollProducts
        apiUrl="/api/leaderboard"
        initialLoad={0}
        loadMoreCount={20}
        existingProducts={initialProducts}
        total={total}
        gridClassName="grid gap-4"
      />
    </div>
  );
}
