"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { PillarConfig } from "@/lib/pillar-audit-service";

interface PillarHeroProps {
  pillar: PillarConfig;
  pageTitle: string;
  pageDescription: string;
}

export function PillarHero({
  pillar,
  pageTitle,
  pageDescription,
}: PillarHeroProps) {
  const [websiteUrl, setWebsiteUrl] = useState("");

  const handleStartAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (websiteUrl) {
      window.location.href = `/survey?url=${encodeURIComponent(websiteUrl)}&pillar=${pillar.slug}`;
    }
  };

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${pillar.gradientFrom} ${pillar.gradientTo} py-24 sm:py-32`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-white text-sm font-medium">
            <CheckCircle2 className="h-4 w-4" />
            <span>Free {pillar.name} Audit</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            {pageTitle}
          </h1>

          {/* Description */}
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            {pageDescription}
          </p>

          {/* URL Input Form */}
          <form
            onSubmit={handleStartAudit}
            className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
          >
            <input
              type="text"
              placeholder="www.yourstartup.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="flex-1 px-6 py-4 bg-white text-slate-900 rounded-lg font-medium focus:ring-2 focus:ring-white/50 transition-all outline-none"
              required
            />
            <Button
              type="submit"
              className="h-14 px-8 bg-slate-900 text-white hover:bg-slate-800 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
            >
              Start Audit
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-6 text-sm text-white/80">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Free initial audit
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              No credit card
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              2-3 minute results
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
