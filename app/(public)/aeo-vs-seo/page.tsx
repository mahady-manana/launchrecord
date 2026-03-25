import { JSONLD } from "@/components/JsonLd";
import type { Metadata } from "next";
import AeoVsSeoPageClient from "./AeoVsSeoPageClient";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const pageUrl = `${appUrl}/aeo-vs-seo`;

const CURRENT_DATE = new Date().toISOString().split("T")[0];
const PUBLISHED_DATE = "2026-01-15";

export const metadata: Metadata = {
  title: {
    default:
      "AEO vs SEO 2026: Key Differences, What Matters & How to Win | LaunchRecord",
    template: "%s | LaunchRecord",
  },
  description:
    "Complete 2026 guide to AEO vs SEO. Learn the critical differences between Answer Engine Optimization and Search Engine Optimization, what actually matters for AI visibility, and proven strategies to dominate both.",
  keywords: [
    "AEO vs SEO 2026",
    "Answer Engine Optimization",
    "SEO vs AEO difference",
    "AI search optimization",
    "AEO strategy guide",
    "SEO strategy 2026",
    "AI visibility optimization",
    "ChatGPT optimization",
    "search engine vs answer engine",
    "semantic SEO",
    "entity optimization",
    "AI citation optimization",
    "zero-click search",
    "LLM optimization",
    "generative AI search",
    "SIO search intelligence optimization",
  ],
  authors: [
    { name: "LaunchRecord Team", url: appUrl },
    { name: "LaunchRecord", url: `${appUrl}/about` },
  ],
  creator: "LaunchRecord",
  publisher: "LaunchRecord",
  metadataBase: new URL(appUrl),
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "AEO vs SEO 2026: Complete Guide to AI Search Optimization",
    description:
      "Master AEO and SEO in 2026. Comprehensive comparison with actionable strategies for AI visibility, traditional search rankings, and winning the zero-click future.",
    url: pageUrl,
    siteName: "LaunchRecord",
    locale: "en_US",
    type: "article",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AEO vs SEO Comparison Chart - Complete Guide 2026 | LaunchRecord",
        type: "image/png",
      },
      {
        url: "/aeo-vs-seo-og.png",
        width: 1200,
        height: 630,
        alt: "Answer Engine Optimization vs Search Engine Optimization",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AEO vs SEO 2026: What's the Difference & What Actually Matters",
    description:
      "Complete guide to AEO vs SEO. Learn what matters for AI visibility, key differences, and winning strategies for 2026.",
    images: ["/og-image.png"],
    creator: "@launchrecord",
    site: "@launchrecord",
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
  other: {
    "article:published_time": PUBLISHED_DATE,
    "article:modified_time": CURRENT_DATE,
  },
};

