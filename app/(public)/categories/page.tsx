import { Metadata } from "next";
import CategoriesPageClient from "./PageClient";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Browse Categories | LaunchRecord",
  description: "Explore SaaS products by category. Find the best products in each niche ranked by defensibility score.",
  metadataBase: new URL(appUrl),
  openGraph: {
    title: "Browse Categories | LaunchRecord",
    description: "Explore SaaS products by category.",
    url: `${appUrl}/categories`,
    siteName: "LaunchRecord",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse Categories | LaunchRecord",
  },
};

async function fetchAllCategories() {
  try {
    const response = await fetch(
      `${appUrl}/api/topics?top=100`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.success) {
      return data.topics;
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return null;
  }
}

export default async function CategoriesPage() {
  const categories = await fetchAllCategories();

  return <CategoriesPageClient initialCategories={categories || []} />;
}
