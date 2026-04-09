"use client";

import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  Lightbulb,
  MessageSquare,
  Shield,
  Target,
  TrendingDown,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type ConversionInsight = {
  definition: string;
  keyPoints?: string[];
  stats?: Array<{ value: string; label: string }>;
  mechanisms?: Array<{ name: string; description: string }>;
  example?: {
    scenario: string;
    problem: string;
    solution: string;
  };
  roadmap?: Array<{
    step: number;
    action: string;
    details: string;
    tools: string[];
  }>;
};

type InsightSection = {
  number: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  content: ConversionInsight;
};

export default function TrafficNoSignupPageClient() {
  const [websiteUrl, setWebsiteUrl] = useState("");

  const handleStartAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (websiteUrl) {
      window.location.href = `/sio-audit?url=${encodeURIComponent(websiteUrl)}`;
    }
  };

  const insights: InsightSection[] = [
    {
      number: "01",
      title: "The Positioning Problem",
      subtitle: "Why Visitors Don't Understand Your Value",
      icon: <Target className="h-8 w-8" />,
      color: "red",
      content: {
        definition:
          "Positioning is how your target audience perceives your product relative to alternatives. If they can't instantly grasp what you do and why it matters to them, they'll leave—no matter how great your solution is.",
        keyPoints: [
          "Visitors decide in 5-8 seconds whether to stay or bounce",
          "Poor positioning creates 'interesting but unclear' syndrome",
          "Features without outcomes confuse rather than convert",
          "Your positioning must be obvious to outsiders, not just insiders",
          "If you try to appeal to everyone, you appeal to no one",
        ],
        stats: [
          { value: "50%", label: "bounce within 15 seconds" },
          { value: "3.2s", label: "to understand your value" },
          { value: "73%", label: "leave if positioning unclear" },
        ],
        example: {
          scenario: "A visitor lands on your homepage",
          problem:
            "Your headline says: 'Empowering next-generation digital transformation solutions' — visitor thinks: 'What does that mean? Who is this for?'",
          solution:
            "Your headline says: 'Cut your legal contract review time by 80%' — visitor thinks: 'That's exactly my problem. Tell me more.'",
        },
        mechanisms: [
          {
            name: "Category Confusion",
            description:
              "When visitors can't immediately identify what category you're in, they assume you're not relevant to their problem.",
          },
          {
            name: "Value Ambiguity",
            description:
              "Even if they understand what you do, unclear benefit statements leave them wondering 'So what?'",
          },
          {
            name: "Differentiation Failure",
            description:
              "If you sound like every competitor, visitors have no reason to choose you over familiar alternatives.",
          },
        ],
      },
    },
    {
      number: "02",
      title: "The Messaging Gap",
      subtitle: "When Your Words Work Against You",
      icon: <MessageSquare className="h-8 w-8" />,
      color: "orange",
      content: {
        definition:
          "Messaging is the strategic alignment of your positioning with benefit-driven, crystal-clear messaging across every touchpoint. It's not just what you say—it's whether every word reinforces why visitors should care.",
        keyPoints: [
          "Jargon kills conversions—speak your customer's language",
          "Lead with outcomes, not features or technology",
          "Every headline should pass the 'So what?' test",
          "Social proof validates your claims before doubts arise",
          "Your messaging should make the next step obvious",
        ],
        stats: [
          { value: "67%", label: "leave due to weak messaging" },
          { value: "3x", label: "higher conversion with clear messaging" },
          { value: "40%", label: "more trust with social proof" },
        ],
        example: {
          scenario: "Your pricing page or feature section",
          problem:
            "You list: 'Advanced ML algorithms, multi-tier architecture, API-first design' — visitor thinks: 'I'm a founder, not an engineer. This isn't for me.'",
          solution:
            "You say: 'Know exactly where your positioning is weak before competitors exploit it' — visitor thinks: 'Yes! That's my exact fear. How do I get it?'",
        },
        mechanisms: [
          {
            name: "Feature Dump Syndrome",
            description:
              "Listing capabilities instead of transformations makes visitors do the mental work of connecting features to their problems.",
          },
          {
            name: "Vague Promise Trap",
            description:
              "Claims like 'transform your business' or 'unlock your potential' are meaningless without specific, measurable outcomes.",
          },
          {
            name: "Proof Deficit",
            description:
              "Making claims without evidence (testimonials, data, case studies) triggers skepticism instead of trust.",
          },
        ],
      },
    },
    {
      number: "03",
      title: "The Trust Deficit",
      subtitle: "Why Visitors Don't Believe You",
      icon: <Shield className="h-8 w-8" />,
      color: "blue",
      content: {
        definition:
          "Trust is the invisible bridge between interest and action. Even with perfect positioning and messaging, visitors won't signup if they don't believe you can deliver on your promises.",
        keyPoints: [
          "New brands face an uphill trust battle—prove yourself fast",
          "Testimonials, logos, and data points build instant credibility",
          "Professional design signals competence (or lack thereof)",
          "Transparency about pricing, process, and people reduces friction",
          "Risk reversal (guarantees, free trials) lowers the barrier to action",
        ],
        stats: [
          { value: "81%", label: "need trust before buying" },
          { value: "5+", label: "touchpoints to build trust" },
          { value: "92%", label: "read reviews before converting" },
        ],
        mechanisms: [
          {
            name: "Social Proof Void",
            description:
              "No testimonials, no case studies, no logos of customers—visitors assume nobody else trusts you either.",
          },
          {
            name: "Authority Gap",
            description:
              "Missing credentials, awards, press mentions, or expertise signals make you look like an amateur operation.",
          },
          {
            name: "Hidden Identity",
            description:
              "No team photos, no about page, no real human presence—visitors wonder if you're legitimate or a fly-by-night operation.",
          },
        ],
        roadmap: [
          {
            step: 1,
            action: "Add testimonials above the fold",
            details:
              "Place 2-3 powerful customer quotes with photos, names, and companies on your homepage.",
            tools: ["Customer interviews", "Video testimonials"],
          },
          {
            step: 2,
            action: "Showcase traction metrics",
            details:
              "Display real numbers: customers served, revenue generated, time saved—specificity builds trust.",
            tools: ["Analytics dashboard", "Customer success stories"],
          },
          {
            step: 3,
            action: "Build an about page that humanizes",
            details:
              "Show your team, share your story, explain why you exist—people buy from people.",
            tools: ["Team photos", "Founder story", "Company timeline"],
          },
        ],
      },
    },
    {
      number: "04",
      title: "The AI Visibility Blindspot",
      subtitle: "Missing the Highest-Intent Traffic Source",
      icon: <Bot className="h-8 w-8" />,
      color: "green",
      content: {
        definition:
          "AI Visibility is your brand's presence in AI assistant responses (ChatGPT, Claude, Gemini). When AI tools recommend solutions like yours, those referred visitors convert 3-5x higher because they arrive pre-qualified and pre-trusting.",
        keyPoints: [
          "AI referrals are the highest-intent traffic you can get",
          "If AI doesn't mention you, you're invisible to millions of queries",
          "AI-cited brands get 89% higher conversion rates",
          "Answer Engine Optimization (AEO) is the new frontier",
          "Your competitors are optimizing for AI—silence is surrender",
        ],
        stats: [
          { value: "50%+", label: "of searches via AI by 2026" },
          { value: "3-5x", label: "higher conversion from AI referrals" },
          { value: "89%", label: "more trust in AI-cited brands" },
        ],
        example: {
          scenario:
            "Someone asks: 'What's the best positioning tool for startups?'",
          problem:
            "ChatGPT lists 3 competitors but never mentions your brand. You just lost a high-intent buyer.",
          solution:
            "ChatGPT responds: 'LaunchRecord offers AI-powered positioning audits with SIO-V5 scoring. It's built specifically for early-stage startups.' You just gained a qualified lead.",
        },
        mechanisms: [
          {
            name: "Entity Recognition Failure",
            description:
              "AI systems don't recognize your brand as authoritative in your category because you haven't built entity signals.",
          },
          {
            name: "Content Structure Gap",
            description:
              "Your content isn't optimized for how AI parses information—missing schema markup, FAQs, and semantic structure.",
          },
          {
            name: "Authority Deficit",
            description:
              "AI prioritizes sources with clear expertise signals: backlinks, mentions, structured data, and consistent messaging.",
          },
        ],
        roadmap: [
          {
            step: 1,
            action: "Audit your AI visibility",
            details:
              "Ask ChatGPT, Claude, and Gemini about your category. Note who they mention and why.",
            tools: ["SIO-V5 Audit", "AI mention tracking"],
          },
          {
            step: 2,
            action: "Implement schema markup",
            details:
              "Add structured data (FAQ, Organization, Product schemas) to help AI understand your content.",
            tools: ["JSON-LD markup", "Schema.org validators"],
          },
          {
            step: 3,
            action: "Build entity authority",
            details:
              "Create definitive content about your category, get mentioned by authoritative sites, and maintain consistent messaging.",
            tools: [
              "Thought leadership content",
              "PR campaigns",
              "Partnership announcements",
            ],
          },
        ],
      },
    },
    {
      number: "05",
      title: "The Friction Killers",
      subtitle: "Small Things That Destroy Momentum",
      icon: <AlertTriangle className="h-8 w-8" />,
      color: "purple",
      content: {
        definition:
          "Even with perfect positioning, messaging, and trust, friction in your user journey can kill conversions. These are the small details that visitors notice but founders overlook.",
        keyPoints: [
          "Slow page loads (>3s) kill 40% of conversions",
          "Complex signup forms reduce completion by 50%+",
          "Mobile-unfriendly design loses 60% of traffic",
          "No clear CTA or multiple competing CTAs create paralysis",
          "Asking for credit card too early triggers abandonment",
        ],
        stats: [
          { value: "1s delay", label: "= 7% less conversions" },
          { value: "4+", label: "form fields = 50% drop-off" },
          { value: "60%", label: "of traffic is mobile" },
        ],
        mechanisms: [
          {
            name: "Form Fatigue",
            description:
              "Asking for too much information upfront creates psychological friction. Only ask for what's absolutely necessary.",
          },
          {
            name: "Choice Overload",
            description:
              "Multiple CTAs ('Learn More', 'Compare Plans', 'See Demo', 'Sign Up') create decision paralysis. One primary action per page.",
          },
          {
            name: "Speed Bumps",
            description:
              "Slow loading, broken links, confusing navigation, and technical errors signal 'amateur hour' and destroy trust.",
          },
        ],
        roadmap: [
          {
            step: 1,
            action: "Simplify your signup flow",
            details:
              "Reduce to email + password max. Offer Google/SSO login. Defer profile completion until after value delivery.",
            tools: ["NextAuth", "Social login providers"],
          },
          {
            step: 2,
            action: "Optimize page speed",
            details:
              "Compress images, lazy load content, minimize JavaScript. Every 100ms improvement matters.",
            tools: ["Lighthouse", "Web Vitals monitoring"],
          },
          {
            step: 3,
            action: "Design mobile-first",
            details:
              "60%+ of your traffic is mobile. If your site isn't perfect on phones, you're hemorrhaging conversions.",
            tools: ["Responsive testing", "Mobile analytics"],
          },
        ],
      },
    },
  ];

  const getColorClasses = (color: string, type: "bg" | "border" | "text") => {
    const colorMap: Record<string, Record<string, string>> = {
      red: {
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-600",
      },
      orange: {
        bg: "bg-orange-50",
        border: "border-orange-200",
        text: "text-orange-600",
      },
      blue: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-600",
      },
      green: {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-600",
      },
      purple: {
        bg: "bg-purple-50",
        border: "border-purple-200",
        text: "text-purple-600",
      },
    };
    return colorMap[color]?.[type] || "";
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.08),transparent_50%)]" />
        <div className="relative mx-auto max-w-5xl px-6">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
              <TrendingDown className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                Conversion Crisis
              </span>
            </div>

            <h1 className="mb-6 text-5xl font-black leading-tight tracking-tighter text-slate-900 md:text-6xl">
              Why You Got Traffic{" "}
              <span className="text-primary">But No Signup</span>
            </h1>

            <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-slate-600">
              Your website gets visitors. Your content is decent. But nobody's
              signing up. The problem isn't your product—it's your{" "}
              <strong className="text-slate-900">
                positioning, messaging, and AI visibility
              </strong>
              . Here's how to fix it.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <form
                onSubmit={handleStartAudit}
                className="flex w-full gap-2 sm:w-auto"
              >
                <input
                  type="text"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="Enter your website URL"
                  className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:w-80"
                />
                <Button
                  type="submit"
                  className="h-12 bg-primary px-6 font-bold uppercase tracking-wider hover:bg-primary/90"
                >
                  Audit My Site
                </Button>
              </form>
              <Button
                asChild
                variant="outline"
                className="h-12 border-slate-300 px-6 font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50"
              >
                <Link href="/pricing">
                  See Pricing <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              Free positioning & messaging analysis • Results in 60 seconds
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="prose prose-lg max-w-none">
            <p className="text-xl leading-relaxed text-slate-700">
              You've driven traffic through SEO, content marketing, maybe even
              paid ads. The analytics dashboard shows hundreds of visitors. But
              your signup page? <strong>Crickets.</strong>
            </p>

            <p className="text-lg leading-relaxed text-slate-600">
              This isn't a traffic problem. It's not a product problem. It's a{" "}
              <strong className="text-slate-900">
                positioning and messaging problem
              </strong>
              . Your visitors don't understand what you do, why it matters to
              them, or why they should trust you over alternatives they already
              know.
            </p>

            <p className="text-lg leading-relaxed text-slate-600">
              In this guide, we'll expose the{" "}
              <strong className="text-slate-900">5 hidden reasons</strong> your
              traffic isn't converting—and give you actionable steps to fix each
              one. By the end, you'll know exactly what to change to turn
              browsers into buyers.
            </p>
          </div>
        </div>
      </section>

      {/* Main Insights */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-black tracking-tight text-slate-900">
              The 5 Conversion Killers
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              Each section reveals a different reason your visitors aren't
              signing up—and exactly how to fix it.
            </p>
          </div>

          <div className="space-y-20">
            {insights.map((insight, index) => (
              <div
                key={index}
                id={`insight-${insight.number}`}
                className="scroll-mt-24"
              >
                <div
                  className={`rounded-2xl border-2 ${getColorClasses(insight.color, "border")} bg-white p-8 shadow-sm md:p-12`}
                >
                  {/* Section Header */}
                  <div className="mb-8 flex items-start gap-4">
                    <div
                      className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl ${getColorClasses(insight.color, "bg")}`}
                    >
                      <div className={getColorClasses(insight.color, "text")}>
                        {insight.icon}
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-sm font-mono font-bold uppercase tracking-widest text-slate-500">
                        {insight.number}
                      </div>
                      <h3 className="mb-2 text-3xl font-black text-slate-900">
                        {insight.title}
                      </h3>
                      <p className="text-lg text-slate-600">
                        {insight.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Definition */}
                  <div className="mb-8 rounded-xl bg-slate-50 p-6">
                    <p className="text-lg leading-relaxed text-slate-700">
                      {insight.content.definition}
                    </p>
                  </div>

                  {/* Stats */}
                  {insight.content.stats && (
                    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                      {insight.content.stats.map((stat, i) => (
                        <div
                          key={i}
                          className={`rounded-lg border ${getColorClasses(insight.color, "border")} ${getColorClasses(insight.color, "bg")} p-4 text-center`}
                        >
                          <div
                            className={`text-3xl font-black ${getColorClasses(insight.color, "text")}`}
                          >
                            {stat.value}
                          </div>
                          <div className="mt-1 text-sm font-medium text-slate-700">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Key Points */}
                  {insight.content.keyPoints && (
                    <div className="mb-8">
                      <h4 className="mb-4 text-lg font-bold uppercase tracking-wide text-slate-900">
                        Key Insights
                      </h4>
                      <div className="space-y-3">
                        {insight.content.keyPoints.map((point, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                            <p className="text-slate-700">{point}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Example */}
                  {insight.content.example && (
                    <div className="mb-8 grid gap-6 md:grid-cols-3">
                      <div className="rounded-lg bg-slate-50 p-5">
                        <div className="mb-2 text-sm font-bold text-slate-900">
                          Scenario
                        </div>
                        <p className="text-sm text-slate-700">
                          {insight.content.example.scenario}
                        </p>
                      </div>
                      <div className="rounded-lg border border-red-200 bg-red-50 p-5">
                        <div className="mb-2 flex items-center gap-2 text-sm font-bold text-red-700">
                          <XCircle className="h-4 w-4" />
                          Problem
                        </div>
                        <p className="text-sm text-slate-700">
                          {insight.content.example.problem}
                        </p>
                      </div>
                      <div className="rounded-lg border border-green-200 bg-green-50 p-5">
                        <div className="mb-2 flex items-center gap-2 text-sm font-bold text-green-700">
                          <CheckCircle2 className="h-4 w-4" />
                          Solution
                        </div>
                        <p className="text-sm text-slate-700">
                          {insight.content.example.solution}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Mechanisms */}
                  {insight.content.mechanisms && (
                    <div className="mb-8">
                      <h4 className="mb-4 text-lg font-bold uppercase tracking-wide text-slate-900">
                        Why It Happens
                      </h4>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {insight.content.mechanisms.map((mechanism, i) => (
                          <div
                            key={i}
                            className="rounded-lg border border-slate-200 p-5"
                          >
                            <h5 className="mb-2 font-bold text-slate-900">
                              {mechanism.name}
                            </h5>
                            <p className="text-sm leading-relaxed text-slate-600">
                              {mechanism.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Roadmap */}
                  {insight.content.roadmap && (
                    <div>
                      <h4 className="mb-6 text-lg font-bold uppercase tracking-wide text-slate-900">
                        How to Fix It
                      </h4>
                      <div className="space-y-4">
                        {insight.content.roadmap.map((step, i) => (
                          <div
                            key={i}
                            className="flex gap-4 rounded-lg border border-slate-200 p-5"
                          >
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                              {step.step}
                            </div>
                            <div className="flex-1">
                              <h5 className="mb-1 font-bold text-slate-900">
                                {step.action}
                              </h5>
                              <p className="mb-2 text-sm text-slate-600">
                                {step.details}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {step.tools.map((tool, j) => (
                                  <span
                                    key={j}
                                    className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700"
                                  >
                                    {tool}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Real Problem Section */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 py-20 text-white">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
              <Lightbulb className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-semibold">The Real Problem</span>
            </div>

            <h2 className="mb-6 text-4xl font-black tracking-tight md:text-5xl">
              It's Not Your Product.{" "}
              <span className="text-primary">It's Your Positioning.</span>
            </h2>

            <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-slate-300">
              Most founders blame their product, their pricing, or their market.
              But the truth is simpler—and more fixable:{" "}
              <strong className="text-white">
                your visitors don't understand why you're the obvious choice.
              </strong>
            </p>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <Target className="mx-auto mb-4 h-12 w-12 text-primary" />
                <h3 className="mb-2 text-xl font-bold">Positioning</h3>
                <p className="text-sm text-slate-300">
                  Make your value obvious in 5 seconds or lose them forever.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <MessageSquare className="mx-auto mb-4 h-12 w-12 text-primary" />
                <h3 className="mb-2 text-xl font-bold">Messaging</h3>
                <p className="text-sm text-slate-300">
                  Every word should reinforce why visitors should care.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <Bot className="mx-auto mb-4 h-12 w-12 text-primary" />
                <h3 className="mb-2 text-xl font-bold">AI Visibility</h3>
                <p className="text-sm text-slate-300">
                  Get cited by AI and attract pre-qualified, high-intent buyers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-6 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            Ready to Fix Your Conversions?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-600">
            Stop guessing. Get a complete audit of your positioning, messaging,
            and AI visibility with actionable recommendations tailored to your
            startup.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <form
              onSubmit={handleStartAudit}
              className="flex w-full gap-2 sm:w-auto"
            >
              <input
                type="text"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="Enter your website URL"
                className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:w-80"
              />
              <Button
                type="submit"
                className="h-12 bg-primary px-6 font-bold uppercase tracking-wider hover:bg-primary/90"
              >
                Get Your Audit
              </Button>
            </form>
            <Button
              asChild
              variant="outline"
              className="h-12 border-slate-300 px-6 font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50"
            >
              <Link href="/pricing">
                View Plans <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span>Complete positioning analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span>Messaging insights</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span>AI visibility score</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
