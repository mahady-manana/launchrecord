import { JSONLD } from "@/components/JsonLd";
import type { Metadata } from "next";
import LaunchRecordLandingPageClient from "./LaunchRecordLandingPageClient";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const pageUrl = appUrl;

export const metadata: Metadata = {
  title: {
    default: "Free Positioning and Messaging Audit For Startups",
    template: "%s | LaunchRecord",
  },
  description:
    "LaunchRecord audits your SaaS messaging clarity, spots positioning gaps, tests AI visibility and gives you exact copy fixes to turn confusion into conversions.",
  keywords: [
    "SaaS messaging audit",
    "positioning clarity",
    "conversion optimization",
    "AEO",
    "AI visibility",
    "startup positioning",
    "messaging clarity",
    "copywriting fixes",
    "LaunchRecord",
    "SaaS copywriting",
    "competitive positioning",
    "website clarity",
    "conversion rate optimization",
    "AI-powered audit",
    "startup messaging",
  ],
  authors: [{ name: "LaunchRecord", url: appUrl }],
  creator: "LaunchRecord",
  publisher: "LaunchRecord",
  metadataBase: new URL(appUrl),
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Free SaaS Positioning and Messaging Audit | LaunchRecord",
    description:
      "Audit your SaaS messaging clarity, spot positioning gaps, test AI visibility and get exact copy fixes to turn confusion into conversions.",
    url: pageUrl,
    siteName: "LaunchRecord",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LaunchRecord - SaaS Positioning and Messaging Audit",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free SaaS Positioning and Messaging Audit | LaunchRecord",
    description:
      "Audit your SaaS messaging clarity, spot positioning gaps, test AI visibility and get exact copy fixes.",
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
          "LaunchRecord helps SaaS founders fix confused messaging and weak positioning. Our audit tools test clarity, spot gaps, and give exact copy fixes to turn visitors into customers.",
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
          "Turn confused visitors into customers with clear positioning and messaging | LaunchRecord",
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
        name: "Free SaaS Positioning and Messaging Audit | LaunchRecord",
        description:
          "LaunchRecord audits your SaaS messaging clarity, spots positioning gaps, tests AI visibility and gives you exact copy fixes to turn confusion into conversions.",
        isPartOf: {
          "@id": `${appUrl}/#website`,
        },
        about: {
          "@type": "Thing",
          name: "SaaS Messaging & Positioning Audit",
          description:
            "Comprehensive analysis of SaaS messaging clarity, positioning gaps, and AI visibility to turn confused visitors into customers.",
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
          "AI-powered messaging and positioning audit tool that analyzes SaaS clarity, spots positioning gaps, and provides exact copy fixes to turn confused visitors into customers.",
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
          "Messaging Clarity Analysis, Positioning Gap Detection, AI Visibility Testing, Copy Fixes for Conversions, Competitive Positioning, Website Clarity Score, Conversion Optimization",
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
          "Comprehensive SaaS messaging and positioning audit that analyzes clarity, spots positioning gaps, tests AI visibility, and provides exact copy fixes to turn confusion into conversions.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          description:
            "Free SaaS Messaging & Positioning Audit | Turn Confused Visitors Into Customers | LaunchRecord",
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
                  "Free messaging and positioning audit with clarity scoring and copy fixes",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Founder Plan",
                description:
                  "Weekly auto audits, competitive positioning tracking, and messaging recommendations",
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
          name: "Messaging Clarity & Positioning Score",
          description:
            "Comprehensive score measuring your SaaS messaging clarity, positioning strength, and conversion potential",
        },
      },
      {
        "@type": "Product",
        "@id": `${pageUrl}#product`,
        name: "LaunchRecord Platform",
        description:
          "Turn confused visitors into customers with clear SaaS positioning and messaging audit tools",
        brand: {
          "@id": `${appUrl}/#organization`,
        },
        category: "Business Intelligence Software",
        features: [
          "Messaging Clarity Analysis",
          "Positioning Gap Detection",
          "AI Visibility Testing",
          "Copy Fixes for Conversions",
          "Competitive Positioning Review",
          "Website Clarity Score",
          "Conversion Optimization",
          "Weekly Messaging Audits",
        ],
        offers: {
          "@type": "AggregateOffer",
          lowPrice: "0",
          highPrice: "49",
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
              text: "Most startups lose customers because their messaging is unclear. LaunchRecord identifies what is confusing in your website positioning and copy, then shows exactly what to improve so more visitors understand your product and convert.",
            },
          },
          {
            "@type": "Question",
            name: "What is LaunchRecord?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "LaunchRecord is a tool that analyzes your website messaging, positioning, and clarity. It helps you understand how clearly your product is communicated and what is preventing visitors from becoming customers.",
            },
          },
          {
            "@type": "Question",
            name: "How does the audit work?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You submit your website URL, and LaunchRecord analyzes your homepage messaging, positioning, and clarity. Within minutes, you receive a report showing key issues and practical improvements to increase understanding and conversions.",
            },
          },
          {
            "@type": "Question",
            name: "Is there a free tier?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. The free plan includes a full website audit with clarity insights, positioning feedback, and key recommendations to improve your messaging and conversions. Paid plans unlock deeper analysis and ongoing tracking.",
            },
          },
          {
            "@type": "Question",
            name: "Who should use LaunchRecord?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "It is built for SaaS founders, product teams, and startups that want to improve messaging clarity, fix positioning issues, and turn more website visitors into customers.",
            },
          },
        ],
      },
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: "Free SaaS Positioning and Messaging Audit | LaunchRecord",
        description:
          "LaunchRecord audits your SaaS messaging clarity, spots positioning gaps, tests AI visibility and gives you exact copy fixes to turn confusion into conversions.",
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
        articleSection: "SaaS Messaging, Positioning & Conversion Optimization",
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
