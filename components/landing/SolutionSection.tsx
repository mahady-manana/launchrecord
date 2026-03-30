"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function SolutionSection() {
  return (
    <section className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-100 tracking-tighter">
            How We Fix It
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            We don't just identify problems. We give you the exact fixes to make
            your product obvious and convert more users.
          </p>
        </div>

        {/* Main Solution Flow */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Step 1 */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-slate-800 text-orange-500 font-black flex items-center justify-center text-2xl border border-slate-700">
                1
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <h3 className="text-2xl font-bold text-slate-100">
                We Detect Your Blind Spots
              </h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                Our SIO-V5 Engine analyzes your startup against 10,000+ records
                to find what you can't see: positioning that sounds like
                everyone else, messaging that confuses prospects, and AI
                invisibility that's killing your discovery. You get cold,
                clinical data—no opinions, no fluff.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-slate-800 text-orange-500 font-black flex items-center justify-center text-2xl border border-slate-700">
                2
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <h3 className="text-2xl font-bold text-slate-100">
                We Tell You What's Broken
              </h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                Your War Briefing shows your Global Score, Survival Probability,
                and a brutal truth summary. You'll know your exact status:{" "}
                <span className="text-slate-100 font-semibold">JUNK</span>,{" "}
                <span className="text-slate-100 font-semibold">VULNERABLE</span>
                , or{" "}
                <span className="text-orange-500 font-semibold">SOVEREIGN</span>
                . No sugarcoating. No generic advice. Just the raw data you need
                to prioritize fixes.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-slate-800 text-orange-500 font-black flex items-center justify-center text-2xl border border-slate-700">
                3
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <h3 className="text-2xl font-bold text-slate-100">
                We Show You How to Fix It
              </h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                Every weakness comes with exact fixes. Your positioning is
                commodity? We show you how to differentiate. Your clarity is
                weak? We identify the confusing messages. You're invisible to
                AI? We tell you what to change to get cited. Then you execute
                weekly missions to make it happen.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-slate-800 text-orange-500 font-black flex items-center justify-center text-2xl border border-slate-700">
                4
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <h3 className="text-2xl font-bold text-slate-100">
                We Track Your Progress
              </h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                This isn't a one-time audit. Your Sovereign Dashboard tracks
                your scores across all five pillars over time. Complete weekly
                missions, upload proof of shipping, and watch your defensibility
                compound. You'll know exactly when you're winning—and when
                you're slipping.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col md:flex-row gap-4 items-center justify-center bg-slate-800/50 border border-slate-700 rounded-xl p-8">
            <div className="text-left space-y-2">
              <p className="text-slate-300 font-medium">
                Ready to fix your positioning?
              </p>
              <p className="text-slate-500 text-sm">
                Get your War Briefing in 2-3 minutes. Free forever.
              </p>
            </div>
            <Link
              href="/survey"
              className="inline-flex items-center gap-2 bg-orange-500 text-slate-900 px-8 py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-orange-400 transition-colors whitespace-nowrap"
            >
              Start Your Free Audit
              <CheckCircle2 className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
