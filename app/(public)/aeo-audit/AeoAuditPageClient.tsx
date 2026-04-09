"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Bot,
  Brain,
  CheckCircle2,
  Eye,
  Globe,
  Search,
  Shield,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { AuditSelectionModal } from "./AuditSelectionModal";

export default function AeoAuditPageClient() {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStartAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (websiteUrl) {
      setIsModalOpen(true);
    }
  };

  const features = [
    {
      icon: <Bot className="h-6 w-6" />,
      title: "AI Engine Optimization",
      description:
        "Ensure your startup appears in AI-generated responses from ChatGPT, Claude, Gemini, and emerging LLMs.",
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: "Answer Engine Visibility",
      description:
        "Optimize for zero-click searches and AI answer boxes that dominate modern search results.",
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Semantic Authority",
      description:
        "Build topical authority and semantic relevance that AI engines recognize and trust.",
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Entity Recognition",
      description:
        "Strengthen your brand entity signals across knowledge graphs and AI training datasets.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Defensibility Score",
      description:
        "Measure how difficult it would be for AI to replace or commoditize your value proposition.",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Competitive Gap Analysis",
      description:
        "Identify where competitors are winning AI visibility and how to reclaim your position.",
    },
  ];

  const benefits = [
    "Discover if AI engines can find and recommend your startup",
    "Get actionable recommendations to improve AI visibility",
    "Understand your semantic positioning in the AI landscape",
    "Benchmark against 10,000+ startups in our SIO-V5 database",
    "Receive a prioritized roadmap for AEO improvements",
    "Future-proof your startup against AI-driven commoditization",
  ];

  const steps = [
    {
      number: "01",
      title: "Submit Your URL",
      description:
        "Enter your startup's website and we'll begin comprehensive analysis across multiple AI engines.",
    },
    {
      number: "02",
      title: "AI Engine Scanning",
      description:
        "Our SIO-V5 engine queries major LLMs and answer engines to assess your visibility and positioning.",
    },
    {
      number: "03",
      title: "Defensibility Audit",
      description:
        "Analyze your semantic authority, entity strength, and competitive differentiation signals.",
    },
    {
      number: "04",
      title: "Strategic War Briefing",
      description:
        "Receive a comprehensive report with scores, gaps, and prioritized actions to dominate AI visibility.",
    },
  ];

  return (
    <div className="space-y-24 py-20">
      {/* Hero Section */}
      <section className="px-4 max-w-6xl mx-auto space-y-8">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-purple-100 px-4 py-1.5 rounded-lg text-purple-800 text-sm font-medium">
            <Zap className="h-4 w-4" />
            <span>AEO Audit Powered by SIO-V5 Engine</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-secondary leading-tight">
            AEO Website Audit Tool, <br />{" "}
            <span className="text-3xl md:text-5xl text-slate-700">
              Start Optimizing for AI Answers.
            </span>
          </h1>

          <p className="text-xl text-slate-600 max-w-3xl leading-relaxed">
            Analyze how well your website performs in the era of AI search.
            Audit your startup's visibility in ChatGPT, Claude, and Gemini. Know
            if you're being recommended or replaced.
          </p>
        </div>

        <div className="space-y-4">
          <form
            onSubmit={handleStartAudit}
            className="flex flex-col sm:flex-row gap-3 max-w-2xl"
          >
            <input
              type="text"
              placeholder="www.yourstartup.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="flex-1 px-6 py-4 bg-white border border-slate-300 text-foreground rounded-lg font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all outline-none"
              required
            />
            <Button
              type="submit"
              className="h-14 px-8 bg-slate-900 text-white text-sm hover:bg-slate-800 rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              Start Free Audit
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="text-sm text-slate-500">
            Free initial audit • No credit card required • Results in 2-4
            minutes
          </p>
        </div>
      </section>

      {/* What is AEO Section */}
      <section className="px-4 max-w-6xl mx-auto space-y-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12 text-white">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            What is Answer Engine Optimization?
          </h2>
          <p className="text-lg text-slate-300 max-w-3xl leading-relaxed">
            AEO is the practice of optimizing your content and digital presence
            to appear in AI-generated answers. Unlike traditional SEO that
            targets search engine rankings, AEO focuses on being the source that
            AI engines cite when answering user queries.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 pt-4">
          <div className="bg-white/10 backdrop-blur rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-3">
              <Globe className="h-6 w-6 text-blue-400" />
              <h3 className="text-xl font-semibold">Traditional SEO</h3>
            </div>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5" />
                <span>Ranks in blue link search results</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5" />
                <span>Targets keyword matching</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5" />
                <span>Drives clicks to your website</span>
              </li>
            </ul>
          </div>

          <div className="bg-orange-500/20 backdrop-blur rounded-xl p-6 space-y-3 border border-orange-500/30">
            <div className="flex items-center gap-3">
              <Bot className="h-6 w-6 text-orange-400" />
              <h3 className="text-xl font-semibold">AEO (AI Era)</h3>
            </div>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-orange-400 mt-0.5" />
                <span>Appears in AI-generated answers</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-orange-400 mt-0.5" />
                <span>Targets semantic understanding</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-orange-400 mt-0.5" />
                <span>Becomes the cited authority</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 mt-4">
          <div className="flex items-start gap-3">
            <Eye className="h-6 w-6 text-red-400 mt-0.5" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-red-300">
                The Reality Check
              </h3>
              <p className="text-slate-300">
                By 2026, over 50% of searches will result in zero-click AI
                answers. If your startup isn't optimized for answer engines,
                you're invisible to half your potential customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-slate-800">
            Comprehensive AEO Audit Coverage
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Our SIO-V5 engine analyzes 6 critical dimensions of AI visibility
            and startup defensibility.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-orange-200 transition-all group"
            >
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-slate-800">
            Your Path to AI Visibility
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Four steps to understanding and dominating your AI presence.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 h-full text-white">
                <div className="text-5xl font-bold text-orange-500/30 mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-slate-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <ArrowRight className="h-6 w-6 text-slate-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 max-w-6xl mx-auto space-y-12">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 md:p-12 space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
              Why This Audit Matters
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl">
              AI engines are reshaping how customers discover and evaluate
              startups. Your visibility in these systems directly impacts your
              growth trajectory and defensibility.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 bg-white rounded-lg p-4 shadow-sm"
              >
                <CheckCircle2 className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700 font-medium">{benefit}</span>
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
              Ready to Audit Your AI Visibility?
            </h2>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Join hundreds of sovereign founders who are using AEO insights to
              build defensible, AI-visible startups.
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

          <p className="text-sm text-orange-100">
            Limited to 100 Sovereign Founders for March 2026
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-slate-800">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          <details className="group bg-white border border-slate-200 rounded-xl open:shadow-md transition-all">
            <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-slate-800">
              <span>What exactly does the AEO audit measure?</span>
              <span className="text-orange-500 group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="px-6 pb-6 text-slate-600 leading-relaxed">
              Our audit measures your startup's visibility across major AI
              engines (ChatGPT, Claude, Gemini), semantic authority in your
              category, entity recognition strength, and overall defensibility
              score based on how difficult it would be for AI to replace your
              value proposition.
            </div>
          </details>

          <details className="group bg-white border border-slate-200 rounded-xl open:shadow-md transition-all">
            <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-slate-800">
              <span>How long does the audit take?</span>
              <span className="text-orange-500 group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="px-6 pb-6 text-slate-600 leading-relaxed">
              The initial scan takes 2-4 minutes. You'll receive immediate
              scores and a high-level overview. A comprehensive War Briefing
              report with detailed recommendations is generated within 24 hours.
            </div>
          </details>

          <details className="group bg-white border border-slate-200 rounded-xl open:shadow-md transition-all">
            <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-slate-800">
              <span>Is this different from SEO tools?</span>
              <span className="text-orange-500 group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="px-6 pb-6 text-slate-600 leading-relaxed">
              Yes. Traditional SEO tools analyze Google rankings and keyword
              performance. Our AEO audit focuses specifically on AI engine
              visibility—whether LLMs can find, understand, and recommend your
              startup when users ask relevant questions.
            </div>
          </details>

          <details className="group bg-white border border-slate-200 rounded-xl open:shadow-md transition-all">
            <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-slate-800">
              <span>What do I get from the free audit?</span>
              <span className="text-orange-500 group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="px-6 pb-6 text-slate-600 leading-relaxed">
              The free audit provides your AEO visibility score, AI engine
              presence breakdown, semantic authority assessment, and 3
              prioritized action items. Upgrade to unlock the full War Briefing
              with competitive analysis and comprehensive recommendations.
            </div>
          </details>

          <details className="group bg-white border border-slate-200 rounded-xl open:shadow-md transition-all">
            <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-slate-800">
              <span>Can I audit multiple startups?</span>
              <span className="text-orange-500 group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="px-6 pb-6 text-slate-600 leading-relaxed">
              Yes. Each URL submission counts as one audit. Pro and Enterprise
              plans include multiple audit credits per month, perfect for
              agencies and serial founders managing multiple ventures.
            </div>
          </details>
        </div>
      </section>

      <AuditSelectionModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        websiteUrl={websiteUrl}
      />
    </div>
  );
}
