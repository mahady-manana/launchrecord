import { JSONLD } from "@/components/JsonLd";
import type { Metadata } from "next";
import WhatIsStartupPositioningPageClient from "./WhatIsStartupPositioningPageClient";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const pageUrl = `${appUrl}/blog/what-is-startup-positioning`;

export const metadata: Metadata = {
  title: {
    default: "What is Startup Positioning? | LaunchRecord",
    template: "%s | LaunchRecord",
  },
  description:
    "Learn what startup positioning is and why it's the foundation of your SaaS growth. Discover how to define your category, UVP, and ICP effectively.",
  keywords: [
    "Startup Positioning",
    "SaaS Positioning",
    "Product Positioning",
    "Market Positioning",
    "Unique Value Proposition",
    "Ideal Customer Profile",
    "Category Ownership",
    "Startup Growth",
    "Go-to-Market Strategy",
    "LaunchRecord",
  ],
  authors: [{ name: "LaunchRecord", url: appUrl }],
  creator: "LaunchRecord",
  publisher: "LaunchRecord",
  metadataBase: new URL(appUrl),
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "What is Startup Positioning?",
    description:
      "The definitive guide to startup positioning. Foundation for conversion, retention, and scale.",
    url: pageUrl,
    siteName: "LaunchRecord",
    locale: "en_US",
    type: "article",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Startup Positioning Guide - LaunchRecord",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "What is Startup Positioning?",
    description: "The definitive guide to startup positioning in 2026.",
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

export default function WhatIsStartupPositioningPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${appUrl}/#organization`,
        name: "LaunchRecord",
        url: appUrl,
        logo: {
          "@type": "ImageObject",
          url: `${appUrl}/favicon.svg`,
          width: 512,
          height: 512,
        },
        description:
          "The #1 Platform For Verified Sovereignty & Defensibility Ledger for Startups",
        sameAs: [
          "https://twitter.com/launchrecord",
          "https://linkedin.com/company/launchrecord",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "support@launchrecord.com",
          availableLanguage: "English",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${appUrl}/#website`,
        url: appUrl,
        name: "LaunchRecord",
        description: "Verify Your Startup's Sovereignty & Defensibility",
        publisher: {
          "@id": `${appUrl}/#organization`,
        },
        potentialAction: [
          {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${appUrl}/search?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        ],
        inLanguage: "en-US",
      },
      {
        "@type": "ImageObject",
        "@id": `${pageUrl}/#primaryimage`,
        inLanguage: "en-US",
        url: `${appUrl}/og-image.png`,
        contentUrl: `${appUrl}/og-image.png`,
        width: 1200,
        height: 630,
        caption: "What is Startup Positioning?",
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}/#webpage`,
        url: pageUrl,
        name: "What is Startup Positioning? | LaunchRecord",
        isPartOf: {
          "@id": `${appUrl}/#website`,
        },
        primaryImageOfPage: {
          "@id": `${pageUrl}/#primaryimage`,
        },
        datePublished: "2026-04-20T09:00:00+00:00",
        dateModified: "2026-04-20T09:00:00+00:00",
        description:
          "Learn what startup positioning is and why it's the foundation of your SaaS growth.",
        breadcrumb: {
          "@id": `${pageUrl}/#breadcrumb`,
        },
        inLanguage: "en-US",
        potentialAction: [
          {
            "@type": "ReadAction",
            target: [pageUrl],
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}/#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: appUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: `${appUrl}/blog`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "What is Startup Positioning?",
          },
        ],
      },
      {
        "@type": "Article",
        "@id": `${pageUrl}/#article`,
        isPartOf: {
          "@id": `${pageUrl}/#webpage`,
        },
        author: {
          "@id": `${appUrl}/#organization`,
        },
        headline: "What is Startup Positioning?",
        datePublished: "2026-04-20T09:00:00+00:00",
        dateModified: "2026-04-20T09:00:00+00:00",
        mainEntityOfPage: {
          "@id": `${pageUrl}/#webpage`,
        },
        publisher: {
          "@id": `${appUrl}/#organization`,
        },
        image: {
          "@id": `${pageUrl}/#primaryimage`,
        },
        keywords: [
          "Startup Positioning",
          "SaaS Positioning",
          "Product Positioning",
          "Market Positioning",
          "UVP",
          "ICP",
        ],
        articleSection: ["Startup Strategy", "Marketing"],
        inLanguage: "en-US",
      },
    ],
  };

  return (
    <>
      <JSONLD data={jsonLd} />
      <WhatIsStartupPositioningPageClient />
    </>
  );
}
