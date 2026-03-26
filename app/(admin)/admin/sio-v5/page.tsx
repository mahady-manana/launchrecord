"use client";

import { ActiveAuditsCard } from "@/components/admin/ActiveAuditsCard";
import { AddAuditDialog } from "@/components/admin/AddAuditDialog";
import { BulkImportDialog } from "@/components/admin/BulkImportDialog";
import { BulkSaveDialog } from "@/components/admin/BulkSaveDialog";
import { ProductsList } from "@/components/admin/ProductsList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileText, Loader2, RefreshCw, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface AuditProduct {
  _id: string;
  name: string;
  website: string;
  tagline?: string;
  description?: string;
  score?: number;
  addedByAdmin?: boolean;
  reports?: Array<{
    overallScore: number;
    status: string;
    createdAt: string;
  }>;
}

interface AuditTask {
  id: string;
  name: string;
  website: string;
  tagline: string;
  description: string;
  status: "pending" | "running" | "completed" | "error";
  progress: number;
  error?: string;
  result?: any;
  productId?: string;
  topics?: string[];
}

export default function SIOV5AdminPage() {
  const [products, setProducts] = useState<AuditProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [showNotAuditedOnly, setShowNotAuditedOnly] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set(),
  );

  const [activeAudits, setActiveAudits] = useState<AuditTask[]>([]);
  const [bulkImportQueue, setBulkImportQueue] = useState<AuditTask[]>([]);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        ...(searchTerm ? { search: searchTerm } : {}),
        ...(showNotAuditedOnly ? { notAudited: "true" } : {}),
      });

      const response = await fetch(`/api/admin/products?${params}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data.products);
        setTotalPages(data.data.pagination.pages);
        setTotalProducts(data.data.pagination.total);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, showNotAuditedOnly]);

  const handleUpdateWebsite = async (productId: string, website: string) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh products list
        await fetchProducts();
      } else {
        console.error("Failed to update website:", data.error);
        alert(`Failed to update website: ${data.error}`);
      }
    } catch (error) {
      console.error("Error updating website:", error);
      alert("Failed to update website. Please try again.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddAudit = (data: {
    name: string;
    website: string;
    tagline: string;
    description: string;
  }) => {
    const newAudit: AuditTask = {
      id: crypto.randomUUID(),
      ...data,
      status: "pending",
      progress: 0,
    };

    setActiveAudits((prev) => [...prev, newAudit]);
    runAudit(newAudit);
  };

  const handleBulkImport = async (data: any[]) => {
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Bulk import failed");
      }

      const queue: AuditTask[] = data
        .filter((item) => item.name && item.website)
        .map((item) => ({
          id: crypto.randomUUID(),
          name: item.name,
          website: item.website,
          tagline: item.tagline || "",
          description: item.tagline || "",
          status: "pending" as const,
          progress: 0,
          topics: item.topics || [],
        }));

      setBulkImportQueue(queue);
      setCurrentQueueIndex(0);
      setIsProcessingQueue(true);
      processQueue(queue, 0);
    } catch (error: any) {
      console.error("Bulk import error:", error);
      alert(error.message || "Failed to import products");
    }
  };

  const handleBulkSave = async (data: any[]) => {
    try {
      const response = await fetch("/api/admin/products/bulk-save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Bulk save failed");
      }

      alert(`Successfully saved ${result.savedCount || data.length} products`);
      fetchProducts();
    } catch (error: any) {
      console.error("Bulk save error:", error);
      alert(error.message || "Failed to save products");
    }
  };

  const processQueue = async (queue: AuditTask[], index: number) => {
    if (index >= queue.length) {
      setIsProcessingQueue(false);
      setCurrentQueueIndex(0);
      setBulkImportQueue([]);
      fetchProducts();
      return;
    }

    const audit = queue[index];

    try {
      const productsResponse = await fetch(
        `/api/admin/products?search=${encodeURIComponent(audit.name)}`,
      );
      const productsData = await productsResponse.json();

      const product = productsData.data?.products?.find(
        (p: any) =>
          p.website?.includes(audit.website) ||
          audit.website.includes(p.website),
      );

      if (!product) {
        throw new Error("Product not found after import");
      }

      const auditWithId = { ...audit, productId: product._id };
      setActiveAudits((prev) => [
        ...prev,
        { ...auditWithId, status: "pending", progress: 0 },
      ]);

      await runAuditFromQueue(auditWithId, index, queue);
    } catch (error) {
      console.error("Error finding product:", error);
      setActiveAudits((prev) => [
        ...prev,
        {
          ...audit,
          status: "error",
          progress: 100,
          error: "Product not found",
        },
      ]);
      setCurrentQueueIndex(index + 1);
      setTimeout(() => {
        processQueue(queue, index + 1);
      }, 500);
    }
  };

  const runAuditFromQueue = async (
    audit: AuditTask,
    index: number,
    queue: AuditTask[],
  ) => {
    setActiveAudits((prev) =>
      prev.map((a) =>
        a.id === audit.id ? { ...a, status: "running", progress: 25 } : a,
      ),
    );

    try {
      if (!audit.productId) {
        throw new Error("Product ID is required");
      }

      const response = await fetch("/api/admin/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: audit.productId }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setActiveAudits((prev) =>
          prev.map((a) =>
            a.id === audit.id
              ? {
                  ...a,
                  status: "completed",
                  progress: 100,
                  result: data.data,
                  productId: data.data.productId,
                }
              : a,
          ),
        );
        setCurrentQueueIndex(index + 1);
        setTimeout(() => {
          processQueue(queue, index + 1);
        }, 1000);
      } else {
        setActiveAudits((prev) =>
          prev.map((a) =>
            a.id === audit.id
              ? {
                  ...a,
                  status: "error",
                  progress: 100,
                  error: data.error || "Audit failed",
                }
              : a,
          ),
        );
        setCurrentQueueIndex(index + 1);
        setTimeout(() => {
          processQueue(queue, index + 1);
        }, 500);
      }
    } catch (error) {
      console.error("Audit error:", error);
      setActiveAudits((prev) =>
        prev.map((a) =>
          a.id === audit.id
            ? {
                ...a,
                status: "error",
                progress: 100,
                error: "Network error. Please try again.",
              }
            : a,
        ),
      );
      setCurrentQueueIndex(index + 1);
      setTimeout(() => {
        processQueue(queue, index + 1);
      }, 500);
    }
  };

  const runAudit = async (audit: AuditTask) => {
    setActiveAudits((prev) =>
      prev.map((a) =>
        a.id === audit.id ? { ...a, status: "running", progress: 25 } : a,
      ),
    );

    try {
      const productsResponse = await fetch(
        `/api/admin/products?search=${encodeURIComponent(audit.name)}`,
      );
      const productsData = await productsResponse.json();

      const product = productsData.data?.products?.find(
        (p: any) =>
          p.website?.includes(audit.website) ||
          audit.website.includes(p.website),
      );

      if (!product) {
        throw new Error("Product not found");
      }

      const response = await fetch("/api/admin/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setActiveAudits((prev) =>
          prev.map((a) =>
            a.id === audit.id
              ? {
                  ...a,
                  status: "completed",
                  progress: 100,
                  result: data.data,
                  productId: data.data.productId,
                }
              : a,
          ),
        );
        fetchProducts();
      } else {
        setActiveAudits((prev) =>
          prev.map((a) =>
            a.id === audit.id
              ? {
                  ...a,
                  status: "error",
                  progress: 100,
                  error: data.error || "Audit failed",
                }
              : a,
          ),
        );
      }
    } catch (error) {
      console.error("Audit error:", error);
      setActiveAudits((prev) =>
        prev.map((a) =>
          a.id === audit.id
            ? {
                ...a,
                status: "error",
                progress: 100,
                error: "Network error. Please try again.",
              }
            : a,
        ),
      );
    }
  };

  const runSingleAudit = async (product: AuditProduct) => {
    const auditTask: AuditTask = {
      id: crypto.randomUUID(),
      name: product.name,
      website: product.website,
      tagline: product.tagline || "",
      description: "",
      status: "pending",
      progress: 0,
      productId: product._id,
    };

    setActiveAudits((prev) => [
      ...prev,
      { ...auditTask, status: "running", progress: 25 },
    ]);

    try {
      const response = await fetch("/api/admin/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setActiveAudits((prev) =>
          prev.map((a) =>
            a.id === auditTask.id
              ? {
                  ...a,
                  status: "completed",
                  progress: 100,
                  result: data.data,
                  productId: data.data.productId,
                }
              : a,
          ),
        );
        fetchProducts();
      } else {
        setActiveAudits((prev) =>
          prev.map((a) =>
            a.id === auditTask.id
              ? {
                  ...a,
                  status: "error",
                  progress: 100,
                  error: data.error || "Audit failed",
                }
              : a,
          ),
        );
      }
    } catch (error) {
      console.error("Audit error:", error);
      setActiveAudits((prev) =>
        prev.map((a) =>
          a.id === auditTask.id
            ? {
                ...a,
                status: "error",
                progress: 100,
                error: "Network error. Please try again.",
              }
            : a,
        ),
      );
    }
  };

  const removeAudit = (id: string) => {
    setActiveAudits((prev) => prev.filter((a) => a.id !== id));
  };

  const retryAudit = (audit: AuditTask) => {
    setActiveAudits((prev) =>
      prev.map((a) =>
        a.id === audit.id ? { ...a, status: "pending", progress: 0 } : a,
      ),
    );
    runAudit(audit);
  };

  const pauseQueue = () => {
    setIsProcessingQueue(false);
  };

  const resumeQueue = () => {
    if (
      bulkImportQueue.length > 0 &&
      currentQueueIndex < bulkImportQueue.length
    ) {
      setIsProcessingQueue(true);
      processQueue(bulkImportQueue, currentQueueIndex);
    }
  };

  const auditAllUnaudited = async () => {
    const unauditedProducts = products.filter(
      (p) => !p.reports || p.reports.length === 0,
    );

    if (unauditedProducts.length === 0) {
      alert("All products have been audited!");
      return;
    }

    if (
      !confirm(
        `Run audits on ${unauditedProducts.length} unaudited products? This will process them one by one.`,
      )
    ) {
      return;
    }

    const queue: AuditTask[] = unauditedProducts.map((p) => ({
      id: crypto.randomUUID(),
      name: p.name,
      website: p.website,
      tagline: p.tagline || "",
      description: "",
      status: "pending" as const,
      progress: 0,
      productId: p._id,
    }));

    setBulkImportQueue(queue);
    setCurrentQueueIndex(0);
    setIsProcessingQueue(true);
    processQueue(queue, 0);
  };

  const auditSelected = async () => {
    const selectedCount = selectedProducts.size;

    if (selectedCount === 0) {
      alert("Please select at least one product");
      return;
    }

    if (
      !confirm(
        `Run audits on ${selectedCount} selected products? This will process them one by one.`,
      )
    ) {
      return;
    }

    const selectedProductsList = products.filter((p) =>
      selectedProducts.has(p._id),
    );
    const queue: AuditTask[] = selectedProductsList.map((p) => ({
      id: crypto.randomUUID(),
      name: p.name,
      website: p.website,
      tagline: p.tagline || "",
      description: "",
      status: "pending" as const,
      progress: 0,
      productId: p._id,
    }));

    setBulkImportQueue(queue);
    setCurrentQueueIndex(0);
    setIsProcessingQueue(true);
    setSelectedProducts(new Set());
    processQueue(queue, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">SIO-V5 Audit Dashboard</h1>
          <p className="text-muted-foreground">
            Run audits on multiple products sequentially
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={showNotAuditedOnly ? "default" : "outline"}
            className="gap-2"
            onClick={() => {
              setShowNotAuditedOnly(!showNotAuditedOnly);
              setPage(1);
            }}
          >
            <FileText className="h-4 w-4" />
            {showNotAuditedOnly ? "Showing Not Audited" : "Show Not Audited"}
          </Button>
          {selectedProducts.size > 0 && (
            <Button
              variant="default"
              className="gap-2 bg-green-600 hover:bg-green-700"
              onClick={auditSelected}
            >
              <RefreshCw className="h-4 w-4" />
              Audit Selected ({selectedProducts.size})
            </Button>
          )}
          <BulkImportDialog onImport={handleBulkImport} />
          <BulkSaveDialog onSave={handleBulkSave} />
          <AddAuditDialog onAdd={handleAddAudit} />
        </div>
      </div>

      {/* Active Audits */}
      {activeAudits.length > 0 && (
        <ActiveAuditsCard
          audits={activeAudits}
          isProcessingQueue={isProcessingQueue}
          currentQueueIndex={currentQueueIndex}
          totalQueueLength={bulkImportQueue.length}
          onPause={pauseQueue}
          onResume={resumeQueue}
          onRetry={retryAudit}
          onRemove={removeAudit}
        />
      )}

      {/* Products List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Products ({totalProducts})
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  className="pl-9 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No products found. Start by adding an audit.</p>
            </div>
          ) : (
            <ProductsList
              products={products}
              loading={loading}
              onAudit={runSingleAudit}
              selectedProducts={selectedProducts}
              onToggleSelect={(id) => {
                const newSelected = new Set(selectedProducts);
                if (newSelected.has(id)) {
                  newSelected.delete(id);
                } else {
                  newSelected.add(id);
                }
                setSelectedProducts(newSelected);
              }}
              onSelectAll={() => {
                if (selectedProducts.size === products.length) {
                  setSelectedProducts(new Set());
                } else {
                  setSelectedProducts(new Set(products.map((p) => p._id)));
                }
              }}
              onUpdateWebsite={handleUpdateWebsite}
            />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
