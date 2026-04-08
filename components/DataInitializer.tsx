"use client";

import { useAuth } from "@/hooks/use-auth";
import { useProducts } from "@/hooks/use-products";
import { useProductStore } from "@/stores/product-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface DataInitializerProps {
  children: React.ReactNode;
}

export function DataInitializer({ children }: DataInitializerProps) {
  const { fetchProducts } = useProducts();
  const { refreshSession } = useAuth(true);
  const { products, selectedProduct, setSelectedProduct } = useProductStore();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize all data on dashboard access
    const initializeData = async () => {
      try {
        // Fetch user products
        await fetchProducts();

        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to initialize dashboard data:", error);
        setIsInitialized(true); // Continue anyway
      }
    };

    if (!isInitialized) {
      initializeData();
    }
  }, [fetchProducts, isInitialized]);

  // Auto-select first product and redirect if none selected and products exist
  useEffect(() => {
    if (isInitialized && !selectedProduct && products.length > 0) {
      setSelectedProduct(products[0]);
      router.push(`/dashboard/${products[0].id}`);
    }
  }, [isInitialized, products, selectedProduct, setSelectedProduct, router]);

  useEffect(() => {
    refreshSession();
  }, []);

  return <>{children}</>;
}
