"use client";

import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Eye,
  MessageSquare,
  Quote,
  Shield,
  Star,
  Target,
  ThumbsDown,
  ThumbsUp,
  Zap,
} from "lucide-react";
import { useState } from "react";

export default function MessagingAuditPageClient() {
  const [websiteUrl, setWebsiteUrl] = useState("");

  const handleStartAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (websiteUrl) {
      window.location.href = `/sio-audit?url=${encodeURIComponent(websiteUrl)}&pillar=clarity`;
    }
  };

  const messagingChecks = [
    {
      category: "Headlines & Hero Section",
      icon: <Target className="h-6 w-6" />,
      checks: [
        {
          good: "Clear outcome: 'Cut your legal review time by 80%'",
          bad: "Vague promise: 'Empowering next-gen solutions'",
          why: "Visitors decide in 3 seconds. Your headline must pass the 'So what?' test instantly.",
        },
        {
          good: "Specific audience: 'For B2B SaaS founders'",
          bad: "Everyone: 'For businesses worldwide'",
          why: "Specificity creates resonance. If you speak to everyone, nobody feels heard.",
        },
        {
          good: "Active voice: 'We help you close more deals'",
          bad: "Passive voice: 'Deals can be closed better'",
          why: "Active voice is 37% more persuasive and creates immediate clarity.",
        },
      ],
    },
    {
      category: "Value Proposition & Benefits",
      icon: <Star className="h-6 w-6" />,
      checks: [
        {
          good: "Outcomes first: 'Save 10 hours/week on reporting'",
          bad: "Features first: 'Automated reporting engine v2.0'",
          why: "Customers buy transformations, not technology. Lead with what they get.",
        },
        {
          good: "Quantified: 'Trusted by 500+ startups'",
          bad: "Vague: 'Trusted by many companies'",
          why: "Specificity builds credibility. Vague claims trigger skepticism.",
        },
        {
          good: "Differentiated: 'Only platform with verified defensibility'",
          bad: "Generic: 'Best-in-class solution'",
          why: "'Best-in-class' means nothing without proof. Show why you're different.",
        },
      ],
    },
    {
      category: "CTAs & Next Steps",
      icon: <ArrowRight className="h-6 w-6" />,
      checks: [
        {
          good: "Action-oriented: 'Get My Free Audit'",
          bad: "Generic: 'Click Here'",
          why: "Your CTA should reinforce the value, not just the action.",
        },
        {
          good: "Single focus: One primary CTA per page",
          bad: "Choice paralysis: 5 competing CTAs",
          why: "Multiple CTAs reduce conversion by 23%. One clear path wins.",
        },
        {
          good: "Low friction: 'Start Free • No Credit Card'",
          bad: "High friction: 'Schedule a Demo • Enterprise Only'",
          why: "Reduce perceived risk. Make the first step effortless.",
        },
      ],
    },
    {
      category: "Social Proof & Trust",
      icon: <Shield className="h-6 w-6" />,
      checks: [
        {
          good: "Above fold: Logos, testimonials visible immediately",
          bad: "Hidden: Social proof buried below the fold",
          why: "Trust signals must appear before doubt creeps in.",
        },
        {
          good: "Specific results: 'Increased conversions by 147%'",
          bad: "Generic praise: 'Great product, highly recommend'",
          why: "Outcome-based testimonials convert 3x higher than generic praise.",
        },
        {
          good: "Real humans: Photos, names, titles",
          bad: "Anonymous: 'A happy customer'",
          why: "Real people build real trust. Anonymity breeds suspicion.",
        },
      ],
    },
    {
      category: "Clarity & Jargon",
      icon: <Eye className="h-6 w-6" />,
      checks: [
        {
          good: "Simple words a 12-year-old understands",
          bad: "Jargon: 'Leveraging synergistic paradigms'",
          why: "Jargon doesn't make you sound smart—it makes visitors feel dumb. Then they leave.",
        },
        {
          good: "Short sentences: Average 15-20 words",
          bad: "Walls of text: 50+ word sentences",
          why: "Readability directly impacts comprehension. Comprehension drives conversion.",
        },
        {
          good: "Active voice throughout",
          bad: "Passive voice creates distance",
          why: "Active voice creates connection. Passive voice creates confusion.",
        },
      ],
    },
  ];

  const beforeAfter = [
    {
      section: "Hero Headline",
      before: "Empowering digital transformation through innovative solutions",
      after:
        "Know exactly where your positioning is weak before competitors exploit it",
      improvement: "+340% conversion rate",
    },
    {
      section: "Feature Description",
      before: "Advanced ML algorithms with multi-tier architecture",
      after:
        "Get your complete positioning score in 60 seconds—no manual work required",
      improvement: "+210% engagement",
    },
    {
      section: "CTA Button",
      before: "Submit",
      after: "Get My Free Audit Now",
      improvement: "+89% click-through",
    },
    {
      section: "Social Proof",
      before: "Trusted by companies worldwide",
      after: "Trusted by 1,200+ founders who refuse to be commoditized",
      improvement: "+156% trust score",
    },
  ];

  const messagingFormula = [
    {
      step: "Hook",
      formula: "Specific outcome + Target audience",
      example: '"Cut your legal review time by 80%—built for startup founders"',
    },
    {
      step: "Amplify",
      formula: "Problem they feel + Cost of inaction",
      example:
        '"Every week you wait, competitors are stealing your ideal customers"',
    },
    {
      step: "Solution",
      formula: "How you solve it + Why you're different",
      example:
        '"Our AI-powered audit reveals your positioning gaps in 60 seconds"',
    },
    {
      step: "Proof",
      formula: "Specific result + Real customer",
      example:
        '"We 7x\'d our conversion rate in 3 weeks" — Sarah, CEO at TechStart',
    },
    {
      step: "Action",
      formula: "Clear CTA + Risk reversal",
      example: '"Get your free audit • No credit card • Results in 60 seconds"',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">
      {/* Storytelling Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 text-white">
        <div className="absolute inset-0 opacity-20">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 py-20">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm font-semibold">Messaging Framework</span>
          </div>

          <h1 className="mb-6 text-5xl font-black leading-tight tracking-tight md:text-7xl">
            Fix Your Words.
            <br />
            <span className="text-yellow-300">Fix Your Conversions.</span>
          </h1>

          <p className="mb-8 max-w-3xl text-xl leading-relaxed text-white/90 md:text-2xl">
            Your visitors read your words before they decide to stay or leave.
            If your messaging confuses instead of converts, you're hemorrhaging
            signups—and you might not even know it.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <form
              onSubmit={handleStartAudit}
              className="flex flex-1 gap-2 sm:flex-row"
            >
              <input
                type="text"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="Enter your website URL"
                className="flex-1 rounded-lg border-2 border-white/30 bg-white/10 px-4 py-3 text-sm font-medium text-white placeholder-white/60 focus:border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-300/20"
              />
              <Button
                type="submit"
                className="h-12 bg-yellow-400 px-8 font-bold uppercase tracking-wider text-slate-900 hover:bg-yellow-500"
              >
                Audit My Messaging
              </Button>
            </form>
          </div>

          <p className="mt-4 text-sm text-white/70">
            Free messaging analysis • 5 dimensions • Results in 60 seconds
          </p>
        </div>

        {/* Wave Divider */}
      </section>

      {/* The Problem - Story Style */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="prose prose-lg max-w-none">
            <p className="text-xl leading-relaxed text-slate-700 first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-6xl first-letter:font-black first-letter:leading-none first-letter:text-indigo-600">
              You've spent months building your product. You know exactly what
              it does. You know the value it delivers. So when you write your
              website copy, it all seems obvious to you.
            </p>

            <p className="text-lg leading-relaxed text-slate-600">
              But your visitors aren't you. They don't have your context. They
              don't care about your technology. They have one question:{" "}
              <strong className="text-slate-900">"What's in it for me?"</strong>
            </p>

            <p className="text-lg leading-relaxed text-slate-600">
              If your messaging doesn't answer that question in the first 3
              seconds, they're gone. And they're not coming back. This is why
              67% of startups lose visitors due to weak messaging—even when
              their product is exceptional.
            </p>
          </div>
        </div>
      </section>

      {/* The Checklist - Interactive */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2">
              <BarChart3 className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-bold text-indigo-600">
                THE MESSAGING CHECKLIST
              </span>
            </div>
            <h2 className="mb-4 text-4xl font-black tracking-tight text-slate-900">
              Is Your Messaging Working For You—or Against You?
            </h2>
            <p className="text-lg text-slate-600">
              Run through these 5 categories. Each one contains specific checks
              that separate converting copy from confusing copy.
            </p>
          </div>

          <div className="space-y-12">
            {messagingChecks.map((category, index) => (
              <div
                key={index}
                className="scroll-mt-24"
                id={`check-${index + 1}`}
              >
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">
                    {category.category}
                  </h3>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                  {category.checks.map((check, i) => (
                    <div
                      key={i}
                      className="rounded-lg border-2 border-slate-200 bg-slate-50 p-5"
                    >
                      {/* Good Example */}
                      <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3">
                        <div className="mb-1 flex items-center gap-2">
                          <ThumbsUp className="h-4 w-4 text-green-600" />
                          <span className="text-xs font-bold text-green-700">
                            DO
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-900">
                          {check.good}
                        </p>
                      </div>

                      {/* Bad Example */}
                      <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3">
                        <div className="mb-1 flex items-center gap-2">
                          <ThumbsDown className="h-4 w-4 text-red-600" />
                          <span className="text-xs font-bold text-red-700">
                            DON'T
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-900">
                          {check.bad}
                        </p>
                      </div>

                      {/* Why It Matters */}
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
                        <p className="text-xs leading-relaxed text-slate-700">
                          {check.why}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Grid */}
      <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-black text-slate-900">
              Messaging Makeovers
            </h2>
            <p className="text-lg text-slate-600">
              Real examples of how small messaging changes create massive
              conversion lifts
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {beforeAfter.map((item, index) => (
              <div
                key={index}
                className="rounded-xl border-2 border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">{item.section}</h3>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    {item.improvement}
                  </span>
                </div>

                <div className="mb-4 rounded-md bg-red-50 p-3">
                  <div className="mb-1 text-xs font-bold text-red-600">
                    BEFORE
                  </div>
                  <p className="text-sm text-slate-700">{item.before}</p>
                </div>

                <div className="mb-3 flex items-center justify-center">
                  <ArrowRight className="h-5 w-5 text-indigo-600" />
                </div>

                <div className="rounded-md bg-green-50 p-3">
                  <div className="mb-1 text-xs font-bold text-green-600">
                    AFTER
                  </div>
                  <p className="text-sm font-medium text-slate-900">
                    {item.after}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Formula */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2">
              <Zap className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-bold text-purple-600">
                THE FORMULA
              </span>
            </div>
            <h2 className="mb-4 text-4xl font-black text-slate-900">
              The 5-Step Messaging Formula
            </h2>
            <p className="text-lg text-slate-600">
              Use this framework to rewrite your entire page in 30 minutes
            </p>
          </div>

          <div className="space-y-6">
            {messagingFormula.map((item, index) => (
              <div
                key={index}
                className="flex gap-6 rounded-xl border-2 border-slate-200 bg-white p-6"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-lg font-black text-white">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900">
                      {item.step}
                    </h3>
                    <span className="text-xs font-medium text-slate-500">
                      {item.formula}
                    </span>
                  </div>
                  <div className="rounded-lg bg-indigo-50 p-3">
                    <Quote className="mb-1 h-4 w-4 text-indigo-400" />
                    <p className="text-sm font-medium italic text-slate-700">
                      {item.example}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 py-20 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <MessageSquare className="mx-auto mb-6 h-16 w-16 text-yellow-300" />
          <h2 className="mb-6 text-4xl font-black md:text-5xl">
            Stop Guessing. Start Converting.
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">
            Get your complete messaging audit with specific recommendations for
            every page on your site. Free. Fast. Actionable.
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
              className="flex-1 rounded-lg border-2 border-white/30 bg-white/10 px-4 py-3 text-sm font-medium text-white placeholder-white/60 focus:border-yellow-300 focus:outline-none"
            />
            <Button
              type="submit"
              className="h-12 bg-yellow-400 px-8 font-bold uppercase tracking-wider text-slate-900 hover:bg-yellow-500"
            >
              Audit My Messaging
            </Button>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-yellow-300" />
              <span>5 messaging dimensions</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-yellow-300" />
              <span>Specific rewrites suggested</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-yellow-300" />
              <span>Results in 60 seconds</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
