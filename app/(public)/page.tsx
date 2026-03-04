"use client";

import { LandingLeaderboard } from "@/components/LandingLeaderboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WarBriefingPreview } from "@/components/WarBriefingPreview";
import {
  AlertCircle,
  Award,
  CheckCircle,
  PartyPopper,
  Shield,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useState } from "react";

const painkillers = [
  {
    pain: "Your positioning is too feature-heavy. LLMs are categorizing you as a utility, not a leader.",
    killer: "AEO Pulse Diagnostic",
    solution:
      "Discover why you're invisible in 942 of 1,000 buyer intent simulations—and fix it.",
    icon: AlertCircle,
  },
  {
    pain: "You're converging toward commodity territory. Your Differentiation Delta shrinks every week.",
    killer: "Market Position Vector",
    solution:
      "See your Genericity Score and exactly where you overlap with competitors.",
    icon: Target,
  },
  {
    pain: "Momentum is the only thing separating a founder from a dreamer—but you're flying blind.",
    killer: "Founder Proof Vault",
    solution:
      "Track Shipping Consistency, Revenue Velocity, and Social Proof in one dashboard.",
    icon: Award,
  },
  {
    pain: "OpenAI's latest leak overlaps 40% of your roadmap. You didn't see it coming.",
    killer: "AI Threat Radar",
    solution:
      "Get weekly threat alerts with strategic pivots before your moat becomes a commodity.",
    icon: Shield,
  },
  {
    pain: "I have $50,000 to spend, and I spent 20 seconds on your site. I still don't know what you do.",
    killer: "Product Clarity Index",
    solution: "See your Time-to-Aha and why CFOs rate your clarity 2/10.",
    icon: Zap,
  },
];

const tiers = [
  {
    name: "Tier 1: The Hook",
    price: "$49/mo",
    description: "For founders who want automated intelligence",
    features: [
      "AEO Tracker (Mention Share, Position Tracking)",
      "Product Clarity Index (PCI)",
      "Weekly War Briefing Email",
      "Basic Threat Alerts",
    ],
    icon: TrendingUp,
  },
  {
    name: "Tier 2: The Retention",
    price: "$99/mo",
    description: "For founders serious about differentiation",
    features: [
      "Everything in Tier 1",
      "Founder Proof Vault™",
      "Market Position Vector™",
      "Sovereign Leaderboard Access",
      "Priority Threat Alerts",
    ],
    icon: Shield,
    featured: true,
  },
  {
    name: "Tier 3: The Ego-Play",
    price: "$299/mo",
    description: "For founders who refuse to lose their rank",
    features: [
      "Everything in Tier 2",
      "Strategy Climb Sessions",
      "Emergency Pivot Call (if you drop Top 20)",
      "1-on-1 Strategic Architect Session",
      "White-Glove Proof Curation",
    ],
    icon: Award,
  },
];

