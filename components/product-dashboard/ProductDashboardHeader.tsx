"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/use-subscription";
import { useProductStore } from "@/stores/product-store";
import { ArrowLeft, Crown, Globe } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const { fetchSubscription, subscription } = useSubscription();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (selectedProduct?.id) {
      fetchSubscription(selectedProduct.id).finally(() => setIsLoading(false));
    }
  }, [selectedProduct?.id]);

  const handleBack = () => {
    router.push("/dashboard");
  };

  const hasActiveSubscription = subscription?.status === "active";
  const planType = subscription?.planType;

  const getPlanBadgeColor = (plan: string | undefined) => {
    switch (plan) {
      case "founder":
        return "bg-blue-100 text-blue-700";
      case "growth":
        return "bg-purple-100 text-purple-700";
      case "sovereign":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
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
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">{selectedProduct?.name}</h1>
                {!isLoading && (
                  <Badge
                    variant="outline"
                    className={getPlanBadgeColor(planType)}
                  >
                    {hasActiveSubscription ? (
                      <span className="capitalize">{planType}</span>
                    ) : (
                      "Free"
                    )}
                  </Badge>
                )}
              </div>
              {selectedProduct?.tagline && (
                <p className="text-muted-foreground">
                  {selectedProduct.tagline}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link href={`/dashboard/${selectedProduct?.id}/subscription`}>
          <Button
            variant={hasActiveSubscription ? "outline" : "default"}
            size="sm"
            className={
              hasActiveSubscription
                ? ""
                : "bg-gradient-to-r from-primary to-primary/80"
            }
          >
            <Crown className="h-4 w-4 mr-2" />
            {hasActiveSubscription ? "Manage Plan" : "Upgrade"}
          </Button>
        </Link>
        <Button onClick={onRunAudit} size="sm">
          Run Audit
        </Button>
        <Button variant="outline" size="sm" onClick={onExport} disabled>
          Export
        </Button>
        <Button variant="outline" size="sm" onClick={onSettings}>
          Settings
        </Button>
      </div>
    </div>
  );
}
