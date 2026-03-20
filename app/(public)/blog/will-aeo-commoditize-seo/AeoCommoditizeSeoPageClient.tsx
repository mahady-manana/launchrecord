"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Bot,
  Brain,
  CheckCircle2,
  ChevronDown,
  Code2,
  Compass,
  Database,
  FileText,
  Lightbulb,
  Link2,
  Search,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  UserCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AeoCommoditizeSeoPageClient() {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const handleStartAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (websiteUrl) {
      window.location.href = `/survey?url=${encodeURIComponent(websiteUrl)}`;
    }
  };

  const seoVsAeo = [
    {
      category: "Optimization Target",
      seo: "Google's ranking algorithm",
      aeo: "Machine comprehension",
      icon: <Target className="h-5 w-5" />,
    },
    {
      category: "Primary Focus",
      seo: "Keywords & backlinks",
      aeo: "Structured & clear content",
      icon: <Search className="h-5 w-5" />,
    },
    {
      category: "Success Metric",
      seo: "Search ranking position",
      aeo: "AI citation frequency",
      icon: <TrendingUp className="h-5 w-5" />,
    },
    {
      category: "Content Style",
      seo: "Keyword-optimized articles",
      aeo: "Direct, extractable answers",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      category: "Authority Signal",
      seo: "Domain authority score",
      aeo: "Entity recognition",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      category: "User Behavior",
      seo: "Click through 10 blue links",
      aeo: "Get one synthesized answer",
      icon: <UserCheck className="h-5 w-5" />,
    },
  ];

  const commoditizedTasks = [
    {
      task: "Add structured data",
      automationLevel: 95,
      description: "Schema markup can be fully automated",
    },
    {
      task: "Write direct answers",
      automationLevel: 85,
      description: "AI can rewrite content for clarity",
    },
    {
      task: "Identify missing entities",
      automationLevel: 90,
      description: "Tools scan and recommend entities",
    },
    {
      task: "Build topical authority",
      automationLevel: 70,
      description: "Content clusters can be AI-generated",
    },
    {
      task: "Maintain consistent info",
      automationLevel: 95,
      description: "Automated across all channels",
    },
  ];

  const irreplaceableElements = [
    {
      element: "Unique Insights",
      description:
        "Original perspectives that come from real experience and expertise",
      icon: <Lightbulb className="h-6 w-6" />,
      color: "purple",
    },
    {
      element: "Original Data",
      description:
        "Proprietary research and data that no one else can replicate",
      icon: <Database className="h-6 w-6" />,
      color: "blue",
    },
    {
      element: "Real Authority",
      description:
        "Genuine expertise built through years of practice and results",
      icon: <Trophy className="h-6 w-6" />,
      color: "orange",
    },
    {
      element: "Strong Positioning",
      description:
        "Clear market position that differentiates you from competitors",
      icon: <Compass className="h-6 w-6" />,
      color: "green",
    },
    {
      element: "Founder Credibility",
      description: "Personal brand and reputation that AI cannot fabricate",
      icon: <UserCheck className="h-6 w-6" />,
      color: "red",
    },
  ];

  const timelineData = [
    {
      era: "2000-2010",
      title: "The Wild West",
      description: "Keyword stuffing, link farms, basic on-page SEO",
      icon: <Search className="h-6 w-6" />,
    },
    {
      era: "2010-2020",
      title: "The Quality Era",
      description: "Content quality, user experience, mobile-first indexing",
      icon: <TrendingUp className="h-6 w-6" />,
    },
    {
      era: "2020-2024",
      title: "The AI Dawn",
      description: "BERT, MUM, early language models change search behavior",
      icon: <Brain className="h-6 w-6" />,
    },
    {
      era: "2024-Present",
      title: "The AEO Revolution",
      description: "ChatGPT, Gemini, Perplexity—answers replace links",
      icon: <Bot className="h-6 w-6" />,
    },
  ];

  return (
    <div className="space-y-24 py-16">
      {/* Hero Section */}
      <section className="px-4 max-w-6xl mx-auto space-y-8 pt-10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-orange-100 px-4 py-1.5 rounded-lg text-purple-800 text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            <span>Strategic Analysis</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 leading-tight">
            Will AEO{" "}
            <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
              Commoditize
            </span>{" "}
            SEO?
          </h1>

          <p className="text-xl text-slate-600 max-w-3xl leading-relaxed summary">
            For 20 years, SEO has been a craft. Keywords. Backlinks. Content
            clusters. Technical audits. A mix of strategy, intuition, and
            experience. But AEO is changing the rules—and it might do something
            unexpected.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">20+</div>
            <div className="text-sm text-slate-600">Years of SEO Craft</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">50%</div>
            <div className="text-sm text-slate-600">
              Searches End with AI Answers
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">2026</div>
            <div className="text-sm text-slate-600">The Tipping Point</div>
          </div>
        </div>
      </section>

      {/* The Shift Section */}
      <section className="px-4 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-800">
            The Shift From <span className="text-purple-600">Ranking</span> to{" "}
            <span className="text-orange-500">Being the Answer</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Search engines used to return lists of links. Now they return
            answers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400">
                <Search className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">The Old Way</h3>
                <p className="text-purple-200 text-sm">Traditional Search</p>
              </div>
            </div>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start gap-3">
                <ChevronDown className="h-5 w-5 text-purple-400 mt-0.5" />
                <span>Users typed queries into Google</span>
              </li>
              <li className="flex items-start gap-3">
                <ChevronDown className="h-5 w-5 text-purple-400 mt-0.5" />
                <span>Got 10 blue links in return</span>
              </li>
              <li className="flex items-start gap-3">
                <ChevronDown className="h-5 w-5 text-purple-400 mt-0.5" />
                <span>Clicked through multiple results</span>
              </li>
              <li className="flex items-start gap-3">
                <ChevronDown className="h-5 w-5 text-purple-400 mt-0.5" />
                <span>Found answers by reading pages</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 bg-white/20 rounded-xl flex items-center justify-center text-white">
                <Bot className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">The New Way</h3>
                <p className="text-orange-100 text-sm">Answer Engines</p>
              </div>
            </div>
            <ul className="space-y-3 text-white">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-white/80 mt-0.5" />
                <span>Users ask questions naturally</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-white/80 mt-0.5" />
                <span>Get one synthesized answer</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-white/80 mt-0.5" />
                <span>Zero clicks needed</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-white/80 mt-0.5" />
                <span>AI cites trusted sources</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-6 text-center">
          <p className="text-lg text-slate-700">
            <span className="font-semibold">
              Systems like ChatGPT, Google Gemini, Perplexity AI, and Microsoft
              Copilot
            </span>{" "}
            are not just ranking pages. They read the web and synthesize
            responses. Users don&apos;t click 10 links anymore. They ask a
            question. And get one answer.
          </p>
        </div>
      </section>

      {/* SEO vs AEO Comparison */}
      <section className="px-4 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-800">
            The Optimization Target Has{" "}
            <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
              Changed
            </span>
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Traditional SEO and AEO optimize for fundamentally different
            systems.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <div className="grid md:grid-cols-3 bg-slate-50">
            <div className="p-4 font-semibold text-slate-700">Category</div>
            <div className="p-4 font-semibold text-purple-700 bg-purple-50">
              Traditional SEO
            </div>
            <div className="p-4 font-semibold text-orange-700 bg-orange-50">
              AEO
            </div>
          </div>
          {seoVsAeo.map((item, idx) => (
            <div
              key={idx}
              className={`grid md:grid-cols-3 ${idx !== seoVsAeo.length - 1 ? "border-b border-slate-200" : ""}`}
            >
              <div className="p-4 flex items-center gap-3 bg-white">
                <span className="text-slate-400">{item.icon}</span>
                <span className="font-medium text-slate-800">
                  {item.category}
                </span>
              </div>
              <div className="p-4 text-slate-600 bg-purple-50/50">
                {item.seo}
              </div>
              <div className="p-4 text-slate-600 bg-orange-50/50">
                {item.aeo}
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <h3 className="font-semibold text-purple-900 mb-4 flex items-center gap-2">
              <Search className="h-5 w-5" />
              Traditional SEO Optimizes For
            </h3>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-600 mt-2" />
                <span>Google&apos;s ranking algorithm</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-600 mt-2" />
                <span>Keywords</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-600 mt-2" />
                <span>Backlinks</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-600 mt-2" />
                <span>Domain authority</span>
              </li>
            </ul>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <h3 className="font-semibold text-orange-900 mb-4 flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AEO Optimizes For
            </h3>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-orange-600 mt-2" />
                <span className="font-semibold">Machine comprehension</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-orange-600 mt-2" />
                <span>Structured content</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-orange-600 mt-2" />
                <span>Clear, direct answers</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-orange-600 mt-2" />
                <span>Authoritative sources</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-orange-600 mt-2" />
                <span>Extractable by AI</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-lg text-red-900">
            <span className="font-bold">The uncomfortable truth:</span> If an AI
            can&apos;t easily extract the answer, you don&apos;t exist.
          </p>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="px-4 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-800">
            20 Years of Search Evolution
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            From keyword stuffing to AI synthesis—the journey of search
            optimization.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-purple-500 via-blue-500 to-orange-500 rounded-full" />

          <div className="space-y-12">
            {timelineData.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-8 ${idx % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
              >
                <div
                  className={`flex-1 ${idx % 2 === 0 ? "text-right" : "text-left"}`}
                >
                  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <div className="text-sm font-bold text-purple-600 mb-2">
                      {item.era}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-600">{item.description}</p>
                  </div>
                </div>
                <div className="relative z-10 h-12 w-12 bg-white border-4 border-purple-500 rounded-full flex items-center justify-center text-purple-600">
                  {item.icon}
                </div>
                <div className="flex-1" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commoditization Section */}
      <section className="px-4 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-red-100 px-4 py-1.5 rounded-lg text-red-800 text-sm font-medium">
            <Zap className="h-4 w-4" />
            <span>The Uncomfortable Truth</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-800">
            Why This Might <span className="text-red-600">Commoditize</span> SEO
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Most AEO best practices are mechanical. And mechanical tasks are
            easy to automate.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {commoditizedTasks.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-xl p-6 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">{item.task}</h3>
                  <span className="text-sm font-bold text-red-600">
                    {item.automationLevel}% automatable
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-1000"
                    style={{ width: `${item.automationLevel}%` }}
                  />
                </div>
                <p className="text-sm text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 space-y-6">
            <h3 className="text-2xl font-bold text-white">
              The Rise of Automated AEO
            </h3>
            <p className="text-slate-300 leading-relaxed">
              We&apos;re already seeing tools that analyze your site, identify
              missing entities, rewrite pages for AI extraction, and generate
              structured answers.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-white">
                <div className="h-10 w-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <Code2 className="h-5 w-5" />
                </div>
                <span>AI analyzing content</span>
              </div>
              <div className="flex items-center gap-4 text-white">
                <div className="h-10 w-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <Brain className="h-5 w-5" />
                </div>
                <span>AI identifying gaps</span>
              </div>
              <div className="flex items-center gap-4 text-white">
                <div className="h-10 w-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5" />
                </div>
                <span>AI rewriting content</span>
              </div>
              <div className="flex items-center gap-4 text-white">
                <div className="h-10 w-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
                <span>AI optimizing for AI</span>
              </div>
            </div>
            <div className="pt-6 border-t border-white/20">
              <p className="text-white font-medium">
                What once required SEO specialists can increasingly be handled
                by software.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Can't Be Commoditized */}
      <section className="px-4 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-1.5 rounded-lg text-green-800 text-sm font-medium">
            <Shield className="h-4 w-4" />
            <span>The Strategic Moat</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-800">
            But Strategy <span className="text-green-600">Won&apos;t</span> Be
            Commoditized
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            The mechanical part of SEO might disappear. But strategy won&apos;t.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {irreplaceableElements.map((item, idx) => (
            <div
              key={idx}
              className={`bg-white border-2 rounded-2xl p-6 space-y-4 hover:shadow-lg transition-shadow ${
                item.color === "purple"
                  ? "border-purple-200"
                  : item.color === "blue"
                    ? "border-blue-200"
                    : item.color === "orange"
                      ? "border-orange-200"
                      : item.color === "green"
                        ? "border-green-200"
                        : "border-red-200"
              }`}
            >
              <div
                className={`h-14 w-14 rounded-xl flex items-center justify-center ${
                  item.color === "purple"
                    ? "bg-purple-100 text-purple-600"
                    : item.color === "blue"
                      ? "bg-blue-100 text-blue-600"
                      : item.color === "orange"
                        ? "bg-orange-100 text-orange-600"
                        : item.color === "green"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                }`}
              >
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800">
                {item.element}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 md:p-12 space-y-6">
          <h3 className="text-2xl font-bold text-green-900 text-center">
            The websites that win in AEO won&apos;t just be optimized.
            <br />
            <span className="text-green-700">
              They&apos;ll be referenced. They&apos;ll be trusted sources.
            </span>
          </h3>
        </div>
      </section>

      {/* The New Moat */}
      <section className="px-4 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-800">
            The New SEO{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Moat
            </span>
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            The future moat is not keywords. It&apos;s knowledge ownership.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-8 text-white space-y-6">
            <h3 className="text-2xl font-bold">What AI Rewards</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-purple-200 mt-0.5" />
                <div>
                  <span className="font-semibold">Proprietary data</span>
                  <p className="text-purple-100 text-sm">
                    Original datasets no one else has
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-purple-200 mt-0.5" />
                <div>
                  <span className="font-semibold">Original research</span>
                  <p className="text-purple-100 text-sm">
                    Studies and insights you&apos;ve created
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-purple-200 mt-0.5" />
                <div>
                  <span className="font-semibold">Industry authority</span>
                  <p className="text-purple-100 text-sm">
                    Recognized expertise in your field
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white space-y-6">
            <h3 className="text-2xl font-bold">What Builds Trust</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-blue-200 mt-0.5" />
                <div>
                  <span className="font-semibold">Strong brand signals</span>
                  <p className="text-blue-100 text-sm">
                    Consistent presence across the web
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-blue-200 mt-0.5" />
                <div>
                  <span className="font-semibold">Founder credibility</span>
                  <p className="text-blue-100 text-sm">
                    Personal reputation and thought leadership
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-blue-200 mt-0.5" />
                <div>
                  <span className="font-semibold">Knowledge ownership</span>
                  <p className="text-blue-100 text-sm">
                    Owning a category of expertise
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-8 md:p-12 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-lg text-white text-sm font-medium">
            <Link2 className="h-4 w-4" />
            <span>AI doesn&apos;t reward pages. It rewards sources.</span>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-white">
            Your competitive advantage isn&apos;t optimization.
            <br />
            <span className="text-purple-400">
              It&apos;s ownership of unique knowledge.
            </span>
          </p>
        </div>
      </section>

      {/* The Real Question */}
      <section className="px-4 max-w-5xl mx-auto space-y-12">
        <div className="bg-gradient-to-br from-orange-500 via-red-500 to-purple-600 rounded-3xl p-8 md:p-16 text-center space-y-8 text-white">
          <div className="space-y-4">
            <p className="text-lg text-white/80">The Real Question</p>
            <h2 className="text-3xl md:text-5xl font-bold">
              It&apos;s No Longer About Ranking
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Search className="h-6 w-6 text-white/60" />
                <span className="text-sm font-medium text-white/60">
                  The Old Question
                </span>
              </div>
              <p className="text-2xl font-bold">
                &quot;How do I rank on Google?&quot;
              </p>
            </div>

            <div className="bg-white/20 backdrop-blur rounded-2xl p-8 border-2 border-white/30">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Bot className="h-6 w-6 text-white" />
                <span className="text-sm font-medium text-white">
                  The New Question
                </span>
              </div>
              <p className="text-2xl font-bold">
                &quot;How do I become the source AI uses to answer the
                question?&quot;
              </p>
            </div>
          </div>

          <div className="pt-8">
            <p className="text-xl text-white/90">
              That&apos;s the new game. And most companies are still playing the
              old one.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 max-w-4xl mx-auto space-y-8">
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 md:p-12 space-y-8 border border-purple-200">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-slate-800">
              Ready to Become an AI Source?
            </h2>
            <p className="text-lg text-slate-600">
              Audit your AI visibility and discover what&apos;s missing from
              your AEO strategy.
            </p>
          </div>

          <form
            onSubmit={handleStartAudit}
            className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
          >
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="Enter your website URL"
              className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Start Free Audit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Free analysis
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Results in minutes
            </span>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="px-4 max-w-6xl mx-auto space-y-8">
        <h3 className="text-2xl font-bold text-slate-800 text-center">
          Continue Reading
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            href="/blog/5-things-you-need-to-know-about-aeo"
            className="group bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md hover:border-purple-200 transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                <Brain className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-purple-600">
                Essential Guide
              </span>
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">
              5 Things You Need to Know About AEO
            </h4>
            <p className="text-slate-600 text-sm">
              What AEO is, why it matters, how it works, who needs it, and where
              to start.
            </p>
          </Link>

          <Link
            href="/aeo-vs-seo"
            className="group bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md hover:border-orange-200 transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                <Target className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-orange-600">
                Comparison
              </span>
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-orange-600 transition-colors">
              AEO vs SEO: What&apos;s the Difference?
            </h4>
            <p className="text-slate-600 text-sm">
              Understand the key differences between traditional SEO and modern
              AEO strategies.
            </p>
          </Link>

          <Link
            href="/sio-v5-engine"
            className="group bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md hover:border-blue-200 transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                <Zap className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-blue-600">
                Technology
              </span>
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
              The SIO-V5 Engine
            </h4>
            <p className="text-slate-600 text-sm">
              AI-powered analysis that measures your sovereignty and
              defensibility.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
