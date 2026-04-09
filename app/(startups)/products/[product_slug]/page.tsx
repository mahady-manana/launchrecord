import { Metadata } from "next";
import ProductPageWrapper from "./ProductPageWrapper";

export const dynamicParams = true;
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
interface ProductPageProps {
  params: Promise<{ product_slug: string }>;
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

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { product_slug: slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const productData = await fetchProduct(slug);
  const title = productData
    ? `${productData.tagline} | ${productData.name}`
    : decodedSlug.replace(/^https?:\/\//, "").split("/")[0];
  const description =
    productData?.description ||
    "View defensibility score and strategic analysis for this product.";

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

export default async function ProductPage({ params }: ProductPageProps) {
  const { product_slug: slug } = await params;
  const productData = await fetchProduct(slug);

  return <ProductPageWrapper slug={slug} initialData={productData} />;
}
