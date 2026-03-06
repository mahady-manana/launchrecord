import { Metadata } from "next";
import LeaderboardPageClient from "./PageClient";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Sovereign 100 Leaderboard | LaunchRecord",
  description:
    "The definitive ranking of SaaS products by defensibility. See which products are untouchable and which are just another ghost. Real-time SIO-V5 scores.",
  metadataBase: new URL(appUrl),
  openGraph: {
    title: "Sovereign 100 Leaderboard | LaunchRecord",
    description:
      "The definitive ranking of SaaS products by defensibility. See who's untouchable and who's just another ghost.",
    url: `${appUrl}/leaderboard`,
    siteName: "LaunchRecord",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LaunchRecord Sovereign 100 Leaderboard",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sovereign 100 Leaderboard | LaunchRecord",
    description:
      "The definitive ranking of SaaS products by defensibility.",
    images: ["/og-image.png"],
  },
  keywords: [
    "SaaS leaderboard",
    "product defensibility",
    "SIO-V5 score",
    "AEO ranking",
    "positioning score",
    "SaaS rankings",
    "AI visibility",
    "LaunchRecord",
  ],
  alternates: {
    canonical: `${appUrl}/leaderboard`,
  },
};

interface LeaderboardEntry {
  _id: string;
  name: string;
  tagline?: string | null;
  website?: string | null;
  logo?: string | null;
  score?: number | null;
  rank: number;
}

async function fetchLeaderboard(pageNum: number): Promise<{
  products: LeaderboardEntry[];
  totalPages: number;
  totalProducts: number;
} | null> {
  try {
    const response = await fetch(
      `${appUrl}/api/leaderboard?limit=100&page=${pageNum}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.success) {
      return {
        products: data.data.products,
        totalPages: data.data.pagination.pages,
        totalProducts: data.data.pagination.total,
      };
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch leaderboard:", error);
    return null;
  }
}

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || "1", 10);
  const leaderboardData = await fetchLeaderboard(page);

  const initialProducts = leaderboardData?.products || [];
  const initialTotalPages = leaderboardData?.totalPages || 1;
  const initialTotalProducts = leaderboardData?.totalProducts || 0;

  return (
    <LeaderboardPageClient
      initialProducts={initialProducts}
      initialPage={page}
      initialTotalPages={initialTotalPages}
      initialTotalProducts={initialTotalProducts}
    />
  );
}
