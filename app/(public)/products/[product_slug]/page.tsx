import { Metadata } from "next";
import ProductPageClient from "./PageClient";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface ProductPageProps {
  params: Promise<{ product_slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { product_slug: slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const productData = await fetchProduct(slug);
  const title = productData
    ? `${productData.tagline} | ${productData.name}`
    : decodedSlug.replace(/^https?:\/\//, "").split("/")[0];
  const description = productData?.description || "View defensibility score and strategic analysis for this product.";

  return {
    title,
    description,
    metadataBase: new URL(appUrl),
    openGraph: {
      title,
      description,
      url: `${appUrl}/products/${slug}`,
      siteName: "LaunchRecord",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

async function fetchProduct(website: string) {
  try {
    const response = await fetch(
      `${appUrl}/api/product-lookup?website=${encodeURIComponent(website)}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.success) {
      return data.data;
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { product_slug: slug } = await params;
  const productData = await fetchProduct(slug);

  if (!productData) {
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

  return <ProductPageClient initialData={productData} />;
}
