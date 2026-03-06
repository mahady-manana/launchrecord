"use client";

import { SurveyHero } from "@/components/survey";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

interface ExistingProduct {
  id: string;
  name: string;
  website: string;
  addedByAdmin: boolean;
  hasUser: boolean;
}

type ProductStatus = 
  | "idle"
  | "checking"
  | "new"           // New product, let them cook
  | "admin-owned"   // Added by admin, needs claim
  | "user-owned"    // Owned by another user
  | "claimed";      // Already claimed by current user

function LaunchRecordSurveyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isInitialized, setIsInitialized] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const initialURL = searchParams.get("url") || "";

  const [productStatus, setProductStatus] = useState<ProductStatus>("checking");
  const [existingProduct, setExistingProduct] = useState<ExistingProduct | null>(null);
  const [checkingProduct, setCheckingProduct] = useState(false);

  const [saasUrl, setSaasUrl] = useState(initialURL);

  // Initialize survey - check for existing product
  useEffect(() => {
    if (initialURL && !isInitialized) {
      setIsInitialized(true);
      initializeSurvey(initialURL);
    } else if (!initialURL) {
      setIsInitialized(true);
      setProductStatus("idle"); // Ready for input
    }
  }, [initialURL]);

  // Redirect to claim page when admin-owned product is found
  useEffect(() => {
    if (productStatus === "admin-owned" && existingProduct) {
      router.push(
        `/survey/claim?product=${existingProduct.id}&name=${encodeURIComponent(existingProduct.name)}&website=${encodeURIComponent(existingProduct.website)}`
      );
    }
  }, [productStatus, existingProduct, router]);

  const initializeSurvey = async (url: string) => {
    setCheckingProduct(true);
    try {
      const response = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          saasName: "Unknown",
          saasUrl: url,
          founderName: "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Case 2: Product owned by another user
        if (data.alreadyClaimed) {
          setProductStatus("user-owned");
          setExistingProduct({
            id: data.productId || "",
            name: data.productName || "Unknown",
            website: url,
            addedByAdmin: false,
            hasUser: true,
          });
          return;
        }
        throw new Error(data.error || "Failed to initialize survey");
      }

      // Product exists or created successfully
      if (data.productId) {
        setProductId(data.productId);
        localStorage.setItem("survey_product_id", data.productId);

        // Case 1: Added by admin, needs claim
        if (data.requiresClaim && data.existing) {
          setProductStatus("admin-owned");
          setExistingProduct({
            id: data.productId,
            name: data.productName || "Unknown",
            website: data.productWebsite || url,
            addedByAdmin: true,
            hasUser: false,
          });
          return;
        }

        // Case 3: Existing product (not new) - block user, require claim or login
        if (data.existing) {
          // Check if there's existing survey/audit data
          const auditResponse = await fetch(
            `/api/audit?productId=${data.productId}`,
          );
          const auditData = await auditResponse.json();

          if (auditData.success && auditData.data?.existing) {
            // Has existing audit - but user still needs to claim/login first
            // Treat as admin-owned requiring claim
            setProductStatus("admin-owned");
            setExistingProduct({
              id: data.productId,
              name: data.productName || "Unknown",
              website: data.productWebsite || url,
              addedByAdmin: true,
              hasUser: false,
            });
            return;
          }
          
          // Product exists but no audit - require claim
          setProductStatus("admin-owned");
          setExistingProduct({
            id: data.productId,
            name: data.productName || "Unknown",
            website: url,
            addedByAdmin: false,
            hasUser: false,
          });
          return;
        }

        // New product - let them cook (go to survey)
        setProductStatus("new");
        localStorage.setItem("survey_answers", JSON.stringify({
          founderName: "",
          saasName: "",
          saasUrl: url,
          role: "",
          teamSize: "",
          revenue: "",
          biggestChallenge: "",
          aeoAwareness: "",
          description: "",
          willingToInvest: "",
        }));
        router.push("/survey/0");
      }
    } catch (error) {
      console.error("Error initializing survey:", error);
      // Still allow user to continue even if initialization fails
      setProductStatus("new");
      localStorage.setItem("survey_answers", JSON.stringify({
        founderName: "",
        saasName: "",
        saasUrl: url,
        role: "",
        teamSize: "",
        revenue: "",
        biggestChallenge: "",
        aeoAwareness: "",
        description: "",
        willingToInvest: "",
      }));
      router.push("/survey/0");
    } finally {
      setCheckingProduct(false);
    }
  };

  // Handle initial submit from hero
  const handleInitialSubmit = async () => {
    if (!saasUrl) return;

    // Don't allow continuing if there's an existing product that needs claim
    if (productStatus === "admin-owned" || productStatus === "user-owned") {
      return; // Already showing the appropriate UI
    }

    // If we already have a product ID from a new product, just continue
    if (productId && productStatus === "new") {
      localStorage.setItem("survey_answers", JSON.stringify({
        founderName: "",
        saasName: "",
        saasUrl: saasUrl,
        role: "",
        teamSize: "",
        revenue: "",
        biggestChallenge: "",
        aeoAwareness: "",
        description: "",
        willingToInvest: "",
      }));
      router.push("/survey/0");
      return;
    }

    // Initialize/check product
    await initializeSurvey(saasUrl);
  };

  // Case 2: Show error if product is owned by another user
  if (productStatus === "user-owned" && existingProduct) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Product Already Owned
            </h2>
            <p className="text-muted-foreground">
              <strong>{existingProduct.name}</strong> is already owned by another user.
            </p>
            <p className="text-sm text-muted-foreground">
              If you own this product, please log in to your account to access it.
              Only the product owner can complete the survey and view the audit.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => router.push("/login")}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  setProductStatus("idle");
                  setExistingProduct(null);
                  setProductId(null);
                  setSaasUrl("");
                  localStorage.removeItem("survey_product_id");
                }}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg border border-gray-300 transition-colors"
              >
                Try Another Product
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while checking product
  if (productStatus === "checking" || checkingProduct) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto" />
          <p className="text-muted-foreground">Checking product...</p>
        </div>
      </div>
    );
  }

  // Show initial hero with website URL
  return (
    <SurveyHero
      saasUrl={saasUrl}
      onUrlChange={(url) => setSaasUrl(url)}
      onSubmit={handleInitialSubmit}
      isLoading={isLoading}
      checkingProduct={checkingProduct}
    />
  );
}

export default function LaunchRecordSurvey() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <LaunchRecordSurveyContent />
    </Suspense>
  );
}
