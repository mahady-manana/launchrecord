"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LogoList } from "./LogoList";

export function HeroSection() {
  const [websiteUrl, setWebsiteUrl] = useState("");

  const handleStartAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (websiteUrl) {
      window.location.href = `/sio-audit?url=${encodeURIComponent(websiteUrl)}`;
    }
  };

  return (
    <section className="pb-0 relative bg-white">
      {/* <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-slate-100) 1px, transparent 1px), linear-gradient(90deg, var(--color-slate-100) 1px, transparent 1px)",
          backgroundSize: "60px 60px, 60px 60px",
        }}
      /> */}
      <div className="border-y border-slate-200 w-full flex flex-col items-center justify-center">
        <div className="space-y-8 relative px-4 py-12 max-w-7xl w-full text-center border-slate-200 border-x px-12">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-slate-600 leading-[1.1] pb-8">
              Confusion kills conversions. <br /> Get a free positioning and
              messaging <br /> clarity audit with precise fixes.
            </h1>

            <div className="space-y-2">
              <p className="block text-lg max-w-2xl mx-auto text-slate-600 font-mono tracking-normal normal-case">
                Launchrecord audits your SaaS messaging clarity, detects
                positioning gaps, and benchmarks your website against thousands
                of SaaS startups to reveal exactly what’s hurting conversions
                and how to fix them.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <form
              onSubmit={handleStartAudit}
              className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto bg-white border-2 border-primary rounded-lg shadow-sm p-0.5"
            >
              <input
                type="text"
                placeholder="www.example-website.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="flex-1 px-6 py-4 bg-white text-slate-900 rounded-lg font-mono outline-none"
                required
              />
              <Button
                type="submit"
                className="h-14 px-10 bg-primary text-white text-sm hover:bg-primary/90 rounded-md font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg"
              >
                Run free audit
              </Button>
            </form>

            <div className="">
              <p className="inline-block rounded-md text-slate-600 font-medium text-sm">
                Enter your website url.{" "}
                <span className="px-2 text-primary font-bold">
                  No signup required.
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl w-full bg-white border-t border-x">
          <LogoList></LogoList>
        </div>
      </div>
    </section>
  );
}
