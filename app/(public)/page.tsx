import { JSONLD } from "@/components/JsonLd";
import type { Metadata } from "next";
import LaunchRecordLandingPageClient from "./LaunchRecordLandingPageClient";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const pageUrl = appUrl;

export const metadata: Metadata = {
  title: {
    default:
      "Get a Free Audit to Clarify Your Startup's Positioning and Boost Conversions | LaunchRecord",
    template: "%s | LaunchRecord",
  },
  description:
    "LaunchRecord analyzes your positioning, clarity, AEO presence, and strategic moat. The SIO-V5 engine benchmarks against 10,000+ startups to ensure you aren't just a feature waiting to be deleted.",
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
    "positioning audit",
    "clarity audit",
    "SaaS positioning",
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
      "Get a Free Audit to Clarify Your Startup's Positioning and Boost Conversions | LaunchRecord",
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
        alt: "LaunchRecord - Startup Positioning Audit",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Get a Free Audit to Clarify Your Startup's Positioning and Boost Conversions | LaunchRecord",
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
          "Get a Free Audit to Make Your Positioning and Product Clear | LaunchRecord",
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
        name: "LaunchRecord - Startup Positioning Audit",
        description:
          "LaunchRecord analyzes your positioning, clarity, AEO presence, and strategic moat. The SIO-V5 engine benchmarks against 10,000+ startups.",
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
        serviceType: "Startup Positioning Audit",
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
            "Get a Free Audit to Make Your Positioning and Product Clear | LaunchRecord",
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
                name: "Founder Plan",
                description:
                  "Weekly auto audits, competitive intelligence, and strategic recommendations",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Growth Plan",
                description:
                  "Advanced competitive analysis, investor reports, and market intelligence",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Sovereign Plan",
                description:
                  "Complete strategic command center with white-glove support and emergency pivot calls",
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
          "Clarity Assessment",
          "AEO Visibility Check",
          "Competitive Intelligence",
          "War Briefing Reports",
          "Defensibility Scoring",
          "Weekly Moat Missions",
        ],
        offers: {
          "@type": "AggregateOffer",
          lowPrice: "0",
          highPrice: "299",
          priceCurrency: "USD",
          offerCount: "4",
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
            name: "What problem does LaunchRecord solve?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Most startups are invisible to AI and sound like everyone else. LaunchRecord detects positioning blind spots with cold, clinical data and gives you a War Briefing with exact fixes before competitors or AI erase you from the market.",
            },
          },
          {
            "@type": "Question",
            name: "What is LaunchRecord?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "LaunchRecord is the #1 platform for verified sovereignty and defensibility ledger for startups. Our SIO-V5 Engine analyzes your positioning, clarity, AEO presence, and strategic moat against 10,000+ records.",
            },
          },
          {
            "@type": "Question",
            name: "How does the audit work?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Submit your URL. Our SIO-V5 Engine scrapes your site and cross-references your positioning against 1,400+ competitors. Within 2-4 minutes, you receive your War Briefing with status: JUNK, VULNERABLE, or SOVEREIGN.",
            },
          },
          {
            "@type": "Question",
            name: "Is there a free tier?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. The Core System is free forever and includes SIO-V5 audit, Global Score, 5-pillar scoring, and positioning analysis. Upgrade to unlock competitive intelligence and strategic warfare capabilities.",
            },
          },
          {
            "@type": "Question",
            name: "Who should use LaunchRecord?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Startup founders, SaaS companies, product leaders, and strategic planners who refuse to be commoditized. If you're building a SaaS and care about being irreplaceable in the age of AI, this is your weapon.",
            },
          },
        ],
      },
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline:
          "Get a Free Audit to Clarify Your Startup's Positioning and Boost Conversions | LaunchRecord",
        description:
          "LaunchRecord analyzes your positioning, clarity, AEO presence, and strategic moat with the AI-powered SIO-V5 engine.",
        image: [
          {
            "@type": "ImageObject",
            url: `${appUrl}/og-image.png`,
            width: 1200,
            height: 630,
          },
        ],
        datePublished: "2024-01-01",
        dateModified: "2026-03-30",
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
        articleSection: "Startup Positioning & Strategic Intelligence",
        wordCount: "2500",
      },
    ],
  };

  return (
    <>
      <JSONLD data={jsonLd} />
      <LaunchRecordLandingPageClient />
    </>
  );
}
