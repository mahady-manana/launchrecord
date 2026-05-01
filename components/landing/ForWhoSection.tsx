"use client";

import { Briefcase, Crown, Rocket, Target, X } from "lucide-react";
import Link from "next/link";

interface Audience {
  title: string;
  description: string;
  icon: React.ReactNode;
  painPoint: string;
}

const audiences: Audience[] = [
  {
    title: "Startup Founders",
    description:
      "You're building a SaaS and you care about being irreplaceable in the age of AI. You need to know your positioning is defensible before you burn runway on the wrong features.",
    icon: <Rocket className="h-8 w-8" />,
    painPoint: "Invisible to LLMs, commodity positioning",
  },
  {
    title: "Product Leaders",
    description:
      "You own the roadmap. You need data-driven insights to prioritize features that compound defensibility, not features that make you look like everyone else.",
    icon: <Target className="h-8 w-8" />,
    painPoint: "Positioning debt, feature convergence",
  },
  {
    title: "Strategic Planners",
    description:
      "You're responsible for competitive intelligence and market positioning. You need a weapon against commoditization and a system to track your moat.",
    icon: <Briefcase className="h-8 w-8" />,
    painPoint: "Competitive blind spots, weak moats",
  },
  {
    title: "Sovereign Founders",
    description:
      "You refuse to be commoditized. You want ongoing defensibility tracking, not a one-time audit. You're ready to execute weekly missions and climb the Sovereign 100.",
    icon: <Crown className="h-8 w-8" />,
    painPoint: "Ongoing defensibility, proof density",
  },
];

export function ForWhoSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tighter">
            Who Is This For?
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            LaunchRecord is built for founders who refuse to be deleted by AI or
            out-positioned by competitors.
          </p>
        </div>

        {/* Audience Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          {audiences.map((audience, index) => (
            <div
              key={index}
              className="relative group bg-white border border-slate-200 hover:border-primary/50 rounded-xl p-8 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-6">
                {audience.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight mb-3">
                {audience.title}
              </h3>

              {/* Pain Point Badge */}
              {/* <div className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold tracking-wider mb-4">
                Pain: {audience.painPoint}
              </div> */}

              {/* Description */}
              <p className="text-slate-700 leading-relaxed">
                {audience.description}
              </p>
            </div>
          ))}
        </div>

        {/* Who It's NOT For */}
        <div className="bg-white border border-slate-200 rounded-xl p-8 md:p-12 shadow-sm">
          <h3 className="text-2xl font-bold text-slate-900 uppercase tracking-tight mb-6">
            Who This Is NOT For
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <X className="w-5 h-5 text-red-600" />
              </div>
              <h4 className="font-bold text-slate-900">
                Generic Advice Seekers
              </h4>
              <p className="text-slate-600 text-sm">
                We don't do fluff. We give you cold data and brutal truths.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <X className="w-5 h-5 text-red-600" />
              </div>
              <h4 className="font-bold text-slate-900">Growth Hackers Only</h4>
              <p className="text-slate-600 text-sm">
                Growth won't save bad positioning. Fix the foundation first.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <X className="w-5 h-5 text-red-600" />
              </div>
              <h4 className="font-bold text-slate-900">
                One-Time Audit Buyers
              </h4>
              <p className="text-slate-600 text-sm">
                Defensibility is ongoing. If you want a PDF and goodbye, this
                isn't for you.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/sio-audit"
            className="inline-flex items-center gap-2 bg-secondary text-white px-8 py-4 rounded-lg font-bold uppercase tracking-wider hover:bg-secondary/90 transition-colors shadow-md"
          >
            See If You're Sovereign
          </Link>
        </div>
      </div>
    </section>
  );
}
