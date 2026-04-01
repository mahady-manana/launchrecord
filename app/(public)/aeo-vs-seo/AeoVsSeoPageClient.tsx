"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Brain,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Globe,
  Layers,
  Lightbulb,
  Link as LinkIcon,
  Menu,
  Users,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AeoVsSeoPageClient() {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isTocOpen, setIsTocOpen] = useState(false);

  const handleStartAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (websiteUrl) {
      window.location.href = `/sio-audit?url=${encodeURIComponent(websiteUrl)}`;
    }
  };

  const tableOfContents = [
    { id: "introduction", title: "Introduction", label: "Intro" },
    { id: "key-differences", title: "Key Differences", label: "Differences" },
    { id: "what-matters", title: "What Matters for AEO", label: "AEO Factors" },
    {
      id: "considerations",
      title: "Key Considerations",
      label: "Considerations",
    },
    { id: "verdict", title: "The Verdict", label: "Verdict" },
    { id: "next-steps", title: "Next Steps", label: "Get Started" },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsTocOpen(false);
    }
  };

  const comparisonData = {
    seo: {
      name: "Traditional SEO",
      icon: <Globe className="h-6 w-6" />,
      color: "blue",
      goal: "Rank in search engine results pages (SERPs)",
      focus: "Keywords and backlinks",
      success: "Clicks to your website",
      timeline: "3-6 months for results",
      metrics: [
        "Keyword rankings",
        "Organic traffic",
        "Backlink quantity",
        "Page load speed",
        "Domain authority",
      ],
      tactics: [
        "Keyword optimization",
        "Link building",
        "Technical SEO",
        "Content length",
        "Meta tags",
      ],
      limitation: "Requires users to click through to your site",
    },
    aeo: {
      name: "Answer Engine Optimization",
      icon: <Bot className="h-6 w-6" />,
      color: "orange",
      goal: "Appear in AI-generated answers",
      focus: "Semantic authority and entity recognition",
      success: "Being cited as the source",
      timeline: "Ongoing optimization",
      metrics: [
        "AI mention rate",
        "Citation frequency",
        "Semantic relevance",
        "Entity strength",
        "Topical authority",
      ],
      tactics: [
        "Structured data",
        "Entity optimization",
        "Authoritative content",
        "Brand mentions",
        "Knowledge graph presence",
      ],
      advantage: "Zero-click visibility—AI answers with your brand",
    },
  };

  const whatMatters = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Semantic Understanding",
      description:
        "AI engines don't match keywords—they understand meaning. Your content must demonstrate topical depth and semantic relationships.",
      impact: "High",
      howTo:
        "Create comprehensive topic clusters with interlinked content that shows depth of expertise.",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Entity Recognition",
      description:
        "AI needs to recognize your brand as a distinct entity. Build consistent signals across the web—mentions, citations, and knowledge panels.",
      impact: "Critical",
      howTo:
        "Maintain consistent NAP (Name, Address, Phone), claim business listings, and earn media mentions.",
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Structured Authority",
      description:
        "Use schema markup, clear hierarchies, and authoritative sources. AI prioritizes content that's easy to parse and verify.",
      impact: "High",
      howTo:
        "Implement schema.org markup, use clear heading hierarchies, and cite authoritative sources.",
    },
    {
      icon: <LinkIcon className="h-8 w-8" />,
      title: "Brand Mentions",
      description:
        "Unlinked brand mentions matter more than backlinks. AI tracks how often and in what context your brand appears.",
      impact: "Medium",
      howTo:
        "Focus on PR, guest posts, and creating shareable content that earns natural mentions.",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Answer Quality",
      description:
        "Content that directly answers questions with clear, concise information wins. AI extracts and cites authoritative answers.",
      impact: "Critical",
      howTo:
        "Use question-based headings, provide direct answers in the first paragraph, and structure content for featured snippets.",
    },
    {
      icon: <Layers className="h-8 w-8" />,
      title: "Multi-Engine Presence",
      description:
        "Optimize for ChatGPT, Claude, Gemini, Perplexity—each has different training data and citation behaviors.",
      impact: "Medium",
      howTo:
        "Distribute content across platforms, monitor mentions in each engine, and adapt strategies per platform.",
    },
  ];

  const considerations = [
    {
      question: "Should I abandon SEO for AEO?",
      answer:
        "No. SEO still drives significant traffic. The winning strategy is SEO + AEO—optimize for both traditional search rankings and AI answer visibility. They complement each other.",
      priority: "high",
    },
    {
      question: "How do I measure AEO success?",
      answer:
        "Track AI mention rates, citation frequency in AI responses, brand association with key topics, and share of voice in AI-generated content. Tools like LaunchRecord's SIO-V5 engine provide AEO visibility scores.",
      priority: "high",
    },
    {
      question: "What content works best for AEO?",
      answer:
        "Content that answers specific questions clearly, uses structured data, demonstrates expertise (E-E-A-T), and covers topics comprehensively. FAQ pages, how-to guides, and definitive resources perform well.",
      priority: "medium",
    },
    {
      question: "Does technical SEO still matter?",
      answer:
        "Yes. AI crawlers need to access and parse your content. Fast load times, clean structure, mobile optimization, and proper indexing remain foundational for both SEO and AEO.",
      priority: "high",
    },
    {
      question: "How long until AEO shows results?",
      answer:
        "AEO is ongoing. AI models train on historical data, so changes take time to reflect. Focus on consistent, high-quality content and entity building. Expect 3-6 months for measurable impact.",
      priority: "medium",
    },
    {
      question: "What if AI misrepresents my brand?",
      answer:
        "Monitor AI responses about your brand. Build strong, consistent messaging across owned channels. Consider claiming knowledge panels and maintaining accurate business listings.",
      priority: "low",
    },
  ];

  const stats = [
    {
      value: "50%",
      label: "Searches end with AI answers (no clicks)",
      source: "2026 Projection",
      footnote: "Based on current AI adoption trends",
    },
    {
      value: "74%",
      label: "Users trust AI recommendations",
      source: "Recent Study",
      footnote: "Trust in AI responses continues to grow",
    },
    {
      value: "3x",
      label: "Higher conversion from AI citations",
      source: "vs Traditional Search",
      footnote: "AI-cited brands see higher intent traffic",
    },
    {
      value: "60%",
      label: "Gen Z starts searches with AI",
      source: "2026",
      footnote: "Demographic shift in search behavior",
    },
  ];

  const keyTakeaways = [
    {
      title: "SEO + AEO = Winning Strategy",
      description:
        "Don't choose one over the other. Use SEO as your foundation and layer AEO optimization on top for maximum visibility.",
    },
    {
      title: "Entity Recognition is Critical",
      description:
        "Build strong brand signals across the web. AI needs to recognize your brand as a distinct, authoritative entity.",
    },
    {
      title: "Content Structure Matters More Than Ever",
      description:
        "Use schema markup, clear hierarchies, and question-based formatting to help AI parse and cite your content.",
    },
    {
      title: "Start Now, See Results in 3-6 Months",
      description:
        "AEO is a long-term investment. Start building your AI visibility today to dominate tomorrow's search landscape.",
    },
  ];

  return (
    <article className="space-y-24 py-16 pt-20" aria-label="AEO vs SEO Guide">
      {/* Table of Contents - Mobile */}
      <section className="px-4 max-w-6xl mx-auto md:hidden">
        <button
          onClick={() => setIsTocOpen(!isTocOpen)}
          className="w-full flex items-center justify-between p-4 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          aria-expanded={isTocOpen}
          aria-controls="toc-mobile"
        >
          <span className="font-semibold text-slate-800 flex items-center gap-2">
            <Menu className="h-5 w-5" />
            Table of Contents
          </span>
          {isTocOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {isTocOpen && (
          <nav
            id="toc-mobile"
            className="mt-4 space-y-2"
            aria-label="Table of Contents"
          >
            {tableOfContents.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block w-full text-left px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {item.title}
              </button>
            ))}
          </nav>
        )}
      </section>

      {/* Table of Contents - Desktop Sidebar */}

      {/* Hero Section */}
      <section
        id="introduction"
        className="relative px-4 bg-slate-100 rounded-xl max-w-7xl mx-auto pt-8 pb-12"
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-orange-50/50 via-transparent to-transparent" />

        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-100 px-4 py-1.5 rounded-full text-purple-800 text-sm font-medium shadow-sm">
            <Lightbulb className="h-4 w-4" />
            <span>Strategic Guide 2026</span>
          </div>
        </div>

        {/* Main Hero Content */}
        <div className="text-center max-w-4xl mx-auto space-y-6 mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 leading-tight">
            AEO vs SEO: <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
              What's the Difference
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              & What Actually Matters
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed summary">
            Search has changed. AI answer engines now handle 50% of queries.
            Understand the real differences between SEO and AEO—and what you
            should prioritize for your startup.
          </p>
        </div>

        {/* Author Byline */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-sm border border-slate-200">
            <div className="">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="h-3 w-3" />
                <time dateTime={CURRENT_DATE}>
                  Updated{" "}
                  {new Date().toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
                <span className="text-slate-300">|</span>
                <Clock className="h-3 w-3" />
                <span>5 min read</span>
              </div>
            </div>
          </div>
        </div>

        {/* SEO vs AEO Comparison Cards */}
        <div className="relative grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* SEO Card */}
          <div className="group relative bg-white border-2 border-blue-200 rounded-2xl p-8 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300">
            <div className="absolute -top-4 -left-4 h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shadow-md group-hover:scale-110 transition-transform">
              <Globe className="h-6 w-6" />
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-blue-900">SEO</h3>
                <p className="text-sm text-blue-600 font-medium">
                  Search Engine Optimization
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-bold">1</span>
                  </div>
                  <p className="text-slate-700">
                    Optimizes for{" "}
                    <strong className="text-blue-700">rankings</strong> in
                    traditional search results
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-bold">2</span>
                  </div>
                  <p className="text-slate-700">
                    Goal: <strong className="text-blue-700">Get clicks</strong>{" "}
                    to your website
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-blue-100">
                <p className="text-sm text-slate-500">
                  <span className="font-medium text-blue-700">Best for:</span>{" "}
                  Driving organic traffic, building long-term authority
                </p>
              </div>
            </div>
          </div>

          {/* AEO Card */}
          <div className="group relative bg-white border-2 border-orange-200 rounded-2xl p-8 shadow-sm hover:shadow-md hover:border-orange-300 transition-all duration-300">
            <div className="absolute -top-4 -left-4 h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 shadow-md group-hover:scale-110 transition-transform">
              <Bot className="h-6 w-6" />
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-orange-900">AEO</h3>
                <p className="text-sm text-orange-600 font-medium">
                  Answer Engine Optimization
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-orange-600 text-xs font-bold">1</span>
                  </div>
                  <p className="text-slate-700">
                    Optimizes for{" "}
                    <strong className="text-orange-700">citations</strong> in
                    AI-generated answers
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-orange-600 text-xs font-bold">2</span>
                  </div>
                  <p className="text-slate-700">
                    Goal:{" "}
                    <strong className="text-orange-700">Be the source</strong>{" "}
                    AI references
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-orange-100">
                <p className="text-sm text-slate-500">
                  <span className="font-medium text-orange-700">Best for:</span>{" "}
                  Zero-click visibility, AI brand mentions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* VS Badge - Desktop */}
      </section>

      {/* Introduction Description Section */}
      <section className="px-4 max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
            Understanding AEO vs SEO
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            The search landscape has fundamentally changed. Here's what you need
            to know.
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-6">
          <p className="text-lg text-slate-700 leading-relaxed">
            <strong className="text-slate-900">
              Search is undergoing its biggest transformation in decades.
            </strong>{" "}
            Traditional search engines like Google are no longer the only way
            people find information. AI-powered answer engines—like ChatGPT,
            Claude, Gemini, and Perplexity—are changing how users discover
            brands, products, and solutions.
          </p>

          <p className="text-lg text-slate-700 leading-relaxed">
            <strong className="text-slate-900">
              Here's the fundamental shift:
            </strong>{" "}
            SEO (Search Engine Optimization) was built for a world where users
            click through to websites. AEO (Answer Engine Optimization) is
            designed for a world where AI provides direct answers—often without
            any clicks at all. This "zero-click" future means your brand needs
            to be the source AI engines trust and cite.
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Globe className="h-5 w-5" />
                When SEO Wins
              </h3>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>
                    User searches "best CRM for startups" and clicks your review
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>
                    Traditional Google search drives organic traffic to your
                    blog
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Product pages rank for commercial keywords</span>
                </li>
              </ul>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-orange-900 mb-3 flex items-center gap-2">
                <Bot className="h-5 w-5" />
                When AEO Wins
              </h3>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span>
                    ChatGPT recommends your product when asked about solutions
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span>Claude cites your research in its response</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span>Gemini mentions your brand as a trusted source</span>
                </li>
              </ul>
            </div>
          </div>

          <p className="text-lg text-slate-700 leading-relaxed">
            <strong className="text-slate-900">The smart strategy?</strong>{" "}
            Don't choose between them. Use SEO as your foundation—quality
            content, technical excellence, and user experience benefit both
            approaches. Then layer AEO optimization on top: structured data,
            entity building, and AI-focused content formatting. This dual
            approach ensures you capture both traditional search traffic and
            emerging AI-driven visibility.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8 space-y-2">
            <h2 className="text-3xl font-bold text-white">
              Why This Matters Now
            </h2>
            <p className="text-slate-300">
              The search landscape is fundamentally shifting
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-orange-400">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-slate-300">
                  {stat.label}
                </div>
                <div className="text-xs text-slate-500">{stat.source}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-6 text-center">
            Sources: Industry research and 2026 search behavior studies
          </p>
        </div>
      </section>

      {/* Detailed Comparison */}
      <section
        id="key-differences"
        className="px-4 max-w-6xl mx-auto space-y-12"
      >
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-slate-800">
            Head-to-Head Comparison
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Understanding the fundamental differences between SEO and AEO
          </p>
        </div>

        <div
          className="overflow-x-auto"
          role="region"
          aria-label="Comparison Table"
          tabIndex={0}
        >
          <table className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden">
            <caption className="sr-only">
              Side-by-side comparison of SEO and AEO strategies
            </caption>
            <thead className="bg-slate-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-sm font-semibold text-slate-700"
                >
                  Aspect
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-sm font-semibold text-blue-700 bg-blue-50"
                >
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    SEO
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-sm font-semibold text-orange-700 bg-orange-50"
                >
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    AEO
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-slate-700 text-left"
                >
                  Primary Goal
                </th>
                <td className="px-6 py-4 text-slate-600 bg-blue-50/30">
                  Rank on page 1 of Google
                </td>
                <td className="px-6 py-4 text-slate-600 bg-orange-50/30">
                  Be cited in AI answers
                </td>
              </tr>
              <tr>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-slate-700 text-left"
                >
                  Success Metric
                </th>
                <td className="px-6 py-4 text-slate-600 bg-blue-50/30">
                  Clicks, impressions, CTR
                </td>
                <td className="px-6 py-4 text-slate-600 bg-orange-50/30">
                  Mentions, citations, brand association
                </td>
              </tr>
              <tr>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-slate-700 text-left"
                >
                  Content Focus
                </th>
                <td className="px-6 py-4 text-slate-600 bg-blue-50/30">
                  Keyword density, length
                </td>
                <td className="px-6 py-4 text-slate-600 bg-orange-50/30">
                  Clarity, authority, structure
                </td>
              </tr>
              <tr>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-slate-700 text-left"
                >
                  Link Strategy
                </th>
                <td className="px-6 py-4 text-slate-600 bg-blue-50/30">
                  Backlinks = ranking signal
                </td>
                <td className="px-6 py-4 text-slate-600 bg-orange-50/30">
                  Brand mentions = entity signal
                </td>
              </tr>
              <tr>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-slate-700 text-left"
                >
                  Technical Focus
                </th>
                <td className="px-6 py-4 text-slate-600 bg-blue-50/30">
                  Site speed, mobile, Core Web Vitals
                </td>
                <td className="px-6 py-4 text-slate-600 bg-orange-50/30">
                  Schema markup, entity data, structure
                </td>
              </tr>
              <tr>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-slate-700 text-left"
                >
                  User Behavior
                </th>
                <td className="px-6 py-4 text-slate-600 bg-blue-50/30">
                  User clicks through to site
                </td>
                <td className="px-6 py-4 text-slate-600 bg-orange-50/30">
                  User gets answer without clicking
                </td>
              </tr>
              <tr>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-slate-700 text-left"
                >
                  Timeline
                </th>
                <td className="px-6 py-4 text-slate-600 bg-blue-50/30">
                  3-6 months for rankings
                </td>
                <td className="px-6 py-4 text-slate-600 bg-orange-50/30">
                  Ongoing, model-dependent
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* What Actually Matters */}
      <section id="what-matters" className="px-4 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-slate-800">
            What Actually Matters for AEO
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Six critical factors that determine your AI visibility
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whatMatters.map((item, idx) => (
            <article
              key={idx}
              className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                  {item.icon}
                </div>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    item.impact === "Critical"
                      ? "bg-red-100 text-red-700"
                      : item.impact === "High"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {item.impact} Impact
                </span>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                {item.title}
              </h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                {item.description}
              </p>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs font-medium text-slate-500 mb-1">
                  How to implement:
                </p>
                <p className="text-sm text-slate-700">{item.howTo}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Key Considerations */}
      <section
        id="considerations"
        className="px-4 max-w-6xl mx-auto space-y-12"
      >
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-slate-800">
            Key Considerations Before You Start
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Strategic questions every founder should ask
          </p>
        </div>

        <div className="space-y-4">
          {considerations.map((item, idx) => (
            <details
              key={idx}
              open
              className="group bg-white border border-slate-200 rounded-xl open:shadow-md transition-all"
            >
              <summary
                className="flex items-center justify-between cursor-pointer p-6"
                aria-label={item.question}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      item.priority === "high"
                        ? "bg-red-500"
                        : item.priority === "medium"
                          ? "bg-orange-500"
                          : "bg-blue-500"
                    }`}
                    aria-hidden="true"
                  />
                  <span className="font-semibold text-slate-800">
                    {item.question}
                  </span>
                </div>
                <span
                  className="text-orange-500 group-open:rotate-180 transition-transform"
                  aria-hidden="true"
                >
                  ▼
                </span>
              </summary>
              <div className="px-6 pb-6 pl-14">
                <p className="text-slate-600 leading-relaxed">{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* The Verdict */}
      <section id="verdict" className="px-4 max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 md:p-12 space-y-8 border border-green-200">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-1.5 rounded-lg text-green-800 text-sm font-medium">
              <CheckCircle2 className="h-4 w-4" />
              <span>The Verdict</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
              You Need Both—Here's Why
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <p className="text-lg text-slate-700 leading-relaxed">
                <strong className="text-slate-900">
                  SEO isn't dead—but it's not enough.
                </strong>{" "}
                Traditional search still drives massive traffic, and the
                fundamentals (quality content, technical excellence, user
                experience) benefit both SEO and AEO.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                <strong className="text-slate-900">
                  AEO is your competitive edge.
                </strong>{" "}
                As AI answers capture more searches, being the cited source
                becomes critical for brand visibility and authority. Early
                adopters will dominate AI recommendations.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                <strong className="text-slate-900">
                  The winning strategy:
                </strong>{" "}
                Maintain SEO excellence while building AEO capabilities. Use the
                same content foundation—optimize it for both keyword rankings
                and AI citation.
              </p>
            </div>

            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-slate-800">
                    Keep Doing
                  </span>
                </div>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Quality content creation</li>
                  <li>• Technical SEO basics</li>
                  <li>• User experience optimization</li>
                  <li>• Mobile optimization</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-orange-600" />
                  <span className="font-semibold text-slate-800">
                    Start Doing
                  </span>
                </div>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Schema markup implementation</li>
                  <li>• Entity optimization</li>
                  <li>• Brand mention tracking</li>
                  <li>• AEO visibility audits</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Takeaways */}
      <section className="px-4 max-w-6xl mx-auto">
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 md:p-12 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-1.5 rounded-lg text-blue-800 text-sm font-medium">
              <Lightbulb className="h-4 w-4" />
              <span>Key Takeaways</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-800">
              What to Remember
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {keyTakeaways.map((takeaway, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">
                    {idx + 1}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">
                    {takeaway.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {takeaway.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="next-steps" className="px-4 max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-8 md:p-16 text-center text-white space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Audit Your AEO Readiness?
            </h2>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Get your AI visibility score and see how you compare to
              competitors. Free audit powered by the SIO-V5 engine.
            </p>
          </div>

          <form
            onSubmit={handleStartAudit}
            className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
          >
            <input
              type="url"
              placeholder="www.yourstartup.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="flex-1 px-6 py-4 bg-white text-slate-900 rounded-lg font-medium focus:ring-2 focus:ring-white/50 transition-all outline-none"
              aria-label="Website URL"
              required
            />
            <Button
              type="submit"
              className="h-14 px-8 bg-slate-900 text-white hover:bg-slate-800 rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              Get Free Audit
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="flex items-center justify-center gap-4 sm:gap-6 text-sm text-orange-100 flex-wrap">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Free initial audit
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              No credit card
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              2-4 minute results
            </span>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="px-4 max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-2xl font-bold text-slate-800">
            Continue Learning
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            href="/aeo-audit"
            className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md hover:border-orange-200 transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                <Eye className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-slate-800 group-hover:text-orange-600 transition-colors">
                AEO Audit
              </h3>
            </div>
            <p className="text-sm text-slate-600">
              Check your AI visibility across ChatGPT, Claude, and Gemini
            </p>
          </Link>

          <Link
            href="/how-score-works"
            className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md hover:border-orange-200 transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                How Scoring Works
              </h3>
            </div>
            <p className="text-sm text-slate-600">
              Understand the SIO-V5 engine and defensibility scoring methodology
            </p>
          </Link>

          <Link
            href="/sio-audit"
            className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md hover:border-orange-200 transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                <Brain className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-slate-800 group-hover:text-purple-600 transition-colors">
                SIO-V5 Engine
              </h3>
            </div>
            <p className="text-sm text-slate-600">
              Deep dive into our AI-powered strategic intelligence engine
            </p>
          </Link>
        </div>
      </section>

      {/* Breadcrumb Schema Display (for SEO) */}
      <nav className="sr-only" aria-label="Breadcrumb">
        <ol>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/resources">Resources</Link>
          </li>
          <li aria-current="page">AEO vs SEO Guide 2026</li>
        </ol>
      </nav>
    </article>
  );
}

const CURRENT_DATE = new Date().toISOString().split("T")[0];
