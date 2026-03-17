import { JSONLD } from "@/components/JsonLd";
import type { Metadata } from "next";
import ClarityAuditPageClient from "./ClarityAuditPageClient";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const pageUrl = `${appUrl}/clarity-audit`;

export const metadata: Metadata = {
  title: {
    default: "Product Clarity Audit - Measure Message Clarity | LaunchRecord",
    template: "%s | LaunchRecord",
  },
  description:
    "Free product clarity audit. Analyze how quickly visitors understand your product's value. Get your clarity score and actionable recommendations in 2-3 minutes.",
  keywords: [
    "product clarity audit",
    "message clarity",
    "value communication",
    "conversion optimization",
    "UX clarity",
    "product messaging",
    "landing page optimization",
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
    title: "Product Clarity Audit - Measure Message Clarity",
    description:
      "Free product clarity audit. Analyze how quickly visitors understand your product's value.",
    url: pageUrl,
    siteName: "LaunchRecord",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LaunchRecord Product Clarity Audit Dashboard",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Product Clarity Audit - Measure Message Clarity",
    description:
      "Free product clarity audit. Get your clarity score in minutes.",
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

export default function ClarityAuditPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${appUrl}/#organization`,
        name: "LaunchRecord",
        url: appUrl,
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
        name: "Product Clarity Audit - Measure Message Clarity | LaunchRecord",
        description:
          "Free product clarity audit. Analyze how quickly visitors understand your product's value.",
        isPartOf: {
          "@id": `${appUrl}/#website`,
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${pageUrl}#software`,
        name: "SIO-V5 Clarity Audit Engine",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: pageUrl,
        description:
          "AI-powered audit engine that analyzes product clarity, message clarity, value communication, and conversion pathways.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          ratingCount: "951",
          bestRating: "5",
          worstRating: "1",
        },
        featureList:
          "Message Clarity Analysis, Value Communication, Feature-Benefit Mapping, Visual Hierarchy, Conversion Pathway, 5-Second Test",
        softwareVersion: "5.0",
        applicationSubCategory: "Clarity Audit Tool",
        screenshot: `${appUrl}/og-image.png`,
        downloadUrl: pageUrl,
        installUrl: pageUrl,
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        serviceType: "Product Clarity Audit",
        provider: {
          "@id": `${appUrl}/#organization`,
        },
        description:
          "Comprehensive product clarity audit that analyzes message clarity, value communication, and conversion pathways.",
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
      <ClarityAuditPageClient />
    </>
  );
}
