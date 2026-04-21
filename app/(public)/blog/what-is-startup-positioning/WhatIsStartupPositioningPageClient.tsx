"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function WhatIsStartupPositioningPageClient() {
  const [websiteUrl, setWebsiteUrl] = useState("");

  const handleStartAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (websiteUrl) {
      window.location.href = `/sio-audit?url=${encodeURIComponent(websiteUrl)}`;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            What is Startup Positioning?
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Positioning isn't what you do to a product. Positioning is what you
            do to the mind of the prospect. It's the foundation of your SaaS
            conversion, retention, and scale.
          </p>
        </header>

        {/* Introduction */}
        <section className="prose prose-lg max-w-none mb-12">
          <p className="text-lg leading-relaxed text-slate-700">
            In the world of startups, especially SaaS companies, positioning is
            often misunderstood. Many founders think it's about creating a
            catchy tagline or choosing the right brand colors. But the truth is,
            positioning is much deeper and more strategic than that.
          </p>
          <p className="text-lg leading-relaxed text-slate-700">
            At its core, positioning is about answering the most critical
            question in your potential customer's mind: "What is this, and why
            should I care?"
          </p>
        </section>

        {/* The Definition */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            The Definition of Startup Positioning
          </h2>
          <blockquote className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-50 rounded-r-lg mb-6">
            <p className="text-xl font-medium text-slate-800 italic">
              "Startup positioning is the act of designing the company's
              offering and image to occupy a distinctive place in the mind of
              the target market."
            </p>
          </blockquote>
          <p className="text-lg leading-relaxed text-slate-700 mb-4">
            In simpler terms, it's how you make your startup memorable and
            relevant to your ideal customers. It's not about what you sell—it's
            about how you frame what you sell in the context of your customers'
            needs and the competitive landscape.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <h4 className="font-bold text-red-900 mb-3">
                Positioning is NOT:
              </h4>
              <ul className="list-disc list-inside text-red-800 space-y-1">
                <li>Just a catchy tagline</li>
                <li>A list of features</li>
                <li>Your brand colors or logo</li>
                <li>Sales copy or marketing materials</li>
              </ul>
            </div>
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h4 className="font-bold text-green-900 mb-3">Positioning IS:</h4>
              <ul className="list-disc list-inside text-green-800 space-y-1">
                <li>Strategic differentiation from competitors</li>
                <li>Creating mental models in your market</li>
                <li>Providing context for your problem-solution fit</li>
                <li>Owning a category in your customers' minds</li>
              </ul>
            </div>
          </div>
        </section>

        {/* The 3 Pillars */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            The 3 Pillars of Effective Positioning
          </h2>
          <p className="text-lg leading-relaxed text-slate-700 mb-6">
            Strong positioning rests on three interconnected pillars. Get these
            right, and you'll have a foundation that drives growth. Get them
            wrong, and you'll struggle to gain traction.
          </p>

          <h3 className="text-2xl font-semibold text-slate-900 mb-4">
            1. Category
          </h3>
          <p className="text-lg leading-relaxed text-slate-700 mb-6">
            The category is the immediate mental bucket your potential customers
            place you in. If they can't categorize your offering quickly and
            easily, they can't begin to understand its value. Think of
            categories like "project management software" or "email marketing
            tool"—they provide instant context and expectations.
          </p>

          <h3 className="text-2xl font-semibold text-slate-900 mb-4">
            2. Ideal Customer Profile (ICP)
          </h3>
          <p className="text-lg leading-relaxed text-slate-700 mb-6">
            Your ICP is the specific group of people who experience your target
            problem most acutely. It's not "everyone" or "small businesses"—it's
            a narrow, well-defined segment. The more precisely you can define
            who you're for, the more powerfully you can speak to them.
          </p>

          <h3 className="text-2xl font-semibold text-slate-900 mb-4">
            3. Unique Value Proposition (UVP)
          </h3>
          <p className="text-lg leading-relaxed text-slate-700 mb-6">
            Your UVP is the specific, measurable outcome that only you can
            provide to your ICP. It's not what you do—it's the transformation
            you create. A strong UVP answers "why you, not them?" in a way that
            resonates deeply with your target customers.
          </p>
        </section>

        {/* Why It Matters */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Why Positioning Matters So Much
          </h2>
          <p className="text-lg leading-relaxed text-slate-700 mb-6">
            In a crowded market, positioning isn't just nice to have—it's a
            matter of survival. Here's why getting it right can make or break
            your startup:
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-3">
            Higher Conversion Rates
          </h3>
          <p className="text-lg leading-relaxed text-slate-700 mb-6">
            Clear positioning removes friction from the buying process. When a
            potential customer immediately understands your value and how you
            fit into their world, they're 3x more likely to sign up. No more
            "what is this?" conversations that kill momentum.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-3">
            Better Customer Retention
          </h3>
          <p className="text-lg leading-relaxed text-slate-700 mb-6">
            When your positioning attracts the right customers—those who truly
            need and value what you offer—churn drops dramatically. These
            customers don't just buy; they become advocates who drive organic
            growth.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-3">
            Faster Sales Cycles
          </h3>
          <p className="text-lg leading-relaxed text-slate-700 mb-6">
            Strong positioning does the heavy lifting before your sales team
            even gets involved. Prospects come pre-sold on your value,
            shortening sales cycles and reducing the cost of acquisition.
          </p>

          <div className="bg-slate-100 p-6 rounded-lg border-l-4 border-slate-400 mb-6">
            <p className="text-lg font-medium text-slate-800 mb-2">
              <strong>74%</strong> of SaaS failures are due to poor positioning,
              not product quality.
            </p>
            <p className="text-sm text-slate-600">
              LaunchRecord Market Analysis 2026
            </p>
          </div>
        </section>

        {/* Common Mistakes */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Common Positioning Mistakes to Avoid
          </h2>
          <p className="text-lg leading-relaxed text-slate-700 mb-6">
            Even experienced founders make these positioning errors. Here's what
            to watch out for:
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-3">
            The "All-in-One" Trap
          </h3>
          <p className="text-lg leading-relaxed text-slate-700 mb-6">
            Trying to solve every problem for everyone leads to generic
            messaging that resonates with no one. Focus on being the best at one
            thing for one group of people, not mediocre at everything for
            everybody.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-3">
            Leading with Features
          </h3>
          <p className="text-lg leading-relaxed text-slate-700 mb-6">
            Customers don't care about your tech stack, dashboard, or API. They
            care about outcomes. Start with the transformation you create, not
            the tools you use to create it.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-3">
            Inventing Categories
          </h3>
          <p className="text-lg leading-relaxed text-slate-700 mb-6">
            Using jargon to create entirely new categories that customers have
            no mental model for is a recipe for confusion. Build on existing
            categories and then differentiate within them.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-3">
            Ignoring the Competition
          </h3>
          <p className="text-lg leading-relaxed text-slate-700 mb-6">
            If you don't define your competitive edge, your customers will do it
            for you—and it might not be in your favor. Know what makes you
            different and why that difference matters.
          </p>
        </section>

        {/* How to Fix Your Positioning */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            How to Fix Your Positioning
          </h2>
          <p className="text-lg leading-relaxed text-slate-700 mb-6">
            The best way to improve your positioning isn't guesswork or
            following generic advice. It's evidence-based analysis of how your
            current messaging performs with real prospects.
          </p>
          <p className="text-lg leading-relaxed text-slate-700 mb-6">
            Our SIO-V5 engine analyzes your website against the three pillars of
            conversion to identify exactly where your messaging breaks down.
            Instead of assumptions, you get data-driven insights about what to
            change.
          </p>

          <div className="bg-blue-50 p-8 rounded-lg border border-blue-200 mb-6">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">
              Start with a Free Positioning Audit
            </h3>
            <p className="text-blue-800 mb-6">
              Get an evidence-based analysis of your current positioning and
              specific recommendations for improvement.
            </p>
            <form
              onSubmit={handleStartAudit}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="url"
                placeholder="Enter your website URL"
                required
                className="flex-grow px-4 py-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
              />
              <Button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                Run Free Audit <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
            <p className="text-sm text-blue-600 mt-3">
              Trusted by 2,000+ founders worldwide
            </p>
          </div>
        </section>

        {/* Conclusion */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Positioning is Your Foundation
          </h2>
          <p className="text-lg leading-relaxed text-slate-700 mb-6">
            In the end, positioning isn't a marketing tactic—it's the strategic
            foundation that determines whether your startup succeeds or fails.
            Get it right, and everything else becomes easier. Get it wrong, and
            you'll fight an uphill battle for every customer.
          </p>
          <p className="text-lg leading-relaxed text-slate-700 mb-6">
            Don't leave your positioning to chance. Use data and evidence to
            build a position that attracts the right customers and drives
            sustainable growth.
          </p>
        </section>

        {/* Related Posts */}
        <section className="border-t border-slate-200 pt-12">
          <h3 className="text-2xl font-bold text-slate-900 mb-8">
            Keep Learning
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/blog/5-things-you-need-to-know-about-aeo"
              className="block"
            >
              <div className="bg-white p-6 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
                <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm mb-3">
                  <Sparkles className="h-4 w-4" /> AI Visibility
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2 hover:text-blue-600 transition-colors">
                  5 Things You Need to Know About AEO
                </h4>
                <p className="text-slate-600 text-sm">
                  Discover the future of AI visibility and how to optimize for
                  ChatGPT, Claude, and Gemini.
                </p>
              </div>
            </Link>
            <Link href="/blog/why-traffic-but-no-signup" className="block">
              <div className="bg-white p-6 rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors">
                <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm mb-3">
                  <TrendingUp className="h-4 w-4" /> Growth
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2 hover:text-indigo-600 transition-colors">
                  Why You Have Traffic but No Signups
                </h4>
                <p className="text-slate-600 text-sm">
                  The gap between visitor interest and actual conversion usually
                  lies in the clarity of your value proposition.
                </p>
              </div>
            </Link>
          </div>
        </section>
      </article>
    </div>
  );
}
