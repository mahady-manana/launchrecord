"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, BadgeCheck, Award, Star, Users, Quote, Zap, Heart } from "lucide-react";
import Link from "next/link";

export default function FounderProofAuditPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.product as string;
  const [isRunning, setIsRunning] = useState(false);

  const handleRunAudit = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header - Purple/Pink gradient theme */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold">Founder Proof Audit</h1>
              <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                <Heart className="h-3 w-3 mr-1" />
                Trust & Credibility
              </Badge>
            </div>
            <p className="text-slate-500">Do they trust you enough to buy?</p>
          </div>
        </div>
        <Button
          onClick={handleRunAudit}
          disabled={isRunning}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
        >
          {isRunning ? (
            <>
              <Zap className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <BadgeCheck className="h-4 w-4 mr-2" />
              Audit Credibility
            </>
          )}
        </Button>
      </div>

      {/* Hero - Elegant trust theme */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 rounded-2xl p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-white/20 rounded-xl">
              <Shield className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Trust Architecture</h2>
              <p className="text-purple-100">
                Visitors need reasons to believe. Social proof, authority signals, 
                and credibility markers convert skepticism into trust.
              </p>
            </div>
          </div>
          
          {/* Trust pillars visual */}
          <div className="grid grid-cols-5 gap-3 mb-6">
            {[
              { icon: <BadgeCheck className="h-6 w-6" />, label: "Authority" },
              { icon: <Users className="h-6 w-6" />, label: "Proof" },
              { icon: <Star className="h-6 w-6" />, label: "Evidence" },
              { icon: <Award className="h-6 w-6" />, label: "Signals" },
              { icon: <Shield className="h-6 w-6" />, label: "Trust" },
            ].map((pillar, idx) => (
              <div key={idx} className="text-center">
                <div className="h-14 w-14 mx-auto mb-2 rounded-xl bg-white/20 flex items-center justify-center">
                  {pillar.icon}
                </div>
                <div className="text-xs">{pillar.label}</div>
              </div>
            ))}
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">5</div>
              <div className="text-sm text-purple-100">Trust Pillars</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">6</div>
              <div className="text-sm text-purple-100">Proof Elements</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">5</div>
              <div className="text-sm text-purple-100">Credibility Levels</div>
            </div>
          </div>
        </div>
      </div>

      {/* Credibility Levels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-600" />
            Credibility Spectrum
          </CardTitle>
          <CardDescription>How much trust do visitors place in you?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { level: "Verified", score: "90-100", desc: "Strong authority with abundant proof", color: "from-emerald-500 to-green-600", icon: <BadgeCheck className="h-5 w-5" /> },
              { level: "Strong", score: "70-89", desc: "Clear credibility signals", color: "from-blue-500 to-indigo-600", icon: <CheckCircle className="h-5 w-5" /> },
              { level: "Moderate", score: "50-69", desc: "Some proof, not comprehensive", color: "from-yellow-500 to-amber-600", icon: <Star className="h-5 w-5" /> },
              { level: "Weak", score: "30-49", desc: "Limited social proof", color: "from-orange-500 to-red-600", icon: <Award className="h-5 w-5" /> },
              { level: "Absent", score: "0-29", desc: "No visible proof elements", color: "from-red-600 to-rose-700", icon: <Shield className="h-5 w-5" /> },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-purple-300 transition-colors">
                <div className={`h-12 w-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-semibold">{item.level}</h4>
                    <Badge variant="outline" className="text-xs">{item.score}</Badge>
                  </div>
                  <p className="text-sm text-slate-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Proof Elements */}
      <Card>
        <CardHeader>
          <CardTitle>Proof Elements We Analyze</CardTitle>
          <CardDescription>Six credibility markers that build trust</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: <Quote className="h-5 w-5" />, label: "Testimonials", desc: "Customer quotes & endorsements", color: "text-purple-600 bg-purple-100" },
              { icon: <Users className="h-5 w-5" />, label: "Case Studies", desc: "Detailed success stories", color: "text-pink-600 bg-pink-100" },
              { icon: <Award className="h-5 w-5" />, label: "Metrics", desc: "Specific numbers & outcomes", color: "text-rose-600 bg-rose-100" },
              { icon: <BadgeCheck className="h-5 w-5" />, label: "Press Features", desc: "Media coverage & mentions", color: "text-orange-600 bg-orange-100" },
              { icon: <Star className="h-5 w-5" />, label: "Trust Badges", desc: "Security & guarantees", color: "text-yellow-600 bg-yellow-100" },
              { icon: <Heart className="h-5 w-5" />, label: "Founder Story", desc: "Origin & expertise", color: "text-red-600 bg-red-100" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 hover:border-purple-300 transition-colors">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${item.color}`}>
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">{item.label}</h4>
                  <p className="text-sm text-slate-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trust Questions */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="text-purple-900">Trust Diagnostics</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {[
              "Do you have visible customer testimonials?",
              "Is your founder story compelling and credible?",
              "Are there specific metrics and outcomes shown?",
              "Do you have third-party validation (press, awards)?",
            ].map((question, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {idx + 1}
                </div>
                <span className="text-purple-800">{question}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Quick Link */}
      <Card>
        <CardContent className="pt-6">
          <Link href="/founder-proof-audit" target="_blank">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                <ExternalLink className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Public Version</h4>
                <p className="text-sm text-slate-500">View public audit page</p>
              </div>
              <Button variant="outline" size="sm">Open</Button>
            </div>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

function CheckCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function ExternalLink(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
