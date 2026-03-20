import { BASE_URL } from "@/lib/constants";
import type { MetadataRoute } from "next";
export const dynamicParams = true;

// Number of URLs per sitemap file (well under Google's 50k limit)
const URLS_PER_SITEMAP = 10000;

/**
 * Get total counts for sitemap calculation
 */
async function getCounts() {
  try {
    const [productsRes, topicsRes] = await Promise.all([
      fetch(`${BASE_URL}/api/sitemap/products?limit=1`).catch(() => null),
      fetch(`${BASE_URL}/api/sitemap/topics?limit=1`).catch(() => null),
    ]);

    const productsData = await productsRes?.json().catch(() => null);
    const topicsData = await topicsRes?.json().catch(() => null);
    return {
      products: productsData?.pagination?.total ?? 0,
      topics: topicsData?.pagination?.total ?? 0,
    };
  } catch {
    return { products: 1, topics: 0 };
  }
}

/**
 * Generate sitemap indices for splitting large datasets
 * This allows us to handle 10k+ products efficiently
 */
export async function generateSitemaps() {
  const { products, topics } = await getCounts();
  const estimatedTotal = products + topics;
  const sitemapCount = Math.max(
    1,
    Math.ceil(estimatedTotal / URLS_PER_SITEMAP),
  );

  // First entry is the index sitemap
  const sitemaps = [{ id: "index" }];

  // Then add all numbered sitemaps
  sitemaps.push(
    ...Array.from({ length: sitemapCount }, (_, i) => ({
      id: i.toString(),
    })),
  );

  return sitemaps;
}

/**
 * Generate individual sitemap entries
 * Each sitemap handles a chunk of URLs to stay under Google's limits
 */
export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap | MetadataRoute.Manifest> {
  const id = (await props?.id) as string | undefined;

  if (!id) {
    return [];
  }

  // Handle index sitemap - return list of all sitemap URLs
  if (id === "index") {
    const { products, topics } = await getCounts();
    const estimatedTotal = products + topics;
    const sitemapCount = Math.max(
      1,
      Math.ceil(estimatedTotal / URLS_PER_SITEMAP),
    );

    return Array.from({ length: sitemapCount }, (_, i) => ({
      url: `${BASE_URL}/sitemap/${i}.xml`,
      lastModified: new Date(),
    }));
  }

  const sitemapId = parseInt(id, 10);

  // Static pages always go in first sitemap
  const staticPages: MetadataRoute.Sitemap =
    sitemapId === 0
      ? [
          {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
          },
          {
            url: `${BASE_URL}/leaderboard`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
          },
          {
            url: `${BASE_URL}/aeo-audit`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
          },
          {
            url: `${BASE_URL}/positioning-audit`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
          },
          {
            url: `${BASE_URL}/clarity-audit`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
          },
          {
            url: `${BASE_URL}/momentum-audit`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
          },
          {
            url: `${BASE_URL}/aeo-vs-seo`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
          },
          {
            url: `${BASE_URL}/pricing`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
          },
          {
            url: `${BASE_URL}/categories`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
          },
          {
            url: `${BASE_URL}/sio-v5-engine`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
          },
          {
            url: `${BASE_URL}/how-score-works`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
          },
          {
            url: `${BASE_URL}/login`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
          },
          {
            url: `${BASE_URL}/register`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
          },
          {
            url: `${BASE_URL}/privacy`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.3,
          },
          {
            url: `${BASE_URL}/terms`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.3,
          },
          {
            url: `${BASE_URL}/cookies`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.3,
          },
          {
            url: `${BASE_URL}/blog/will-aeo-commoditize-seo`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
          },
          {
            url: `${BASE_URL}/blog/5-things-you-need-to-know-about-aeo`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
          },
        ]
      : [];

  // Fetch topics for sitemap
  const topicsRes = await fetch(
    `${BASE_URL}/api/sitemap/topics?limit=${URLS_PER_SITEMAP}`,
  ).catch(() => null);

  const topicsData = await topicsRes?.json().catch(() => null);
  const topicRoutes: MetadataRoute.Sitemap =
    topicsData?.data?.map((t: { topic_slug: string; updatedAt: string }) => ({
      url: `${BASE_URL}/categories/${t.topic_slug}`,
      lastModified: new Date(t.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })) ?? [];

  // Fetch products for sitemap using page-based pagination
  const productsRes = await fetch(
    `${BASE_URL}/api/sitemap/products?limit=${URLS_PER_SITEMAP}&page=${sitemapId}`,
  ).catch(() => null);

  const productsData = await productsRes?.json().catch(() => null);
  const productRoutes: MetadataRoute.Sitemap =
    productsData?.data?.map((p: { slug: string; updatedAt: string }) => ({
      url: `${BASE_URL}/products/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })) ?? [];

  return [...staticPages, ...topicRoutes, ...productRoutes];
}
