import { JSONLD } from "@/components/JsonLd";
import type { Metadata } from "next";
import PositioningAuditPageClient from "./PositioningAuditPageClient";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const pageUrl = `${appUrl}/positioning-audit`;

export const metadata: Metadata = {
  title: {
    default:
      "Positioning Audit - Measure Your Market Differentiation | LaunchRecord",
    template: "%s | LaunchRecord",
  },
  description:
    "Free positioning audit for startups. Analyze your market differentiation, category definition, and competitive positioning. Get your positioning score in 2-3 minutes.",
  keywords: [
    "positioning audit",
    "market positioning",
    "competitive differentiation",
    "category definition",
    "startup positioning",
    "market position",
    "unique value proposition",
    "positioning strategy",
    "SIO-V5",
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
    title: "Positioning Audit - Measure Your Market Differentiation",
    description:
      "Free positioning audit for startups. Analyze your market differentiation and competitive positioning.",
    url: pageUrl,
    siteName: "LaunchRecord",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LaunchRecord Positioning Audit Dashboard",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Positioning Audit - Measure Your Market Differentiation",
    description:
      "Free positioning audit for startups. Get your positioning score in minutes.",
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

export default function PositioningAuditPage() {
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
        name: "Positioning Audit - Measure Your Market Differentiation | LaunchRecord",
        description:
          "Free positioning audit for startups. Analyze your market differentiation, category definition, and competitive positioning.",
        isPartOf: {
          "@id": `${appUrl}/#website`,
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${pageUrl}#software`,
        name: "SIO-V5 Positioning Audit Engine",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: pageUrl,
        description:
          "AI-powered audit engine that analyzes startup positioning, market differentiation, category definition, and competitive positioning.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          ratingCount: "977",
          bestRating: "5",
          worstRating: "1",
        },
        featureList:
          "Positioning Analysis, Category Definition, Competitive Differentiation, AI Entity Recognition, Market Position Clarity, Defensibility Score",
        softwareVersion: "5.0",
        applicationSubCategory: "Positioning Audit Tool",
        screenshot: `${appUrl}/og-image.png`,
        downloadUrl: pageUrl,
        installUrl: pageUrl,
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        serviceType: "Positioning Audit",
        provider: {
          "@id": `${appUrl}/#organization`,
        },
        description:
          "Comprehensive positioning audit that analyzes your startup's market differentiation, category definition, and competitive positioning.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
    ],
  };

  return (
    <>
      <JSONLD data={jsonLd} />
      <PositioningAuditPageClient />
    </>
  );
}
