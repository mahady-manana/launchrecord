"use client";

import { useAuth } from "@/hooks/use-auth";
import { useProducts } from "@/hooks/use-products";
import { useEffect, useState } from "react";

interface DataInitializerProps {
  children: React.ReactNode;
}

export function DataInitializer({ children }: DataInitializerProps) {
  const { fetchProducts } = useProducts();
  const { refreshSession } = useAuth(true);
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

  useEffect(() => {
    refreshSession();
  }, []);

  return <>{children}</>;
}
