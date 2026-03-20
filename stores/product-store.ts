import { AuditReportV1 } from "@/types/audit-report-v1";
import { create } from "zustand";

export interface Product {
  _id: string;
  id: string;
  name: string;
  description?: string | null;
  tagline?: string | null;
  logo?: string | null;
  website?: string | null;
  users?: string[];
  topics?: string[];
  score?: number | null;
  earlyAccess?: boolean;
  addedByAdmin?: boolean;
  surveyData?: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductWithReport extends Product {
  report?: AuditReportV1 | null;
}

interface ProductState {
  products: Product[];
  productsWithReports: ProductWithReport[];
  reportsCache: Record<string, AuditReportV1 | null>;
  selectedProduct: Product | null;
  isLoading: boolean;
  isReportsLoading: boolean;
  error: string | null;

  // Actions
  setProducts: (products: Product[]) => void;
  setProductsWithReports: (products: ProductWithReport[]) => void;
  setReportsCache: (reports: Record<string, AuditReportV1 | null>) => void;
  updateReportCache: (productId: string, report: AuditReportV1 | null) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  setSelectedProduct: (product: Product | null) => void;
  setLoading: (loading: boolean) => void;
  setReportsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearProducts: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  productsWithReports: [],
  reportsCache: {},
  selectedProduct: null,
  isLoading: false,
  isReportsLoading: false,
  error: null,

  setProducts: (products) => set({ products }),

  setProductsWithReports: (productsWithReports) => set({ productsWithReports }),

  setReportsCache: (reportsCache) => set({ reportsCache }),

  updateReportCache: (productId, report) =>
    set((state) => ({
      reportsCache: { ...state.reportsCache, [productId]: report },
      productsWithReports: state.productsWithReports.map((p) =>
        p.id === productId ? { ...p, report } : p,
      ),
    })),

  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product],
      productsWithReports: [
        ...state.productsWithReports,
        { ...product, report: state.reportsCache[product.id] || null },
      ],
    })),

  updateProduct: (id, updates) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id || p._id === id ? { ...p, ...updates } : p,
      ),
      productsWithReports: state.productsWithReports.map((p) =>
        p.id === id || p._id === id ? { ...p, ...updates } : p,
      ),
      selectedProduct:
        state.selectedProduct?.id === id || state.selectedProduct?._id === id
          ? { ...state.selectedProduct, ...updates }
          : state.selectedProduct,
    })),

  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id && p._id !== id),
      productsWithReports: state.productsWithReports.filter(
        (p) => p.id !== id && p._id !== id,
      ),
      selectedProduct:
        state.selectedProduct?.id === id || state.selectedProduct?._id === id
          ? null
          : state.selectedProduct,
    })),

  setSelectedProduct: (product) => set({ selectedProduct: product }),

  setLoading: (loading) => set({ isLoading: loading }),

  setReportsLoading: (loading) => set({ isReportsLoading: loading }),

  setError: (error) => set({ error }),

  clearProducts: () =>
    set({
      products: [],
      productsWithReports: [],
      reportsCache: {},
      selectedProduct: null,
      error: null,
    }),
}));
