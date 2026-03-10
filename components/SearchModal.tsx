"use client";

import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface Product {
  _id: string;
  id: string;
  name: string;
  tagline?: string | null;
  logo?: string | null;
  slug?: string;
  score?: number | null;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/products/search?q=${encodeURIComponent(query)}`,
        );
        const data = await res.json();
        if (data.success) {
          setResults(data.products || []);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 top-0 bg-black/50 left-0 w-full h-screen z-50 flex items-start justify-center pt-20">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl border shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center gap-4 p-4 border-b">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 outline-none text-lg"
            autoFocus
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500">Searching...</div>
          ) : query.length < 2 ? (
            <div className="p-8 text-center text-slate-500">
              Type at least 2 characters to search
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No products found
            </div>
          ) : (
            <div className="divide-y">
              {results.map((product) => {
                const productUrl = product.slug || "/";

                return (
                  <Link
                    key={product.id}
                    href={`/products/${productUrl}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors block"
                  >
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden border bg-white flex-shrink-0">
                      {product.logo ? (
                        <Image
                          src={product.logo}
                          alt={product.name}
                          fill
                          className="object-cover p-1"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-slate-100">
                          <Search className="h-6 w-6 text-slate-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base truncate">
                        {product.name}
                      </h3>
                      {product.tagline && (
                        <p className="text-sm text-slate-500 truncate">
                          {product.tagline}
                        </p>
                      )}
                    </div>
                    {product.score && (
                      <div className="text-sm font-bold text-primary">
                        {product.score}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
