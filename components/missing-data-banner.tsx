"use client";

import { Button } from "@/components/ui/button";
import { useProductStore } from "@/stores/product-store";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

interface MissingDataBannerProps {
  className?: string;
}

export function MissingDataBanner({ className }: MissingDataBannerProps) {
  const router = useRouter();
  const { selectedProduct } = useProductStore();

  if (!selectedProduct) return null;

  const missingFields: string[] = [];

  if (!selectedProduct.logo) {
    missingFields.push("Logo");
  }
  if (!selectedProduct.tagline) {
    missingFields.push("Tagline");
  }
  if (!selectedProduct.description) {
    missingFields.push("Description");
  }
  if (!selectedProduct.topics?.length) {
    missingFields.push("Topics");
  }

  if (missingFields.length === 0) {
    return null;
  }

  const handleComplete = () => {
    if (selectedProduct) {
      router.push(`/dashboard/${selectedProduct.id}/settings`);
    }
  };

  return (
    <div
      className={`bg-red-50 border-2 border-red-200 rounded-lg p-4 ${className || ""}`}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-red-100 rounded-lg shrink-0">
          <AlertTriangle className="h-5 w-5 text-red-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-red-800">
            Incomplete Product Information
          </h3>
          <p className="text-sm text-red-700 mt-1">
            Missing:{" "}
            <span className="font-medium">{missingFields.join(", ")}</span>.
            Complete your profile for better listing on{" "}
            <span>Launchrecord directories</span>.
          </p>
          <Button
            onClick={handleComplete}
            size="sm"
            variant="destructive"
            className="mt-3"
          >
            Complete Now
          </Button>
        </div>
      </div>
    </div>
  );
}
