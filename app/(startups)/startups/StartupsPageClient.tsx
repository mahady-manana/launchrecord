"use client";

import InfiniteScrollProducts from "@/components/InfiniteScrollProducts";
import { ProductItem } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Building2, Zap } from "lucide-react";
import Link from "next/link";

interface StartupsPageClientProps {
  initialProducts: ProductItem[];
  total: number;
}

export default function StartupsPageClient({
  initialProducts,
  total,
}: StartupsPageClientProps) {
  return (
    <div className="space-y-8">
      {/* Compact Hero Header */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-4 md:p-5 text-white">
        <div className="gap-4">
          <div>
            <div className="mb-1.5 inline-flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-md">
              <Building2 className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Startup Directories</span>
            </div>
            <h1 className="mb-2 text-2xl md:text-3xl font-black leading-tight">
              Discover the latest AI Startups
            </h1>
            <p className="text-blue-100 text-sm max-w-xl">
              Browse {total.toLocaleString()}+ startups across 230+ categories.
              Compare the most defensive startups in AI
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0 pt-4">
            <Link href="/sio-audit">
              <Button className="h-9 px-4 bg-white text-blue-600 hover:bg-blue-50 text-sm font-bold">
                <Zap className="h-3.5 w-3.5 mr-1.5" />
                Get Audited for free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}

      {/* Infinite Scroll - starts from page 2 */}
      <InfiniteScrollProducts
        apiUrl="/api/leaderboard"
        initialLoad={0}
        loadMoreCount={20}
        existingProducts={initialProducts}
        total={total}
      />
    </div>
  );
}
