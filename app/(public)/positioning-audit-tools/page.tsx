import { JSONLD } from "@/components/JsonLd";
import type { Metadata } from "next";
import PositioningAuditToolsPageClient from "./PositioningAuditToolsPageClient";

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const pageUrl = `${appUrl}/positioning-audit-tools`;

export const metadata: Metadata = {
  title: {
    default:
      "Positioning Audit Tools - Find Your Market Edge | LaunchRecord",
    template: "%s | LaunchRecord",
  },
  description:
    "Master your market positioning with our comprehensive audit toolkit. Discover your category, differentiate from competitors, and own your space. Free positioning analysis in 60 seconds.",
  keywords: [
    "positioning audit",
    "market positioning tools",
    "category design",
    "competitive differentiation",
    "positioning strategy",
    "startup positioning",
    "value proposition",
    "market positioning",
    "positioning framework",
    "category king strategy",
  ],
  authors: [{ name: "LaunchRecord", url: appUrl }],
  creator: "LaunchRecord",
  publisher: "LaunchRecord",
  metadataBase: new URL(appUrl),
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Positioning Audit Tools - Find Your Market Edge",
    description:
      "Comprehensive positioning audit toolkit. Discover your category edge and dominate your market.",
    url: pageUrl,
    siteName: "LaunchRecord",
    locale: "en_US",
    type: "article",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Positioning Audit Tools - LaunchRecord",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Positioning Audit Tools - Find Your Market Edge",
    description:
      "Master your market positioning with our comprehensive audit toolkit.",
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

export default function PositioningAuditToolsPage() {
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
      },
      {
        "@type": "WebSite",
        "@id": `${appUrl}/#website`,
        url: appUrl,
        name: "LaunchRecord",
        publisher: {
          "@id": `${appUrl}/#organization`,
        },
      },
      {
        "@type": "WebPage",
        "@id": pageUrl,
        url: pageUrl,
        name: "Positioning Audit Tools - Find Your Market Edge | LaunchRecord",
        description:
          "Master your market positioning with our comprehensive audit toolkit. Discover your category, differentiate from competitors, and own your space.",
        isPartOf: {
          "@id": `${appUrl}/#website`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
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
            name: "Positioning Audit Tools",
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: "Positioning Audit Tools - Find Your Market Edge",
        description:
          "Comprehensive guide to positioning audit tools that help you discover your category edge, differentiate from competitors, and dominate your market.",
        datePublished: "2026-04-09",
        dateModified: "2026-04-09",
        author: {
          "@id": `${appUrl}/#organization`,
        },
        publisher: {
          "@id": `${appUrl}/#organization`,
        },
        mainEntityOfPage: {
          "@id": pageUrl,
        },
        inLanguage: "en-US",
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "What is a positioning audit?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "A positioning audit analyzes how your startup is perceived in the market, your competitive differentiation, category clarity, and whether your target audience understands your unique value. It reveals gaps between your intended positioning and actual market perception.",
            },
          },
          {
            "@type": "Question",
            name: "How long does a positioning audit take?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Our automated audit delivers results in 60 seconds. It analyzes your website, messaging, competitive landscape, and market signals to provide a comprehensive positioning score with actionable recommendations.",
            },
          },
          {
            "@type": "Question",
            name: "What's included in the positioning report?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The report includes your positioning score, category clarity assessment, competitive differentiation analysis, messaging alignment check, target audience fit, and prioritized recommendations to strengthen your market position.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <JSONLD data={jsonLd} />
      <PositioningAuditToolsPageClient />
    </>
  );
}
