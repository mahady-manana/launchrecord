"use client";

import { useProducts } from "@/hooks/use-products";
import { useProductStore } from "@/stores/product-store";
import { Globe, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export function ProductList() {
  const { products, selectedProduct, setSelectedProduct } = useProductStore();
  const { fetchProducts, isMutating } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Products
        </span>
      </div>

      <nav className="flex flex-col gap-1">
        {isMutating && products.length === 0 ? (
          <div className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Loading...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
            <Link
              href="/dashboard/survey"
              className="flex items-center gap-1.5 hover:text-foreground"
            >
              <Plus className="h-3 w-3" />
              Add your first product
            </Link>
          </div>
        ) : (
          products.map((product) => (
            <Link
              key={product.id}
              href={`/dashboard/audit?product=${product.id}`}
              onClick={() => setSelectedProduct(product)}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition hover:bg-muted ${
                selectedProduct?.id === product.id ? "bg-muted font-medium" : ""
              }`}
            >
              {product.logo ? (
                <img
                  src={product.logo}
                  alt={product.name}
                  className="h-4 w-4 rounded object-cover"
                />
              ) : (
                <Globe className="h-3.5 w-3.5 text-muted-foreground" />
              )}
              <span className="truncate">{product.name}</span>
              {product.score !== null && product.score !== undefined && (
                <span className="ml-auto text-xs text-muted-foreground">
                  {product.score}
                </span>
              )}
            </Link>
          ))
        )}
      </nav>
    </div>
  );
}
