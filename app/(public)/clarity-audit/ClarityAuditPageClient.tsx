"use client";

import { Button } from "@/components/ui/button";
import { PILLAR_CONFIGS } from "@/lib/pillar-audit-service";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Eye,
  Layout,
  MessageSquare,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const pillar = PILLAR_CONFIGS.clarity;

export default function ClarityAuditPageClient() {
  const [websiteUrl, setWebsiteUrl] = useState("");

  const handleStartAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (websiteUrl) {
      window.location.href = `/survey?url=${encodeURIComponent(websiteUrl)}&pillar=clarity`;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero - Centered with 5-second test visual */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-500 via-green-500 to-teal-600">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.3),transparent_50%)]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 py-32 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tighter">
            Product Clarity Audit
            <br />
            <span className="">
              Make your product obvious <br /> and turn visitors into customers
            </span>
          </h1>

          <p className="text-xl text-white max-w-4xl mx-auto mb-10 leading-relaxed">
            Most startups struggle because users don’t immediately understand
            what their product does. LaunchRecord audits your product messaging
            and clarity, benchmarking against 10,000+ startups, to pinpoint
            exactly what’s unclear, confusing, or holding back conversions — so
            you can fix it fast and grow with confidence.
          </p>

          <form onSubmit={handleStartAudit} className="max-w-xl mx-auto">
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                placeholder="www.yourstartup.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="flex-1 px-6 py-5 bg-white text-slate-900 rounded-2xl font-medium focus:ring-4 focus:ring-white/30 transition-all outline-none text-lg"
                required
              />
              <Button
                type="submit"
                className="h-[72px] px-10 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl font-bold transition-all flex items-center gap-2 text-lg"
              >
                Test
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-green-100">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> Free audit
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> Instant results
              </span>
            </div>
          </form>
        </div>

        {/* 5-second countdown visual */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/60 text-sm">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((num) => (
              <div
                key={num}
                className="w-8 h-8 rounded-full border-2 border-white/40 flex items-center justify-center text-xs font-medium"
              >
                {num}
              </div>
            ))}
          </div>
          <span>Second clarity test</span>
        </div>
      </section>

      {/* Clarity Levels - Vertical Timeline Style */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Clarity Levels
            </h2>
            <p className="text-lg text-slate-600">
              How long does it take visitors to understand your value?
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                level: "Instant",
                time: "<3 sec",
                desc: "Crystal clear value proposition",
                color: "bg-emerald-500",
                border: "border-emerald-200",
              },
              {
                level: "Clear",
                time: "3-5 sec",
                desc: "Value understood quickly",
                color: "bg-green-500",
                border: "border-green-200",
              },
              {
                level: "Average",
                time: "5-10 sec",
                desc: "Some friction in understanding",
                color: "bg-yellow-500",
                border: "border-yellow-200",
              },
              {
                level: "Confusing",
                time: "10-20 sec",
                desc: "Visitors struggle to get it",
                color: "bg-orange-500",
                border: "border-orange-200",
              },
              {
                level: "Opaque",
                time: ">20 sec",
                desc: "Completely unclear offering",
                color: "bg-red-500",
                border: "border-red-200",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-6 p-6 rounded-2xl border-2 ${item.border} bg-white hover:shadow-lg transition-all`}
              >
                <div
                  className={`w-16 h-16 ${item.color} rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0`}
                >
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold text-slate-900">
                      {item.level}
                    </h3>
                    <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-slate-600">{item.desc}</p>
                </div>
                <ArrowUpRight className="h-6 w-6 text-slate-400" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analysis Areas - Card Grid */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              We Analyze
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <MessageSquare className="h-6 w-6" />,
                title: "Headline Clarity",
                desc: "Can visitors understand your headline instantly?",
              },
              {
                icon: <Eye className="h-6 w-6" />,
                title: "Visual Flow",
                desc: "Does design guide attention to key messages?",
              },
              {
                icon: <Layout className="h-6 w-6" />,
                title: "Value Hierarchy",
                desc: "Is the most important info most visible?",
              },
              {
                icon: <Zap className="h-6 w-6" />,
                title: "Benefit Clarity",
                desc: "Are outcomes and transformations clear?",
              },
              {
                icon: <ArrowUpRight className="h-6 w-6" />,
                title: "CTA Clarity",
                desc: "Is the next step obvious and compelling?",
              },
              {
                icon: <CheckCircle2 className="h-6 w-6" />,
                title: "Proof Placement",
                desc: "Are trust signals strategically positioned?",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-green-300 hover:shadow-xl hover:shadow-green-100/50 transition-all duration-300"
              >
                <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Minimal */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-slate-900 mb-6">
            Test Your Clarity
          </h2>
          <p className="text-xl text-slate-600 mb-10">
            Discover friction points costing you conversions
          </p>
          <form
            onSubmit={handleStartAudit}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text"
              placeholder="www.yourstartup.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="flex-1 px-6 py-5 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl font-medium focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none text-lg"
              required
            />
            <Button
              type="submit"
              className="h-[72px] px-10 bg-green-600 text-white hover:bg-green-700 rounded-2xl font-bold transition-all flex items-center gap-2 text-lg"
            >
              Get Score
              <ArrowRight className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </section>

      {/* Related */}
      <section className="py-16 px-4 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/positioning-audit"
              className="px-5 py-3 bg-blue-50 text-blue-700 rounded-xl font-medium hover:bg-blue-100 transition-colors"
            >
              Positioning Audit
            </Link>
            <Link
              href="/momentum-audit"
              className="px-5 py-3 bg-orange-50 text-orange-700 rounded-xl font-medium hover:bg-orange-100 transition-colors"
            >
              Momentum Audit
            </Link>
            <Link
              href="/founder-proof-audit"
              className="px-5 py-3 bg-purple-50 text-purple-700 rounded-xl font-medium hover:bg-purple-100 transition-colors"
            >
              Founder Proof Audit
            </Link>
            <Link
              href="/aeo-audit"
              className="px-5 py-3 bg-cyan-50 text-cyan-700 rounded-xl font-medium hover:bg-cyan-100 transition-colors"
            >
              AEO Audit
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
