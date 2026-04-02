"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export function HeroSection() {
  const [websiteUrl, setWebsiteUrl] = useState("");

  const handleStartAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (websiteUrl) {
      window.location.href = `/sio-audit?url=${encodeURIComponent(websiteUrl)}`;
    }
  };

  return (
    <section className="pb-12 relative bg-slate-800 min-h-screen flex items-center justify-center">
      <div className="space-y-8 relative px-4 max-w-6xl mx-auto text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-mono md:text-6xl font-semibold tracking-tighter text-slate-100 leading-[1.1]">
            Confused visitors don’t convert <br /> Fix your{" "}
            <span className="text-primary">positioning</span> and{" "}
            <span className="text-primary"> messaging</span> <br /> to turn them
            into customers.
          </h1>

          <div className="space-y-2">
            <p className="block text-xl max-w-2xl mx-auto text-slate-200 font-mono tracking-normal normal-case">
              Launchrecord audits your saas messaging clarity, spots positioning
              gaps, tests AI visibility and gives you exact copy fixes to turn
              confusion into conversions.
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
              placeholder="Paste your website URL here"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="flex-1 px-6 py-4 bg-white border border-slate-800 text-foreground rounded-none font-mono focus:border-red-600 focus:ring-0 transition-all outline-none"
              required
            />
            <Button
              type="submit"
              className="h-14 px-10 bg-primary text-background text-sm hover:opacity-90 rounded-none font-black uppercase tracking-widest transition-all"
            >
              Run free audit
            </Button>
          </form>

          <div className="">
            <p className="inline-block rounded-md text-blue-400 font-medium text-sm">
              <span className="px-2 text-blue-300 font-bold">
                No signup required.
              </span>{" "}
              Audit takes 2-5 minutes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
