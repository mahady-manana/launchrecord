"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export function HeroSection() {
  const [websiteUrl, setWebsiteUrl] = useState("");

  const handleStartAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (websiteUrl) {
      window.location.href = `/survey?url=${encodeURIComponent(websiteUrl)}`;
    }
  };

  return (
    <section className="py-12 relative bg-slate-800 min-h-screen flex items-center justify-center">
      <div className="space-y-8 relative px-4 max-w-6xl mx-auto text-center">
        <div className="space-y-4 max-w-4xl">
          <h1 className="text-4xl font-mono md:text-7xl font-semibold tracking-tighter text-slate-100 leading-[1.1]">
            Get a Free Audit to Clarify Your Startup's{" "}
            <span className="text-orange-400">Positioning</span> and <br />
            <span className="text-green-400"> Boost Conversions</span>
            <br />
          </h1>

          <div className="space-y-2">
            <p className="font-bold text-2xl text-slate-300 tracking-wide">
              Clear positioning and messaging turn confusion into conversions.
            </p>
            <p className="block text-lg max-w-2xl mx-auto text-slate-200 font-mono tracking-normal normal-case">
              LaunchRecord helps you spot the blind spots in your startup. We
              audit your positioning, product clarity, AEO visibility,
              differentiation, and strategic moat — benchmarking against 10,000+
              startups so you can make your product obvious and convert more
              users.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <form
            onSubmit={handleStartAudit}
            className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto"
          >
            <input
              type="text"
              placeholder="www.website_url.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="flex-1 px-6 py-4 bg-white border border-slate-800 text-foreground rounded-none font-mono focus:border-red-600 focus:ring-0 transition-all outline-none"
              required
            />
            <Button
              type="submit"
              className="h-14 px-10 bg-primary text-background text-sm hover:opacity-90 rounded-none font-black uppercase tracking-widest transition-all"
            >
              Audit My Record
            </Button>
          </form>

          <div className="">
            <p className="inline-block rounded-md text-blue-400 font-medium text-sm">
              <span className="px-2 text-blue-300 font-bold">
                No credit card required.
              </span>{" "}
              Free audit in a minute.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
