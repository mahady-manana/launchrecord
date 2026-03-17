import { JSONLD } from "@/components/JsonLd";
import type { Metadata } from "next";
import FiveThingsAeoPageClient from "./FiveThingsAeoPageClient";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const pageUrl = `${appUrl}/blog/5-things-you-need-to-know-about-aeo`;

export const metadata: Metadata = {
  title: {
    default: "5 Things You Need to Know About AEO | LaunchRecord",
    template: "%s | LaunchRecord",
  },
  description:
    "Discover the 5 critical facts about Answer Engine Optimization (AEO). Learn what it is, why it matters, how it works, who needs it, and where to start optimizing for AI visibility.",
  keywords: [
    "AEO",
    "Answer Engine Optimization",
    "AI visibility",
    "ChatGPT optimization",
    "AI search",
    "semantic SEO",
    "entity optimization",
    "AI marketing",
    "startup visibility",
    "SIO-V5",
  ],
  authors: [{ name: "LaunchRecord", url: appUrl }],
  creator: "LaunchRecord",
  publisher: "LaunchRecord",
  metadataBase: new URL(appUrl),
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "5 Things You Need to Know About AEO",
    description:
      "Essential guide to Answer Engine Optimization. Learn what AEO is, why it matters, how it works, who needs it, and where to start.",
    url: pageUrl,
    siteName: "LaunchRecord",
    locale: "en_US",
    type: "article",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "5 Things About AEO - LaunchRecord",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "5 Things You Need to Know About AEO",
    description: "Essential guide to Answer Engine Optimization in 2026.",
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

export default function FiveThingsAeoPage() {
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
        name: "5 Things You Need to Know About AEO | LaunchRecord",
        description:
          "Comprehensive guide to Answer Engine Optimization. Learn what AEO is, why it matters, how it works, who needs it, and where to start optimizing.",
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
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", ".summary"],
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
            name: "5 Things About AEO",
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: "5 Things You Need to Know About AEO",
        alternativeHeadline:
          "The Complete Guide to Answer Engine Optimization Essentials",
        description:
          "Essential guide covering the five critical aspects of Answer Engine Optimization: what it is, why it matters, how it works, who needs it, and where to start.",
        image: [
          {
            "@type": "ImageObject",
            url: `${appUrl}/og-image.png`,
            width: 1200,
            height: 630,
          },
        ],
        datePublished: "2026-03-17",
        dateModified: "2026-03-17",
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
        articleSection: "Digital Marketing Strategy",
        articleBody:
          "This comprehensive guide covers five essential aspects of Answer Engine Optimization (AEO): what it is, why it matters for modern businesses, how it works technically, who needs to implement it, and where to start optimization efforts.",
        wordCount: "3000",
        keywords:
          "AEO, Answer Engine Optimization, AI visibility, ChatGPT optimization, semantic SEO, entity optimization",
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "What is AEO in simple terms?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "AEO (Answer Engine Optimization) is the practice of optimizing your content so AI systems like ChatGPT, Claude, and Gemini cite your brand when answering questions. Unlike SEO which aims for search rankings, AEO aims for AI citations.",
            },
          },
          {
            "@type": "Question",
            name: "Why does AEO matter for my business?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "By 2026, AI answer engines handle over 50% of searches. If your brand isn't visible in AI responses, you're losing massive visibility to competitors who are optimized for AI citation.",
            },
          },
          {
            "@type": "Question",
            name: "How does AEO actually work?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "AEO works by optimizing for how AI systems process information: semantic understanding, entity recognition, structured data, authoritative content, and multi-engine presence. AI systems prioritize sources that demonstrate clear expertise and are easy to parse.",
            },
          },
          {
            "@type": "Question",
            name: "Who needs to implement AEO?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Every business with an online presence needs AEO: startups, SaaS companies, e-commerce brands, content creators, and enterprises. If customers search for solutions you offer, you need AI visibility.",
            },
          },
          {
            "@type": "Question",
            name: "Where should I start with AEO optimization?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Start with these steps: 1) Audit your current AI visibility, 2) Implement schema markup, 3) Create authoritative FAQ content, 4) Build entity signals across the web, 5) Monitor and track AI mentions. Tools like LaunchRecord's SIO-V5 engine can help.",
            },
          },
        ],
      },
      {
        "@type": "DefinedTermSet",
        "@id": `${pageUrl}#definitions`,
        name: "AEO Terminology",
        hasDefinedTerm: [
          {
            "@type": "DefinedTerm",
            name: "AEO",
            termCode: "AEO",
            description:
              "Answer Engine Optimization—the practice of optimizing content to appear in AI-generated answers from language models.",
            inDefinedTermSet: {
              "@id": `${pageUrl}#definitions`,
            },
          },
          {
            "@type": "DefinedTerm",
            name: "Entity Recognition",
            termCode: "EntityRecognition",
            description:
              "The ability of AI systems to identify and understand brands, organizations, and concepts as distinct entities with specific attributes.",
            inDefinedTermSet: {
              "@id": `${pageUrl}#definitions`,
            },
          },
          {
            "@type": "DefinedTerm",
            name: "Semantic Authority",
            termCode: "SemanticAuthority",
            description:
              "The degree to which AI systems recognize a source as authoritative on a particular topic based on content depth and accuracy.",
            inDefinedTermSet: {
              "@id": `${pageUrl}#definitions`,
            },
          },
          {
            "@type": "DefinedTerm",
            name: "Zero-Click Visibility",
            termCode: "ZeroClickVisibility",
            description:
              "Brand visibility achieved when AI answers user queries without requiring clicks to external websites.",
            inDefinedTermSet: {
              "@id": `${pageUrl}#definitions`,
            },
          },
        ],
      },
      {
        "@type": "LearningResource",
        "@id": `${pageUrl}#learning`,
        name: "5 Things About AEO Guide",
        description:
          "Educational resource covering the essentials of Answer Engine Optimization for businesses and marketers.",
        educationalLevel: "Beginner to Intermediate",
        learningResourceType: "Guide",
        typicalAgeRange: "18+",
        timeRequired: "PT10M",
        author: {
          "@id": `${appUrl}/#organization`,
        },
        educationalUse:
          "Professional development, marketing strategy, startup education",
        inLanguage: "en-US",
        url: pageUrl,
      },
    ],
  };

  return (
    <>
      <JSONLD data={jsonLd} />
      <FiveThingsAeoPageClient />
    </>
  );
}
