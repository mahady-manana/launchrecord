import { JSONLD } from "@/components/JsonLd";
import type { Metadata } from "next";
import MessagingAuditPageClient from "./MessagingAuditPageClient";

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const pageUrl = `${appUrl}/messaging-audit`;

export const metadata: Metadata = {
  title: {
    default:
      "Messaging Audit Tool - Fix Your Words, Fix Your Conversions | LaunchRecord",
    template: "%s | LaunchRecord",
  },
  description:
    "Your words are killing your conversions. Audit your messaging with our free tool. Discover if your headlines, copy, and CTAs convert or confuse. Fix your messaging in minutes.",
  keywords: [
    "messaging audit",
    "messaging framework",
    "copywriting audit",
    "conversion copywriting",
    "messaging strategy",
    "headline testing",
    "value proposition messaging",
    "PosiMessaging",
    "messaging clarity",
    "benefit-driven messaging",
  ],
  authors: [{ name: "LaunchRecord", url: appUrl }],
  creator: "LaunchRecord",
  publisher: "LaunchRecord",
  metadataBase: new URL(appUrl),
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Messaging Audit Tool - Fix Your Words, Fix Your Conversions",
    description:
      "Audit your messaging. Discover if your words convert or confuse. Free messaging analysis tool for startups.",
    url: pageUrl,
    siteName: "LaunchRecord",
    locale: "en_US",
    type: "article",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Messaging Audit Tool - LaunchRecord",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Messaging Audit Tool - Fix Your Words, Fix Your Conversions",
    description:
      "Your words are killing your conversions. Audit your messaging now.",
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

export default function MessagingAuditPage() {
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
        name: "Messaging Audit Tool - Fix Your Words, Fix Your Conversions | LaunchRecord",
        description:
          "Audit your messaging with our free tool. Discover if your headlines, copy, and CTAs convert or confuse.",
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
            name: "Messaging Audit",
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: "Messaging Audit Tool - Fix Your Words, Fix Your Conversions",
        description:
          "Your words are either converting visitors or driving them away. Our messaging audit tool reveals exactly where your copy fails—and how to fix it.",
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
            name: "What does a messaging audit check?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Our messaging audit analyzes your headlines, value proposition clarity, benefit vs. feature balance, CTA effectiveness, jargon density, social proof placement, and overall messaging coherence. It reveals exactly where your words work against you.",
            },
          },
          {
            "@type": "Question",
            name: "How is messaging different from positioning?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Positioning is your strategic market placement—what category you own and how you're different. Messaging is how you communicate that positioning through words. Great positioning with bad messaging still fails to convert.",
            },
          },
          {
            "@type": "Question",
            name: "What's a good messaging score?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "A messaging score above 75 indicates strong, conversion-oriented copy. Between 50-75 means you have clarity but room for improvement. Below 50 signals critical messaging problems that are actively killing your conversions.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <JSONLD data={jsonLd} />
      <MessagingAuditPageClient />
    </>
  );
}
