import { JSONLD } from "@/components/JsonLd";
import type { Metadata } from "next";
import MomentumAuditPageClient from "./MomentumAuditPageClient";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const pageUrl = `${appUrl}/momentum-audit`;

export const metadata: Metadata = {
  title: {
    default:
      "Momentum Audit - Measure Growth Signals & Traction | LaunchRecord",
    template: "%s | LaunchRecord",
  },
  description:
    "Free momentum audit for startups. Analyze your growth signals, market traction, and velocity indicators. Get your momentum score in 2-4 minutes.",
  keywords: [
    "momentum audit",
    "growth signals",
    "startup traction",
    "market momentum",
    "growth metrics",
    "traction evidence",
    "startup velocity",
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
    title: "Momentum Audit - Measure Growth Signals & Traction",
    description:
      "Free momentum audit for startups. Analyze your growth signals and market traction.",
    url: pageUrl,
    siteName: "LaunchRecord",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LaunchRecord Momentum Audit Dashboard",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Momentum Audit - Measure Growth Signals & Traction",
    description:
      "Free momentum audit for startups. Get your momentum score in minutes.",
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

export default function MomentumAuditPage() {
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
        name: "Momentum Audit - Measure Growth Signals & Traction | LaunchRecord",
        description:
          "Free momentum audit for startups. Analyze your growth signals, market traction, and velocity indicators.",
        isPartOf: {
          "@id": `${appUrl}/#website`,
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${pageUrl}#software`,
        name: "SIO-V5 Momentum Audit Engine",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: pageUrl,
        description:
          "AI-powered audit engine that analyzes startup momentum, growth signals, market traction, and velocity indicators.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.4",
          ratingCount: "345",
          bestRating: "5",
          worstRating: "1",
        },
        featureList:
          "Growth Trajectory Analysis, Market Signals, User Engagement, Competitive Velocity, Traction Evidence, Velocity Indicators",
        softwareVersion: "5.0",
        applicationSubCategory: "Momentum Audit Tool",
        screenshot: `${appUrl}/og-image.png`,
        downloadUrl: pageUrl,
        installUrl: pageUrl,
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        serviceType: "Momentum Audit",
        provider: {
          "@id": `${appUrl}/#organization`,
        },
        description:
          "Comprehensive momentum audit that analyzes growth signals, market traction, and velocity indicators.",
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
      <MomentumAuditPageClient />
    </>
  );
}
