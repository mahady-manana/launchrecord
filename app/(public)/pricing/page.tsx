"use client";

import {
  PricingCard,
  coreSystemFeatures,
  pricingTiers,
} from "@/components/pricing/pricing-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Target,
  Shield,
  TrendingUp,
  Zap,
  Layers,
  Award,
  CheckCircle,
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
        <Badge
          variant="outline"
          className="font-mono text-xs tracking-[0.2em] uppercase py-1.5 px-6 border-primary/50 text-primary bg-primary/5 mb-6"
        >
          ● PRICING: INVEST IN YOUR SOVEREIGNTY
        </Badge>

        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white leading-[0.9] mb-6">
          Choose Your <span className="text-primary">War Room</span>
        </h1>

        <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Every plan includes the Core System. Upgrade to unlock competitive
          intelligence and strategic warfare capabilities.
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
            Select Your Tier
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Start with Founder. Upgrade as you scale. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <PricingCard key={index} tier={tier} />
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="max-w-6xl mx-auto mt-24">
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
                <th className="text-center p-4 text-white font-bold">
                  Founder
                </th>
                <th className="text-center p-4 text-primary font-bold">
                  Growth
                </th>
                <th className="text-center p-4 text-primary font-bold">
                  Sovereign
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-800/50">
                <td className="p-4 text-slate-300">Products</td>
                <td className="text-center p-4 text-slate-400">1</td>
                <td className="text-center p-4 text-slate-400">1</td>
                <td className="text-center p-4 text-slate-400">1</td>
              </tr>
              <tr className="border-b border-slate-800/50">
                <td className="p-4 text-slate-300">Team Members</td>
                <td className="text-center p-4 text-slate-400">5</td>
                <td className="text-center p-4 text-slate-400">10</td>
                <td className="text-center p-4 text-slate-400">20</td>
              </tr>
              <tr className="border-b border-slate-800/50">
                <td className="p-4 text-slate-300">Competitors Monitored</td>
                <td className="text-center p-4 text-slate-400">5</td>
                <td className="text-center p-4 text-slate-400">10</td>
                <td className="text-center p-4 text-slate-400">20</td>
              </tr>
              <tr className="border-b border-slate-800/50">
                <td className="p-4 text-slate-300">Weekly Auto Audit</td>
                <td className="text-center p-4">
                  <CheckCircle className="w-5 h-5 text-primary mx-auto" />
                </td>
                <td className="text-center p-4">
                  <CheckCircle className="w-5 h-5 text-primary mx-auto" />
                </td>
                <td className="text-center p-4">
                  <CheckCircle className="w-5 h-5 text-primary mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-slate-800/50">
                <td className="p-4 text-slate-300">Competitor Change Alerts</td>
                <td className="text-center p-4">
                  <X className="w-5 h-5 text-slate-700 mx-auto" />
                </td>
                <td className="text-center p-4">
                  <CheckCircle className="w-5 h-5 text-primary mx-auto" />
                </td>
                <td className="text-center p-4">
                  <CheckCircle className="w-5 h-5 text-primary mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-slate-800/50">
                <td className="p-4 text-slate-300">Investor Report Generator</td>
                <td className="text-center p-4">
                  <X className="w-5 h-5 text-slate-700 mx-auto" />
                </td>
                <td className="text-center p-4">
                  <CheckCircle className="w-5 h-5 text-primary mx-auto" />
                </td>
                <td className="text-center p-4">
                  <CheckCircle className="w-5 h-5 text-primary mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-slate-800/50">
                <td className="p-4 text-slate-300">Strategy Sandbox</td>
                <td className="text-center p-4">
                  <X className="w-5 h-5 text-slate-700 mx-auto" />
                </td>
                <td className="text-center p-4">
                  <X className="w-5 h-5 text-slate-700 mx-auto" />
                </td>
                <td className="text-center p-4">
                  <CheckCircle className="w-5 h-5 text-primary mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-slate-800/50">
                <td className="p-4 text-slate-300">Defensibility Delta Engine</td>
                <td className="text-center p-4">
                  <X className="w-5 h-5 text-slate-700 mx-auto" />
                </td>
                <td className="text-center p-4">
                  <X className="w-5 h-5 text-slate-700 mx-auto" />
                </td>
                <td className="text-center p-4">
                  <CheckCircle className="w-5 h-5 text-primary mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-slate-800/50">
                <td className="p-4 text-slate-300">Founder War Room</td>
                <td className="text-center p-4">
                  <X className="w-5 h-5 text-slate-700 mx-auto" />
                </td>
                <td className="text-center p-4">
                  <X className="w-5 h-5 text-slate-700 mx-auto" />
                </td>
                <td className="text-center p-4">
                  <CheckCircle className="w-5 h-5 text-primary mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-slate-800/50">
                <td className="p-4 text-slate-300">Strategic Moat Generator</td>
                <td className="text-center p-4">
                  <X className="w-5 h-5 text-slate-700 mx-auto" />
                </td>
                <td className="text-center p-4">
                  <X className="w-5 h-5 text-slate-700 mx-auto" />
                </td>
                <td className="text-center p-4">
                  <CheckCircle className="w-5 h-5 text-primary mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="p-4 text-slate-300">VC-Ready Strategic Dossier</td>
                <td className="text-center p-4">
                  <X className="w-5 h-5 text-slate-700 mx-auto" />
                </td>
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
            Ready to Claim Your Sovereignty?
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Join 100+ Sovereign Founders who refuse to be commoditized. Start
            your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="h-14 px-10 bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest"
            >
              <Link href="/register">Start Free Trial</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-14 px-10 border-slate-700 text-white hover:bg-slate-800 font-bold uppercase tracking-widest"
            >
              <Link href="/survey">Get Free Audit</Link>
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
              Can I change plans later?
            </h3>
            <p className="text-slate-400">
              Yes, you can upgrade or downgrade your plan at any time. Changes
              take effect immediately and pricing is prorated.
            </p>
          </div>

          <div className="p-6 bg-slate-900/50 rounded-lg border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-2">
              Is there a free trial?
            </h3>
            <p className="text-slate-400">
              Yes, all plans come with a 14-day free trial. No credit card
              required to start.
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
              Can I cancel anytime?
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
