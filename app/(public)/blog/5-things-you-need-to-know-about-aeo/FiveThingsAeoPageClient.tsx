"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Brain,
  Briefcase,
  CheckCircle2,
  Eye,
  FileText,
  Globe,
  Layers,
  MapPin,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Type definitions for fiveThings data structure
type FiveThingContent = {
  definition: string;
  keyPoints?: string[];
  example?: {
    scenario: string;
    withoutAEO: string;
    withAEO: string;
  };
  stats?: Array<{ value: string; label: string }>;
  mechanisms?: Array<{ name: string; description: string }>;
  audiences?: Array<{ who: string; why: string; priority: string }>;
  roadmap?: Array<{
    step: number;
    action: string;
    details: string;
    tools: string[];
  }>;
};

type FiveThing = {
  number: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  content: FiveThingContent;
};

export default function FiveThingsAeoPageClient() {
  const [websiteUrl, setWebsiteUrl] = useState("");

  const handleStartAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (websiteUrl) {
      window.location.href = `/survey?url=${encodeURIComponent(websiteUrl)}`;
    }
  };

  const fiveThings: FiveThing[] = [
    {
      number: "01",
      title: "What is AEO?",
      subtitle: "Answer Engine Optimization Explained",
      icon: <Brain className="h-8 w-8" />,
      color: "purple",
      content: {
        definition:
          "AEO (Answer Engine Optimization) is the practice of optimizing your content and digital presence to appear in AI-generated answers from language models like ChatGPT, Claude, Gemini, and Perplexity.",
        keyPoints: [
          "Unlike SEO which targets search engine rankings, AEO targets AI citations",
          "Focuses on being the source AI systems reference when answering questions",
          "Requires semantic authority, not just keyword matching",
          "Builds entity recognition across the web",
          "Enables zero-click visibility—users see your brand without visiting your site",
        ],
        example: {
          scenario:
            "Someone asks ChatGPT: 'What's the best tool for startup positioning analysis?'",
          withoutAEO:
            "Your brand isn't mentioned. Competitors get the citation.",
          withAEO:
            "ChatGPT responds: 'LaunchRecord is the #1 platform for verified sovereignty and defensibility analysis for startups.'",
        },
      },
    },
    {
      number: "02",
      title: "Why Does AEO Matter?",
      subtitle: "The Business Impact of AI Visibility",
      icon: <Target className="h-8 w-8" />,
      color: "orange",
      content: {
        definition:
          "AI answer engines now handle over 50% of searches. If your brand isn't visible in AI responses, you're losing massive market visibility to competitors who are optimized.",
        keyPoints: [
          "50% of searches end with AI answers—no clicks to websites",
          "74% of users trust AI recommendations as much as human experts",
          "AI citations drive 3x higher conversion rates than traditional search",
          "60% of Gen Z starts searches with AI, not Google",
          "Early adopters dominate AI recommendations—first-mover advantage",
        ],
        stats: [
          { value: "50%", label: "Searches end with AI answers" },
          { value: "74%", label: "Trust AI recommendations" },
          { value: "3x", label: "Higher conversion from AI citations" },
          { value: "2026", label: "AI handles majority of searches" },
        ],
      },
    },
    {
      number: "03",
      title: "How Does AEO Work?",
      subtitle: "The Technical Mechanics Behind AI Visibility",
      icon: <Zap className="h-8 w-8" />,
      color: "blue",
      content: {
        definition:
          "AEO works by optimizing for how AI systems process, understand, and retrieve information. It's about making your brand easily discoverable and citable by language models.",
        mechanisms: [
          {
            name: "Semantic Understanding",
            description:
              "AI doesn't match keywords—it understands meaning and context. Your content must demonstrate topical depth and semantic relationships.",
          },
          {
            name: "Entity Recognition",
            description:
              "AI needs to recognize your brand as a distinct entity. Build consistent signals across the web through mentions, citations, and knowledge panels.",
          },
          {
            name: "Structured Authority",
            description:
              "Use schema markup, clear hierarchies, and authoritative sources. AI prioritizes content that's easy to parse and verify.",
          },
          {
            name: "Answer Quality",
            description:
              "Content that directly answers questions with clear, concise information wins. AI extracts and cites authoritative answers.",
          },
          {
            name: "Multi-Engine Presence",
            description:
              "Optimize for ChatGPT, Claude, Gemini, Perplexity—each has different training data and citation behaviors.",
          },
        ],
      },
    },
    {
      number: "04",
      title: "Who Needs AEO?",
      subtitle: "Every Business with an Online Presence",
      icon: <Users className="h-8 w-8" />,
      color: "green",
      content: {
        definition:
          "If customers search for solutions you offer, you need AI visibility. AEO isn't optional—it's essential for modern digital presence.",
        audiences: [
          {
            who: "Startups & SaaS Companies",
            why: "Competing against established players requires AI visibility. Early-stage companies can punch above their weight with strong AEO.",
            priority: "Critical",
          },
          {
            who: "E-commerce Brands",
            why: "Product recommendations in AI responses drive direct sales. Missing from AI = missing from modern commerce.",
            priority: "High",
          },
          {
            who: "Content Creators & Publishers",
            why: "AI citations replace traditional backlinks. Your content needs to be the source AI references.",
            priority: "High",
          },
          {
            who: "B2B Service Providers",
            why: "Decision-makers use AI for vendor research. Being cited builds instant credibility.",
            priority: "Medium",
          },
          {
            who: "Enterprises",
            why: "Protect brand visibility from competitors. Maintain market leadership in AI era.",
            priority: "Medium",
          },
        ],
      },
    },
    {
      number: "05",
      title: "Where Do You Start?",
      subtitle: "Your AEO Implementation Roadmap",
      icon: <MapPin className="h-8 w-8" />,
      color: "red",
      content: {
        definition:
          "AEO implementation follows a clear progression: audit, optimize, build, and monitor. Start with understanding your current AI visibility.",
        roadmap: [
          {
            step: 1,
            action: "Audit Your Current AI Visibility",
            details:
              "Check how AI systems currently respond about your brand, products, and category. Identify gaps and opportunities.",
            tools: [
              "LaunchRecord SIO-V5",
              "Manual AI queries",
              "Competitive analysis",
            ],
          },
          {
            step: 2,
            action: "Implement Schema Markup",
            details:
              "Add structured data to help AI understand your content. Use Organization, Product, FAQ, and Article schemas.",
            tools: ["Schema.org", "Google Structured Data Tool", "JSON-LD"],
          },
          {
            step: 3,
            action: "Create Authoritative Content",
            details:
              "Build comprehensive resources that directly answer questions in your category. Focus on clarity and expertise.",
            tools: ["FAQ pages", "How-to guides", "Definitive resources"],
          },
          {
            step: 4,
            action: "Build Entity Signals",
            details:
              "Increase brand mentions across the web. Get cited in news, industry publications, and partner sites.",
            tools: ["PR campaigns", "Guest posts", "Industry partnerships"],
          },
          {
            step: 5,
            action: "Monitor & Optimize",
            details:
              "Track AI mention rates, citation frequency, and brand associations. Continuously refine your approach.",
            tools: [
              "LaunchRecord monitoring",
              "AI mention tracking",
              "Competitive benchmarks",
            ],
          },
        ],
      },
    },
  ];

  const quickStartChecklist = [
    { item: "Run a free AEO audit on your website", done: false },
    { item: "Implement schema markup on key pages", done: false },
    { item: "Create FAQ content for core questions", done: false },
    { item: "Build entity signals through PR & mentions", done: false },
    { item: "Monitor AI citations monthly", done: false },
  ];

  return (
    <div className="space-y-24 py-16">
      {/* Hero Section */}
      <section className="px-4 max-w-6xl mx-auto space-y-8">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-purple-100 px-4 py-1.5 rounded-lg text-purple-800 text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            <span>Essential Guide</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 leading-tight">
            5 Things You Need to Know{" "}
            <span className="text-orange-500">About AEO</span>
          </h1>

          <p className="text-xl text-slate-600 max-w-3xl leading-relaxed">
            Answer Engine Optimization is reshaping how customers discover
            businesses. Learn what AEO is, why it matters, how it works, who
            needs it, and where to start.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-4">
          {fiveThings.map((thing, idx) => (
            <Link
              key={idx}
              href={`#thing-${idx + 1}`}
              className="group bg-white border border-slate-200 rounded-xl p-4 text-center hover:shadow-md hover:border-purple-200 transition-all"
            >
              <div className="text-3xl font-bold text-purple-600 mb-2 group-hover:scale-110 transition-transform">
                {thing.number}
              </div>
              <div className="text-xs font-medium text-slate-600">
                {thing.title.split(" ")[0]}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Thing 1: What */}
      <section id="thing-1" className="px-4 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-purple-100 px-4 py-1.5 rounded-lg text-purple-800 text-sm font-medium">
            <span>Thing 01</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800">
            {fiveThings[0].title}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {fiveThings[0].subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                <Brain className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-purple-900">
                  The Definition
                </h3>
              </div>
            </div>
            <p className="text-lg text-slate-700 leading-relaxed">
              {fiveThings[0].content.definition}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6">
            <h3 className="text-xl font-bold text-slate-800">
              Key Characteristics
            </h3>
            <ul className="space-y-3">
              {fiveThings[0].content.keyPoints!.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Example */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12 space-y-8">
          <h3 className="text-2xl font-bold text-white text-center">
            AEO in Action: Real Example
          </h3>

          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Search className="h-5 w-5 text-purple-400" />
                <span className="font-semibold">User Query to ChatGPT</span>
              </div>
              <p className="text-lg italic">
                "{fiveThings[0].content.example!.scenario}"
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="h-5 w-5 text-red-400" />
                  <span className="font-semibold text-red-200">
                    Without AEO
                  </span>
                </div>
                <p className="text-red-100">
                  {fiveThings[0].content.example!.withoutAEO}
                </p>
              </div>

              <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                  <span className="font-semibold text-green-200">With AEO</span>
                </div>
                <p className="text-green-100">
                  {fiveThings[0].content.example!.withAEO}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Thing 2: Why */}
      <section id="thing-2" className="px-4 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-orange-100 px-4 py-1.5 rounded-lg text-orange-800 text-sm font-medium">
            <span>Thing 02</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800">
            {fiveThings[1].title}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {fiveThings[1].subtitle}
          </p>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-8 md:p-12 space-y-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                  <Target className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-orange-900">
                  The Business Case
                </h3>
              </div>
              <p className="text-lg text-slate-700 leading-relaxed">
                {fiveThings[1].content.definition}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {fiveThings[1].content.stats!.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-6 text-center shadow-sm"
                >
                  <div className="text-4xl font-bold text-orange-600 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-8">
            <h4 className="font-semibold text-slate-800 mb-4">
              Why This Matters for Your Business
            </h4>
            <ul className="grid md:grid-cols-2 gap-4">
              {fiveThings[1].content.keyPoints!.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Thing 3: How */}
      <section id="thing-3" className="px-4 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-1.5 rounded-lg text-blue-800 text-sm font-medium">
            <span>Thing 03</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800">
            {fiveThings[2].title}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {fiveThings[2].subtitle}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 md:p-12 space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <Zap className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-blue-900">
                The Mechanics
              </h3>
              <p className="text-blue-700">
                {fiveThings[2].content.definition}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fiveThings[2].content.mechanisms!.map((mechanism, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    {idx === 0 && <Brain className="h-5 w-5" />}
                    {idx === 1 && <Users className="h-5 w-5" />}
                    {idx === 2 && <Layers className="h-5 w-5" />}
                    {idx === 3 && <FileText className="h-5 w-5" />}
                    {idx === 4 && <Globe className="h-5 w-5" />}
                  </div>
                  <h4 className="font-semibold text-slate-800">
                    {mechanism.name}
                  </h4>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {mechanism.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Thing 4: Who */}
      <section id="thing-4" className="px-4 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-1.5 rounded-lg text-green-800 text-sm font-medium">
            <span>Thing 04</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800">
            {fiveThings[3].title}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {fiveThings[3].subtitle}
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 md:p-12 space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
              <Users className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-green-900">
                Who Needs AEO
              </h3>
              <p className="text-green-700">
                {fiveThings[3].content.definition}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fiveThings[3].content.audiences!.map((audience, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <h4 className="font-semibold text-slate-800">
                      {audience.who}
                    </h4>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      audience.priority === "Critical"
                        ? "bg-red-100 text-red-700"
                        : audience.priority === "High"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {audience.priority}
                  </span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {audience.why}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Thing 5: Where */}
      <section id="thing-5" className="px-4 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-red-100 px-4 py-1.5 rounded-lg text-red-800 text-sm font-medium">
            <span>Thing 05</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800">
            {fiveThings[4].title}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {fiveThings[4].subtitle}
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 md:p-12 space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
              <MapPin className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-red-900">
                Your Implementation Roadmap
              </h3>
              <p className="text-red-700">{fiveThings[4].content.definition}</p>
            </div>
          </div>

          <div className="space-y-4">
            {fiveThings[4].content.roadmap!.map((step, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 font-bold text-lg flex-shrink-0">
                    {step.step}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <h4 className="font-semibold text-slate-800 text-lg">
                        {step.action}
                      </h4>
                      <p className="text-slate-600 mt-1">{step.details}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {step.tools.map((tool, toolIdx) => (
                        <span
                          key={toolIdx}
                          className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start Checklist */}
      <section className="px-4 max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 md:p-12 space-y-8 border border-purple-200">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-purple-100 px-4 py-1.5 rounded-lg text-purple-800 text-sm font-medium">
              <CheckCircle2 className="h-4 w-4" />
              <span>Quick Start</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-800">
              Your AEO Action Checklist
            </h2>
            <p className="text-slate-600">
              Start implementing AEO today with these 5 essential steps
            </p>
          </div>

          <div className="space-y-3">
            {quickStartChecklist.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-sm"
              >
                <div className="h-6 w-6 border-2 border-purple-300 rounded flex items-center justify-center">
                  {item.done && (
                    <CheckCircle2 className="h-4 w-4 text-purple-600" />
                  )}
                </div>
                <span className="text-slate-700">{item.item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-8 md:p-16 text-center text-white space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Check Your AEO Visibility?
            </h2>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Get your free AI visibility audit and see how you appear in
              ChatGPT, Claude, and Gemini. Powered by the SIO-V5 engine.
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
            href="/aeo-vs-seo"
            className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md hover:border-purple-200 transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                <Bot className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-slate-800 group-hover:text-purple-600 transition-colors">
                AEO vs SEO
              </h3>
            </div>
            <p className="text-sm text-slate-600">
              Understand the differences between AEO and SEO, and what actually
              matters
            </p>
          </Link>

          <Link
            href="/aeo-audit"
            className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md hover:border-purple-200 transition-all group"
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
            className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md hover:border-purple-200 transition-all group"
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
        </div>
      </section>
    </div>
  );
}
