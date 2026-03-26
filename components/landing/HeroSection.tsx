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
    <section className="py-12 pt-20 relative bg-slate-800 min-h-[80vh] flex items-center justify-center">
      <div className="space-y-8 relative px-4 max-w-6xl mx-auto text-center pt-20">
        <div className="space-y-4 max-w-4xl">
          <h1 className="text-3xl font-mono md:text-6xl font-semibold tracking-tighter text-slate-100 leading-[1.1]">
            We Audit Your Startup’s{" "}
            <span className="text-orange-400">Positioning</span>,{" "}
            <span className="text-green-400">Product Clarity</span> and
            Strategic Moat.
            <br />
          </h1>

          <p className="block text-xl max-w-2xl mx-auto text-slate-200 font-mono mt-4 tracking-normal normal-case">
            LaunchRecord analyzes your startup’s market positioning &
            differentiation, product clarity, AEO presence, and strategic moat.
            Our SIO-V5 engine benchmarks your startup against 10,000+ records to
            ensure you stand out not get lost in the noise.
          </p>
        </div>
        <div className="space-y-4">
          <p className="font-bold text-sm text-purple-100 uppercase tracking-wide">
            The <span className="text-orange-300">#1 Platform</span> For
            Verified Sovereignty & Defensibility Ledger for Startups
          </p>
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
