"use client";

import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
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
      <div className="space-y-8 relative px-4 max-w-6xl mx-auto ">
        <div className="space-y-4 pt-8">
          <div className="hidden md:flex items-center justify-center absolute bg-secondary rounded-full h-40 w-40 top-5 right-5 gap-4">
            <div className="flex items-center justify-center flex-col text-center text-white">
              <Star className="animate-spin" size={30} />
              <p className="font-bold text-3xl pt-2">+ 5,500</p>
              <p className="text-xl font-bold leading-5">
                Startups <br /> <span>Audited</span>
              </p>
            </div>
          </div>
          <div className="flex md:hidden">
            <p className="font-bold">
              + 5,500 Startups <span>Audited</span>
            </p>
          </div>
          <p className="font-bold text-sm text-purple-700 uppercase tracking-wide">
            The <span className="text-orange-500">#1 Platform</span> For
            Verified Sovereignty & Defensibility Ledger for Startups
          </p>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-mono md:text-5xl font-semibold tracking-tighter text-slate-700 leading-[0.9]">
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
