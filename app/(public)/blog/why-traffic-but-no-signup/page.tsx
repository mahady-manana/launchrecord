import { JSONLD } from "@/components/JsonLd";
import type { Metadata } from "next";
import TrafficNoSignupPageClient from "./TrafficNoSignupPageClient";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const pageUrl = `${appUrl}/blog/why-traffic-but-no-signup`;

export const metadata: Metadata = {
  title: {
    default: "Why You Got Traffic But No Signup | Positioning & Messaging Fix",
    template: "%s | LaunchRecord",
  },
  description:
    "Your website gets visitors but nobody signs up? Discover the real reasons behind the traffic-to-conversion gap. Learn how positioning, messaging, and AI visibility can turn browsers into buyers.",
  keywords: [
    "conversion optimization",
    "positioning strategy",
    "messaging framework",
    "traffic conversion",
    "startup marketing",
    "value proposition",
    "AI visibility",
    "customer acquisition",
    "website conversion",
    "SaaS growth",
    "Messaging",
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
    title: "Why You Got Traffic But No Signup",
    description:
      "The hidden reasons your website traffic isn't converting. Fix your positioning, messaging, and AI visibility to turn visitors into customers.",
    url: pageUrl,
    siteName: "LaunchRecord",
    locale: "en_US",
    type: "article",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Traffic But No Signup - LaunchRecord",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Why You Got Traffic But No Signup",
    description:
      "Discover why your traffic isn't converting and how to fix it with better positioning and messaging.",
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

export default function TrafficNoSignupPage() {
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
        name: "Why You Got Traffic But No Signup | LaunchRecord",
        description:
          "Uncover why your website traffic isn't converting and learn how positioning, messaging, and AI visibility can turn visitors into customers.",
        isPartOf: {
          "@id": `${appUrl}/#website`,
        },
        about: {
          "@type": "Thing",
          name: "Conversion Optimization Through Positioning and Messaging",
          description:
            "A comprehensive guide to understanding and fixing the gap between website traffic and user conversions through strategic positioning and clear messaging.",
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
            name: "Traffic But No Signup",
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: "Why You Got Traffic But No Signup",
        alternativeHeadline:
          "The Real Reason Your Visitors Aren't Converting (And How to Fix It)",
        description:
          "A deep dive into the positioning, messaging, and AI visibility problems that kill conversions. Learn why traffic without signups is a symptom of deeper strategic issues.",
        image: [
          {
            "@type": "ImageObject",
            url: `${appUrl}/og-image.png`,
            width: 1200,
            height: 630,
          },
        ],
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
        articleSection: "Startup Growth Strategy & Conversion Optimization",
        articleBody:
          "This guide reveals the hidden reasons why your website gets traffic but fails to convert visitors into users. Through positioning strategy, messaging optimization, and AI visibility, learn how to build trust and drive conversions.",
        wordCount: "4500",
        keywords:
          "conversion optimization, positioning strategy, messaging framework, traffic conversion, startup marketing, value proposition",
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "Why am I getting traffic but no signups?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Traffic without conversions usually indicates positioning or messaging problems. Visitors don't understand your value, don't trust your solution, or can't see why you're different from competitors. Your website might be attracting the wrong audience or failing to communicate clear benefits.",
            },
          },
          {
            "@type": "Question",
            name: "How does positioning affect conversions?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Positioning determines whether visitors instantly understand what you do and why it matters to them. Poor positioning creates confusion, while strong positioning makes your value obvious. If visitors can't answer 'What is this?' and 'Why should I care?' within 5 seconds, they'll leave.",
            },
          },
          {
            "@type": "Question",
            name: "What is Messaging and why does it matter?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Messaging combines positioning strategy with clear, benefit-driven messaging. It ensures every word on your site reinforces your unique value. Without it, even great products fail to convert because visitors don't understand the transformation you offer.",
            },
          },
          {
            "@type": "Question",
            name: "How can AI visibility help with conversions?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "AI visibility ensures your brand is cited by ChatGPT, Claude, and other AI assistants when users ask about solutions you provide. These AI-referred visitors arrive pre-qualified and convert 3-5x higher because they trust the AI recommendation.",
            },
          },
          {
            "@type": "Question",
            name: "What's the fastest way to improve conversions?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Start with these steps: 1) Audit your positioning clarity, 2) Rewrite your hero section to focus on outcomes not features, 3) Add social proof above the fold, 4) Simplify your messaging, 5) Use tools like LaunchRecord's SIO-V5 to identify gaps in your strategy.",
            },
          },
        ],
      },
      {
        "@type": "DefinedTermSet",
        "@id": `${pageUrl}#definitions`,
        name: "Conversion Optimization Terminology",
        hasDefinedTerm: [
          {
            "@type": "DefinedTerm",
            name: "Positioning",
            termCode: "Positioning",
            description:
              "The strategic placement of your product in the minds of your target audience, clearly differentiating it from alternatives and making your unique value obvious.",
            inDefinedTermSet: {
              "@id": `${pageUrl}#definitions`,
            },
          },
          {
            "@type": "DefinedTerm",
            name: "Messaging",
            termCode: "Messaging",
            description:
              "The combination of positioning strategy and benefit-driven messaging that ensures every communication reinforces your unique value proposition.",
            inDefinedTermSet: {
              "@id": `${pageUrl}#definitions`,
            },
          },
          {
            "@type": "DefinedTerm",
            name: "AI Visibility",
            termCode: "AIVisibility",
            description:
              "The practice of optimizing your brand to be cited by AI assistants (ChatGPT, Claude, etc.) when users ask about solutions in your category.",
            inDefinedTermSet: {
              "@id": `${pageUrl}#definitions`,
            },
          },
          {
            "@type": "DefinedTerm",
            name: "Conversion Gap",
            termCode: "ConversionGap",
            description:
              "The difference between website traffic and actual conversions (signups, purchases, etc.), typically caused by positioning or messaging failures.",
            inDefinedTermSet: {
              "@id": `${pageUrl}#definitions`,
            },
          },
          {
            "@type": "DefinedTerm",
            name: "Value Proposition",
            termCode: "ValueProposition",
            description:
              "A clear statement that explains how your product solves customers' problems, delivers specific benefits, and tells the ideal customer why they should choose you.",
            inDefinedTermSet: {
              "@id": `${pageUrl}#definitions`,
            },
          },
        ],
      },
      {
        "@type": "LearningResource",
        "@id": `${pageUrl}#learning`,
        name: "Why Traffic But No Signup Guide",
        description:
          "Comprehensive resource for understanding and fixing conversion problems through positioning, messaging, and AI visibility strategies.",
        educationalLevel: "Intermediate to Advanced",
        learningResourceType: "Guide",
        typicalAgeRange: "18+",
        timeRequired: "PT12M",
        author: {
          "@id": `${appUrl}/#organization`,
        },
        educationalUse:
          "Professional development, startup strategy, conversion optimization, marketing",
        inLanguage: "en-US",
        url: pageUrl,
      },
    ],
  };

  return (
    <>
      <JSONLD data={jsonLd} />
      <TrafficNoSignupPageClient />
    </>
  );
}
