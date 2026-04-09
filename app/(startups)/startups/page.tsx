import { JSONLD } from "@/components/JsonLd";
import { ProductItem } from "@/components/product-card";
import type { Metadata } from "next";
import StartupsPageClient from "./StartupsPageClient";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const pageUrl = `${appUrl}/startups`;

export const metadata: Metadata = {
  title: {
    default: "Startup Directories - Discover AI Startups | LaunchRecord",
    template: "%s | LaunchRecord",
  },
  description:
    "Browse thousands of AI startups. Discover, compare, and find the most defensible startups in the AI ecosystem.",
  keywords: [
    "startup directories",
    "AI startups",
    "startup rankings",
    "defensible startups",
    "AI visibility",
  ],
  authors: [{ name: "LaunchRecord", url: appUrl }],
  creator: "LaunchRecord",
  publisher: "LaunchRecord",
  metadataBase: new URL(appUrl),
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Startup Directories - Discover AI Startups",
    description:
      "Browse thousands of AI startups with rankings and categories.",
    url: pageUrl,
    siteName: "LaunchRecord",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Startup Directories - LaunchRecord",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Startup Directories - Discover AI Startups",
    description: "Browse thousands of AI startups.",
    images: ["/og-image.png"],
    creator: "@launchrecord",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

async function getInitialProducts() {
  try {
    const res = await fetch(`${appUrl}/api/leaderboard?page=1&limit=100`, {
      next: { revalidate: 60 },
    });
    const data = await res.json();

    if (data.success) {
      return {
        products: data.data.products as ProductItem[],
        total: data.data.pagination.total as number,
      };
    }
  } catch (error) {
    console.error("Failed to fetch initial products:", error);
  }

  return { products: [], total: 0 };
}

export default async function StartupsPage() {
  const { products, total } = await getInitialProducts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${appUrl}/#organization`,
        name: "LaunchRecord",
        url: appUrl,
      },
      {
        "@type": "WebPage",
        "@id": pageUrl,
        url: pageUrl,
        name: "Startup Directories - Discover AI Startups | LaunchRecord",
        isPartOf: {
          "@id": `${appUrl}/#website`,
        },
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#items`,
        name: "AI Startups Directory",
        itemListElement: products.slice(0, 50).map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "SoftwareApplication",
            name: product.name,
            url: `${appUrl}/products/${product.slug}`,
            description: product.tagline || "",
          },
        })),
        numberOfItems: products.length,
      },
    ],
  };

  return (
    <>
      <JSONLD data={jsonLd} />
      <StartupsPageClient initialProducts={products} total={total} />
    </>
  );
}
