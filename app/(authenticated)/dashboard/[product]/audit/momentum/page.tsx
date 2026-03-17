"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  ArrowLeft,
  Award,
  BarChart3,
  Flame,
  Rocket,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function MomentumAuditPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.product as string;
  const [isRunning, setIsRunning] = useState(false);

  const handleRunAudit = () => {
    alert("Momentum Audit is coming soon! AEO Audit is currently available.");
  };

  return (
    <div className="space-y-8">
      {/* Header - Orange/Red gradient theme */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold">Momentum Audit</h1>
              <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                <Flame className="h-3 w-3 mr-1" />
                Growth Signals
              </Badge>
            </div>
            <p className="text-slate-500">
              Is your startup moving or stagnating?
            </p>
          </div>
        </div>
        <Button
          onClick={handleRunAudit}
          disabled={isRunning}
          className="bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700 relative"
        >
          {isRunning ? (
            <>
              <Activity className="h-4 w-4 mr-2 animate-spin" />
              Measuring...
            </>
          ) : (
            <>
              <TrendingUp className="h-4 w-4 mr-2" />
              Measure Momentum
              <span className="ml-2 px-2 py-0.5 bg-white/20 text-white text-xs font-medium rounded-full">
                Coming Soon
              </span>
            </>
          )}
        </Button>
      </div>

      {/* Hero - Dark theme with momentum visualization */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-orange-900 to-red-900 rounded-2xl p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />

        <div className="relative z-10">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-orange-500/20 rounded-xl">
              <Rocket className="h-8 w-8 text-orange-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">
                Growth Trajectory Analysis
              </h2>
              <p className="text-orange-100">
                Measure your startup's velocity, market signals, and traction
                evidence. Momentum attracts customers, talent, and capital.
              </p>
            </div>
          </div>

          {/* Momentum gauge visualization */}
          <div className="flex items-end gap-2 mb-6 h-24">
            {[20, 40, 60, 80, 100].map((level, idx) => (
              <div
                key={idx}
                className="flex-1 rounded-t-lg transition-all"
                style={{
                  height: `${level}%`,
                  background:
                    level <= 20
                      ? "#ef4444"
                      : level <= 40
                        ? "#f97316"
                        : level <= 60
                          ? "#eab308"
                          : level <= 80
                            ? "#22c55e"
                            : "#10b981",
                }}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-orange-200/70 mb-6">
            <span>Dead</span>
            <span>Flat</span>
            <span>Stable</span>
            <span>Rising</span>
            <span>Viral</span>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">6</div>
              <div className="text-sm text-orange-100">Momentum Signals</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">5</div>
              <div className="text-sm text-orange-100">Growth Bands</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">∞</div>
              <div className="text-sm text-orange-100">Growth Potential</div>
            </div>
          </div>
        </div>
      </div>

      {/* Momentum Spectrum */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-orange-600" />
            Momentum Spectrum
          </CardTitle>
          <CardDescription>
            Where does your startup fall on the growth spectrum?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-5 gap-3">
            {[
              {
                name: "Viral",
                score: "90-100",
                desc: "Exponential growth",
                gradient: "from-emerald-500 to-green-600",
              },
              {
                name: "Rising",
                score: "70-89",
                desc: "Strong upward",
                gradient: "from-blue-500 to-indigo-600",
              },
              {
                name: "Stable",
                score: "50-69",
                desc: "Steady growth",
                gradient: "from-yellow-500 to-amber-600",
              },
              {
                name: "Flat",
                score: "30-49",
                desc: "Minimal growth",
                gradient: "from-orange-500 to-red-600",
              },
              {
                name: "Dead",
                score: "0-29",
                desc: "No momentum",
                gradient: "from-red-600 to-rose-800",
              },
            ].map((band, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-br ${band.gradient} rounded-xl p-4 text-white text-center transform hover:scale-105 transition-transform`}
                style={{ transform: `translateY(${idx * -6}px)` }}
              >
                <div className="text-lg font-bold">{band.name}</div>
                <div className="text-xs opacity-80 mb-1">{band.score}</div>
                <div className="text-xs opacity-70">{band.desc}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Growth Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>Growth Indicators</CardTitle>
          <CardDescription>
            Six signals that reveal your trajectory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                icon: <Rocket className="h-5 w-5" />,
                label: "Growth Trajectory",
                desc: "Direction and velocity",
                color: "text-blue-600 bg-blue-100",
              },
              {
                icon: <BarChart3 className="h-5 w-5" />,
                label: "Market Signals",
                desc: "Press, partnerships",
                color: "text-indigo-600 bg-indigo-100",
              },
              {
                icon: <Activity className="h-5 w-5" />,
                label: "User Engagement",
                desc: "Active usage metrics",
                color: "text-purple-600 bg-purple-100",
              },
              {
                icon: <Flame className="h-5 w-5" />,
                label: "Competitive Velocity",
                desc: "Growth vs competitors",
                color: "text-orange-600 bg-orange-100",
              },
              {
                icon: <Award className="h-5 w-5" />,
                label: "Traction Evidence",
                desc: "Metrics, logos, wins",
                color: "text-yellow-600 bg-yellow-100",
              },
              {
                icon: <Zap className="h-5 w-5" />,
                label: "Velocity Indicators",
                desc: "Acceleration signals",
                color: "text-red-600 bg-red-100",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 hover:border-orange-300 transition-colors"
              >
                <div
                  className={`h-10 w-10 rounded-lg flex items-center justify-center ${item.color}`}
                >
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

      {/* Diagnostic Questions */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-orange-900">
            Momentum Diagnostics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {[
              "Can you show month-over-month growth?",
              "Are customers actively using your product?",
              "Do you have visible traction evidence?",
              "Are you gaining or losing vs competitors?",
            ].map((question, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {idx + 1}
                </div>
                <span className="text-orange-800">{question}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Quick Link */}
      <Card>
        <CardContent className="pt-6">
          <Link href="/momentum-audit" target="_blank">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                <ExternalLink className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Public Version</h4>
                <p className="text-sm text-slate-500">View public audit page</p>
              </div>
              <Button variant="outline" size="sm">
                Open
              </Button>
            </div>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

function ExternalLink(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
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
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
