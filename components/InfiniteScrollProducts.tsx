"use client";

import { ProductCard, type ProductItem } from "@/components/product-card";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

interface InfiniteScrollProductsProps {
  /** API endpoint to fetch products from */
  apiUrl: string;
  /** Number of products to load initially (0 if using existingProducts) */
  initialLoad?: number;
  /** Number of products to load on each scroll */
  loadMoreCount?: number;
  /** Additional query params to append to API URL */
  queryParams?: Record<string, string>;
  /** Custom class for the grid container */
  gridClassName?: string;
  /** Custom empty state message */
  emptyMessage?: string;
  /** Products already loaded server-side */
  existingProducts?: ProductItem[];
  /** Total count from server-side fetch */
  total?: number;
  /** Callback when products are loaded */
  onProductsLoaded?: (products: ProductItem[]) => void;
}

export default function InfiniteScrollProducts({
  apiUrl,
  initialLoad = 100,
  loadMoreCount = 20,
  queryParams = {},
  gridClassName = "grid gap-4 md:grid-cols-1",
  emptyMessage = "No products found",
  existingProducts = [],
  total: initialTotal = 0,
  onProductsLoaded,
}: InfiniteScrollProductsProps) {
  const [products, setProducts] = useState<ProductItem[]>(existingProducts);
  const [page, setPage] = useState(initialLoad > 0 ? 2 : 1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(
    initialLoad === 0 && existingProducts.length === 0,
  );

  // Build query string
  const buildQueryString = (pageNum: number, limit: number) => {
    const params = new URLSearchParams({
      page: pageNum.toString(),
      limit: limit.toString(),
      ...queryParams,
    });
    return `${apiUrl}?${params}`;
  };

  // Initial load only if no existing products
  useEffect(() => {
    if (existingProducts.length === 0 && initialLoad > 0) {
      fetchProducts(1, initialLoad);
    } else if (existingProducts.length > 0) {
      // Calculate correct starting page based on already-loaded products
      // e.g., if server loaded 100 products and we load 20 at a time, start from page 6
      const nextPage = Math.ceil(existingProducts.length / loadMoreCount) + 1;
      setHasMore(total > existingProducts.length);
      setPage(nextPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiUrl, JSON.stringify(queryParams)]);

  const fetchProducts = async (pageNum: number, limit: number) => {
    try {
      const url = buildQueryString(pageNum, limit);
      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        let fetchedProducts = data.data.products || [];

        // Normalize products to match ProductItem interface
        fetchedProducts = fetchedProducts.map((p: any) => ({
          _id: p._id || p.id,
          name: p.name,
          tagline: p.tagline,
          website: p.website,
          logo: p.logo,
          score: p.score,
          grade: p.grade,
          rank: p.rank,
          topics: p.topics,
          slug: p.slug,
        }));

        if (pageNum === 1) {
          setProducts(fetchedProducts);
        } else {
          setProducts((prev) => [...prev, ...fetchedProducts]);
        }

        // Handle both "total" and "totalProducts" from different APIs
        const apiTotal =
          data.data.pagination?.total ??
          data.data.pagination?.totalProducts ??
          0;
        setTotal(apiTotal);
        // Handle both "pages" and "totalPages" from different APIs
        const totalPages =
          data.data.pagination?.pages ?? data.data.pagination?.totalPages ?? 1;
        setHasMore(data.data.pagination?.page < totalPages);

        // Notify parent
        if (pageNum === 1 && onProductsLoaded) {
          onProductsLoaded(fetchedProducts);
        }
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    fetchProducts(page, loadMoreCount);
    setPage((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-slate-600 font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div data-total={total} data-showing={products.length}>
      <InfiniteScroll
        dataLength={products.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        }
        endMessage={
          <div className="text-center py-8 text-slate-600">
            <p className="font-medium">🎉 You've reached the end!</p>
            <p className="text-sm mt-1">
              You've browsed all {total.toLocaleString()} products
            </p>
          </div>
        }
        className="space-y-4"
      >
        <div className={gridClassName}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
