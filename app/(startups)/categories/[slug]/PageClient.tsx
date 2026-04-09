"use client";

import InfiniteScrollProducts from "@/components/InfiniteScrollProducts";
import { ProductItem } from "@/components/product-card";
import { BarChart3 } from "lucide-react";

interface CategoryPageClientProps {
  initialProducts: ProductItem[];
  total: number;
  slug: string;
  topTopics: Array<{
    _id: string;
    name: string;
    slug: string;
    count: number;
    short_description: string;
    description: string;
  }>;
  categoryData: {
    topic: {
      id: string;
      name: string;
      slug: string;
      short_description: string;
      description: string;
    };
    stats: {
      totalProducts: number;
      avgScore: number;
    };
  };
}

export default function CategoryPageClient({
  initialProducts,
  total,
  slug,
  topTopics,
  categoryData,
}: CategoryPageClientProps) {
  return (
    <div className="space-y-8">
      {/* Category Hero */}
      <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <BarChart3 className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              {categoryData.topic.name}
            </h1>
            <p className="text-slate-600">
              {total} products ranked by defensibility
            </p>
          </div>
        </div>

        {categoryData.topic.description && (
          <p className="text-slate-700 leading-relaxed">
            {categoryData.topic.description}
          </p>
        )}
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-6 bg-white rounded-lg border border-slate-200 px-6 py-4">
        <div>
          <div className="text-xl font-black text-slate-900">{total}</div>
          <div className="text-xs text-slate-600 font-medium">Products</div>
        </div>
      </div>

      {/* Infinite Scroll Products */}
      <InfiniteScrollProducts
        apiUrl={`/api/categories/${slug}/products`}
        initialLoad={0}
        loadMoreCount={20}
        existingProducts={initialProducts}
        total={total}
      />
    </div>
  );
}
