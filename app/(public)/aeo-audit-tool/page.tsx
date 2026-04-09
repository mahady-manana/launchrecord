import { JSONLD } from "@/components/JsonLd";
import type { Metadata } from "next";
import AeoAuditToolPageClient from "./AeoAuditToolPageClient";

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const pageUrl = `${appUrl}/aeo-audit-tool`;

export const metadata: Metadata = {
  title: {
    default:
      "AEO Audit Tool - Is AI Recommending Your Startup? | LaunchRecord",
    template: "%s | LaunchRecord",
  },
  description:
    "Check if ChatGPT, Claude, and Gemini recommend your startup. Free AEO audit reveals your AI visibility score, entity strength, and answer engine presence. Get results in 60 seconds.",
  keywords: [
    "AEO audit tool",
    "AI visibility checker",
    "ChatGPT optimization tool",
    "answer engine optimization",
    "AI SEO audit",
    "LLM visibility",
    "AI recommendation audit",
    "entity optimization",
    "semantic authority",
    "AI presence score",
  ],
  authors: [{ name: "LaunchRecord", url: appUrl }],
  creator: "LaunchRecord",
  publisher: "LaunchRecord",
  metadataBase: new URL(appUrl),
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "AEO Audit Tool - Is AI Recommending Your Startup?",
    description:
      "Free AEO audit tool. Check if AI assistants recommend your startup and get your AI visibility score.",
    url: pageUrl,
    siteName: "LaunchRecord",
    locale: "en_US",
    type: "article",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AEO Audit Tool - LaunchRecord",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AEO Audit Tool - Is AI Recommending Your Startup?",
    description:
      "Check if ChatGPT, Claude, and Gemini recommend your startup. Free AEO audit.",
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

export default function AeoAuditToolPage() {
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
        name: "AEO Audit Tool - Is AI Recommending Your Startup? | LaunchRecord",
        description:
          "Free AEO audit tool. Check if AI assistants recommend your startup and discover your AI visibility score.",
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
            name: "AEO Audit Tool",
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${pageUrl}#software`,
        name: "AEO Visibility Audit Tool",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: pageUrl,
        description:
          "AI-powered tool that checks your startup's visibility across ChatGPT, Claude, Gemini, and other answer engines.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          ratingCount: "1547",
          bestRating: "5",
          worstRating: "1",
        },
      },
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: "AEO Audit Tool - Is AI Recommending Your Startup?",
        description:
          "Discover whether AI assistants like ChatGPT, Claude, and Gemini recommend your startup when users ask for solutions in your category.",
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
            name: "What is an AEO audit?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "An AEO (Answer Engine Optimization) audit analyzes whether your startup appears in AI-generated responses from ChatGPT, Claude, Gemini, and other language models when users ask about solutions in your category. It measures your AI visibility score, entity recognition strength, and semantic authority.",
            },
          },
          {
            "@type": "Question",
            name: "How is AEO different from SEO?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "SEO optimizes for search engine rankings—getting clicks from Google results. AEO optimizes for AI citations—getting mentioned by AI assistants when they answer user questions. AEO is about being the source AI trusts, not the link users click.",
            },
          },
          {
            "@type": "Question",
            name: "Why does AI visibility matter?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "By 2026, over 50% of searches happen through AI assistants. If your startup isn't mentioned by AI when users ask about your category, you're invisible to half your market. AI-referred visitors also convert 3-5x higher because they arrive pre-trusting the recommendation.",
            },
          },
          {
            "@type": "Question",
            name: "How long does the AEO audit take?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Our automated AEO audit delivers results in 60 seconds. It analyzes your AI visibility across multiple engines, checks entity recognition strength, evaluates semantic authority, and provides a prioritized action plan to improve your AI presence.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <JSONLD data={jsonLd} />
      <AeoAuditToolPageClient />
    </>
  );
}
