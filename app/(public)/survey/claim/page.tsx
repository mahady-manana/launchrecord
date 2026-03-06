"use client";

import { ClaimProductForm } from "@/components/ClaimProductForm";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function ClaimProductContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [productId, setProductId] = useState<string | null>(null);
  const [productName, setProductName] = useState("");
  const [productWebsite, setProductWebsite] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const id = searchParams.get("product");
    const name = searchParams.get("name");
    const website = searchParams.get("website");

    if (!id) {
      router.push("/survey");
      return;
    }

    setProductId(id);
    setProductName(name || "Unknown Product");
    setProductWebsite(website || "");
    setIsLoading(false);
  }, [searchParams, router]);

  const handleClaimSuccess = () => {
    // After successful claim, save product ID and redirect to survey auth
    if (productId) {
      localStorage.setItem("survey_product_id", productId);
      localStorage.setItem("survey_answers", JSON.stringify({
        founderName: "",
        saasName: productName,
        saasUrl: productWebsite,
        role: "",
        teamSize: "",
        revenue: "",
        biggestChallenge: "",
        aeoAwareness: "",
        description: "",
        willingToInvest: "",
      }));
    }
    // Redirect to survey auth to complete their product info in dashboard
    router.push("/survey/auth");
  };

  const handleBack = () => {
    router.push("/survey");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto" />
          <p className="text-muted-foreground">Loading claim form...</p>
        </div>
      </div>
    );
  }

  if (!productId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <ClaimProductForm
          productId={productId}
          productName={productName}
          productWebsite={productWebsite}
          onClaimSuccess={handleClaimSuccess}
          onBack={handleBack}
        />
      </div>
    </div>
  );
}

export default function ClaimProductPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <ClaimProductContent />
    </Suspense>
  );
}
