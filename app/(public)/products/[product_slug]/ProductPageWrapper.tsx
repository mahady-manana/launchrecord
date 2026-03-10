"use client";

import { JSONLD } from "@/components/JsonLd";
import { useEffect, useState } from "react";
import ProductPageClient from "./PageClient";

interface ProductData {
  id: string;
  name: string;
  tagline?: string | null;
  description?: string | null;
  logo?: string | null;
  website?: string | null;
  score: number;
  topics: Array<{ _id: string; name: string }>;
  createdAt: string;
  updatedAt: string;
  latestReport: any | null;
  historicalReports: Array<{ id: string; score: number; createdAt: string }>;
  rank: number;
}

export default function ProductPageWrapper({
  slug,
  initialData,
}: {
  slug: string;
  initialData: ProductData | null;
}) {
  const [productData, setProductData] = useState<ProductData | null>(
    initialData,
  );
  const [isLoading, setIsLoading] = useState(!initialData);
  const [jsonLd, setJsonLd] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    // If we have initial data, still revalidate on client
    // If we don't have initial data, fetch to confirm if product exists
    async function fetchProduct() {
      try {
        const response = await fetch(
          `/api/product-lookup?website=${encodeURIComponent(slug)}`,
          {
            cache: "no-store",
          },
        );

        if (!response.ok) {
          setIsLoading(false);
          return;
        }

        const data = await response.json();

        if (data.success) {
          const product = data.data;
          setProductData(product);

          // Generate JSON-LD
          setJsonLd({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: product.name,
            description: product.description || product.tagline,
            url: `${window.location.origin}/products/${encodeURIComponent(slug)}`,
            applicationCategory: "BusinessApplication",
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: product.score || 0,
              bestRating: 100,
              worstRating: 0,
            },
            offers: {
              "@type": "Offer",
              price: "49.00",
              priceCurrency: "USD",
            },
          });
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  if (isLoading && !initialData?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!productData && !initialData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold">Product Not Found</h1>
          <p className="text-muted-foreground mt-2">
            This product hasn&apos;t been audited yet or doesn&apos;t exist.
          </p>
          <div className="mt-6 flex gap-4 justify-center">
            <a href="/leaderboard" className="text-primary hover:underline">
              View Leaderboard
            </a>
            <a href="/survey" className="text-primary hover:underline">
              Audit a Product
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {jsonLd && <JSONLD data={jsonLd} />}
      <ProductPageClient
        initialData={(productData as any) || initialData}
        jsonLd={null}
      />
    </>
  );
}
