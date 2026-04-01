"use client";

import { Button } from "@/components/ui/button";
import { PILLAR_CONFIGS } from "@/lib/pillar-audit-service";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  CheckCircle2,
  Quote,
  Shield,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const pillar = PILLAR_CONFIGS.founderProof;

export default function FounderProofAuditPageClient() {
  const [websiteUrl, setWebsiteUrl] = useState("");

  const handleStartAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (websiteUrl) {
      window.location.href = `/sio-audit?url=${encodeURIComponent(websiteUrl)}&pillar=founder-proof`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
      {/* Hero - Elegant centered design */}
      <section className="relative py-32 px-4">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-purple-100/50 to-transparent" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full text-sm font-bold mb-8 shadow-lg shadow-purple-200">
            <BadgeCheck className="h-4 w-4" />
            <span>Trust & Credibility Audit</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            Do They Trust
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              You?
            </span>
          </h1>

          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            Validate your authority, credibility, and social proof. Discover
            trust gaps costing you conversions.
          </p>

          <form onSubmit={handleStartAudit} className="max-w-xl mx-auto">
            <div className="flex gap-3 mb-6">
              <input
                type="text"
                placeholder="www.yourstartup.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="flex-1 px-6 py-5 bg-white border-2 border-purple-200 text-slate-900 rounded-2xl font-medium focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-lg shadow-lg shadow-purple-100/50"
                required
              />
              <Button
                type="submit"
                className="h-[72px] px-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 rounded-2xl font-bold transition-all flex items-center gap-2 text-lg shadow-lg shadow-purple-200"
              >
                Audit
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-purple-500" /> Free
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-purple-500" /> 2-4 minutes
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-purple-500" /> Actionable
              </span>
            </div>
          </form>
        </div>
      </section>

      {/* Trust Pillars - Card Stack Design */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Trust Pillars
            </h2>
            <p className="text-lg text-slate-600">
              Five elements that build instant credibility
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-4">
            {[
              {
                icon: <BadgeCheck className="h-8 w-8" />,
                title: "Authority",
                desc: "Founder expertise",
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Proof",
                desc: "Customer validation",
              },
              {
                icon: <Star className="h-8 w-8" />,
                title: "Evidence",
                desc: "Specific outcomes",
              },
              {
                icon: <Award className="h-8 w-8" />,
                title: "Signals",
                desc: "Third-party validation",
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Trust",
                desc: "Risk reversal",
              },
            ].map((pillar, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-3xl p-8 text-center border-2 border-purple-100 hover:border-purple-300 hover:shadow-2xl hover:shadow-purple-100/50 transition-all duration-300"
              >
                <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform">
                  {pillar.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  {pillar.title}
                </h3>
                <p className="text-slate-500 text-sm">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proof Levels - Elegant Cards */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Credibility Levels
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                level: "Verified",
                score: "90-100",
                desc: "Strong authority with abundant proof",
                color: "from-emerald-500 to-green-600",
                icon: <BadgeCheck className="h-6 w-6" />,
              },
              {
                level: "Strong",
                score: "70-89",
                desc: "Clear credibility signals",
                color: "from-blue-500 to-indigo-600",
                icon: <CheckCircle2 className="h-6 w-6" />,
              },
              {
                level: "Moderate",
                score: "50-69",
                desc: "Some proof, not comprehensive",
                color: "from-yellow-500 to-amber-600",
                icon: <Star className="h-6 w-6" />,
              },
              {
                level: "Weak",
                score: "30-49",
                desc: "Limited social proof",
                color: "from-orange-500 to-red-600",
                icon: <Award className="h-6 w-6" />,
              },
              {
                level: "Absent",
                score: "0-29",
                desc: "No visible proof elements",
                color: "from-red-600 to-rose-700",
                icon: <Shield className="h-6 w-6" />,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group flex items-center gap-6 p-6 bg-gradient-to-r from-slate-50 to-white rounded-2xl border border-slate-200 hover:shadow-xl hover:shadow-purple-100/30 transition-all duration-300"
              >
                <div
                  className={`h-14 w-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-white flex-shrink-0`}
                >
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold text-slate-900">
                      {item.level}
                    </h3>
                    <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                      {item.score}
                    </span>
                  </div>
                  <p className="text-slate-600">{item.desc}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-purple-600" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Look For - Grid */}
      <section className="py-24 px-4 bg-gradient-to-b from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              What We Analyze
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                label: "Founder Story",
                desc: "Compelling origin and expertise",
              },
              {
                label: "Testimonials",
                desc: "Customer quotes and endorsements",
              },
              { label: "Case Studies", desc: "Detailed success stories" },
              { label: "Metrics", desc: "Specific numbers and outcomes" },
              { label: "Press Features", desc: "Media coverage and mentions" },
              { label: "Trust Badges", desc: "Security and guarantees" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all"
              >
                <Quote className="h-8 w-8 text-purple-400 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {item.label}
                </h3>
                <p className="text-slate-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-slate-900 mb-6">
            Build Unshakeable Trust
          </h2>
          <p className="text-xl text-slate-600 mb-10">
            Discover credibility gaps and fix them
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
              className="flex-1 px-6 py-5 bg-white border-2 border-purple-200 text-slate-900 rounded-2xl font-medium focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-lg"
              required
            />
            <Button
              type="submit"
              className="h-[72px] px-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 text-lg"
            >
              Get Score
              <ArrowRight className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </section>

      {/* Related */}
      <section className="py-16 px-4 border-t border-purple-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/positioning-audit"
              className="px-5 py-3 bg-white text-blue-700 border-2 border-blue-200 rounded-xl font-bold hover:border-blue-400 transition-colors"
            >
              Positioning
            </Link>
            <Link
              href="/clarity-audit"
              className="px-5 py-3 bg-white text-green-700 border-2 border-green-200 rounded-xl font-bold hover:border-green-400 transition-colors"
            >
              Clarity
            </Link>
            <Link
              href="/momentum-audit"
              className="px-5 py-3 bg-white text-orange-700 border-2 border-orange-200 rounded-xl font-bold hover:border-orange-400 transition-colors"
            >
              Momentum
            </Link>
            <Link
              href="/aeo-audit"
              className="px-5 py-3 bg-white text-cyan-700 border-2 border-cyan-200 rounded-xl font-bold hover:border-cyan-400 transition-colors"
            >
              AEO
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
