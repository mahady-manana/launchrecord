"use client";

import { Button } from "@/components/ui/button";
import { PILLAR_CONFIGS } from "@/lib/pillar-audit-service";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Flame,
  Rocket,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const pillar = PILLAR_CONFIGS.momentum;

export default function MomentumAuditPageClient() {
  const [websiteUrl, setWebsiteUrl] = useState("");

  const handleStartAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (websiteUrl) {
      window.location.href = `/sio-audit?url=${encodeURIComponent(websiteUrl)}&pillar=momentum`;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero - Dark theme with momentum visualization */}
      <section className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-orange-600/20 via-red-600/20 to-slate-950" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 px-4 py-2 rounded-full text-orange-400 text-sm font-medium">
                <Activity className="h-4 w-4" />
                <span>Growth Signals Audit</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white leading-none">
                Measure Your
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                  Momentum
                </span>
              </h1>

              <p className="text-xl text-slate-400 leading-relaxed">
                Assess your startup's growth signals, market traction, and
                velocity indicators.
              </p>

              <form onSubmit={handleStartAudit} className="space-y-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="www.yourstartup.com"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="flex-1 px-6 py-4 bg-slate-900/80 border border-slate-700 text-white rounded-xl font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"
                    required
                  />
                  <Button
                    type="submit"
                    className="h-14 px-8 bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 rounded-xl font-semibold transition-all flex items-center gap-2"
                  >
                    Audit
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-orange-500" /> Free
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-orange-500" /> 2-4 min
                  </span>
                </div>
              </form>
            </div>

            {/* Momentum Meter Visualization */}
            <div className="relative">
              <div className="bg-slate-900/80 backdrop-blur border border-slate-700 rounded-3xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-white font-semibold">
                    Momentum Spectrum
                  </h3>
                  <Flame className="h-6 w-6 text-orange-500" />
                </div>

                {/* Momentum Gauge */}
                <div className="relative h-48 mb-8">
                  <div className="absolute inset-0 flex items-end justify-center gap-2">
                    {[20, 40, 60, 80, 100].map((level, idx) => (
                      <div
                        key={idx}
                        className="w-12 rounded-t-lg transition-all"
                        style={{
                          height: `${level}%`,
                          background:
                            level <= 20
                              ? "#ef4444"
                              : level <= 40
                                ? "#f97316"
                                : level <= 60
                                  ? "#eab308"
                                  : level <= 80
                                    ? "#22c55e"
                                    : "#10b981",
                        }}
                      />
                    ))}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-slate-500 mt-2">
                    <span>Dead</span>
                    <span>Flat</span>
                    <span>Stable</span>
                    <span>Rising</span>
                    <span>Viral</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">--</div>
                    <div className="text-xs text-slate-500">Growth Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">--</div>
                    <div className="text-xs text-slate-500">Velocity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">--</div>
                    <div className="text-xs text-slate-500">Traction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Momentum Indicators - Horizontal Cards */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Momentum Indicators
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Six signals that reveal your startup's trajectory
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Rocket className="h-6 w-6" />,
                label: "Growth Trajectory",
                desc: "Direction and velocity of growth",
              },
              {
                icon: <BarChart3 className="h-6 w-6" />,
                label: "Market Signals",
                desc: "Press, partnerships, recognition",
              },
              {
                icon: <Activity className="h-6 w-6" />,
                label: "User Engagement",
                desc: "Active usage and retention",
              },
              {
                icon: <Flame className="h-6 w-6" />,
                label: "Competitive Velocity",
                desc: "Growth vs competitors",
              },
              {
                icon: <TrendingUp className="h-6 w-6" />,
                label: "Traction Evidence",
                desc: "Metrics, logos, milestones",
              },
              {
                icon: <CheckCircle2 className="h-6 w-6" />,
                label: "Velocity Indicators",
                desc: "Acceleration signals",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-orange-500/50 hover:bg-slate-900 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {item.label}
                    </h3>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bands - Diagonal Design */}
      <section className="py-24 px-4 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Momentum Bands
            </h2>
          </div>

          <div className="relative">
            <div className="grid md:grid-cols-5 gap-4">
              {[
                {
                  name: "Viral",
                  score: "90-100",
                  desc: "Exponential growth",
                  gradient: "from-emerald-500 to-green-600",
                },
                {
                  name: "Rising",
                  score: "70-89",
                  desc: "Strong upward",
                  gradient: "from-blue-500 to-indigo-600",
                },
                {
                  name: "Stable",
                  score: "50-69",
                  desc: "Steady growth",
                  gradient: "from-yellow-500 to-amber-600",
                },
                {
                  name: "Flat",
                  score: "30-49",
                  desc: "Minimal growth",
                  gradient: "from-orange-500 to-red-600",
                },
                {
                  name: "Dead",
                  score: "0-29",
                  desc: "No momentum",
                  gradient: "from-red-600 to-rose-800",
                },
              ].map((band, idx) => (
                <div
                  key={idx}
                  className={`bg-gradient-to-br ${band.gradient} rounded-2xl p-6 text-white text-center transform hover:scale-105 transition-transform`}
                  style={{ transform: `translateY(${idx * -8}px)` }}
                >
                  <div className="text-2xl font-bold mb-1">{band.name}</div>
                  <div className="text-sm opacity-80 mb-3">{band.score}</div>
                  <div className="text-xs opacity-70">{band.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Is Your Startup Moving?
          </h2>
          <p className="text-xl text-slate-400 mb-10">
            Get your momentum score and acceleration plan
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
              className="flex-1 px-6 py-4 bg-slate-900 border border-slate-700 text-white rounded-xl font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"
              required
            />
            <Button
              type="submit"
              className="h-14 px-8 bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
            >
              Check Momentum
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </section>

      {/* Related */}
      <section className="py-16 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/positioning-audit"
              className="px-5 py-3 bg-blue-900/30 text-blue-400 border border-blue-800 rounded-xl font-medium hover:bg-blue-900/50 transition-colors"
            >
              Positioning Audit
            </Link>
            <Link
              href="/clarity-audit"
              className="px-5 py-3 bg-green-900/30 text-green-400 border border-green-800 rounded-xl font-medium hover:bg-green-900/50 transition-colors"
            >
              Clarity Audit
            </Link>
            <Link
              href="/founder-proof-audit"
              className="px-5 py-3 bg-purple-900/30 text-purple-400 border border-purple-800 rounded-xl font-medium hover:bg-purple-900/50 transition-colors"
            >
              Founder Proof Audit
            </Link>
            <Link
              href="/aeo-audit"
              className="px-5 py-3 bg-cyan-900/30 text-cyan-400 border border-cyan-800 rounded-xl font-medium hover:bg-cyan-900/50 transition-colors"
            >
              AEO Audit
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
