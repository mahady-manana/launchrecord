"use client";

import { Button } from "@/components/ui/button";
import {
  Award,
  CheckCircle2,
  Compass,
  Eye,
  Lightbulb,
  Shield,
  Target,
  Trophy,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";

export default function PositioningAuditToolsPageClient() {
  const [websiteUrl, setWebsiteUrl] = useState("");

  const handleStartAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (websiteUrl) {
      window.location.href = `/sio-audit?url=${encodeURIComponent(websiteUrl)}&pillar=positioning`;
    }
  };

  const auditTools = [
    {
      icon: <Compass className="h-8 w-8" />,
      title: "Category Definition Analyzer",
      description:
        "Discover if you've clearly defined the category you play in—or if you're lost in a sea of 'me-too' solutions.",
      whatItDoes: [
        "Evaluates category clarity on your site",
        "Identifies category confusion signals",
        "Measures category ownership potential",
        "Compares against category kings in your space",
      ],
      whyItMatters:
        "If visitors can't instantly identify what category you're in, they'll assume you're not the solution they need. Category clarity is the foundation of strong positioning.",
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Competitive Differentiation Scanner",
      description:
        "Uncover how you stack up against alternatives and whether your differentiation is obvious or invisible.",
      whatItDoes: [
        "Maps your competitive landscape",
        "Identifies differentiation gaps",
        "Analyzes unique value signals",
        "Reveals positioning overlaps with competitors",
      ],
      whyItMatters:
        "Without clear differentiation, you're competing on price and features—a race to the bottom. Strong positioning makes you the obvious choice, not just another option.",
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "Value Proposition Validator",
      description:
        "Test whether your value proposition actually communicates value—or just lists features nobody asked for.",
      whatItDoes: [
        "Analyzes outcome-focused language",
        "Measures specificity of claims",
        "Identifies feature vs. benefit imbalance",
        "Checks alignment with customer pain points",
      ],
      whyItMatters:
        "Your value proposition is the first thing visitors evaluate. If it doesn't instantly communicate why you matter to them, you've lost them before they scroll.",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Audience Fit Analyzer",
      description:
        "Verify whether you're attracting your ideal customer or bleeding traffic from people who'll never convert.",
      whatItDoes: [
        "Evaluates ICP (Ideal Customer Profile) clarity",
        "Analyzes messaging resonance with target audience",
        "Identifies audience mismatch signals",
        "Measures specificity of audience targeting",
      ],
      whyItMatters:
        "Trying to appeal to everyone appeals to no one. Precise audience positioning increases conversion rates by 3-5x because the right visitors instantly recognize this is for them.",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Defensibility Score Calculator",
      description:
        "Measure how difficult it would be for competitors (or AI) to commoditize your positioning and steal your market.",
      whatItDoes: [
        "Calculates positioning defensibility score",
        "Identifies commoditization risks",
        "Analyzes moat-building opportunities",
        "Provides defensibility improvement roadmap",
      ],
      whyItMatters:
        "Weak positioning is easily copied. Strong positioning becomes part of your brand identity—something competitors can't replicate without looking like they're copying you.",
    },
  ];

  const successMetrics = [
    { metric: "3.2x", label: "higher conversion with clear positioning" },
    { metric: "67%", label: "of startups have positioning confusion" },
    { metric: "5s", label: "to make positioning clear or lose visitors" },
    { metric: "89%", label: "of category leaders capture market value" },
  ];

  const caseStudy = {
    company: "SaaS Analytics Startup",
    problem:
      "Getting 2,000+ monthly visitors but only 0.3% conversion rate. Visitors bounced within 8 seconds.",
    diagnosis:
      "Homepage said: 'Next-generation analytics platform empowering data-driven decisions.' Visitors had no idea what category they were in, who it was for, or why it mattered.",
    fix: "Changed to: 'Know exactly which marketing channels drive revenue—not vanity metrics.' Conversion rate jumped to 2.1% in 3 weeks.",
    result: "7x improvement in signup rate from positioning clarity alone",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-white">
      {/* Magazine-Style Header */}
      <section className="relative overflow-hidden border-b-4 border-amber-500 bg-white">
        <div className="absolute inset-0 opacity-5">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "radial-gradient(circle, #000 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-16">
          {/* Magazine Tag */}
          <div className="mb-6 flex items-center justify-between border-b-2 border-slate-900 pb-4">
            <div className="flex items-center gap-3">
              <span className="rounded bg-amber-500 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
                Positioning Toolkit
              </span>
              <span className="text-sm font-medium text-slate-600">
                5 Tools • Free Analysis • 60 Seconds
              </span>
            </div>
            <div className="hidden text-sm font-medium text-slate-600 md:block">
              No signup required
            </div>
          </div>

          {/* Headline */}
          <div className="mt-8 max-w-4xl">
            <h1 className="mb-6 text-5xl font-black leading-none tracking-tighter text-slate-900 md:text-7xl">
              Positioning Audit
              <span className="text-amber-600"> Tools</span>
            </h1>

            <p className="mb-8 text-xl leading-relaxed text-slate-700 md:text-2xl">
              <strong>Find your market edge.</strong> Discover why visitors
              don't understand your value—and fix it with 5 comprehensive
              positioning audit tools.
            </p>

            {/* Author/Byline */}
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-white">
                <Eye className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-slate-900">
                  LaunchRecord Team
                </div>
                <div>Positioning Strategy & Category Design</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Bar */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {successMetrics.map((item, i) => (
              <div key={i} className="text-center">
                <div className="mb-1 text-3xl font-black text-amber-600">
                  {item.metric}
                </div>
                <div className="text-xs font-medium uppercase tracking-wide text-slate-600">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="bg-gradient-to-r from-amber-500 to-orange-500 py-12">
        <div className="mx-auto max-w-4xl px-6">
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <div className="mb-4 flex items-center gap-3">
              <Zap className="h-6 w-6 text-amber-600" />
              <h2 className="text-2xl font-black text-slate-900">
                Audit Your Positioning Now
              </h2>
            </div>
            <p className="mb-6 text-slate-700">
              Enter your website URL for instant positioning analysis across all
              5 dimensions.
            </p>
            <form
              onSubmit={handleStartAudit}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <input
                type="text"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://your-startup.com"
                className="flex-1 rounded-lg border-2 border-slate-300 px-4 py-3 text-sm font-medium focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
              <Button
                type="submit"
                className="h-12 bg-amber-600 px-8 font-bold uppercase tracking-wider text-white hover:bg-amber-700"
              >
                Start Free Audit
              </Button>
            </form>
            <p className="mt-3 text-xs text-slate-500">
              Free positioning analysis • No signup required • Results in 60
              seconds
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Article */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="prose prose-lg max-w-none">
            <p className="text-xl leading-relaxed text-slate-700 first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-6xl first-letter:font-black first-letter:leading-none first-letter:text-amber-600">
              Most startups don't have a product problem. They have a
              positioning problem. Your visitors land on your site, spend 5
              seconds trying to figure out what you do, and leave because it's
              not obvious.
            </p>

            <p className="text-lg leading-relaxed text-slate-600">
              The companies that win don't always have the best product. They
              have the clearest positioning. They make their value obvious in
              seconds. They own a category in the minds of their customers. And
              they've systematically eliminated every signal of positioning
              confusion.
            </p>

            <p className="text-lg leading-relaxed text-slate-600">
              These 5 audit tools will expose exactly where your positioning is
              weak—and give you actionable steps to fix it. Let's dive in.
            </p>
          </div>
        </div>
      </section>

      {/* Main Tools Grid - Magazine Style */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 border-b-4 border-slate-900 pb-4">
            <h2 className="text-4xl font-black tracking-tight text-slate-900">
              The Positioning Toolkit
            </h2>
            <p className="mt-2 text-lg text-slate-600">
              5 comprehensive tools to audit, analyze, and strengthen your
              market positioning
            </p>
          </div>

          <div className="space-y-16">
            {auditTools.map((tool, index) => (
              <article
                key={index}
                id={`tool-${index + 1}`}
                className="scroll-mt-24 grid gap-8 md:grid-cols-5"
              >
                {/* Tool Header */}
                <div className="md:col-span-2">
                  <div className="sticky top-24">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                      {tool.icon}
                    </div>
                    <div className="mb-2 text-xs font-bold uppercase tracking-widest text-amber-600">
                      Tool {index + 1}
                    </div>
                    <h3 className="mb-3 text-3xl font-black text-slate-900">
                      {tool.title}
                    </h3>
                    <p className="text-lg leading-relaxed text-slate-700">
                      {tool.description}
                    </p>
                  </div>
                </div>

                {/* Tool Details */}
                <div className="md:col-span-3">
                  <div className="rounded-lg border-2 border-slate-200 bg-slate-50 p-6">
                    <h4 className="mb-4 font-bold text-slate-900">
                      What It Analyzes
                    </h4>
                    <ul className="mb-6 space-y-2">
                      {tool.whatItDoes.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-1 h-4 w-4 flex-shrink-0 text-amber-600" />
                          <span className="text-slate-700">{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="rounded-lg bg-amber-50 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-amber-600" />
                        <span className="font-bold text-slate-900">
                          Why This Matters
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-700">
                        {tool.whyItMatters}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study - Magazine Pull Quote Style */}
      <section className="border-y-4 border-slate-900 bg-slate-50 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-8 text-center">
            <span className="rounded-full bg-slate-900 px-4 py-1 text-xs font-bold uppercase tracking-widest text-white">
              Case Study
            </span>
          </div>

          <div className="grid gap-12 md:grid-cols-2">
            {/* Problem Side */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <XCircle className="h-6 w-6 text-red-600" />
                <h3 className="text-2xl font-black text-slate-900">Before</h3>
              </div>

              <div className="rounded-lg border-2 border-red-200 bg-white p-6">
                <div className="mb-2 text-xs font-bold uppercase text-slate-600">
                  Company
                </div>
                <p className="mb-4 font-medium text-slate-900">
                  {caseStudy.company}
                </p>

                <div className="mb-2 text-xs font-bold uppercase text-slate-600">
                  The Problem
                </div>
                <p className="text-slate-700">{caseStudy.problem}</p>
              </div>

              <div className="rounded-lg border-2 border-red-200 bg-white p-6">
                <div className="mb-2 text-xs font-bold uppercase text-slate-600">
                  Diagnosis
                </div>
                <p className="text-slate-700">{caseStudy.diagnosis}</p>
              </div>
            </div>

            {/* Solution Side */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                <h3 className="text-2xl font-black text-slate-900">After</h3>
              </div>

              <div className="rounded-lg border-2 border-green-200 bg-white p-6">
                <div className="mb-2 text-xs font-bold uppercase text-slate-600">
                  The Fix
                </div>
                <p className="text-slate-700">{caseStudy.fix}</p>
              </div>

              <div className="rounded-lg border-2 border-green-200 bg-white p-6">
                <div className="mb-2 text-xs font-bold uppercase text-slate-600">
                  The Result
                </div>
                <div className="mb-2 text-4xl font-black text-green-600">
                  {caseStudy.result.split(" ")[0]}
                </div>
                <p className="text-slate-700">
                  {caseStudy.result.split(" ").slice(1).join(" ")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Timeline */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-black text-slate-900">
              How The Positioning Audit Works
            </h2>
            <p className="text-lg text-slate-600">
              Three simple steps to positioning clarity
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                step: 1,
                title: "Enter Your URL",
                desc: "Paste your website URL. Our SIO-V5 engine will analyze your positioning signals, messaging, category clarity, and competitive differentiation.",
              },
              {
                step: 2,
                title: "Get Your Positioning Score",
                desc: "In 60 seconds, receive a comprehensive positioning score across 5 dimensions: category clarity, differentiation, value proposition, audience fit, and defensibility.",
              },
              {
                step: 3,
                title: "Follow The Action Plan",
                desc: "Get prioritized recommendations with specific changes to make. Each recommendation is tied to measurable positioning improvements.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-600 text-lg font-black text-white">
                    {item.step}
                  </div>
                  {item.step < 3 && (
                    <div className="mt-2 h-16 w-0.5 bg-amber-300" />
                  )}
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="mb-2 text-xl font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-slate-700">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-20 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Award className="mx-auto mb-6 h-16 w-16 text-amber-500" />
          <h2 className="mb-6 text-4xl font-black md:text-5xl">
            Ready to Own Your Category?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-300">
            Stop losing visitors to positioning confusion. Get your
            comprehensive positioning audit and start dominating your market.
          </p>

          <form
            onSubmit={handleStartAudit}
            className="mx-auto mb-6 flex max-w-xl flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://your-startup.com"
              className="flex-1 rounded-lg border-2 border-white/20 bg-white/10 px-4 py-3 text-sm font-medium text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none"
            />
            <Button
              type="submit"
              className="h-12 bg-amber-600 px-8 font-bold uppercase tracking-wider text-white hover:bg-amber-700"
            >
              Get Your Audit
            </Button>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-amber-500" />
              <span>5 audit tools in one analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-amber-500" />
              <span>Actionable recommendations</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-amber-500" />
              <span>Results in 60 seconds</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
