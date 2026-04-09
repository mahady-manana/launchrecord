"use client";

import { PricingCard, pricingTiers } from "@/components/pricing/pricing-card";
import { Button } from "@/components/ui/button";
import {
  Award,
  Brain,
  CheckCircle,
  Layers,
  Shield,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";

const coreFeatures = [
  {
    icon: Brain,
    title: "Product Audit Engine",
    description: "AI strategic audit with 5 pillars scoring",
  },
  {
    icon: Target,
    title: "Defensibility Score",
    description: "Know exactly how defensible your product is",
  },
  {
    icon: Shield,
    title: "Positioning Analysis",
    description: "Deep analysis of your market position",
  },
  {
    icon: TrendingUp,
    title: "Historical Tracking",
    description: "Track score and strategy evolution over time",
  },
  {
    icon: Zap,
    title: "Strategic Recommendations",
    description: "AI suggests moat creation and positioning shifts",
  },
  {
    icon: Layers,
    title: "Timeline of Improvements",
    description: "See what improved or declined over time",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto text-center mb-20">
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white leading-[0.9] mb-6">
          Pricing
        </h1>

        <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Get 5 audits for $29 one-time. Or go unlimited with Founder at $49/mo.
        </p>
      </section>

      {/* Core System Section */}
      <section className="max-w-6xl mx-auto mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-4">
            Core System
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            These are the foundation features. Included in all plans.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {coreFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="p-6 bg-slate-900/50 rounded-lg border border-slate-800 hover:border-primary/50 transition-all"
              >
                <Icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pricing Tiers Section */}
      <section className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-4">
            Select Your Plan
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Get one time pass or go unlimited with Founder.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <PricingCard key={index} tier={tier} />
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="max-w-4xl mx-auto mt-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-4">
            Feature Comparison
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left p-4 text-slate-400 font-medium">
                  Feature
                </th>
                <th className="text-center p-4 text-orange-400 font-bold">
                  One-Time $29
                </th>
                <th className="text-center p-4 text-primary font-bold">
                  Founder $49/mo
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-800/50">
                <td className="p-4 text-slate-300">Audits Included</td>
                <td className="text-center p-4 text-orange-400 font-semibold">
                  5
                </td>
                <td className="text-center p-4 text-primary font-semibold">
                  Unlimited
                </td>
              </tr>
              <tr className="border-b border-slate-800/50">
                <td className="p-4 text-slate-300">Full Reports</td>
                <td className="text-center p-4">
                  <CheckCircle className="w-5 h-5 text-primary mx-auto" />
                </td>
                <td className="text-center p-4">
                  <CheckCircle className="w-5 h-5 text-primary mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-slate-800/50">
                <td className="p-4 text-slate-300">
                  Positioning Insights & Fixes
                </td>
                <td className="text-center p-4">
                  <CheckCircle className="w-5 h-5 text-primary mx-auto" />
                </td>
                <td className="text-center p-4">
                  <CheckCircle className="w-5 h-5 text-primary mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-slate-800/50">
                <td className="p-4 text-slate-300">
                  Messaging Insights & Fixes
                </td>
                <td className="text-center p-4">
                  <CheckCircle className="w-5 h-5 text-primary mx-auto" />
                </td>
                <td className="text-center p-4">
                  <CheckCircle className="w-5 h-5 text-primary mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-slate-800/50">
                <td className="p-4 text-slate-300">Weekly Auto Audit</td>
                <td className="text-center p-4">
                  <X className="w-5 h-5 text-slate-700 mx-auto" />
                </td>
                <td className="text-center p-4">
                  <CheckCircle className="w-5 h-5 text-primary mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-slate-800/50">
                <td className="p-4 text-slate-300">Competitor Spy</td>
                <td className="text-center p-4">
                  <X className="w-5 h-5 text-slate-700 mx-auto" />
                </td>
                <td className="text-center p-4">
                  <CheckCircle className="w-5 h-5 text-primary mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-slate-800/50">
                <td className="p-4 text-slate-300">Private Audit Mode</td>
                <td className="text-center p-4">
                  <X className="w-5 h-5 text-slate-700 mx-auto" />
                </td>
                <td className="text-center p-4">
                  <CheckCircle className="w-5 h-5 text-primary mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="p-4 text-slate-300">Historical Analytics</td>
                <td className="text-center p-4">
                  <X className="w-5 h-5 text-slate-700 mx-auto" />
                </td>
                <td className="text-center p-4">
                  <CheckCircle className="w-5 h-5 text-primary mx-auto" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto mt-24 text-center">
        <div className="p-12 bg-gradient-to-b from-primary/10 to-transparent rounded-xl border border-primary/20">
          <Award className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Get 5 audits for $29 one-time, or unlock unlimited with Founder at
            $49/mo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="h-14 px-10 bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-widest"
            >
              <Link href="/register">Get 5 Audits - $29</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-14 px-10 border-slate-700 text-white hover:bg-slate-800 font-bold uppercase tracking-widest"
            >
              <Link href="/register">Start with Founder</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto mt-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-slate-900/50 rounded-lg border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-2">
              What's included in the $29 one-time plan?
            </h3>
            <p className="text-slate-400">
              You get 5 full SIO-V5 audits with complete reports, positioning
              insights & fixes, and Messaging insights & fixes. No subscription
              needed - pay once, use forever.
            </p>
          </div>

          <div className="p-6 bg-slate-900/50 rounded-lg border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-2">
              Can I change plans later?
            </h3>
            <p className="text-slate-400">
              Yes, you can upgrade from One-Time to Founder at any time. If you
              use all 5 audits on the One-Time plan, you can upgrade to Founder
              for unlimited audits.
            </p>
          </div>

          <div className="p-6 bg-slate-900/50 rounded-lg border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-2">
              What payment methods do you accept?
            </h3>
            <p className="text-slate-400">
              We accept all major credit cards (Visa, MasterCard, American
              Express) and process payments securely through Stripe.
            </p>
          </div>

          <div className="p-6 bg-slate-900/50 rounded-lg border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-2">
              Can I cancel the Founder subscription anytime?
            </h3>
            <p className="text-slate-400">
              Absolutely. You can cancel your subscription at any time with no
              questions asked. Your account remains active until the end of your
              billing period.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

// Simple X icon component for the comparison table
function X({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
