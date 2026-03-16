import { JSONLD } from "@/components/JsonLd";
import type { Metadata } from "next";
import AeoAuditPageClient from "./AeoAuditPageClient";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const pageUrl = `${appUrl}/aeo-audit`;

export const metadata: Metadata = {
  title: {
    default:
      "AEO Website Audit - Check If AI Recommends Your Startup | LaunchRecord",
    template: "%s | LaunchRecord",
  },
  description:
    "Free AEO (Answer Engine Optimization) audit. Analyze your startup's visibility in ChatGPT, Claude, and Gemini. Get your AI visibility score and defensibility report in 2-3 minutes.",
  keywords: [
    "AEO audit",
    "Answer Engine Optimization",
    "AI visibility audit",
    "ChatGPT optimization",
    "AI SEO tool",
    "LLM visibility",
    "startup defensibility",
    "AI search optimization",
    "SIO-V5 engine",
    "semantic authority",
    "entity recognition",
    "AI recommendation engine",
  ],
  authors: [{ name: "LaunchRecord", url: appUrl }],
  creator: "LaunchRecord",
  publisher: "LaunchRecord",
  metadataBase: new URL(appUrl),
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "AEO Website Audit - Check If AI Recommends Your Startup",
    description:
      "Free AEO audit for startups. Analyze your visibility in ChatGPT, Claude, and Gemini. Get your AI visibility score and action plan in minutes.",
    url: pageUrl,
    siteName: "LaunchRecord",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LaunchRecord AEO Audit - AI Visibility Score Dashboard",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AEO Audit - Check If AI Recommends Your Startup",
    description:
      "Free AEO audit for startups. Analyze your visibility in ChatGPT, Claude, and Gemini.",
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

export default function AeoAuditPage() {
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
        description:
          "Audit your startup's sovereignty and defensibility with AI-powered analysis",
        publisher: {
          "@id": `${appUrl}/#organization`,
        },
        inLanguage: "en-US",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${appUrl}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "WebPage",
        "@id": pageUrl,
        url: pageUrl,
        name: "AEO Audit - Check If AI Recommends Your Startup | LaunchRecord",
        description:
          "Free AEO (Answer Engine Optimization) audit. Analyze your startup's visibility in ChatGPT, Claude, and Gemini. Get your AI visibility score in 2-3 minutes.",
        isPartOf: {
          "@id": `${appUrl}/#website`,
        },
        about: {
          "@type": "Thing",
          name: "Answer Engine Optimization",
          description:
            "AEO is the practice of optimizing content to appear in AI-generated answers from ChatGPT, Claude, Gemini, and other LLMs.",
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${appUrl}/og-image.png`,
          width: 1200,
          height: 630,
        },
        inLanguage: "en-US",
        breadcrumb: {
          "@id": `${pageUrl}#breadcrumb`,
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
            name: "AEO Audit",
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${pageUrl}#software`,
        name: "SIO-V5 AEO Audit Engine",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: pageUrl,
        description:
          "AI-powered audit engine that analyzes startup visibility across major language models and answer engines including ChatGPT, Claude, and Gemini.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          ratingCount: "500",
          bestRating: "5",
          worstRating: "1",
        },
        featureList:
          "AI Engine Optimization, Answer Engine Visibility, Semantic Authority, Entity Recognition, Defensibility Score, Competitive Gap Analysis",
        softwareVersion: "5.0",
        applicationSubCategory: "AEO Audit Tool",
        screenshot: `${appUrl}/og-image.png`,
        downloadUrl: pageUrl,
        installUrl: pageUrl,
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        serviceType: "AEO Audit",
        provider: {
          "@id": `${appUrl}/#organization`,
        },
        areaServed: {
          "@type": "Country",
          name: "Worldwide",
        },
        audience: {
          "@type": "Audience",
          audienceType:
            "Startup Founders, SaaS Companies, Digital Marketers, SEO Professionals",
        },
        description:
          "Comprehensive Answer Engine Optimization audit that analyzes your startup's visibility across AI engines like ChatGPT, Claude, and Gemini. Get actionable insights to improve AI recommendation rates.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          description:
            "Free initial AEO audit with visibility score and action items",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "AEO Audit Plans",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Free AEO Audit",
                description:
                  "Basic visibility score and 3 prioritized action items",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "War Briefing Report",
                description:
                  "Comprehensive AEO analysis with competitive intelligence",
              },
            },
          ],
        },
        serviceOutput: {
          "@type": "PropertyValue",
          name: "AEO Visibility Score",
          description:
            "Comprehensive score measuring your startup's AI engine visibility",
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "What exactly does the AEO audit measure?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Our audit measures your startup's visibility across major AI engines (ChatGPT, Claude, Gemini), semantic authority in your category, entity recognition strength, and overall defensibility score based on how difficult it would be for AI to replace your value proposition.",
            },
          },
          {
            "@type": "Question",
            name: "How long does the audit take?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The initial scan takes 2-3 minutes. You'll receive immediate scores and a high-level overview. A comprehensive War Briefing report with detailed recommendations is generated within 24 hours.",
            },
          },
          {
            "@type": "Question",
            name: "Is this different from SEO tools?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Traditional SEO tools analyze Google rankings and keyword performance. Our AEO audit focuses specifically on AI engine visibility—whether LLMs can find, understand, and recommend your startup when users ask relevant questions.",
            },
          },
          {
            "@type": "Question",
            name: "What do I get from the free audit?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The free audit provides your AEO visibility score, AI engine presence breakdown, semantic authority assessment, and 3 prioritized action items. Upgrade to unlock the full War Briefing with competitive analysis and comprehensive recommendations.",
            },
          },
          {
            "@type": "Question",
            name: "Can I audit multiple startups?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Each URL submission counts as one audit. Pro and Enterprise plans include multiple audit credits per month, perfect for agencies and serial founders managing multiple ventures.",
            },
          },
        ],
      },
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: "AEO Audit - Answer Engine Optimization for Startups",
        description:
          "Learn how to optimize your startup for AI engines. Our free AEO audit analyzes your visibility in ChatGPT, Claude, and Gemini.",
        image: [
          {
            "@type": "ImageObject",
            url: `${appUrl}/og-image.png`,
            width: 1200,
            height: 630,
          },
        ],
        datePublished: "2026-03-01",
        dateModified: "2026-03-13",
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
        articleSection: "Answer Engine Optimization",
        wordCount: "1500",
      },
    ],
  };

  return (
    <>
      <JSONLD data={jsonLd} />
      <AeoAuditPageClient />
    </>
  );
}
