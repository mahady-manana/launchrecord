import { MetadataRoute } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    {
      url: appUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${appUrl}/leaderboard`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${appUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${appUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${appUrl}/sio-v5-engine`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${appUrl}/how-score-works`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },

    {
      url: `${appUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${appUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },

    {
      url: `${appUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `${appUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `${appUrl}/cookies`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
  ];

  // Fetch dynamic routes for categories/topics
  const categories = await fetch(`${appUrl}/api/topics?top=100`)
    .then((res) => {
      if (!res.ok) return null;
      return res.json();
    })
    .catch(() => null);
  const categoryRoutes =
    categories?.topics?.map(
      (category: { slug: string; updatedAt?: string }) => ({
        url: `${appUrl}/categories/${category.slug}`,
        lastModified: new Date(category.updatedAt ?? Date.now()),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }),
    ) ?? [];

  // Fetch top 100 products based on score
  const products = await fetch(`${appUrl}/api/leaderboard?limit=200&page=1`)
    .then((res) => {
      if (!res.ok) return null;
      return res.json();
    })
    .catch(() => null);
  const productRoutes =
    products?.data?.products
      ?.filter(
        (p: { slug: string; score: number | null }) =>
          p.score != null && p.slug,
      )
      .map((product: { slug: string; updatedAt?: string }) => ({
        url: `${appUrl}/products/${product.slug}`,
        lastModified: new Date(product.updatedAt ?? Date.now()),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })) ?? [];

  return [...staticPages, ...categoryRoutes, ...productRoutes];
}
