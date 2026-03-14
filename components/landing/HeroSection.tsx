"use client";

import { Button } from "@/components/ui/button";
import { PartyPopper } from "lucide-react";
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
    <section className="py-12 pb-20 relative bg-gradient-to-t from-green-50 to-white">
      <div className="space-y-8 px-4 max-w-6xl mx-auto ">
        <div className="space-y-4">
          <div className="flex items-center justify-start gap-4 flex-wrap">
            <div className="bg-green-100 flex items-center justify-center gap-2 py-1.5 px-4 text-sm rounded-lg text-green-800">
              <PartyPopper className="h-4 w-4" />
              <p className="font-medium">
                Whitelist is open for Sovereign Founders
              </p>
            </div>
          </div>
          <p className="font-bold text-purple-700 uppercase tracking-wide">
            The <span className="text-orange-500">#1 Platform</span> For
            Verified Sovereignty & Defensibility Ledger for Startups
          </p>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-mono md:text-6xl font-semibold tracking-tighter text-slate-700 leading-[0.9]">
            Audits your startup’s <br />
            <span className="text-orange-500">sovereignty</span> and{" "}
            <span className="text-green-600">defensibility</span>.
          </h1>

          <p className="block text-xl text-slate-600 font-mono mt-4 tracking-normal normal-case">
            LaunchRecord analyze your <span>positioning</span>,{" "}
            <span>product clarity</span>, <span>AEO presence</span>, and{" "}
            <span>strategic moat</span>.<br /> The SIO-V5 engine analyzes your
            positioning against 10,000+ records to ensure you aren't just a
            feature waiting to be deleted.
          </p>
        </div>

        <div className="space-y-4">
          <form
            onSubmit={handleStartAudit}
            className="flex flex-col sm:flex-row gap-2 max-w-xl"
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
              className="h-14 px-10 bg-foreground text-background text-sm hover:opacity-90 rounded-none font-black uppercase tracking-widest transition-all"
            >
              Audit My Record
            </Button>
          </form>

          <div className="space-y-2">
            <p className="inline-block rounded-md px-4 bg-green-100 text-green-800 py-1 text-sm">
              Limited to 100 Sovereign Founders for March 2026
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
