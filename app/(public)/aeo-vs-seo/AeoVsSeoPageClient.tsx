"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Brain,
  CheckCircle2,
  Eye,
  FileText,
  Globe,
  Layers,
  Lightbulb,
  Link as LinkIcon,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AeoVsSeoPageClient() {
  const [websiteUrl, setWebsiteUrl] = useState("");

  const handleStartAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (websiteUrl) {
      window.location.href = `/survey?url=${encodeURIComponent(websiteUrl)}`;
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
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Entity Recognition",
      description:
        "AI needs to recognize your brand as a distinct entity. Build consistent signals across the web—mentions, citations, and knowledge panels.",
      impact: "Critical",
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Structured Authority",
      description:
        "Use schema markup, clear hierarchies, and authoritative sources. AI prioritizes content that's easy to parse and verify.",
      impact: "High",
    },
    {
      icon: <LinkIcon className="h-8 w-8" />,
      title: "Brand Mentions",
      description:
        "Unlinked brand mentions matter more than backlinks. AI tracks how often and in what context your brand appears.",
      impact: "Medium",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Answer Quality",
      description:
        "Content that directly answers questions with clear, concise information wins. AI extracts and cites authoritative answers.",
      impact: "Critical",
    },
    {
      icon: <Layers className="h-8 w-8" />,
      title: "Multi-Engine Presence",
      description:
        "Optimize for ChatGPT, Claude, Gemini, Perplexity—each has different training data and citation behaviors.",
      impact: "Medium",
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
      source: "2026",
    },
    {
      value: "74%",
      label: "Users trust AI recommendations",
      source: "Recent Study",
    },
    {
      value: "3x",
      label: "Higher conversion from AI citations",
      source: "vs Traditional Search",
    },
    { value: "60%", label: "Gen Z starts searches with AI", source: "2026" },
  ];

  return (
    <div className="space-y-24 py-16">
      {/* Hero Section */}
      <section className="px-4 max-w-6xl mx-auto space-y-8 pt-10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-purple-100 px-4 py-1.5 rounded-lg text-purple-800 text-sm font-medium">
            <Lightbulb className="h-4 w-4" />
            <span>Strategic Guide</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 leading-tight">
            AEO vs SEO:{" "}
            <span className="text-orange-500">What's the Difference</span>{" "}
            <span className="text-green-600">& What Actually Matters</span>
          </h1>

          <p className="text-xl text-slate-600 max-w-3xl leading-relaxed">
            Search has changed. AI answer engines now handle 50% of queries.
            Understand the real differences between SEO and AEO—and what you
            should prioritize for your startup.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900">SEO</h3>
                <p className="text-sm text-blue-700">
                  Search Engine Optimization
                </p>
              </div>
            </div>
            <p className="text-slate-700">
              Optimizes for <strong>rankings</strong> in traditional search
              results. Goal: Get clicks to your website.
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-orange-900">AEO</h3>
                <p className="text-sm text-orange-700">
                  Answer Engine Optimization
                </p>
              </div>
            </div>
            <p className="text-slate-700">
              Optimizes for <strong>citations</strong> in AI-generated answers.
              Goal: Be the source AI references.
            </p>
          </div>
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
        </div>
      </section>

      {/* Detailed Comparison */}
      <section className="px-4 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-slate-800">
            Head-to-Head Comparison
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Understanding the fundamental differences between SEO and AEO
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Aspect
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-700 bg-blue-50">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    SEO
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-700 bg-orange-50">
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    AEO
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="px-6 py-4 font-medium text-slate-700">
                  Primary Goal
                </td>
                <td className="px-6 py-4 text-slate-600 bg-blue-50/30">
                  Rank on page 1 of Google
                </td>
                <td className="px-6 py-4 text-slate-600 bg-orange-50/30">
                  Be cited in AI answers
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-slate-700">
                  Success Metric
                </td>
                <td className="px-6 py-4 text-slate-600 bg-blue-50/30">
                  Clicks, impressions, CTR
                </td>
                <td className="px-6 py-4 text-slate-600 bg-orange-50/30">
                  Mentions, citations, brand association
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-slate-700">
                  Content Focus
                </td>
                <td className="px-6 py-4 text-slate-600 bg-blue-50/30">
                  Keyword density, length
                </td>
                <td className="px-6 py-4 text-slate-600 bg-orange-50/30">
                  Clarity, authority, structure
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-slate-700">
                  Link Strategy
                </td>
                <td className="px-6 py-4 text-slate-600 bg-blue-50/30">
                  Backlinks = ranking signal
                </td>
                <td className="px-6 py-4 text-slate-600 bg-orange-50/30">
                  Brand mentions = entity signal
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-slate-700">
                  Technical Focus
                </td>
                <td className="px-6 py-4 text-slate-600 bg-blue-50/30">
                  Site speed, mobile, Core Web Vitals
                </td>
                <td className="px-6 py-4 text-slate-600 bg-orange-50/30">
                  Schema markup, entity data, structure
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-slate-700">
                  User Behavior
                </td>
                <td className="px-6 py-4 text-slate-600 bg-blue-50/30">
                  User clicks through to site
                </td>
                <td className="px-6 py-4 text-slate-600 bg-orange-50/30">
                  User gets answer without clicking
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-slate-700">
                  Timeline
                </td>
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
      <section className="px-4 max-w-6xl mx-auto space-y-12">
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
            <div
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
              <p className="text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Key Considerations */}
      <section className="px-4 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-slate-800">
            What to Consider Before You Start
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Strategic questions every founder should ask
          </p>
        </div>

        <div className="space-y-4">
          {considerations.map((item, idx) => (
            <details
              key={idx}
              className="group bg-white border border-slate-200 rounded-xl open:shadow-md transition-all"
            >
              <summary className="flex items-center justify-between cursor-pointer p-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      item.priority === "high"
                        ? "bg-red-500"
                        : item.priority === "medium"
                          ? "bg-orange-500"
                          : "bg-blue-500"
                    }`}
                  />
                  <span className="font-semibold text-slate-800">
                    {item.question}
                  </span>
                </div>
                <span className="text-orange-500 group-open:rotate-180 transition-transform">
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
      <section className="px-4 max-w-6xl mx-auto">
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

      {/* CTA Section */}
      <section className="px-4 max-w-4xl mx-auto">
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
              type="text"
              placeholder="www.yourstartup.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="flex-1 px-6 py-4 bg-white text-slate-900 rounded-lg font-medium focus:ring-2 focus:ring-white/50 transition-all outline-none"
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

          <div className="flex items-center justify-center gap-6 text-sm text-orange-100">
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
              2-3 minute results
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
            href="/sio-v5-engine"
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
    </div>
  );
}
