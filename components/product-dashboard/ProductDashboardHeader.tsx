"use client";

import { Button } from "@/components/ui/button";
import { useProductStore } from "@/stores/product-store";
import { ArrowLeft, Globe } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductDashboardHeaderProps {
  onRunAudit: () => void;
  onExport: () => void;
  onSettings: () => void;
}

export function ProductDashboardHeader({
  onRunAudit,
  onExport,
  onSettings,
}: ProductDashboardHeaderProps) {
  const router = useRouter();
  const { selectedProduct } = useProductStore();

  const handleBack = () => {
    router.push("/dashboard");
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <div className="flex items-center gap-3">
            {selectedProduct?.logo ? (
              <img
                src={selectedProduct.logo}
                alt={selectedProduct.name}
                className="h-10 w-10 rounded-lg object-cover border"
              />
            ) : (
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <Globe className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold">{selectedProduct?.name}</h1>
              {selectedProduct?.tagline && (
                <p className="text-muted-foreground">{selectedProduct.tagline}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={onRunAudit} size="sm">
          Run Audit
        </Button>
        <Button variant="outline" size="sm" onClick={onExport}>
          Export
        </Button>
        <Button variant="outline" size="sm" onClick={onSettings}>
          Settings
        </Button>
      </div>
    </div>
  );
}
