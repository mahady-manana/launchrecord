"use client";

import { useProducts } from "@/hooks/use-products";
import { useProductStore } from "@/stores/product-store";
import { Globe, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { GradeBadge } from "./GradeBadge";

interface ProductListProps {
  compact?: boolean;
}

export function ProductList({ compact = false }: ProductListProps) {
  const { products, selectedProduct, setSelectedProduct } = useProductStore();
  const { fetchProducts, isMutating } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="space-y-2">
      <nav className={`flex flex-col gap-1 ${compact ? "items-center" : ""}`}>
        {isMutating && products.length === 0 ? (
          <div className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Loading...
          </div>
        ) : products.length === 0 ? (
          <div
            className={`rounded-xl border border-dashed border-slate-300 px-3 py-3 text-xs text-slate-500 ${compact ? "text-center" : ""}`}
          >
            <Link
              href="/dashboard"
              className={`flex items-center gap-1.5 hover:text-orange-600 transition-colors ${compact ? "justify-center" : ""}`}
              title={compact ? "Add your first product" : undefined}
            >
              <Plus className="h-3.5 w-3.5" />
              {!compact && "Add your first product"}
            </Link>
          </div>
        ) : (
          products.slice(0, 8).map((product) => (
            <Link
              key={product.id}
              href={`/dashboard/${product.id}`}
              onClick={() => setSelectedProduct(product)}
              className={`group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 hover:shadow-sm ${
                selectedProduct?.id === product.id
                  ? "bg-gradient-to-r from-orange-50 to-amber-50 shadow-sm"
                  : ""
              } ${compact ? "justify-center" : ""}`}
              title={compact ? product.name : undefined}
            >
              {product.logo ? (
                <img
                  src={product.logo}
                  alt={product.name}
                  className={`${compact ? "h-8 w-8" : "h-6 w-6"} rounded-lg object-cover ring-1 ring-slate-200 flex-shrink-0`}
                />
              ) : (
                <div
                  className={`flex items-center justify-center rounded-lg bg-slate-100 ring-1 ring-slate-200 flex-shrink-0 ${compact ? "h-8 w-8" : "h-6 w-6"}`}
                >
                  <Globe
                    className={`${compact ? "h-4 w-4" : "h-3.5 w-3.5"} text-slate-400`}
                  />
                </div>
              )}
              {!compact && (
                <span
                  className={`truncate flex-1 ${
                    selectedProduct?.id === product.id
                      ? "font-semibold text-orange-700"
                      : "text-slate-600"
                  }`}
                >
                  {product.name}
                </span>
              )}

              {!compact && <GradeBadge score={product.score}></GradeBadge>}
            </Link>
          ))
        )}
      </nav>
    </div>
  );
}
