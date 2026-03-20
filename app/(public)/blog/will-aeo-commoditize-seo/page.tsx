import { JSONLD } from "@/components/JsonLd";
import type { Metadata } from "next";
import AeoCommoditizeSeoPageClient from "./AeoCommoditizeSeoPageClient";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const pageUrl = `${appUrl}/blog/will-aeo-commoditize-seo`;

export const metadata: Metadata = {
  title: {
    default: "Will AEO Commoditize SEO? | LaunchRecord",
    template: "%s | LaunchRecord",
  },
  description:
    "For 20 years, SEO has been a craft. But AEO is changing the rules. Discover why mechanical optimization is becoming automated—and what truly matters in the AI era.",
  keywords: [
    "AEO",
    "SEO",
    "Answer Engine Optimization",
    "AI search",
    "SEO future",
    "AI optimization",
    "search marketing",
    "digital strategy",
    "AI visibility",
    "content strategy",
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
    title: "Will AEO Commoditize SEO?",
    description:
      "The uncomfortable truth about SEO in the AI era. Mechanical tasks are being automated. Strategy won't be.",
    url: pageUrl,
    siteName: "LaunchRecord",
    locale: "en_US",
    type: "article",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Will AEO Commoditize SEO? - LaunchRecord",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Will AEO Commoditize SEO?",
    description:
      "The real question is no longer 'How do I rank?' It's 'How do I become the source?'",
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

export default function AeoCommoditizeSeoPage() {
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
        name: "Will AEO Commoditize SEO? | LaunchRecord",
        description:
          "Analysis of how Answer Engine Optimization is transforming SEO from a craft into a commodity—and what remains irreplaceable.",
        isPartOf: {
          "@id": `${appUrl}/#website`,
        },
        about: {
          "@type": "Thing",
          name: "AEO vs SEO",
          description:
            "Exploring the shift from traditional SEO to Answer Engine Optimization and its implications for digital marketing strategy.",
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
            name: "Blog",
            item: `${appUrl}/blog`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Will AEO Commoditize SEO?",
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: "Will AEO Commoditize SEO?",
        alternativeHeadline:
          "The Uncomfortable Truth About SEO in the Age of Answer Engines",
        description:
          "For 20 years, SEO has been a craft. But AEO is changing the rules. Mechanical optimization is being automated. Strategy won't be.",
        image: [
          {
            "@type": "ImageObject",
            url: `${appUrl}/og-image.png`,
            width: 1200,
            height: 630,
          },
        ],
        datePublished: "2026-03-20",
        dateModified: "2026-03-20",
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
          "This article explores how Answer Engine Optimization (AEO) is transforming traditional SEO practices, examining which aspects are becoming commoditized and which strategic elements remain irreplaceable in the AI era.",
        wordCount: "2500",
        keywords:
          "AEO, SEO, Answer Engine Optimization, AI search, digital marketing, content strategy, AI visibility",
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "What is the difference between SEO and AEO?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "SEO (Search Engine Optimization) optimizes for ranking in search results—keywords, backlinks, and domain authority. AEO (Answer Engine Optimization) optimizes for AI comprehension—structured data, clear answers, entity recognition, and extractability by language models.",
            },
          },
          {
            "@type": "Question",
            name: "Is SEO becoming obsolete?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Traditional mechanical SEO tasks are being automated by AI tools. However, strategic SEO—unique insights, original data, real authority, and strong positioning—remains essential. The craft is evolving, not disappearing.",
            },
          },
          {
            "@type": "Question",
            name: "What aspects of SEO can AI automate?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "AI can automate: structured data implementation, keyword optimization, content rewriting for AI extraction, entity identification, and generating structured answers. These systematic tasks no longer require specialist expertise.",
            },
          },
          {
            "@type": "Question",
            name: "What can't AI replace in SEO strategy?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "AI cannot replace: unique insights, original research, real authority, strong brand positioning, founder credibility, and knowledge ownership. These strategic elements create the moat that separates leaders from followers.",
            },
          },
          {
            "@type": "Question",
            name: "How do I become the source AI uses?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Focus on: proprietary data, original research, industry authority, strong brand signals, and founder credibility. AI rewards sources, not just optimized pages. Build trust, demonstrate expertise, and own your knowledge category.",
            },
          },
        ],
      },
      {
        "@type": "DefinedTermSet",
        "@id": `${pageUrl}#definitions`,
        name: "SEO & AEO Terminology",
        hasDefinedTerm: [
          {
            "@type": "DefinedTerm",
            name: "SEO",
            termCode: "SEO",
            description:
              "Search Engine Optimization—the practice of optimizing content to rank higher in search engine results pages through keywords, backlinks, and technical improvements.",
            inDefinedTermSet: {
              "@id": `${pageUrl}#definitions`,
            },
          },
          {
            "@type": "DefinedTerm",
            name: "AEO",
            termCode: "AEO",
            description:
              "Answer Engine Optimization—the practice of optimizing content to appear in AI-generated answers from language models like ChatGPT, Claude, and Gemini.",
            inDefinedTermSet: {
              "@id": `${pageUrl}#definitions`,
            },
          },
          {
            "@type": "DefinedTerm",
            name: "Knowledge Ownership",
            termCode: "KnowledgeOwnership",
            description:
              "The strategic advantage gained by creating proprietary data, original research, and authoritative content that AI systems recognize as the definitive source on a topic.",
            inDefinedTermSet: {
              "@id": `${pageUrl}#definitions`,
            },
          },
          {
            "@type": "DefinedTerm",
            name: "Machine Comprehension",
            termCode: "MachineComprehension",
            description:
              "The ability of AI systems to understand, parse, and extract information from content. AEO optimizes for machine comprehension over human readability alone.",
            inDefinedTermSet: {
              "@id": `${pageUrl}#definitions`,
            },
          },
        ],
      },
      {
        "@type": "LearningResource",
        "@id": `${pageUrl}#learning`,
        name: "Will AEO Commoditize SEO? Analysis",
        description:
          "Strategic analysis of how Answer Engine Optimization is transforming traditional SEO practices and what remains irreplaceable in the AI era.",
        educationalLevel: "Intermediate to Advanced",
        learningResourceType: "Article",
        typicalAgeRange: "18+",
        timeRequired: "PT8M",
        author: {
          "@id": `${appUrl}/#organization`,
        },
        educationalUse:
          "Professional development, marketing strategy, startup education, digital transformation",
        inLanguage: "en-US",
        url: pageUrl,
      },
    ],
  };

  return (
    <>
      <JSONLD data={jsonLd} />
      <AeoCommoditizeSeoPageClient />
    </>
  );
}
