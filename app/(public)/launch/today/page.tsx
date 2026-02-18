import { Metadata } from "next";
import { TodayPageClient } from "./today-page-client";

export const metadata: Metadata = {
  title: "Today's Launches | LaunchRecord - New Products Launched Today",
  description: "Discover all the amazing products, startups, and tools launched today on LaunchRecord. Be the first to explore and provide feedback to makers.",
  keywords: [
    "today's launches",
    "new products today",
    "daily product launches",
    "startup launches",
    "product of the day",
    "tech launches",
    "new startups",
    "product discovery",
    "early adopters",
    "launch calendar",
  ],
  authors: [{ name: "LaunchRecord" }],
  creator: "LaunchRecord",
  publisher: "LaunchRecord",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.launchrecord.com"),
  alternates: {
    canonical: "/launch/today",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/launch/today",
    siteName: "LaunchRecord",
    title: "Today's Launches | LaunchRecord",
    description: "Discover all the amazing products, startups, and tools launched today.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Today's Product Launches on LaunchRecord",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Today's Launches | LaunchRecord",
    description: "Discover all the amazing products launched today.",
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
  "@type": "CollectionPage",
  name: "Today's Launches",
  description: "Discover all the amazing products, startups, and tools launched today on LaunchRecord",
  url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.launchrecord.com"}/launch/today`,
  isPartOf: {
    "@type": "WebSite",
    name: "LaunchRecord",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.launchrecord.com",
  },
  about: {
    "@type": "Thing",
    name: "Product Launches",
    description: "Daily product launches from makers and startups",
  },
  dateCreated: new Date().toISOString().split("T")[0],
  publisher: {
    "@type": "Organization",
    name: "LaunchRecord",
    logo: {
      "@type": "ImageObject",
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.launchrecord.com"}/logo.png`,
    },
  },
};

interface TodayPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function TodayPage({ searchParams }: TodayPageProps) {
  const params = await searchParams;
  const initialQuery = typeof params.q === "string" ? params.q : "";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <TodayPageClient initialQuery={initialQuery} />
    </>
  );
}