export default function LaunchRecordLandingPage() {
  const [websiteUrl, setWebsiteUrl] = useState("");

  const handleStartAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (websiteUrl) {
      window.location.href = `/survey?url=${encodeURIComponent(websiteUrl)}`;
    }
  };

  return (
    <div className="space-y-20 py-10">
      {/* Hero Section - SF-1 War Briefing Style */}
      <section className="relative overflow-hidden bg-slate-900 rounded-xl pb-20 pt-8 px-6 border-b border-slate-800">
        <div className="bg-green-300 mb-4 text-center max-w-lg mx-auto flex items-center justify-center gap-4 py-2 text-lg rounded-lg text-green-800">
          <PartyPopper></PartyPopper>
          <p className="font-bold">Whitelist is open for Sovereign Founders</p>
        </div>
        {/* The "Judge" Background Element */}

        <div className="max-w-5xl mx-auto space-y-12 relative z-10">
          <div className="max-w-6xl mx-auto space-y-16 relative z-10">
            <div className="space-y-8 text-center">
              {/* Status Indicator */}
              <Badge
                variant="outline"
                className="font-mono text-xs tracking-[0.2em] uppercase py-1.5 px-6 border-red-500/50 text-red-500 bg-red-500/5 animate-pulse rounded-none"
              >
                ● SIO-V5 Engine ACTIVE: AUDITING 42 ACTIVE RECORDS
              </Badge>

              {/* The Pain-Inflicting Headline */}
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-200 leading-[0.9]">
                Growth Hacking <br />
                <span className="text-red-600">Will Not Save You.</span>
                <span className="block text-2xl md:text-3xl font-mono mt-4 tracking-normal normal-case text-slate-300">
                  Most SaaS are just features waiting to be deleted.
                </span>
              </h1>

              {/* The 4 Core Metrics - Integrated into the Lead Copy */}
              <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-slate-200/10">
                {[
                  { label: "AEO Presence", status: "INVISIBLE" },
                  { label: "Positioning", status: "GENERIC" },
                  { label: "Product Clarity", status: "LOW" },
                  { label: "Momentum", status: "STAGNANT" },
                ].map((metric) => (
                  <div key={metric.label} className="text-center space-y-1">
                    <p className="font-mono text-[10px] text-slate-500 uppercase">
                      {metric.label}
                    </p>
                    <p className="font-bold text-white tracking-widest">
                      {metric.status}
                    </p>
                  </div>
                ))}
              </div>

              <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                LaunchRecord is the brutal{" "}
                <span className="text-2xl text-primary font-bold">Audit</span>{" "}
                that tracks your{" "}
                <span className="text-white">AEO presence</span>,{" "}
                <span className="text-white">Positioning</span>,{" "}
                <span className="text-white">Clarity</span> and
                <span className="text-white"> Momentum</span>. Either you're
                compounding, or you're quietly eroding. Which one is on your
                record?
              </p>
            </div>

            {/* CTA Section - The "High Status" Entry */}
            <div className="flex flex-col items-center gap-8 max-w-xl mx-auto">
              <form
                onSubmit={handleStartAudit}
                className="w-full flex flex-col md:flex-row gap-2"
              >
                <input
                  type="url"
                  placeholder="www.website_url.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="flex-1 px-6 py-4 bg-slate-500 border border-slate-200 text-white rounded-none font-mono focus:border-red-600 focus:ring-0 transition-all outline-none"
                  required
                />
                <Button
                  type="submit"
                  className="h-14 px-10 bg-white text-black text-sm hover:bg-slate-200 rounded-none font-black uppercase tracking-widest transition-all"
                >
                  Audit My Record
                </Button>
              </form>

              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-4 text-[10px] font-mono text-slate-300 uppercase tracking-[0.3em]">
                  <span>The #1 Platform For Verified Defensibility Ledger</span>
                </div>
                <p className="rounded-md px-4 bg-green-200 text-green-800 py-1">
                  Limited to 100 Sovereign Founders for March 2026
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <LandingLeaderboard />
      </section>
      <section>
        <WarBriefingPreview />
      </section>
      <section className="bg-slate-950 py-24 rounded-xl text-white px-6 border-t border-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-2 mb-16">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic">
              The Protocol
            </h2>
            <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
              Standardized Defensibility Testing v1.04
            </p>
          </div>

          <div className="space-y-12">
            {/* Step 1 */}
            <div className="flex gap-8 group">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-black text-xs">
                  01
                </div>
                <div className="w-px h-full bg-slate-800 my-2"></div>
              </div>
              <div className="pb-12 space-y-2">
                <h4 className="text-xl font-bold uppercase tracking-tight">
                  Deep-Vector Submission
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Submit your URL. We cross-reference your positioning against
                  1,400+ competitors to detect "Commodity Convergence."
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-8 group">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border border-slate-700 text-slate-500 flex items-center justify-center font-black text-xs group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 transition-all">
                  02
                </div>
                <div className="w-px h-full bg-slate-800 my-2"></div>
              </div>
              <div className="pb-12 space-y-2">
                <h4 className="text-xl font-bold uppercase tracking-tight">
                  The Stress-Test
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  We simulate AEO (AI-Engine Optimization) visibility and run a
                  CFO ROI-Clarity scan. We find where you are invisible.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-8 group">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border border-slate-700 text-slate-500 flex items-center justify-center font-black text-xs group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 transition-all">
                  03
                </div>
                <div className="w-px h-full bg-slate-800 my-2"></div>
              </div>
              <div className="pb-12 space-y-2">
                <h4 className="text-xl font-bold uppercase tracking-tight">
                  The War Briefing
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Receive your Record. Status: JUNK, VULNERABLE, or SOVEREIGN.
                  Know the truth about your defensibility.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-8 group">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border border-slate-700 text-slate-500 flex items-center justify-center font-black text-xs group-hover:bg-green-600 group-hover:text-white group-hover:border-green-600 transition-all">
                  04
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold uppercase tracking-tight">
                  Moat Missions
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Complete weekly missions to fix your record. Upload proof,
                  climb the Sovereign 100, and build a fortress.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="grid grid-cols-3 gap-8 pt-8 border-t border-border">
        <div>
          <div className="text-3xl font-bold text-foreground">94.2%</div>
          <p className="text-sm text-muted-foreground font-medium">
            Founders Invisible to LLMs
          </p>
        </div>
        <div>
          <div className="text-3xl font-bold text-foreground">12%</div>
          <p className="text-sm text-muted-foreground font-medium">
            Avg. Differentiation Loss/Month
          </p>
        </div>
        <div>
          <div className="text-3xl font-bold text-foreground">48s</div>
          <p className="text-sm text-muted-foreground font-medium">
            Avg. Time-to-Aha (Target: 15s)
          </p>
        </div>
      </section>

      {/* Pain-Killer Features */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-foreground">
            What Founders Don't Know (But Should)
          </h2>
          <p className="text-lg text-muted-foreground">
            Five blind spots. Five diagnostics. One dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {painkillers.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card
                key={idx}
                className="border border-border hover:border-orange-300 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-orange-600" />
                        <CardTitle className="text-lg text-orange-700">
                          {item.killer}
                        </CardTitle>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-red-600 mb-1">
                        The problem:
                      </p>
                      <p className="text-sm text-muted-foreground italic">
                        "{item.pain}"
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-700 mb-1">
                        Your solution:
                      </p>
                      <p className="text-sm text-foreground">{item.solution}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-foreground">
            The "Cash-Machine" Deployment
          </h2>
          <p className="text-lg text-muted-foreground">
            Three tiers. One mission: Make you irreplaceable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier, idx) => {
            const Icon = tier.icon;
            return (
              <Card
                key={idx}
                className={`relative ${
                  tier.featured
                    ? "border-2 border-orange-600 shadow-lg scale-105"
                    : "border border-border"
                }`}
              >
                <CardHeader className="pt-8">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="h-6 w-6 text-orange-600" />
                    <CardTitle className="text-xl">{tier.name}</CardTitle>
                  </div>
                  <div className="text-3xl font-bold text-foreground">
                    {tier.price}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {tier.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tier.featured && (
                    <Badge className="w-fit bg-orange-600 hover:bg-orange-700">
                      Most Popular
                    </Badge>
                  )}
                  <ul className="space-y-3">
                    {tier.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {/* <Link href="/survey" className="block">
                    <Button
                      className={`w-full h-12 ${
                        tier.featured
                          ? "bg-orange-600 hover:bg-orange-700"
                          : "bg-slate-900 hover:bg-slate-800"
                      }`}
                    >
                      Join Waitlist
                    </Button>
                  </Link> */}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="space-y-12 bg-orange-50 rounded-2xl p-12 border border-orange-100">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-foreground">
            The Pre-Audit Funnel
          </h2>
          <p className="text-lg text-muted-foreground">
            From curiosity to conversion in 3 steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Free Genericity Score",
              desc: "Enter your URL. Get a 1-page roast of your positioning in 2 minutes.",
            },
            {
              step: "2",
              title: "Full War Briefing",
              desc: "Unlock all 6 diagnostics. See your AEO Pulse, Market Position, and Threat Radar.",
            },
            {
              step: "3",
              title: "Choose Your Tier",
              desc: "Start at $49/mo. Upgrade as you climb the Sovereign Leaderboard.",
            },
          ].map((item, idx) => (
            <div key={idx} className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-orange-600 text-white flex items-center justify-center text-2xl font-bold mx-auto">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Leaderboard Section */}

      {/* Social Proof */}
      <section className="text-center space-y-6 py-12 border-t border-border">
        <h3 className="text-2xl font-semibold text-foreground">
          For Founders Who Refuse to Be Commoditized
        </h3>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          LaunchRecord is the Strategic Architect's weapon against AI-driven
          commoditization. Join founding members before the leaderboard fills.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Badge variant="outline" className="px-4 py-2">
            🔒 No brand sponsorships
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            🎯 Proprietary logic only
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            📊 Human-led Proof-of-Work
          </Badge>
        </div>
      </section>
    </div>
  );
}