export default function AeoVsSeoPage() {
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
        "@type": "Person",
        "@id": `${appUrl}/#author`,
        name: "LaunchRecord Team",
        url: `${appUrl}/about`,
        jobTitle: "Product Team",
        worksFor: {
          "@id": `${appUrl}/#organization`,
        },
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
        name: "AEO vs SEO 2026: Key Differences, What Matters & How to Win | LaunchRecord",
        description:
          "Complete 2026 guide comparing AEO and SEO. Learn the critical differences, what matters for AI visibility, key strategies, and how to optimize for both search engines and answer engines.",
        isPartOf: {
          "@id": `${appUrl}/#website`,
        },
        about: [
          {
            "@type": "Thing",
            name: "Answer Engine Optimization",
            description:
              "AEO is the practice of optimizing content to appear in AI-generated answers from ChatGPT, Claude, Gemini, and other LLMs.",
          },
          {
            "@type": "Thing",
            name: "Search Engine Optimization",
            description:
              "SEO is the practice of optimizing content to rank in traditional search engine results pages.",
          },
          {
            "@type": "Thing",
            name: "AI Visibility",
            description:
              "The measure of how often and prominently a brand appears in AI-generated responses.",
          },
        ],
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
        significantLink: {
          "@id": `${pageUrl}#significant-links`,
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
            name: "Resources",
            item: `${appUrl}/resources`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "AEO vs SEO Guide 2026",
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "SignificantLink",
        "@id": `${pageUrl}#significant-links`,
        significantLink: [
          {
            "@type": "LinkRelation",
            name: "AEO Audit Tool",
            url: `${appUrl}/aeo-audit`,
          },
          {
            "@type": "LinkRelation",
            name: "How Scoring Works",
            url: `${appUrl}/how-score-works`,
          },
          {
            "@type": "LinkRelation",
            name: "SIO-V5 Engine",
            url: `${appUrl}/sio-v5-engine`,
          },
        ],
      },
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline:
          "AEO vs SEO 2026: What's the Difference & What Actually Matters",
        alternativeHeadline:
          "The Complete Guide to Answer Engine Optimization vs Search Engine Optimization for 2026",
        description:
          "Comprehensive comparison of AEO and SEO strategies. Learn what matters for AI visibility, key differences, actionable strategies, and how to optimize for both traditional search and AI answer engines in 2026.",
        image: [
          {
            "@type": "ImageObject",
            url: `${appUrl}/og-image.png`,
            width: 1200,
            height: 630,
          },
        ],
        datePublished: PUBLISHED_DATE,
        dateModified: CURRENT_DATE,
        author: {
          "@id": `${appUrl}/#author`,
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
          "This comprehensive 2026 guide compares Answer Engine Optimization (AEO) and Search Engine Optimization (SEO), explaining the key differences, what matters for AI visibility, strategic considerations for startups, and actionable tactics to dominate both traditional search and AI answer engines.",
        wordCount: "3200",
        keywords:
          "AEO, SEO, Answer Engine Optimization, Search Engine Optimization, AI visibility, ChatGPT optimization, semantic SEO, entity optimization, zero-click search, 2026 SEO strategy",
        mainEntity: {
          "@id": `${pageUrl}#faq`,
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "What is the main difference between AEO and SEO?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "SEO (Search Engine Optimization) focuses on ranking in traditional search results to drive clicks to your website. AEO (Answer Engine Optimization) focuses on being cited as the source in AI-generated answers, often resulting in zero-click visibility where users get answers without visiting your site.",
            },
          },
          {
            "@type": "Question",
            name: "Should I focus on AEO or SEO in 2026?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You should focus on both. SEO still drives significant organic traffic, while AEO prepares you for the AI-driven search future. The fundamentals of quality content and technical excellence benefit both strategies. Use SEO as your foundation and layer AEO optimization on top.",
            },
          },
          {
            "@type": "Question",
            name: "What matters most for AEO?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The most critical factors for AEO are: semantic understanding (topical depth and relationships), entity recognition (brand signals across the web), structured authority (schema markup and clear hierarchies), answer quality (clear, direct responses to questions), and multi-engine presence (optimizing for ChatGPT, Claude, Gemini, etc.).",
            },
          },
          {
            "@type": "Question",
            name: "How do I measure AEO success?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Track AI mention rates, citation frequency in AI responses, brand association with key topics, and share of voice in AI-generated content. Tools like LaunchRecord's SIO-V5 engine provide AEO visibility scores and competitive benchmarks.",
            },
          },
          {
            "@type": "Question",
            name: "Is SEO dead in the age of AI?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No, SEO is not dead. Traditional search still handles billions of queries daily. However, AI answer engines are growing rapidly—projected to handle 50% of searches by 2026. The winning strategy combines SEO excellence with AEO capabilities.",
            },
          },
          {
            "@type": "Question",
            name: "What content works best for AEO?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Content that directly answers specific questions with clear, concise information performs best. Use structured data, demonstrate expertise (E-E-A-T), cover topics comprehensively, and format content for easy AI parsing. FAQ pages, how-to guides, and definitive resources are ideal.",
            },
          },
          {
            "@type": "Question",
            name: "How long does it take to see results from AEO?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "AEO is an ongoing process. AI models train on historical data, so changes take time to reflect. Focus on consistent, high-quality content and entity building. Expect 3-6 months for measurable impact, similar to traditional SEO timelines.",
            },
          },
          {
            "@type": "Question",
            name: "Does technical SEO still matter for AEO?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. AI crawlers need to access and parse your content. Fast load times, clean structure, mobile optimization, and proper indexing remain foundational for both SEO and AEO. Technical excellence is a prerequisite for both strategies.",
            },
          },
        ],
      },
      {
        "@type": "DefinedTermSet",
        "@id": `${pageUrl}#definitions`,
        name: "AEO and SEO Terminology",
        hasDefinedTerm: [
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
            name: "SEO",
            termCode: "SEO",
            description:
              "Search Engine Optimization—the practice of optimizing content to rank in traditional search engine results pages (SERPs) like Google.",
            inDefinedTermSet: {
              "@id": `${pageUrl}#definitions`,
            },
          },
          {
            "@type": "DefinedTerm",
            name: "Zero-Click Search",
            termCode: "ZeroClickSearch",
            description:
              "A search query that is answered directly on the search results page or in an AI response without requiring the user to click through to a website.",
            inDefinedTermSet: {
              "@id": `${pageUrl}#definitions`,
            },
          },
          {
            "@type": "DefinedTerm",
            name: "Entity Recognition",
            termCode: "EntityRecognition",
            description:
              "The ability of AI systems to identify and understand brands, people, organizations, and concepts as distinct entities with specific attributes and relationships.",
            inDefinedTermSet: {
              "@id": `${pageUrl}#definitions`,
            },
          },
          {
            "@type": "DefinedTerm",
            name: "Semantic Authority",
            termCode: "SemanticAuthority",
            description:
              "The degree to which AI systems recognize a source as authoritative on a particular topic based on content depth, accuracy, and topical coverage.",
            inDefinedTermSet: {
              "@id": `${pageUrl}#definitions`,
            },
          },
          {
            "@type": "DefinedTerm",
            name: "SIO",
            termCode: "SIO",
            description:
              "Search Intelligence Optimization—a comprehensive approach to optimizing for both traditional search engines and AI answer engines using data-driven insights.",
            inDefinedTermSet: {
              "@id": `${pageUrl}#definitions`,
            },
          },
        ],
      },
      {
        "@type": "LearningResource",
        "@id": `${pageUrl}#learning`,
        name: "AEO vs SEO Guide 2026",
        description:
          "Educational resource comparing Answer Engine Optimization and Search Engine Optimization strategies for 2026.",
        educationalLevel: "Intermediate",
        learningResourceType: "Guide",
        typicalAgeRange: "18+",
        timeRequired: "PT15M",
        author: {
          "@id": `${appUrl}/#author`,
        },
        educationalUse:
          "Professional development, marketing strategy, SEO training",
        inLanguage: "en-US",
        url: pageUrl,
      },
      {
        "@type": "Table",
        "@id": `${pageUrl}#comparison-table`,
        name: "AEO vs SEO Comparison Table",
        description:
          "Side-by-side comparison of Answer Engine Optimization and Search Engine Optimization",
        about: {
          "@id": `${pageUrl}#article`,
        },
      },
    ],
  };

  return (
    <>
      <JSONLD data={jsonLd} />
      <AeoVsSeoPageClient />
    </>
  );
}
