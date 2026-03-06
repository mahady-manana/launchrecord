"use client";

import { useProductStore, type Product } from "@/stores/product-store";
import { useCallback, useState } from "react";

export function useProducts() {
  const { products, setProducts, addProduct, updateProduct, removeProduct, setLoading, setError } = useProductStore();
  const [isMutating, setIsMutating] = useState(false);

  // Fetch all user products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/products");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch products");
      }

      setProducts(data.products || []);
      return data.products || [];
    } catch (error: any) {
      setError(error.message || "Failed to fetch products");
      return [];
    } finally {
      setLoading(false);
    }
  }, [setProducts, setLoading, setError]);

  // Create a new product
  const createProduct = useCallback(async (productData: {
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
  }, [addProduct, setError]);

  // Update a product
  const updateProductById = useCallback(async (
    productId: string,
    updates: Partial<Product>
  ) => {
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
  }, [updateProduct, setError]);

  // Delete a product
  const deleteProduct = useCallback(async (productId: string) => {
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
  }, [removeProduct, setError]);

  return {
    products,
    isMutating,
    fetchProducts,
    createProduct,
    updateProduct: updateProductById,
    deleteProduct,
  };
}
