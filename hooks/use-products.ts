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
                _id: preview._id,
                overallScore: preview.compositeScore,
                score: preview.compositeScore,
                statement: preview.statement || "Overall assessment",
                overallCommentPositive: [],
                overallCommentNegative: [],
                websiteSummary: {
                  summary: preview.categoryPosition || "",
                  summaryComment: "",
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
                  score: preview.pillars.clarity,
                  statement: "First impression analysis",
                  recommendation: [],
                  overallCommentPositive: [],
                  overallCommentNegative: [],
                  headline: {
                    current: "",
                    positiveComments: [],
                    negativeComments: [],
                    recommendation: [],
                    suggested: [],
                  },
                  subheadline: {
                    current: "",
                    positiveComments: [],
                    negativeComments: [],
                    recommendation: [],
                    suggested: [],
                  },
                  cta: {
                    current: "",
                    positiveComments: [],
                    negativeComments: [],
                    recommendation: [],
                    suggested: [],
                  },
                },
                positioning: {
                  score: preview.pillars.positioning,
                  statement: "Positioning analysis",
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
                      name: "Category Ownership",
                      score: preview.pillars.positioning,
                      current: "",
                      positiveComments: [],
                      negativeComments: [],
                      recommendation: [],
                      suggested: [],
                    },
                    uniqueValueProp: {
                      name: "Unique Value Prop",
                      score: preview.pillars.positioning,
                      current: "",
                      positiveComments: [],
                      negativeComments: [],
                      recommendation: [],
                      suggested: [],
                    },
                    competitiveDiff: {
                      name: "Competitive Diff",
                      score: preview.pillars.positioning,
                      current: "",
                      positiveComments: [],
                      negativeComments: [],
                      recommendation: [],
                      suggested: [],
                    },
                    targetAudience: {
                      name: "Target Audience",
                      score: preview.pillars.positioning,
                      current: "",
                      positiveComments: [],
                      negativeComments: [],
                      recommendation: [],
                      suggested: [],
                    },
                    problemSolutionFit: {
                      name: "Problem-Solution Fit",
                      score: preview.pillars.positioning,
                      current: "",
                      positiveComments: [],
                      negativeComments: [],
                      recommendation: [],
                      suggested: [],
                    },
                    messagingConsistency: {
                      name: "Messaging Consistency",
                      score: preview.pillars.positioning,
                      current: "",
                      positiveComments: [],
                      negativeComments: [],
                      recommendation: [],
                      suggested: [],
                    },
                  },
                },
                clarity: {
                  score: preview.pillars.clarity,
                  statement: "Clarity analysis",
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
                      name: "Headline Clarity",
                      score: preview.pillars.clarity,
                      current: "",
                      positiveComments: [],
                      negativeComments: [],
                      recommendation: [],
                      suggested: [],
                      unclearTexts: [],
                    },
                    valueProposition: {
                      name: "Value Proposition",
                      score: preview.pillars.clarity,
                      current: "",
                      positiveComments: [],
                      negativeComments: [],
                      recommendation: [],
                      suggested: [],
                      unclearTexts: [],
                    },
                    featureBenefitMapping: {
                      name: "Feature-Benefit Mapping",
                      score: preview.pillars.clarity,
                      current: "",
                      positiveComments: [],
                      negativeComments: [],
                      recommendation: [],
                      suggested: [],
                      unclearTexts: [],
                    },
                    visualHierarchy: {
                      name: "Visual Hierarchy",
                      score: preview.pillars.clarity,
                      current: "",
                      positiveComments: [],
                      negativeComments: [],
                      recommendation: [],
                      suggested: [],
                      unclearTexts: [],
                    },
                    ctaClarity: {
                      name: "CTA Clarity",
                      score: preview.pillars.clarity,
                      current: "",
                      positiveComments: [],
                      negativeComments: [],
                      recommendation: [],
                      suggested: [],
                      unclearTexts: [],
                    },
                    proofPlacement: {
                      name: "Proof Placement",
                      score: preview.pillars.clarity,
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
                  score: preview.pillars.aeo,
                  statement: "AEO analysis",
                  aiPresence: { isPresent: false, engines: [], comment: "" },
                  recommendations: [],
                },
                analyzedUrl: preview.website || "",
                analyzedAt: preview.updatedAt,
                band: {
                  name: "Blended",
                  scoreRange: "50-69",
                  description: "Understandable but not distinctive",
                },
                url: preview.website || "",
                createdAt: new Date(preview.createdAt),
              } as SIOV5Report)
            : null,
        }),
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
