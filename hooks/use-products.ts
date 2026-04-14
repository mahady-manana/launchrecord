"use client";

import { SIOV5Report } from "@/services/sio-report/schema";
import {
  useProductStore,
  type Product,
  type ProductWithReport,
} from "@/stores/product-store";
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
        (preview: any) => {
          const compositeScore = preview.compositeScore || 0;

          return {
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
                  _id: preview._id,
                  overallScore: preview.compositeScore,
                  score: preview.compositeScore,
                  statement: preview.statement || "Overall assessment",
                  overallCommentPositive: [],
                  overallCommentNegative: [],
                  websiteSummary: {
                    summary: "",
                    problems: {
                      currents: [],
                      positiveComments: [],
                      negativeComments: [],
                    },
                    outcomes: {
                      currents: [],
                      positiveComments: [],
                      negativeComments: [],
                    },
                    solutions: {
                      currents: [],
                      positiveComments: [],
                      negativeComments: [],
                    },
                    features: {
                      currents: [],
                      positiveComments: [],
                      negativeComments: [],
                    },
                    isPositioningClear: true,
                    isMessagingClear: true,
                    areUsersLeftGuessing: false,
                  },
                  firstImpression: {
                    score: preview.pillars?.firstImpression || 0,
                    statement: "",
                    recommendation: [],
                    overallCommentPositive: [],
                    overallCommentNegative: [],
                    headline: {
                      statement: "",
                      current: "",
                      positiveComments: [],
                      negativeComments: [],
                      recommendation: [],
                      suggested: [],
                    },
                    subheadline: {
                      statement: "",
                      current: "",
                      positiveComments: [],
                      negativeComments: [],
                      recommendation: [],
                      suggested: [],
                    },
                    cta: {
                      statement: "",
                      current: "",
                      positiveComments: [],
                      negativeComments: [],
                      recommendation: [],
                      suggested: [],
                    },
                  },
                  positioning: {
                    score: preview.pillars?.positioning || 0,
                    statement: "",
                    recommendation: [],
                    overallCommentPositive: [],
                    overallCommentNegative: [],
                    summary: {
                      current: "",
                      positiveComments: [],
                      negativeComments: [],
                      recommendation: [],
                      suggested: [],
                    },
                    subMetrics: {
                      categoryOwnership: {
                        statement: "",
                        score: 0,
                        current: "",
                        positiveComments: [],
                        negativeComments: [],
                        recommendation: [],
                        suggested: [],
                      },
                      uniqueValueProp: {
                        statement: "",
                        score: 0,
                        current: "",
                        positiveComments: [],
                        negativeComments: [],
                        recommendation: [],
                        suggested: [],
                      },
                      competitiveDiff: {
                        statement: "",
                        score: 0,
                        current: "",
                        positiveComments: [],
                        negativeComments: [],
                        recommendation: [],
                        suggested: [],
                      },
                      targetAudience: {
                        statement: "",
                        score: 0,
                        current: "",
                        positiveComments: [],
                        negativeComments: [],
                        recommendation: [],
                        suggested: [],
                      },
                      problemSolutionFit: {
                        statement: "",
                        score: 0,
                        current: "",
                        positiveComments: [],
                        negativeComments: [],
                        recommendation: [],
                        suggested: [],
                      },
                      messagingConsistency: {
                        statement: "",
                        score: 0,
                        current: "",
                        positiveComments: [],
                        negativeComments: [],
                        recommendation: [],
                        suggested: [],
                      },
                    },
                  },
                  clarity: {
                    score: preview.pillars?.clarity || 0,
                    statement: "",
                    recommendation: [],
                    overallCommentPositive: [],
                    overallCommentNegative: [],
                    summary: {
                      current: "",
                      positiveComments: [],
                      negativeComments: [],
                      recommendation: [],
                      suggested: [],
                    },
                    unclearSentences: [],
                    subMetrics: {
                      headlineClarity: {
                        statement: "",
                        score: 0,
                        current: "",
                        positiveComments: [],
                        negativeComments: [],
                        recommendation: [],
                        suggested: [],
                        unclearTexts: [],
                      },
                      valueProposition: {
                        statement: "",
                        score: 0,
                        current: "",
                        positiveComments: [],
                        negativeComments: [],
                        recommendation: [],
                        suggested: [],
                        unclearTexts: [],
                      },
                      featureBenefitMapping: {
                        statement: "",
                        score: 0,
                        current: "",
                        positiveComments: [],
                        negativeComments: [],
                        recommendation: [],
                        suggested: [],
                        unclearTexts: [],
                      },
                      visualHierarchy: {
                        statement: "",
                        score: 0,
                        current: "",
                        positiveComments: [],
                        negativeComments: [],
                        recommendation: [],
                        suggested: [],
                        unclearTexts: [],
                      },
                      ctaClarity: {
                        statement: "",
                        score: 0,
                        current: "",
                        positiveComments: [],
                        negativeComments: [],
                        recommendation: [],
                        suggested: [],
                        unclearTexts: [],
                      },
                      proofPlacement: {
                        statement: "",
                        score: 0,
                        current: "",
                        positiveComments: [],
                        negativeComments: [],
                        recommendation: [],
                        suggested: [],
                        unclearTexts: [],
                      },
                    },
                  },
                  aeo: {
                    score: preview.pillars?.aeo || 0,
                    statement: "",
                    aiPresence: { isPresent: false, engines: [], comment: "" },
                    recommendations: [],
                  },
                  analyzedUrl: preview.website || "",
                  analyzedAt: new Date().toISOString(),
                  band: {
                    name:
                      compositeScore >= 90
                        ? "Dominant"
                        : compositeScore >= 70
                          ? "Strong"
                          : compositeScore >= 50
                            ? "Blended"
                            : compositeScore >= 30
                              ? "Weak"
                              : "Ghost",
                    scoreRange:
                      compositeScore >= 90
                        ? "90-100"
                        : compositeScore >= 70
                          ? "70-89"
                          : compositeScore >= 50
                            ? "50-69"
                            : compositeScore >= 30
                              ? "30-49"
                              : "0-29",
                    description:
                      compositeScore >= 90
                        ? "You own the category"
                        : compositeScore >= 70
                          ? "Clear differentiation"
                          : compositeScore >= 50
                            ? "Understandable but not distinctive"
                            : compositeScore >= 30
                              ? "Unclear positioning"
                              : "Invisible to market",
                  },
                  url: preview.website || "",
                  createdAt: new Date(preview.createdAt),
                } as SIOV5Report)
              : null,
          };
        },
      );

      // Build reports cache
      const newReportsCache: Record<string, SIOV5Report | null> = {};
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
    async (productId: string, report: SIOV5Report | null) => {
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
