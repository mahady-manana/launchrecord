import { Metadata } from "next";
import CategoryPageClient from "./PageClient";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} Category | LaunchRecord`,
    description: `Top SaaS products in ${slug}. See rankings by defensibility score.`,
    metadataBase: new URL(appUrl),
    openGraph: {
      title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} Category | LaunchRecord`,
      description: `Top SaaS products in ${slug}.`,
      url: `${appUrl}/categories/${slug}`,
      siteName: "LaunchRecord",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} Category | LaunchRecord`,
    },
  };
}

async function fetchCategory(slug: string, page: number) {
  try {
    const response = await fetch(
      `${appUrl}/api/categories/${slug}/products?page=1&limit=100`,
      {
        next: { revalidate: 60 },
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
    console.error("Failed to fetch category:", error);
    return null;
  }
}

async function fetchTopTopics(limit: number = 10) {
  try {
    const response = await fetch(`${appUrl}/api/topics?top=${limit}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.success) {
      return data.topics;
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch top topics:", error);
    return null;
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const [categoryData, topTopics] = await Promise.all([
    fetchCategory(slug, 1),
    fetchTopTopics(10),
  ]);

  if (!categoryData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Category Not Found</h1>
          <p className="text-muted-foreground mt-2">
            The category &quot;{slug}&quot; doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  const initialProducts = categoryData.products.map((product: any) => ({
    _id: product.id,
    name: product.name,
    tagline: product.tagline,
    website: product.website,
    logo: product.logo,
    score: product.score,
    rank: product.rank,
    topics: product.topics,
    slug: product.slug,
  }));

  return (
    <CategoryPageClient
      initialProducts={initialProducts}
      total={categoryData.pagination.totalProducts}
      slug={slug}
      topTopics={topTopics || []}
      categoryData={categoryData}
    />
  );
}
