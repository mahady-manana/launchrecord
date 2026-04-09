"use client";

import { AuditSelectionModal } from "@/app/(public)/aeo-audit/AuditSelectionModal";
import { Button } from "@/components/ui/button";
import {
  Activity,
  AlertCircle,
  Bot,
  Brain,
  CheckCircle2,
  Cpu,
  Eye,
  Globe,
  MessageSquare,
  Network,
  Search,
  Shield,
  Sparkles,
  Target,
  Terminal,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useState } from "react";

export default function AeoAuditToolPageClient() {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStartAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (websiteUrl) {
      setIsModalOpen(true);
    }
  };

  const aiEngines = [
    {
      name: "ChatGPT",
      icon: <MessageSquare className="h-6 w-6" />,
      color: "from-green-500 to-emerald-600",
      description:
        "OpenAI's assistant handles 100M+ daily queries. If it doesn't mention you, you're invisible to millions.",
      checks: [
        "Brand mention in category queries",
        "Contextual relevance scoring",
        "Entity recognition strength",
        "Citation frequency analysis",
      ],
    },
    {
      name: "Claude",
      icon: <Brain className="h-6 w-6" />,
      color: "from-orange-500 to-amber-600",
      description:
        "Anthropic's AI prioritizes authoritative sources. Strong entity signals = more recommendations.",
      checks: [
        "Knowledge graph presence",
        "Authority signal detection",
        "Structured data optimization",
        "Source credibility score",
      ],
    },
    {
      name: "Gemini",
      icon: <Sparkles className="h-6 w-6" />,
      color: "from-blue-500 to-indigo-600",
      description:
        "Google's AI leverages search index depth. Your SEO foundations impact AI visibility.",
      checks: [
        "Google knowledge panel status",
        "Search-AI cross-visibility",
        "Entity graph integration",
        "Content structure analysis",
      ],
    },
    {
      name: "Perplexity",
      icon: <Search className="h-6 w-6" />,
      color: "from-cyan-500 to-teal-600",
      description:
        "Answer engine that cites sources directly. Being cited = free high-intent traffic.",
      checks: [
        "Source citation frequency",
        "Answer box appearance rate",
        "Reference link inclusion",
        "Topical authority mapping",
      ],
    },
  ];

  const auditDimensions = [
    {
      icon: <Eye className="h-8 w-8" />,
      title: "AI Visibility Score",
      description:
        "Measures how often AI engines mention your brand when users ask about your category.",
      metric: "0-100",
      benchmark: "Industry average: 34/100",
    },
    {
      icon: <Network className="h-8 w-8" />,
      title: "Entity Recognition",
      description:
        "Analyzes whether AI systems recognize your brand as a distinct entity with specific attributes.",
      metric: "Weak/Strong/Dominant",
      benchmark: "Goal: Strong or higher",
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Semantic Authority",
      description:
        "Evaluates your topical expertise signals across your category. AI trusts authorities.",
      metric: "0-100",
      benchmark: "Top 20% = authoritative",
    },
    {
      icon: <Cpu className="h-8 w-8" />,
      title: "Answer Engine Presence",
      description:
        "Checks your structured data, FAQs, and content optimization for AI parsing.",
      metric: "Optimized/Needs Work",
      benchmark: "Schema markup required",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Defensibility Score",
      description:
        "Measures how difficult it would be for AI to replace or commoditize your value proposition.",
      metric: "0-100",
      benchmark: "Above 60 = defensible",
    },
    {
      icon: <Activity className="h-8 w-8" />,
      title: "Competitive Gap",
      description:
        "Identifies where competitors outrank you in AI responses and how to reclaim position.",
      metric: "Gap analysis",
      benchmark: "Track top 5 competitors",
    },
  ];

  const stats = [
    {
      value: "50%+",
      label: "of searches via AI by 2026",
      icon: <TrendingUp />,
    },
    {
      value: "3-5x",
      label: "higher conversion from AI referrals",
      icon: <Zap />,
    },
    { value: "89%", label: "trust AI recommendations", icon: <Bot /> },
    {
      value: "67%",
      label: "of startups invisible to AI",
      icon: <AlertCircle />,
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Submit Your URL",
      desc: "Enter your website URL. Our SIO-V5 engine initiates a comprehensive crawl across 4 major AI engines.",
      icon: <Globe className="h-6 w-6" />,
    },
    {
      step: 2,
      title: "AI Engine Queries",
      desc: "We simulate 50+ category-relevant queries across ChatGPT, Claude, Gemini, and Perplexity to measure your visibility.",
      icon: <Bot className="h-6 w-6" />,
    },
    {
      step: 3,
      title: "Entity Analysis",
      desc: "Deep analysis of your brand's entity recognition strength, knowledge graph presence, and semantic signals.",
      icon: <Network className="h-6 w-6" />,
    },
    {
      step: 4,
      title: "Get Your Report",
      desc: "Receive your AI Visibility Score with dimension breakdowns, competitive gaps, and prioritized action items.",
      icon: <Target className="h-6 w-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Terminal/Dashboard Header */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-slate-900">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(34, 197, 94, 0.3) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-16">
          {/* Terminal Bar */}

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left: Headline */}
            <div>
              <h1 className="mb-6 text-5xl font-black leading-tight tracking-tight md:text-6xl">
                AEO Audit Tool
                <br />
                <span className="bg-primary bg-clip-text text-transparent">
                  Is your startup visible to AI?
                </span>
              </h1>

              <p className="mb-8 text-lg text-slate-400">
                Our AEO Audit Tool checks your visibility across ChatGPT,
                Claude, Gemini, and Perplexity. Discover your AI Visibility
                Score and get an actionable roadmap to dominate AI responses.
              </p>

              {/* Stats Grid */}
            </div>

            {/* Right: Audit Form */}
            <div className="flex items-center">
              <div className="w-full rounded-xl border border-slate-700 bg-slate-800 p-8 shadow-2xl">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                    <Eye className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">AEO Visibility Audit</h2>
                    <p className="text-sm text-slate-400">
                      Free • 60 seconds • 4 AI engines
                    </p>
                  </div>
                </div>

                <form onSubmit={handleStartAudit} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Website URL
                    </label>
                    <input
                      type="text"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://your-startup.com"
                      className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-sm font-medium text-white placeholder-slate-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-green-500 py-3 text-base font-bold uppercase tracking-wider text-white hover:bg-green-600"
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    Run AEO Audit
                  </Button>

                  <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      No signup required
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Instant results
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Engines Scanned */}
      <section className="border-b border-slate-800 bg-slate-900 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded bg-blue-500/10 px-3 py-1 font-mono text-sm text-blue-400">
              <Network className="h-4 w-4" />
              SCAN TARGETS
            </div>
            <h2 className="text-3xl font-black">
              4 AI Engines. 50+ Queries. 1 Visibility Score.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {aiEngines.map((engine, index) => (
              <div
                key={index}
                className="group rounded-xl border border-slate-700 bg-slate-800/50 p-6 transition-all hover:border-slate-600 hover:bg-slate-800"
              >
                <div
                  className={`mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br ${engine.color}`}
                >
                  {engine.icon}
                </div>

                <h3 className="mb-2 text-lg font-bold">{engine.name}</h3>
                <p className="mb-4 text-sm text-slate-400">
                  {engine.description}
                </p>

                <div className="space-y-2">
                  {engine.checks.map((check, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className="h-3 w-3 text-green-400" />
                      <span className="text-slate-300">{check}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audit Dimensions */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded bg-purple-500/10 px-3 py-1 font-mono text-sm text-purple-400">
              <Activity className="h-4 w-4" />
              AUDIT DIMENSIONS
            </div>
            <h2 className="mb-4 text-4xl font-black">
              6 Dimensions of AI Visibility
            </h2>
            <p className="text-lg text-slate-400">
              Your AEO audit analyzes every signal that determines whether AI
              engines recommend your startup.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {auditDimensions.map((dim, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-700 bg-slate-800/50 p-6 transition-all hover:border-green-500/50"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
                  {dim.icon}
                </div>

                <h3 className="mb-2 text-xl font-bold">{dim.title}</h3>
                <p className="mb-4 text-sm text-slate-400">{dim.description}</p>

                <div className="flex items-center justify-between rounded-lg bg-slate-900 px-3 py-2 text-xs">
                  <span className="text-slate-500">Metric</span>
                  <span className="font-mono font-bold text-green-400">
                    {dim.metric}
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  {dim.benchmark}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Terminal Style */}
      <section className="border-y border-slate-800 bg-slate-900 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded bg-cyan-500/10 px-3 py-1 font-mono text-sm text-cyan-400">
              <Terminal className="h-4 w-4" />
              EXECUTION FLOW
            </div>
            <h2 className="text-4xl font-black">How The Audit Works</h2>
          </div>

          <div className="space-y-6">
            {howItWorks.map((item) => (
              <div
                key={item.step}
                className="flex gap-6 rounded-xl border border-slate-700 bg-slate-800/50 p-6"
              >
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500 text-white">
                    {item.icon}
                  </div>
                  {item.step < 4 && (
                    <div className="mt-2 h-12 w-0.5 bg-slate-700" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-3">
                    <span className="font-mono text-xs text-green-400">
                      STEP_{item.step.toString().padStart(2, "0")}
                    </span>
                    <h3 className="text-xl font-bold">{item.title}</h3>
                  </div>
                  <p className="text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why AEO Matters */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded bg-amber-500/10 px-3 py-1 font-mono text-sm text-amber-400">
              <AlertCircle className="h-4 w-4" />
              WHY THIS MATTERS
            </div>
            <h2 className="mb-6 text-4xl font-black">
              The AI Visibility Crisis
            </h2>
          </div>

          <div className="space-y-6 text-lg text-slate-300">
            <p>
              <strong className="text-white">
                By 2026, AI answer engines will handle over 50% of searches.
              </strong>{" "}
              That's not a prediction—it's happening now. ChatGPT, Claude,
              Gemini, and Perplexity are changing how people discover products,
              services, and solutions.
            </p>

            <p>
              If your startup isn't mentioned when users ask AI about your
              category,{" "}
              <strong className="text-white">
                you're invisible to half your market.
              </strong>{" "}
              Not because your product is bad. Because your AI visibility is
              zero.
            </p>

            <p>
              The companies that optimize for AI visibility now will become the
              default recommendations for the next decade. The ones that don't
              will wonder why their traffic flatlined despite having a great
              product.
            </p>

            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-6">
              <p className="text-slate-300">
                <strong className="text-amber-400">Key insight:</strong>{" "}
                AI-referred visitors convert 3-5x higher than organic search
                traffic. They arrive pre-trusting the recommendation. They're
                ready to buy. Don't let that referral go to your competitor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-green-500/10">
            <Bot className="h-10 w-10 text-green-400" />
          </div>

          <h2 className="mb-6 text-4xl font-black md:text-5xl">
            Check Your AI Visibility
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-400">
            Run your free AEO audit now. Discover whether AI engines recommend
            your startup—and get the roadmap to dominate AI responses.
          </p>

          <form
            onSubmit={handleStartAudit}
            className="mx-auto mb-6 flex max-w-xl flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://your-startup.com"
              className="flex-1 rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-sm font-medium text-white placeholder-slate-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            />
            <Button
              type="submit"
              className="h-12 bg-green-500 px-8 font-bold uppercase tracking-wider text-white hover:bg-green-600"
            >
              Run Audit
            </Button>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <span>4 AI engines scanned</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <span>6 visibility dimensions</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <span>Competitive gap analysis</span>
            </div>
          </div>
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
