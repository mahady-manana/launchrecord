"use client";

import { useProducts } from "@/hooks/use-products";
import { useProductStore } from "@/stores/product-store";
import { Check, ChevronDown, Globe, Loader2, Plus, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function ProductSwitcher() {
  const { products, selectedProduct, setSelectedProduct } = useProductStore();
  const { fetchProducts, isMutating } = useProducts();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleSelect = (product: any) => {
    setSelectedProduct(product);
    router.push(`/dashboard/${product.id}`);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 hover:shadow-sm"
      >
        {selectedProduct && selectedProduct.logo ? (
          <img
            src={selectedProduct.logo}
            alt={selectedProduct.name}
            className="h-6 w-6 rounded-lg object-cover ring-1 ring-slate-200 flex-shrink-0"
          />
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 ring-1 ring-slate-200 flex-shrink-0">
            <Globe className="h-3.5 w-3.5 text-slate-400" />
          </div>
        )}
        <span className="truncate flex-1 text-left text-slate-600 font-medium">
          {selectedProduct ? selectedProduct.name : "Switch Product"}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 rounded-xl border border-slate-200/60 bg-white/95 backdrop-blur-xl shadow-xl shadow-slate-200/20 z-50 overflow-hidden">
          <div className="p-2">
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Products
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="h-3.5 w-3.5 text-slate-400" />
              </button>
            </div>

            {isMutating && products.length === 0 ? (
              <div className="flex items-center gap-2 px-3 py-4 text-sm text-slate-500 justify-center">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 px-3 py-3 text-xs text-slate-500 m-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 hover:text-orange-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add your first product
                </Link>
              </div>
            ) : (
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {products.slice(0, 8).map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSelect(product)}
                    className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 hover:shadow-sm ${
                      selectedProduct?.id === product.id
                        ? "bg-gradient-to-r from-orange-50 to-amber-50 shadow-sm"
                        : ""
                    }`}
                  >
                    {product.logo ? (
                      <img
                        src={product.logo}
                        alt={product.name}
                        className="h-6 w-6 rounded-lg object-cover ring-1 ring-slate-200 flex-shrink-0"
                      />
                    ) : (
                      <div className="flex items-center justify-center rounded-lg bg-slate-100 ring-1 ring-slate-200 flex-shrink-0 h-6 w-6">
                        <Globe className="h-3.5 w-3.5 text-slate-400" />
                      </div>
                    )}
                    <span
                      className={`truncate flex-1 text-left ${
                        selectedProduct?.id === product.id
                          ? "font-semibold text-orange-700"
                          : "text-slate-600"
                      }`}
                    >
                      {product.name}
                    </span>
                    {selectedProduct?.id === product.id && (
                      <Check className="h-4 w-4 text-orange-600 flex-shrink-0" />
                    )}
                  </button>
                ))}

                {/* Add Product */}
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-slate-500 transition-all duration-200 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 hover:shadow-sm mt-2"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 ring-1 ring-slate-200 flex-shrink-0">
                    <Plus className="h-3.5 w-3.5" />
                  </div>
                  <span className="truncate flex-1">Add product</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
