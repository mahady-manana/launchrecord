"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function SolutionSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
            How It Works
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            We audit your startup's website. We don't just identify problems, we
            give you the exact fixes to make your product obvious and convert
            more users.
          </p>
        </div>

        {/* Main Solution Flow */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Step 1 */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary font-black flex items-center justify-center text-2xl border-2 border-primary/20">
                1
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <h3 className="text-2xl font-bold text-slate-900">
                We Detect Your Blind Spots
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Our engine analyzes your startup against 10,000+ records to find
                what you can't see: positioning that sounds like everyone else,
                messaging that confuses prospects, and AI invisibility that's
                killing your discovery. You get cold, clinical data—no opinions,
                no fluff.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary font-black flex items-center justify-center text-2xl border-2 border-primary/20">
                2
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <h3 className="text-2xl font-bold text-slate-900">
                We Tell You What's Broken
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Your report shows your score, strong points, and weaknesses
                across different pillars of defensibility. Each weakness comes
                with specific examples and a truth summary. You'll know what
                works, what doesn't and how to fixes. No generic advice. Just
                the raw data you need to prioritize fixes.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary font-black flex items-center justify-center text-2xl border-2 border-primary/20">
                3
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <h3 className="text-2xl font-bold text-slate-900">
                We Show You How to Fix It
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed">
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
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary font-black flex items-center justify-center text-2xl border-2 border-primary/20">
                4
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <h3 className="text-2xl font-bold text-slate-900">
                We Track Your Progress
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed">
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
          <div className="inline-flex flex-col md:flex-row gap-4 items-center justify-center bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
            <div className="text-left space-y-2">
              <p className="text-slate-700 font-medium">
                Ready to fix your positioning?
              </p>
            </div>
            <Link
              href="/sio-audit"
              className="inline-flex items-center gap-2 bg-secondary text-white px-8 py-4 rounded-lg font-bold uppercase tracking-wider hover:bg-secondary/90 transition-colors whitespace-nowrap shadow-md"
            >
              Run Free Audit
              <CheckCircle2 className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
