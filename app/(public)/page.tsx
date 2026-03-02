"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  Award,
  CheckCircle,
  Shield,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";
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
  const [email, setEmail] = useState("");

  const handleJoinWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      window.location.href = `/survey?email=${encodeURIComponent(email)}`;
    }
  };

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section - SF-1 War Briefing Style */}
      <section className="relative overflow-hidden bg-slate-900 rounded-xl py-20 px-6 border-b border-slate-800">
        {/* The "Judge" Background Element */}

        <div className="max-w-5xl mx-auto space-y-12 relative z-10">
          <div className="max-w-6xl mx-auto space-y-16 relative z-10">
            <div className="space-y-8 text-center">
              {/* Status Indicator */}
              <Badge
                variant="outline"
                className="font-mono text-xs tracking-[0.2em] uppercase py-1.5 px-6 border-red-500/50 text-red-500 bg-red-500/5 animate-pulse rounded-none"
              >
                ● SYSTEM_ACTIVE: AUDITING 42 ACTIVE RECORDS
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
                onSubmit={handleJoinWaitlist}
                className="w-full flex flex-col md:flex-row gap-2"
              >
                <input
                  type="email"
                  placeholder="FOUNDER@COMPANY_DOMAIN.COM"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-6 py-4 bg-slate-900 border border-slate-800 text-white rounded-none font-mono focus:border-red-600 focus:ring-0 transition-all outline-none"
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
                <div className="flex items-center gap-4 text-[10px] font-mono text-slate-600 uppercase tracking-[0.3em]">
                  <span>LaunchRecord.com</span>
                  <span className="text-slate-800">|</span>
                  <span>Verified Defensibility Ledger</span>
                </div>
                <p className="text-[10px] text-slate-700 italic">
                  Limited to 100 Sovereign Founders for March 2026
                </p>
              </div>
            </div>
          </div>

          {/* The War Briefing Preview - Shifted to "Clinical" Style */}
          <div className="mt-16 bg-black text-white border border-slate-800 rounded-sm overflow-hidden shadow-[0_0_50px_-12px_rgba(255,255,255,0.1)]">
            <div className="bg-slate-900 px-6 py-3 border-b border-slate-800 flex justify-between items-center">
              <span className="font-mono text-xs text-slate-400">
                SESSION_ID: 0042-ALPHA
              </span>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                <div className="w-2 h-2 rounded-full bg-slate-700"></div>
              </div>
            </div>

            <div className="p-8 md:p-12 space-y-10">
              <div className="flex flex-col md:flex-row justify-between gap-6 border-b border-slate-800 pb-8">
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold uppercase tracking-tighter">
                    SF-1 War Briefing: [Your_SaaS]
                  </h3>
                  <p className="font-mono text-xs text-slate-500">
                    SOVEREIGN_RANK: #42 (▼ 4) | RISK_LEVEL: CRITICAL
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-mono font-bold text-red-500">
                    JUNK
                  </div>
                  <div className="text-[10px] font-mono uppercase text-slate-500">
                    Current Moat Rating
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                {/* AEO Pulse */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 font-mono text-xs text-slate-500 uppercase tracking-widest">
                    <div className="w-1 h-1 bg-red-500"></div> AEO Visibility
                    Pulse
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold italic">
                      “Invisible in 94% of sessions.”
                    </div>
                    <p className="text-sm text-slate-400 font-light">
                      LLMs (ChatGPT/Claude) are currently recommending 4
                      competitors over you.
                    </p>
                  </div>
                </div>

                {/* Positioning */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 font-mono text-xs text-slate-500 uppercase tracking-widest">
                    <div className="w-1 h-1 bg-orange-500"></div> Positioning
                    Drift
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold italic">
                      Genericity: 72%
                    </div>
                    <p className="text-sm text-slate-400 font-light">
                      Your value proposition matches 8 out of 10 market
                      laggards.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="space-y-4 max-w-md">
                  <p className="font-mono text-xs text-green-500 uppercase tracking-[0.2em]">
                    Required_Missions_To_Level_Up:
                  </p>
                  <ul className="text-sm space-y-2 text-slate-300 font-mono">
                    <li>&gt; REWRITE_H1_FOR_OUTCOME_SPECIFICITY</li>
                    <li>&gt; UPLOAD_REVENUE_PROOF_FOR_Q1</li>
                    <li>&gt; DEFINE_STRATEGIC_MOAT_DELTA</li>
                  </ul>
                </div>
                <div className="text-[10px] font-mono text-slate-600 text-right uppercase leading-tight">
                  Secured by LaunchRecord Protocol
                  <br />
                  No Moat = No Future
                </div>
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
                  <Link href="/survey" className="block">
                    <Button
                      className={`w-full h-12 ${
                        tier.featured
                          ? "bg-orange-600 hover:bg-orange-700"
                          : "bg-slate-900 hover:bg-slate-800"
                      }`}
                    >
                      Join Waitlist
                    </Button>
                  </Link>
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
