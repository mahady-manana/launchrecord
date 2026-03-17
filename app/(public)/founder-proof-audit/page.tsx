import { JSONLD } from "@/components/JsonLd";
import type { Metadata } from "next";
import FounderProofAuditPageClient from "./FounderProofAuditPageClient";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const pageUrl = `${appUrl}/founder-proof-audit`;

export const metadata: Metadata = {
  title: {
    default:
      "Founder Proof Audit - Measure Authority & Credibility | LaunchRecord",
    template: "%s | LaunchRecord",
  },
  description:
    "Free founder proof audit. Analyze your authority, credibility, and social proof signals. Get your founder proof score in 2-3 minutes.",
  keywords: [
    "founder proof audit",
    "founder authority",
    "social proof",
    "credibility signals",
    "trust indicators",
    "founder branding",
    "startup credibility",
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
    title: "Founder Proof Audit - Measure Authority & Credibility",
    description:
      "Free founder proof audit. Analyze your authority and social proof signals.",
    url: pageUrl,
    siteName: "LaunchRecord",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LaunchRecord Founder Proof Audit Dashboard",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Founder Proof Audit - Measure Authority & Credibility",
    description:
      "Free founder proof audit. Get your founder proof score in minutes.",
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

export default function FounderProofAuditPage() {
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
        name: "Founder Proof Audit - Measure Authority & Credibility | LaunchRecord",
        description:
          "Free founder proof audit. Analyze your authority, credibility, and social proof signals.",
        isPartOf: {
          "@id": `${appUrl}/#website`,
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${pageUrl}#software`,
        name: "SIO-V5 Founder Proof Audit Engine",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: pageUrl,
        description:
          "AI-powered audit engine that analyzes founder authority, credibility signals, social proof, and trust indicators.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.6",
          ratingCount: "1203",
          bestRating: "5",
          worstRating: "1",
        },
        featureList:
          "Founder Authority Analysis, Social Proof Evaluation, Evidence Quality, Credibility Signals, Trust Indicators, Story Resonance",
        softwareVersion: "5.0",
        applicationSubCategory: "Founder Proof Audit Tool",
        screenshot: `${appUrl}/og-image.png`,
        downloadUrl: pageUrl,
        installUrl: pageUrl,
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        serviceType: "Founder Proof Audit",
        provider: {
          "@id": `${appUrl}/#organization`,
        },
        description:
          "Comprehensive founder proof audit that analyzes authority, credibility, and social proof signals.",
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
      <FounderProofAuditPageClient />
    </>
  );
}
