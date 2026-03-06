"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  Brain,
  CheckCircle,
  Eye,
  Filter,
  Lock,
  Scale,
  Shield,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";

const engines = [
  {
    name: "AEO Engine",
    subtitle: "Answer Engine Optimization",
    description:
      "Evaluates how likely an LLM (Perplexity, SearchGPT) is to cite this product as a category leader vs. ignoring it as a generic wrapper.",
    icon: Brain,
    color: "text-blue-600",
    bgColor: "bg-blue-600/10",
    borderColor: "border-blue-600/30",
  },
  {
    name: "Positioning Engine",
    subtitle: "Distance from the Mean",
    description:
      "Measures how different your product is from the top 5 competitors. Convergence = commodity death.",
    icon: Target,
    color: "text-purple-600",
    bgColor: "bg-purple-600/10",
    borderColor: "border-purple-600/30",
  },
  {
    name: "Clarity Engine",
    subtitle: "Time-to-Value",
    description:
      "If the engine can't define the 'What' in < 200ms of processing, the score drops. CFOs decide in seconds.",
    icon: Zap,
    color: "text-yellow-600",
    bgColor: "bg-yellow-600/10",
    borderColor: "border-yellow-600/30",
  },
  {
    name: "Momentum Engine",
    subtitle: "Social Proof Density",
    description:
      "Analyzes social proof density and launch velocity. Momentum separates founders from dreamers.",
    icon: TrendingUp,
    color: "text-green-600",
    bgColor: "bg-green-600/10",
    borderColor: "border-green-600/30",
  },
  {
    name: "Proof Engine",
    subtitle: "Hard Evidence Verification",
    description:
      "Checks for metrics, logos, testimonials. Verifies that the founder isn't just 'Vibe-Coding'.",
    icon: CheckCircle,
    color: "text-orange-600",
    bgColor: "bg-orange-600/10",
    borderColor: "border-orange-600/30",
  },
];

const architectureLayers = [
  {
    name: "The Analyst",
    role: "The Eye",
    description:
      "Scrapes the raw data (URL, metadata, H1, sub-copy). Identifies 'The Tell'—specific clichés like Revolutionize, Empower, or Seamless—and applies immediate scoring penalties.",
    icon: Eye,
    color: "text-red-600",
    bgColor: "bg-red-600/10",
    borderColor: "border-red-600/30",
  },
  {
    name: "The Sanitizer",
    role: "The Filter",
    description:
      "Applies Hard Caps. If a site has zero case studies, the Sanitizer 'locks' the Proof score at 30, regardless of how 'good' the copy sounds. Prevents the AI from being 'too nice'.",
    icon: Filter,
    color: "text-orange-600",
    bgColor: "bg-orange-600/10",
    borderColor: "border-orange-600/30",
  },
  {
    name: "The Auditor",
    role: "The Verdict",
    description:
      "Compares findings against the Large Data Ledger (thousands of scraped startups). Calculates where the product sits in the market percentile.",
    icon: Scale,
    color: "text-slate-600",
    bgColor: "bg-slate-600/10",
    borderColor: "border-slate-600/30",
  },
];

const outputMetrics = [
  {
    name: "Global Score",
    value: "1-100",
    description: "Your rank on the Sovereign Scale",
    icon: Shield,
  },
  {
    name: "Ego-Stab",
    value: "20 words",
    description: "A brutal, clinical truth about your positioning",
    icon: AlertTriangle,
  },
  {
    name: "Survival Probability",
    value: "0-100%",
    description: "Forecast of whether you'll exist in 12 months",
    icon: Lock,
  },
];

