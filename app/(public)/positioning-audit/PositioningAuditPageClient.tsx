"use client";

import { Button } from "@/components/ui/button";
import { PILLAR_CONFIGS } from "@/lib/pillar-audit-service";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Compass,
  Eye,
  Flag,
  Layers,
  Lightbulb,
  Shield,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const pillar = PILLAR_CONFIGS.positioning;

export default function PositioningAuditPageClient() {
  const [websiteUrl, setWebsiteUrl] = useState("");

  const handleStartAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (websiteUrl) {
      window.location.href = `/sio-audit?url=${encodeURIComponent(websiteUrl)}&pillar=positioning`;
    }
  };

  const features = [
    {
      icon: <Target className="h-5 w-5" />,
      title: "Category Ownership",
      desc: "Define and dominate your unique market space",
      details: [
        "Clear category definition that you can own",
        "Distinctive language that sets you apart",
        "Market perception as the go-to solution",
      ],
    },
    {
      icon: <Trophy className="h-5 w-5" />,
      title: "Unique Value Proposition",
      desc: "Articulate what makes you uniquely valuable",
      details: [
        "Specific outcomes customers can expect",
        "Quantifiable benefits and ROI",
        "Clear differentiation from alternatives",
      ],
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Competitive Differentiation",
      desc: "Build defensible differentiation from competitors",
      details: [
        "Explicit competitor contrasts",
        "Unfair advantages that are hard to copy",
        "Clear reasons why you win deals",
      ],
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Target Audience Clarity",
      desc: "Crystal clear understanding of your ideal customer",
      details: [
        "Well-defined ICP with specific criteria",
        "Deep understanding of customer pain points",
        "Clear buyer persona and decision-maker mapping",
      ],
    },
    {
      icon: <Lightbulb className="h-5 w-5" />,
      title: "Problem-Solution Fit",
      desc: "Demonstrate clear connection between pain point and solution",
      details: [
        "Articulated problem worth solving",
        "Direct mapping of features to pain points",
        "Evidence of solution effectiveness",
      ],
    },
    {
      icon: <Layers className="h-5 w-5" />,
      title: "Messaging Consistency",
      desc: "Unified positioning across all touchpoints",
      details: [
        "Consistent voice across all channels",
        "Aligned messaging from website to sales",
        "Coherent brand narrative and story",
      ],
    },
  ];

  const scores = [
    { label: "Category Ownership", range: "0-100", color: "bg-blue-500" },
    { label: "Unique Value Prop", range: "0-100", color: "bg-indigo-500" },
    { label: "Competitive Diff", range: "0-100", color: "bg-violet-500" },
    { label: "Target Audience", range: "0-100", color: "bg-purple-500" },
    { label: "Problem-Solution Fit", range: "0-100", color: "bg-pink-500" },
    { label: "Messaging Consistency", range: "0-100", color: "bg-rose-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">
      {/* Hero - Asymmetric Layout */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-3xl md:text-5xl font-bold text-white leading-none tracking-tighter">
                Get a Free Positioning Audit
                <br />
                <span className="text-blue-100 text-5xl">
                  & Market differentiation
                </span>
              </h1>

              <p className="text-xl text-blue-100 leading-relaxed">
                LaunchRecord evaluates your startup’s market positioning,
                differentiation, and strategic fit. Our SIO-V5 engine benchmarks
                your startup against 10,000+ records to show where you’re
                getting lost — so you can stand out and attract the right users.
              </p>

              <form onSubmit={handleStartAudit} className="space-y-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="www.yourstartup.com"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="flex-1 px-6 py-4 bg-white/95 backdrop-blur text-slate-900 rounded-xl font-medium focus:ring-2 focus:ring-white transition-all outline-none"
                    required
                  />
                  <Button
                    type="submit"
                    className="h-14 px-8 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-semibold transition-all flex items-center gap-2"
                  >
                    Analyze
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-sm text-blue-200">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Free
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> 2-4 min
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> No card
                  </span>
                </div>
              </form>
            </div>

            {/* Visual Score Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold">
                  Positioning Dimensions
                </h3>
                <Trophy className="h-5 w-5 text-yellow-300" />
              </div>
              <div className="space-y-4">
                {scores.map((score, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/90">{score.label}</span>
                      <span className="text-white/70">{score.range}</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${score.color} rounded-full w-3/4`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-white/20">
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">Overall Score</span>
                  <span className="text-3xl font-bold text-white">--</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              What Gets Measured
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Six critical dimensions that determine your market positioning
              strength
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group bg-white border border-slate-200 rounded-2xl p-8 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300"
              >
                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 mb-4">{feature.desc}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, detailIdx) => (
                    <li
                      key={detailIdx}
                      className="flex items-start gap-2 text-sm text-slate-500"
                    >
                      <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Positioning Matters */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why Positioning Matters
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Great positioning isn't just marketing—it's your competitive
              advantage in every customer conversation, sales pitch, and AI
              recommendation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Compass className="h-6 w-6" />,
                title: "Guides Customer Decisions",
                desc: "Clear positioning helps buyers instantly understand why you're the right choice, reducing sales cycles and increasing conversion rates.",
                stat: "3x faster",
                statLabel: "sales decisions",
              },
              {
                icon: <Flag className="h-6 w-6" />,
                title: "Wins AI Recommendations",
                desc: "Strong entity signals and category definition make you more likely to be recommended by ChatGPT, Claude, and other AI assistants.",
                stat: "5x more",
                statLabel: "AI citations",
              },
              {
                icon: <Lightbulb className="h-6 w-6" />,
                title: "Attracts Perfect Customers",
                desc: "When you own a category, you attract customers who specifically want what you offer—leading to higher LTV and lower churn.",
                stat: "40% higher",
                statLabel: "customer LTV",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl p-8 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all"
              >
                <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-600 mb-6">{item.desc}</p>
                <div className="pt-6 border-t border-slate-200">
                  <div className="text-3xl font-bold text-blue-600">
                    {item.stat}
                  </div>
                  <div className="text-sm text-slate-500">{item.statLabel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bands - Horizontal Cards */}
      <section className="py-24 px-4 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Positioning Bands
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Discover where your startup ranks—and what it takes to move up
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-4">
            {[
              {
                name: "Dominant",
                score: "90-100",
                desc: "You own the category",
                color: "from-green-500 to-emerald-600",
              },
              {
                name: "Strong",
                score: "70-89",
                desc: "Clear differentiation",
                color: "from-blue-500 to-indigo-600",
              },
              {
                name: "Blended",
                score: "50-69",
                desc: "Understandable but not distinctive",
                color: "from-yellow-500 to-amber-600",
              },
              {
                name: "Weak",
                score: "30-49",
                desc: "Unclear positioning",
                color: "from-orange-500 to-red-600",
              },
              {
                name: "Ghost",
                score: "0-29",
                desc: "Invisible to market",
                color: "from-red-600 to-rose-700",
              },
            ].map((band, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-br ${band.color} rounded-2xl p-6 text-white text-center`}
              >
                <div className="text-2xl font-bold mb-1">{band.name}</div>
                <div className="text-sm opacity-80 mb-3">{band.score}</div>
                <div className="text-xs opacity-70">{band.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              How the Tool Works
            </h2>
            <p className="text-lg text-slate-600">
              Get your positioning score and action plan in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Enter Your URL",
                desc: "Submit your startup's website URL. We'll analyze your positioning signals, messaging, and market presence.",
              },
              {
                step: "02",
                title: "AI-Powered Analysis",
                desc: "Our engine evaluates category definition, differentiation, AI entity recognition, and competitive positioning.",
              },
              {
                step: "03",
                title: "Get Action Plan",
                desc: "Receive your positioning score, band ranking, and specific recommendations to strengthen your market position.",
              },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="text-8xl font-bold text-blue-100 absolute -top-4 -left-4">
                  {item.step}
                </div>
                <div className="relative bg-white rounded-2xl p-8 border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-slate-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Ready to Find Your Position?
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Get your positioning score and action plan in minutes
          </p>
          <form
            onSubmit={handleStartAudit}
            className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
          >
            <input
              type="text"
              placeholder="www.yourstartup.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="flex-1 px-6 py-4 bg-white border border-slate-200 text-slate-900 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              required
            />
            <Button
              type="submit"
              className="h-14 px-8 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
            >
              Get Free Audit
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </section>

      {/* Related Audits */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center">
            Explore Other Free Audit Tools
          </h3>
          <p className="text-lg text-slate-600 text-center mb-12 max-w-2xl mx-auto">
            Complete your startup audit with our full suite of positioning and
            visibility tools
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            <Link
              href="/clarity-audit"
              className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:shadow-green-100/50 hover:border-green-300 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                  <Eye className="h-5 w-5" />
                </div>
                <span className="font-semibold text-slate-800">Clarity</span>
              </div>
              <p className="text-sm text-slate-600">
                Message clarity audit - 5 second test
              </p>
            </Link>
            <Link
              href="/momentum-audit"
              className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:shadow-orange-100/50 hover:border-orange-300 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                  <Zap className="h-5 w-5" />
                </div>
                <span className="font-semibold text-slate-800">Momentum</span>
              </div>
              <p className="text-sm text-slate-600">Growth signals audit</p>
            </Link>
            <Link
              href="/founder-proof-audit"
              className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:shadow-purple-100/50 hover:border-purple-300 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                  <Shield className="h-5 w-5" />
                </div>
                <span className="font-semibold text-slate-800">
                  Founder Proof
                </span>
              </div>
              <p className="text-sm text-slate-600">Authority audit</p>
            </Link>
            <Link
              href="/aeo-audit"
              className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:shadow-cyan-100/50 hover:border-cyan-300 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 bg-cyan-100 rounded-lg flex items-center justify-center text-cyan-600">
                  <Brain className="h-5 w-5" />
                </div>
                <span className="font-semibold text-slate-800">AEO</span>
              </div>
              <p className="text-sm text-slate-600">AI visibility audit</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
