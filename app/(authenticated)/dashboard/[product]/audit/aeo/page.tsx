"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bot, Brain, Search, Eye, Zap, MessageSquare, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AEOAuditPage() {
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
      {/* Header - Cyan/Blue gradient theme */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold">AEO Audit</h1>
              <Badge className="bg-cyan-100 text-cyan-700 border-cyan-200">
                <Bot className="h-3 w-3 mr-1" />
                AI Visibility
              </Badge>
            </div>
            <p className="text-slate-500">Are AI engines recommending you?</p>
          </div>
        </div>
        <Button
          onClick={handleRunAudit}
          disabled={isRunning}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700"
        >
          {isRunning ? (
            <>
              <Brain className="h-4 w-4 mr-2 animate-spin" />
              Scanning AI...
            </>
          ) : (
            <>
              <Bot className="h-4 w-4 mr-2" />
              Run AEO Audit
            </>
          )}
        </Button>
      </div>

      {/* Hero - AI/Technology theme */}
      <div className="relative overflow-hidden bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="relative z-10">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-white/20 rounded-xl">
              <Bot className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">AI Engine Visibility</h2>
              <p className="text-cyan-100">
                50% of searches now end with AI answers. If ChatGPT, Claude, or Gemini 
                can't find and recommend you, you're invisible to half the market.
              </p>
            </div>
          </div>
          
          {/* AI engines visual */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <div className="h-12 w-12 mx-auto mb-2 rounded-lg bg-white/20 flex items-center justify-center">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div className="text-sm font-semibold">ChatGPT</div>
              <div className="text-xs text-cyan-100">OpenAI</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <div className="h-12 w-12 mx-auto mb-2 rounded-lg bg-white/20 flex items-center justify-center">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="text-sm font-semibold">Claude</div>
              <div className="text-xs text-cyan-100">Anthropic</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <div className="h-12 w-12 mx-auto mb-2 rounded-lg bg-white/20 flex items-center justify-center">
                <Brain className="h-6 w-6" />
              </div>
              <div className="text-sm font-semibold">Gemini</div>
              <div className="text-xs text-cyan-100">Google</div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">5</div>
              <div className="text-sm text-cyan-100">AI Metrics</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">3+</div>
              <div className="text-sm text-cyan-100">AI Engines</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">50%</div>
              <div className="text-sm text-cyan-100">AI Search Share</div>
            </div>
          </div>
        </div>
      </div>

      {/* AEO Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-cyan-600" />
            AI Visibility Metrics
          </CardTitle>
          <CardDescription>Five dimensions of AI engine optimization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-5 gap-3">
            {[
              { name: "AI Presence", icon: <Bot className="h-4 w-4" />, desc: "Can AI find you?" },
              { name: "Citations", icon: <MessageSquare className="h-4 w-4" />, desc: "How often cited?" },
              { name: "Semantic", icon: <Brain className="h-4 w-4" />, desc: "Topic authority" },
              { name: "Entity", icon: <Search className="h-4 w-4" />, desc: "Brand recognition" },
              { name: "Recommendation", icon: <Zap className="h-4 w-4" />, desc: "AI suggestion rate" },
            ].map((metric, idx) => (
              <div key={idx} className="text-center p-4 rounded-xl bg-cyan-50 border border-cyan-200 hover:border-cyan-400 transition-colors">
                <div className="h-10 w-10 mx-auto mb-2 rounded-lg bg-cyan-100 flex items-center justify-center text-cyan-600">
                  {metric.icon}
                </div>
                <div className="text-sm font-semibold text-slate-900">{metric.name}</div>
                <div className="text-xs text-slate-500">{metric.desc}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* How AEO Works */}
      <Card>
        <CardHeader>
          <CardTitle>How AEO Works</CardTitle>
          <CardDescription>The AI optimization process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Crawl", desc: "AI bots scan your content", color: "from-cyan-500 to-blue-600" },
              { step: "02", title: "Understand", desc: "Semantic analysis & entity mapping", color: "from-blue-500 to-indigo-600" },
              { step: "03", title: "Index", desc: "Store in AI knowledge base", color: "from-indigo-500 to-purple-600" },
              { step: "04", title: "Retrieve", desc: "Surface in AI responses", color: "from-purple-500 to-pink-600" },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className={`h-16 w-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                  {item.step}
                </div>
                <h4 className="font-semibold text-slate-900 mb-1">{item.title}</h4>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Critical Questions */}
      <Card className="border-cyan-200 bg-cyan-50">
        <CardHeader>
          <CardTitle className="text-cyan-900">AI Visibility Diagnostics</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {[
              "Does ChatGPT know your startup exists?",
              "Are you cited when users ask about your category?",
              "How does AI describe your value proposition?",
              "Do you appear in comparisons with competitors?",
            ].map((question, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-cyan-200 text-cyan-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {idx + 1}
                </div>
                <span className="text-cyan-800">{question}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Stats Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-4xl font-bold text-cyan-400 mb-1">50%</div>
            <div className="text-sm text-slate-300">Searches end with AI answers</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-400 mb-1">74%</div>
            <div className="text-sm text-slate-300">Trust AI recommendations</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-indigo-400 mb-1">3x</div>
            <div className="text-sm text-slate-300">Higher conversion rate</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-400 mb-1">60%</div>
            <div className="text-sm text-slate-300">Gen Z starts with AI</div>
          </div>
        </div>
      </div>

      {/* Quick Link */}
      <Card>
        <CardContent className="pt-6">
          <Link href="/aeo-audit" target="_blank">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-600">
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

function ExternalLink(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
