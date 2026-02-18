import { HomePage } from "@/components/launchrecord/home-page";
import type { Metadata } from "next";

interface LaunchRecordHomePageProps {
  searchParams: Promise<{ q?: string }>;
}

async function getInitialLaunches() {
  try {
    const urlParams = new URLSearchParams({
      page: String(1),
      limit: String(50),
      category: "all",
      timeFilter: "all",
    });

    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL +
        `/api/launches/get?${urlParams.toString()}`,
      {
        cache: "no-store",
      },
    );
    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || "Failed to fetch launches.",
      };
    }

    return {
      success: true,
      launches: data.launches || [],
      pagination: data.pagination,
    };
  } catch (error) {
    console.error("Error loading launches:", error);
    return {
      success: false,
      message: "Failed to fetch launches.",
    };
  }
}

export const metadata: Metadata = {
  title: "LaunchRecord - Discover & Launch Amazing Products",
  description:
    "The premier platform for discovering new products, startups, and tools. Join thousands of makers and early adopters to share feedback and grow your product.",
  keywords: [
    "product launch",
    "startup",
    "new products",
    "tech products",
    "SaaS",
    "AI tools",
    "product discovery",
    "early adopters",
    "product feedback",
    "launch platform",
  ],
  authors: [{ name: "LaunchRecord" }],
  creator: "LaunchRecord",
  publisher: "LaunchRecord",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.launchrecord.com",
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "LaunchRecord",
    title: "LaunchRecord - Discover & Launch Amazing Products",
    description:
      "The premier platform for discovering new products, startups, and tools. Join thousands of makers and early adopters.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LaunchRecord - Product Launch Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LaunchRecord - Discover & Launch Amazing Products",
    description:
      "The premier platform for discovering new products, startups, and tools.",
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

export const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "LaunchRecord",
  description:
    "The premier platform for discovering new products, startups, and tools",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.launchrecord.com",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.launchrecord.com"}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  } as any,
  publisher: {
    "@type": "Organization",
    name: "LaunchRecord",
    logo: {
      "@type": "ImageObject",
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.launchrecord.com"}/logo.png`,
    },
  },
};

export default async function LaunchRecordHomePage({
  searchParams,
}: LaunchRecordHomePageProps) {
  const params = await searchParams;
  const initialQuery = typeof params.q === "string" ? params.q : "";
  const initialData = await getInitialLaunches();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomePage
        initialQuery={initialQuery}
        initialLaunches={initialData.launches || []}
        initialPagination={initialData.pagination}
      />
    </>
  );
}
