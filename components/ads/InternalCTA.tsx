"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

export function InternalCTA() {
  const [websiteUrl, setWebsiteUrl] = useState("");

  const handleStartAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (websiteUrl) {
      window.location.href = `/sio-audit?i_src=product_item&url=${encodeURIComponent(websiteUrl)}`;
    }
  };

  return (
    <section className="bg-slate-50 relative flex border border-primary rounded-lg shadow-md py-4">
      <div className="space-y-8 relative px-4">
        <div className="space-y-4">
          <Link
            href="/"
            className="font-bold text-xl text-primary border-b-2 border-primary inline-block"
          >
            Launchrecord.com
          </Link>
          <h3 className="text-xl font-bold tracking-tighter text-slate-700 leading-[1.1]">
            <span className="text-secondary">
              Stop losing potential customers
            </span>
            . Get a free positioning and messaging audit with exact fixes to
            boost conversions.
          </h3>

          <div className="space-y-2">
            <p className="block text-xl text-slate-600 font-mono tracking-normal normal-case">
              Launchrecord audits your SaaS messaging clarity, spots positioning
              gaps, tests AI visibility and gives you exact copy fixes to turn
              confusion into conversions.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <form
            onSubmit={handleStartAudit}
            className="flex flex-col sm:flex-row gap-2 border-2 border-primary rounded-lg shadow-sm p-0.5"
          >
            <input
              type="text"
              placeholder="www.your-website-link.com"
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
              </span>{" "}
              Audit takes 2-5 minutes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
