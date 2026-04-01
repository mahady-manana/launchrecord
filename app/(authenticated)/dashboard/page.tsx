"use client";

import {
  BillingOverview,
  KPISummary,
  ProductSection,
  QuickActions,
} from "@/components/dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { useProducts } from "@/hooks/use-products";
import { SIOV5Report } from "@/services/sio-report/schema";
import { useProductStore } from "@/stores/product-store";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DashboardPage() {
  const router = useRouter();
  const { productsWithReports, isReportsLoading } = useProductStore();
  const {
    loadAllProductsData,
    createProduct,
    refreshProductsReports,
    isMutating,
  } = useProducts();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    website: "",
    description: "",
    tagline: "",
  });

  useEffect(() => {
    loadAllProductsData();
  }, [loadAllProductsData]);

  const handleViewProduct = (productId: string) => {
    router.push(`/dashboard/${productId}`);
  };

  const handleUpgrade = (productId: string) => {
    router.push(`/dashboard/${productId}/subscription`);
  };

  const handleManageBilling = (productId: string) => {
    router.push(`/dashboard/${productId}/subscription`);
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.website) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      await createProduct({
        name: newProduct.name,
        website: newProduct.website,
        description: newProduct.description || undefined,
        tagline: newProduct.tagline || undefined,
      });

      toast.success("Product added successfully!");
      setIsAddDialogOpen(false);
      setNewProduct({ name: "", website: "", description: "", tagline: "" });
      await refreshProductsReports();
    } catch (error) {
      toast.error("Failed to add product");
      console.error(error);
    }
  };

  // Prepare billing data
  const billingData = productsWithReports.map((p) => ({
    productId: p.id,
    productName: p.name,
    plan: "free" as const,
    status: "active" as const,
  }));

  // Prepare reports map for KPI
  const reportsMap = productsWithReports.reduce(
    (acc, p) => ({ ...acc, [p.id]: p.report || null }),
    {} as Record<string, SIOV5Report | null>,
  );

  const isLoading = isReportsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="relative inline-flex">
            <div className="animate-spin h-10 w-10 border-4 border-orange-200 border-t-orange-500 rounded-full" />
            <div className="absolute inset-0 animate-ping h-10 w-10 border-4 border-orange-300 border-t-transparent rounded-full opacity-20" />
          </div>
          <p className="text-slate-500 font-medium">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Product Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor all your products and their SIO-V5 scores
          </p>
        </div>
        <QuickActions context="dashboard" />
      </div>

      {/* KPI Summary */}
      <KPISummary products={productsWithReports} reports={reportsMap} />

      {/* Products Sections */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Your Products</h2>
          <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {productsWithReports.length} product
            {productsWithReports.length !== 1 ? "s" : ""}
          </span>
        </div>

        {productsWithReports.length === 0 ? (
          <Card className="border-2 border-dashed border-slate-300 bg-slate-50/50">
            <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                <Plus className="h-10 w-10 text-orange-600" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-slate-900">
                  No products yet
                </h3>
                <p className="text-slate-500 mt-1">
                  Add your first product to start tracking SIO-V5 scores
                </p>
              </div>
              <Link
                href="/dashboard/survey"
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {productsWithReports.map((product) => (
              <ProductSection
                key={product.id}
                product={product}
                report={product.report}
                onViewProduct={() => handleViewProduct(product.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Billing Overview */}
      <BillingOverview
        billings={billingData}
        onUpgrade={handleUpgrade}
        onManageBilling={handleManageBilling}
      />
    </div>
  );
}
