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
  ArrowLeft,
  ArrowUpRight,
  CheckCircle,
  Clock,
  Eye,
  Layout,
  MessageSquare,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ClarityAuditPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.product as string;
  const [isRunning, setIsRunning] = useState(false);

  const handleRunAudit = () => {
    alert(
      "Product Clarity Audit is coming soon! AEO Audit is currently available.",
    );
  };

  return (
    <div className="space-y-8">
      {/* Header - Green gradient theme */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold">Product Clarity Audit</h1>
              <Badge className="bg-green-100 text-green-700 border-green-200">
                <Clock className="h-3 w-3 mr-1" />
                5-Second Test
              </Badge>
            </div>
            <p className="text-slate-500">
              If they don't get it in 5 seconds, they're gone
            </p>
          </div>
        </div>
        <Button
          onClick={handleRunAudit}
          disabled={isRunning}
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 relative"
        >
          {isRunning ? (
            <>
              <Zap className="h-4 w-4 mr-2 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Test Clarity
              <span className="ml-2 px-2 py-0.5 bg-white/20 text-white text-xs font-medium rounded-full">
                Coming Soon
              </span>
            </>
          )}
        </Button>
      </div>

      {/* Hero - 5-second countdown visual */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-2xl p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-white/20 rounded-xl">
              <Eye className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">The 5-Second Rule</h2>
              <p className="text-green-100">
                Visitors decide in seconds whether to stay or leave. Your
                clarity determines conversion.
              </p>
            </div>
          </div>

          {/* Countdown visual */}
          <div className="flex items-center gap-3 mb-6">
            {[1, 2, 3, 4, 5].map((sec) => (
              <div
                key={sec}
                className={`h-12 w-12 rounded-full border-2 flex items-center justify-center text-lg font-bold ${
                  sec <= 3
                    ? "bg-white text-green-600 border-white"
                    : "border-white/50 text-white/70"
                }`}
              >
                {sec}
              </div>
            ))}
            <span className="text-green-100 ml-2">seconds to impress</span>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">6</div>
              <div className="text-sm text-green-100">Clarity Signals</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">&lt;5s</div>
              <div className="text-sm text-green-100">Target Time</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">5</div>
              <div className="text-sm text-green-100">Clarity Levels</div>
            </div>
          </div>
        </div>
      </div>

      {/* Clarity Levels - Timeline style */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-green-600" />
            Clarity Levels
          </CardTitle>
          <CardDescription>
            How quickly do visitors understand your value?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                level: "Instant",
                time: "&lt;3 sec",
                desc: "Crystal clear value proposition",
                color: "bg-green-500",
              },
              {
                level: "Clear",
                time: "3-5 sec",
                desc: "Value understood quickly",
                color: "bg-emerald-500",
              },
              {
                level: "Average",
                time: "5-10 sec",
                desc: "Some friction exists",
                color: "bg-yellow-500",
              },
              {
                level: "Confusing",
                time: "10-20 sec",
                desc: "Visitors struggle",
                color: "bg-orange-500",
              },
              {
                level: "Opaque",
                time: "&gt;20 sec",
                desc: "Completely unclear",
                color: "bg-red-500",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-green-300 transition-colors"
              >
                <div
                  className={`h-12 w-12 ${item.color} rounded-lg flex items-center justify-center text-white font-bold`}
                >
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{item.level}</h4>
                    <Badge variant="outline" className="text-xs">
                      {item.time}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600">{item.desc}</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-slate-400" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* What We Analyze */}
      <Card>
        <CardHeader>
          <CardTitle>Clarity Dimensions</CardTitle>
          <CardDescription>
            Six elements that determine instant understanding
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: <MessageSquare className="h-5 w-5" />,
                label: "Headline Clarity",
                desc: "Instant headline comprehension",
              },
              {
                icon: <Eye className="h-5 w-5" />,
                label: "Visual Flow",
                desc: "Design guides attention",
              },
              {
                icon: <Layout className="h-5 w-5" />,
                label: "Value Hierarchy",
                desc: "Most important info visible",
              },
              {
                icon: <ArrowUpRight className="h-5 w-5" />,
                label: "Benefit Clarity",
                desc: "Outcomes clearly stated",
              },
              {
                icon: <CheckCircle className="h-5 w-5" />,
                label: "CTA Clarity",
                desc: "Next step is obvious",
              },
              {
                icon: <Clock className="h-5 w-5" />,
                label: "Speed",
                desc: "Fast load = clear message",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-green-50 border border-green-200"
              >
                <div className="text-green-600 mb-2">{item.icon}</div>
                <h4 className="font-semibold text-slate-900 mb-1">
                  {item.label}
                </h4>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Questions */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-900">Critical Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {[
              "Can a stranger explain what you do after 5 seconds?",
              "Is your value proposition above the fold?",
              "Do you lead with benefits or features?",
              "Is the next step obvious and compelling?",
            ].map((question, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-green-200 text-green-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {idx + 1}
                </div>
                <span className="text-green-800">{question}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Quick Link */}
      <Card>
        <CardContent className="pt-6">
          <Link href="/clarity-audit" target="_blank">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
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
