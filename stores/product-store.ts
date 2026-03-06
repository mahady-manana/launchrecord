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
  score?: number | null;
  earlyAccess?: boolean;
  addedByAdmin?: boolean;
  surveyData?: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
}

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  setSelectedProduct: (product: Product | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearProducts: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  
  setProducts: (products) => set({ products }),
  
  addProduct: (product) => set((state) => ({
    products: [...state.products, product],
  })),
  
  updateProduct: (id, updates) => set((state) => ({
    products: state.products.map((p) =>
      p.id === id || p._id === id ? { ...p, ...updates } : p
    ),
    selectedProduct: state.selectedProduct?.id === id || state.selectedProduct?._id === id
      ? { ...state.selectedProduct, ...updates }
      : state.selectedProduct,
  })),
  
  removeProduct: (id) => set((state) => ({
    products: state.products.filter((p) => p.id !== id && p._id !== id),
    selectedProduct: state.selectedProduct?.id === id || state.selectedProduct?._id === id
      ? null
      : state.selectedProduct,
  })),
  
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  clearProducts: () => set({
    products: [],
    selectedProduct: null,
    error: null,
  }),
}));
