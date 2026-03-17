"use client";

import { useProducts } from "@/hooks/use-products";
import { useProductStore } from "@/stores/product-store";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ product: string }>;
}) {
  const router = useRouter();
  const { selectedProduct, setSelectedProduct, products } = useProductStore();
  const { fetchProducts } = useProducts();
  const [isInitializing, setIsInitializing] = useState(true);
  const [productId, setProductId] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      const { product: productIdFromParams } = await params;
      setProductId(productIdFromParams);

      // Fetch products if not already loaded
      if (products.length === 0) {
        await fetchProducts();
      }
    }

    loadProduct();
  }, [params]);

  useEffect(() => {
    if (!productId || products.length === 0) return;

    // Find the product in the store
    const foundProduct = products.find(
      (p) => p.id === productId || p._id === productId
    );

    if (foundProduct) {
      setSelectedProduct(foundProduct);
      setIsInitializing(false);
    } else {
      // Product not found, redirect to dashboard
      router.push("/dashboard");
    }
  }, [productId, products, setSelectedProduct, router]);

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-orange-600 border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!selectedProduct) {
    return null;
  }

  return <>{children}</>;
}
