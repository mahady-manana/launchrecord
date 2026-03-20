"use client";

import {
  useProductStore,
  type Product,
  type ProductWithReport,
} from "@/stores/product-store";
import { AuditReportV1 } from "@/types/audit-report-v1";
import { useCallback, useState } from "react";

export function useProducts() {
  const {
    products,
    productsWithReports,
    reportsCache,
    setProducts,
    setProductsWithReports,
    setReportsCache,
    updateReportCache,
    addProduct,
    updateProduct,
    removeProduct,
    setLoading,
    setReportsLoading,
    setSelectedProduct,
    setError,
  } = useProductStore();
  const [isMutating, setIsMutating] = useState(false);

  // Fetch all user products
  const fetchProducts = useCallback(
    async (currentId?: string) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/products");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch products");
        }

        setProducts(data.products || []);
        if (currentId && Array.isArray(data.products)) {
          const current = data.products.find((p: any) => p.id === currentId);
          if (current) {
            setSelectedProduct(current);
          }
        }
        return data.products || [];
      } catch (error: any) {
        setError(error.message || "Failed to fetch products");
        return [];
      } finally {
        setLoading(false);
      }
    },
    [setProducts, setLoading, setError],
  );

  // Fetch all user products with reports in a single API call
  const loadProductsReports = useCallback(async (): Promise<
    ProductWithReport[]
  > => {
    setReportsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/products/preview");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch products preview");
      }

      const productPreviews = data.products || [];

      // Transform preview data to ProductWithReport format
      const productsWithReportsData: ProductWithReport[] = productPreviews.map(
        (preview: any) => ({
          _id: preview._id,
          id: preview.id,
          name: preview.name,
          tagline: preview.tagline,
          logo: preview.logo,
          website: preview.website,
          score: preview.score,
          createdAt: preview.createdAt,
          updatedAt: preview.updatedAt,
          report: preview.hasReport
            ? ({
                overall_assessment: {
                  composite_score: preview.compositeScore,
                  primary_constraint: preview.primaryConstraint,
                  biggest_leverage_point: preview.biggestLeveragePoint,
                  category_position: preview.categoryPosition,
                  survival_probability_12m: 50, // Default value as not included in preview
                },
                aeo_index: { score: preview.pillars.aeo },
                positioning_sharpness: { score: preview.pillars.positioning },
                clarity_velocity: { score: preview.pillars.clarity },
                momentum_signal: { score: preview.pillars.momentum },
                founder_proof_vault: { score: preview.pillars.proof },
              } as AuditReportV1)
            : null,
        }),
      );

      // Build reports cache
      const newReportsCache: Record<string, AuditReportV1 | null> = {};
      productsWithReportsData.forEach((p) => {
        if (p.report) {
          newReportsCache[p.id] = p.report;
        }
      });

      setReportsCache(newReportsCache);
      setProductsWithReports(productsWithReportsData);

      return productsWithReportsData;
    } catch (error: any) {
      setError(error.message || "Failed to load product reports");
      return [];
    } finally {
      setReportsLoading(false);
    }
  }, [setReportsCache, setProductsWithReports, setReportsLoading, setError]);

  // Load products and their reports (main entry point)
  const loadAllProductsData = useCallback(async (): Promise<
    ProductWithReport[]
  > => {
    setLoading(true);
    const productsWithReportsData = await loadProductsReports();
    setLoading(false);

    return productsWithReportsData;
  }, [loadProductsReports, setLoading]);

  // Refresh reports for all products (use when returning to dashboard)
  const refreshProductsReports = useCallback(async (): Promise<
    ProductWithReport[]
  > => {
    return loadProductsReports();
  }, [loadProductsReports]);

  // Create a new product
  const createProduct = useCallback(
    async (productData: {
      name: string;
      website: string;
      description?: string;
      tagline?: string;
    }) => {
      setIsMutating(true);
      setError(null);

      try {
        const response = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create product");
        }

        addProduct(data.product);
        return data.product;
      } catch (error: any) {
        setError(error.message || "Failed to create product");
        throw error;
      } finally {
        setIsMutating(false);
      }
    },
    [addProduct, setError],
  );

  // Update a product
  const updateProductById = useCallback(
    async (productId: string, updates: Partial<Product>) => {
      setIsMutating(true);
      setError(null);

      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to update product");
        }

        updateProduct(productId, data.product || updates);
        return data.product;
      } catch (error: any) {
        setError(error.message || "Failed to update product");
        throw error;
      } finally {
        setIsMutating(false);
      }
    },
    [updateProduct, setError],
  );

  // Update product report after audit
  const updateProductReport = useCallback(
    async (productId: string, report: AuditReportV1 | null) => {
      updateReportCache(productId, report);
    },
    [updateReportCache],
  );

  // Delete a product
  const deleteProduct = useCallback(
    async (productId: string) => {
      setIsMutating(true);
      setError(null);

      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to delete product");
        }

        removeProduct(productId);
      } catch (error: any) {
        setError(error.message || "Failed to delete product");
        throw error;
      } finally {
        setIsMutating(false);
      }
    },
    [removeProduct, setError],
  );

  return {
    products,
    productsWithReports,
    reportsCache,
    isMutating,
    fetchProducts,
    loadProductsReports,
    loadAllProductsData,
    refreshProductsReports,
    createProduct,
    updateProduct: updateProductById,
    updateProductReport,
    deleteProduct,
  };
}