export default function SIOV5EnginePage() {
  return (
    <div className="space-y-24 py-10 md:px-0 px-4 bg-slate-950">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto relative overflow-hidden bg-slate-900 rounded-xl py-20 px-6 border border-slate-800">
        <div className="max-w-6xl mx-auto space-y-12 relative z-10">
          <div className="space-y-8 text-center">
            {/* Status Badge */}
            <Badge
              variant="outline"
              className="font-mono text-xs tracking-[0.2em] uppercase py-1.5 px-6 border-blue-400 text-blue-300 bg-blue-500/10 rounded-none"
            >
              ● SIO-V5 PROTOCOL ACTIVE
            </Badge>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-[0.9]">
              SIO-V5 Engine
              <span className="block text-3xl md:text-4xl font-mono mt-6 tracking-normal normal-case text-slate-300">
                Sovereign Intelligence Officer, Version 5
              </span>
            </h1>

            {/* Core Definition */}
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Not a chatbot. A{" "}
              <span className="text-white font-bold">
                multi-agent auditing protocol
              </span>{" "}
              designed to act as a cold, analytical{" "}
              <span className="text-blue-400">Digital Auditor</span>. While
              other tools give "marketing feedback," SIO-V5 detects{" "}
              <span className="text-red-400">Commodity Risk</span> and{" "}
              <span className="text-red-400">Positioning Debt</span>.
            </p>
          </div>

          {/* The Analogy */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-white uppercase tracking-tight">
                  The Truth
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  If a standard SEO tool is a{" "}
                  <span className="text-white">"Check Engine" light</span>, the
                  SIO-V5 is a{" "}
                  <span className="text-blue-400 font-semibold">
                    full forensic crash-test simulation
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Architecture */}
      <section className="max-w-6xl mx-auto space-y-12">
        <div className="space-y-4">
          <Badge
            variant="outline"
            className="font-mono text-[10px] tracking-[0.2em] uppercase py-1 px-4 border-slate-600 text-slate-300"
          >
            SYSTEM_ARCHITECTURE
          </Badge>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
            The Three AI Logic Layers
          </h2>
          <p className="text-lg text-slate-300 max-w-3xl">
            Three distinct layers working in sequence to eliminate "AI fluff"
            and bias. No marketing speak. Pure audit logic.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {architectureLayers.map((layer, idx) => {
            const Icon = layer.icon;
            return (
              <Card
                key={idx}
                className={`border ${layer.borderColor} bg-slate-800 hover:border-slate-500 transition-colors`}
              >
                <CardHeader className="space-y-4">
                  <div
                    className={`w-14 h-14 ${layer.bgColor} rounded-lg flex items-center justify-center`}
                  >
                    <Icon className={`h-7 w-7 ${layer.color}`} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-slate-400">
                        LAYER_0{idx + 1}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[10px] border-slate-600 text-slate-300"
                      >
                        {layer.role}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-white">
                      {layer.name}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {layer.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* The 5 Engines */}
      <section className="max-w-6xl mx-auto space-y-12 bg-slate-800 rounded-xl p-12 border border-slate-700">
        <div className="space-y-4">
          <Badge
            variant="outline"
            className="font-mono text-[10px] tracking-[0.2em] uppercase py-1 px-4 border-blue-400 text-blue-300"
          >
            FIVE_PILLARS
          </Badge>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
            The 5 Engines of SIO-V5
          </h2>
          <p className="text-lg text-slate-300 max-w-3xl">
            Five clinical pillars that determine if a startup is{" "}
            <span className="text-green-400">Untouchable</span> or a{" "}
            <span className="text-red-400">Ghost</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {engines.map((engine, idx) => {
            const Icon = engine.icon;
            return (
              <Card
                key={idx}
                className={`border ${engine.borderColor} bg-slate-900 hover:scale-[1.02] transition-transform`}
              >
                <CardHeader className="space-y-4">
                  <div
                    className={`w-14 h-14 ${engine.bgColor} rounded-lg flex items-center justify-center`}
                  >
                    <Icon className={`h-7 w-7 ${engine.color}`} />
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-lg text-white">
                      {engine.name}
                    </CardTitle>
                    <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                      {engine.subtitle}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {engine.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Sovereign Output */}
      <section className="max-w-6xl mx-auto space-y-12">
        <div className="space-y-4">
          <Badge
            variant="outline"
            className="font-mono text-[10px] tracking-[0.2em] uppercase py-1 px-4 border-green-400 text-green-300"
          >
            OUTPUT_FORMAT
          </Badge>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
            The "Sovereign" Output
          </h2>
          <p className="text-lg text-slate-300 max-w-3xl">
            The result of the SIO-V5 Engine is the{" "}
            <span className="text-blue-400 font-mono">War Briefing JSON</span>.
            Not a "blog post"—a structured dataset.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {outputMetrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <Card
                key={idx}
                className="border border-slate-600 bg-slate-800 hover:border-green-500 transition-colors"
              >
                <CardHeader className="space-y-4">
                  <div className="w-14 h-14 bg-green-600/20 rounded-lg flex items-center justify-center">
                    <Icon className="h-7 w-7 text-green-400" />
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-lg text-white">
                      {metric.name}
                    </CardTitle>
                    <p className="text-2xl font-mono font-bold text-green-400">
                      {metric.value}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 text-sm">{metric.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* War Briefing Code Example */}
      </section>

      {/* Comparison Section */}
      <section className="max-w-6xl mx-auto space-y-12 bg-red-950/40 rounded-xl p-12 border border-red-900">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
            Why SIO-V5 Exists
          </h2>
          <p className="text-lg text-slate-300 max-w-3xl">
            Other tools lie. They're designed to make you feel good. SIO-V5 is
            designed to make you{" "}
            <span className="text-red-400 font-bold">survive</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Other Tools */}
          <Card className="border border-slate-600 bg-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-300 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Standard Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "Marketing feedback disguised as insights",
                "Generic scores that mean nothing",
                "No competitive context",
                "Designed to upsell, not audit",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <p className="text-sm text-slate-300">{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* SIO-V5 */}
          <Card className="border border-blue-600 bg-blue-950/40">
            <CardHeader>
              <CardTitle className="text-blue-300 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                SIO-V5 Engine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "Cold, analytical audit protocol",
                "Clinical scores with hard caps",
                "1,400+ startup comparison ledger",
                "Designed to detect commodity risk",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <p className="text-sm text-slate-200">{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto space-y-8 text-center">
        <div className="space-y-4">
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
            Run Your Audit
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            See where you stand on the Sovereign Scale. Get your War Briefing.
            Know the truth.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/survey">
            <Button className="h-14 px-10 bg-blue-600 hover:bg-blue-700 text-white rounded-none font-black uppercase tracking-widest transition-all">
              Start SIO-V5 Audit
            </Button>
          </Link>
          <Link href="/">
            <Button
              variant="outline"
              className="h-14 px-10 border-slate-600 text-slate-300 hover:bg-slate-800 rounded-none font-mono uppercase tracking-widest transition-all"
            >
              Return Home
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
