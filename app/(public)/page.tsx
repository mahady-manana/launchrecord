import { JSONLD } from "@/components/JsonLd";
import { LandingLeaderboard } from "@/components/LandingLeaderboard";
import type { Metadata } from "next";
import LaunchRecordLandingPageClient from "./LaunchRecordLandingPageClient";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const pageUrl = appUrl;

export const metadata: Metadata = {
  title: {
    default: "LaunchRecord - Audit Your Startup's Sovereignty & Defensibility",
    template: "%s | LaunchRecord",
  },
  description:
    "Analyze your positioning, clarity, AEO presence, and strategic moat. The SIO-V5 engine analyzes your positioning against 10,000+ records to ensure you aren't just a feature waiting to be deleted.",
  keywords: [
    "SaaS audit",
    "positioning analysis",
    "AEO",
    "AI visibility",
    "startup defensibility",
    "product score",
    "SIO-V5",
    "LaunchRecord",
    "startup sovereignty",
    "competitive intelligence",
    "strategic moat",
    "AI-powered audit",
    "startup analysis tool",
  ],
  authors: [{ name: "LaunchRecord", url: appUrl }],
  creator: "LaunchRecord",
  publisher: "LaunchRecord",
  metadataBase: new URL(appUrl),
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title:
      "LaunchRecord - Audit Your Startup’s Market Positioning, Clarity and Strategic Moat.",
    description:
      "Analyze your positioning, clarity, AEO presence, and strategic moat with AI-powered SIO-V5 engine.",
    url: pageUrl,
    siteName: "LaunchRecord",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LaunchRecord - SF-1 War Briefing Preview",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "LaunchRecord - Audit Your Startup’s Market Positioning, Clarity and Strategic Moat.",
    description:
      "Analyze your positioning, clarity, AEO presence, and strategic moat.",
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

export default function LaunchRecordLandingPage() {
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
          "The #1 Platform For Verified Sovereignty & Defensibility Ledger for Startups. The Strategic Architect's weapon against AI-driven commoditization.",
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
        foundingDate: "2024",
        areaServed: {
          "@type": "Country",
          name: "Worldwide",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${appUrl}/#website`,
        url: appUrl,
        name: "LaunchRecord",
        description:
          "Audit Your Startup’s Market Positioning, Clarity and Strategic Moat.",
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
        name: "LaunchRecord - Audit Your Startup’s Market Positioning, Clarity and Strategic Moat.",
        description:
          "Analyze your positioning, clarity, AEO presence, and strategic moat. The SIO-V5 engine analyzes your positioning against 10,000+ records.",
        isPartOf: {
          "@id": `${appUrl}/#website`,
        },
        about: {
          "@type": "Thing",
          name: "Startup Defensibility Audit",
          description:
            "Comprehensive analysis of startup positioning, sovereignty, and defensibility using AI-powered SIO-V5 engine.",
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
        ],
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${pageUrl}#software`,
        name: "SIO-V5 Engine",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: pageUrl,
        description:
          "AI-powered strategic intelligence engine that analyzes startup positioning against 10,000+ records to measure sovereignty and defensibility.",
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
          "Positioning Analysis, Clarity Assessment, AEO Presence Check, Strategic Moat Analysis, Sovereignty Score, Defensibility Ledger, Competitive Intelligence",
        softwareVersion: "5.0",
        applicationSubCategory: "Startup Audit Platform",
        screenshot: `${appUrl}/og-image.png`,
        downloadUrl: pageUrl,
        installUrl: pageUrl,
        producer: {
          "@id": `${appUrl}/#organization`,
        },
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        serviceType: "Startup Defensibility Audit",
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
            "Startup Founders, SaaS Companies, Entrepreneurs, Product Leaders, Strategic Planners",
        },
        description:
          "Comprehensive startup audit service that analyzes positioning, clarity, AEO presence, and strategic moat using the SIO-V5 engine against 10,000+ records.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          description:
            "Free initial audit with sovereignty and defensibility scores",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "LaunchRecord Plans",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Core System",
                description:
                  "Basic sovereignty and defensibility audit with SIO-V5 analysis",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Competitive Intelligence",
                description:
                  "Advanced competitive analysis and strategic warfare capabilities",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "War Briefing",
                description:
                  "Comprehensive strategic report with actionable intelligence",
              },
            },
          ],
        },
        serviceOutput: {
          "@type": "PropertyValue",
          name: "Sovereignty & Defensibility Score",
          description:
            "Comprehensive score measuring your startup's market position and AI-era defensibility",
        },
      },
      {
        "@type": "Product",
        "@id": `${pageUrl}#product`,
        name: "LaunchRecord Platform",
        description:
          "The #1 Platform For Verified Sovereignty & Defensibility Ledger for Startups",
        brand: {
          "@id": `${appUrl}/#organization`,
        },
        category: "Business Intelligence Software",
        features: [
          "SIO-V5 Engine Analysis",
          "Positioning Audit",
          "AEO Visibility Check",
          "Competitive Intelligence",
          "War Briefing Reports",
          "Defensibility Scoring",
        ],
        offers: {
          "@type": "AggregateOffer",
          lowPrice: "0",
          highPrice: "99",
          priceCurrency: "USD",
          offerCount: "3",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          ratingCount: "500",
          bestRating: "5",
          worstRating: "1",
        },
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "Database Size",
            value: "10,000+ records",
          },
          {
            "@type": "PropertyValue",
            name: "Analysis Type",
            value: "AI-Powered",
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "What is LaunchRecord?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "LaunchRecord is the #1 platform for verified sovereignty and defensibility ledger for startups. Our SIO-V5 engine analyzes your positioning against 10,000+ records to ensure you aren't just a feature waiting to be deleted.",
            },
          },
          {
            "@type": "Question",
            name: "What does the SIO-V5 engine analyze?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The SIO-V5 engine analyzes your positioning, clarity, AEO (Answer Engine Optimization) presence, and strategic moat. It compares your startup against 10,000+ records to measure sovereignty and defensibility.",
            },
          },
          {
            "@type": "Question",
            name: "How long does an audit take?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The initial audit takes 2-3 minutes. You'll receive immediate scores and insights. Comprehensive War Briefing reports with detailed recommendations are generated within 24 hours.",
            },
          },
          {
            "@type": "Question",
            name: "Is there a free tier?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, LaunchRecord offers a free Core System tier that includes basic sovereignty and defensibility audits. Upgrade to unlock competitive intelligence and strategic warfare capabilities.",
            },
          },
          {
            "@type": "Question",
            name: "Who should use LaunchRecord?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "LaunchRecord is designed for startup founders, SaaS companies, entrepreneurs, product leaders, and strategic planners who want to ensure their startup has defensible positioning in the AI era.",
            },
          },
        ],
      },
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline:
          "LaunchRecord - The Sovereignty & Defensibility Platform for Startups",
        description:
          "Analyze your startup's positioning, clarity, AEO presence, and strategic moat with the AI-powered SIO-V5 engine.",
        image: [
          {
            "@type": "ImageObject",
            url: `${appUrl}/og-image.png`,
            width: 1200,
            height: 630,
          },
        ],
        datePublished: "2024-01-01",
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
        articleSection: "Startup Analysis & Strategic Intelligence",
        wordCount: "2000",
      },
    ],
  };

  return (
    <>
      <JSONLD data={jsonLd} />
      <LaunchRecordLandingPageClient Directories={<LandingLeaderboard />} />
    </>
  );
}
