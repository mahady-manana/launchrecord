"use client";

import { ProductCard } from "@/components/product-card";
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
import { ArrowLeft, BarChart3, Crown, Medal, Trophy } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface ProductItem {
  id: string;
  name: string;
  tagline?: string | null;
  description?: string | null;
  logo?: string | null;
  website?: string | null;
  score: number;
  rank: number;
  topics?: Array<{ _id: string; name: string }>;
  createdAt: string;
  slug: string;
}

interface CategoryData {
  topic: {
    id: string;
    name: string;
    slug: string;
  };
  stats: {
    totalProducts: number;
    avgScore: number;
  };
  products: ProductItem[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalProducts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface CategoryPageClientProps {
  initialData: CategoryData;
  slug: string;
  topTopics: Array<{
    _id: string;
    name: string;
    slug: string;
    count: number;
  }>;
  currentPage: number;
}

export default function CategoryPageClient({
  initialData,
  slug,
  topTopics,
  currentPage,
}: CategoryPageClientProps) {
  const pathname = usePathname();
  const [data, setData] = useState<CategoryData>(initialData);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(currentPage);

  const fetchCategory = async (pageNum: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/categories/${slug}/products?page=${pageNum}&limit=20`,
      );
      const result = await response.json();

      if (result.success) {
        setData(result.data);
        setPage(pageNum);
        // Update URL without reload
        window.history.pushState({}, "", `${pathname}?page=${pageNum}`);
      }
    } catch (error) {
      console.error("Failed to fetch category:", error);
    } finally {
      setLoading(false);
    }
  };

  const products = data.products.map((product) => ({
    _id: product.id,
    name: product.name,
    tagline: product.tagline,
    website: product.website,
    logo: product.logo,
    score: product.score,
    rank: product.rank,
    topics: product.topics,
    slug: product.slug,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary/5">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/leaderboard">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Leaderboard
              </Button>
            </Link>
          </div>

          <div className="flex items-start justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <BarChart3 className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-black tracking-tight">
                    {data.topic.name}
                  </h1>
                  <p className="text-white/80 text-lg">Category Leaderboard</p>
                </div>
              </div>

              {/* Top 10 Topics */}
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-white/80 mb-3 uppercase tracking-wider">
                  Top 10 Categories
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {topTopics.map((topic, index) => (
                    <Link
                      key={topic._id}
                      href={`/categories/${topic.slug}`}
                      className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all rounded-xl p-3 text-center"
                    >
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <span className="text-lg font-bold text-white">
                          {index === 0
                            ? "🥇"
                            : index === 1
                              ? "🥈"
                              : index === 2
                                ? "🥉"
                                : `#${index + 1}`}
                        </span>
                      </div>
                      <div className="text-xs font-medium text-white/90 truncate group-hover:text-white">
                        {topic.name}
                      </div>
                      <div className="text-[10px] text-white/60">
                        {topic.count}{" "}
                        {topic.count === 1 ? "product" : "products"}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Top 3 Podium */}
            {products.length >= 3 && page === 1 && (
              <div className="hidden lg:flex items-end gap-4">
                {/* 2nd Place */}
                <div className="text-center">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center mx-auto mb-2 shadow-lg">
                    <Medal className="h-12 w-12 text-white" />
                  </div>
                  <div className="font-bold text-sm truncate w-24">
                    {products[1].name}
                  </div>
                  <div className="text-xs text-white/70">
                    Score: {products[1].score}
                  </div>
                  <div className="h-20 bg-gradient-to-t from-slate-400/50 to-transparent rounded-t w-20 mx-auto mt-2" />
                </div>

                {/* 1st Place */}
                <div className="text-center">
                  <div className="h-32 w-32 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center mx-auto mb-2 shadow-xl">
                    <Crown className="h-16 w-16 text-white" />
                  </div>
                  <div className="font-bold truncate w-32">
                    {products[0].name}
                  </div>
                  <div className="text-xs text-white/70">
                    Score: {products[0].score}
                  </div>
                  <div className="h-28 bg-gradient-to-t from-yellow-500/50 to-transparent rounded-t w-24 mx-auto mt-2" />
                </div>

                {/* 3rd Place */}
                <div className="text-center">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center mx-auto mb-2 shadow-lg">
                    <Trophy className="h-10 w-10 text-white" />
                  </div>
                  <div className="font-bold text-sm truncate w-20">
                    {products[2].name}
                  </div>
                  <div className="text-xs text-white/70">
                    Score: {products[2].score}
                  </div>
                  <div className="h-16 bg-gradient-to-t from-amber-700/50 to-transparent rounded-t w-16 mx-auto mt-2" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">All Products</h2>
            <p className="text-muted-foreground">
              Showing {products.length} of {data.pagination.totalProducts}{" "}
              products
            </p>
          </div>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
            </CardContent>
          </Card>
        ) : products.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Trophy className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600">
                No products yet
              </h3>
              <p className="text-slate-500 mt-2">
                Be the first to add a product in this category!
              </p>
              <Link href="/survey" className="mt-4 inline-block">
                <Button>Add Product</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          products.map((product, index) => (
            <ProductCard
              key={product._id}
              product={product}
              showRank
              showTrend={index > 0}
            />
          ))
        )}

        {/* Pagination */}
        {!loading && data.pagination.totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (data.pagination.hasPrevPage) {
                      fetchCategory(page - 1);
                    }
                  }}
                  className={
                    !data.pagination.hasPrevPage
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
              {Array.from(
                { length: Math.min(5, data.pagination.totalPages) },
                (_, i) => {
                  let pageNum = i + 1;
                  if (data.pagination.totalPages > 5) {
                    if (page > 3) {
                      pageNum = page - 2 + i;
                    }
                    if (pageNum > data.pagination.totalPages) {
                      pageNum = data.pagination.totalPages - 4 + i;
                    }
                  }
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          fetchCategory(pageNum);
                        }}
                        isActive={page === pageNum}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                },
              )}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (data.pagination.hasNextPage) {
                      fetchCategory(page + 1);
                    }
                  }}
                  className={
                    !data.pagination.hasNextPage
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
