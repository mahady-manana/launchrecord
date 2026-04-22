"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

export function NewsletterCTA() {
  const [websiteUrl, setWebsiteUrl] = useState("");

  const handleStartAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (websiteUrl) {
      window.location.href = `/sio-audit?url=${encodeURIComponent(websiteUrl)}`;
    }
  };
  return (
    <div className="bg-blue-50 p-8 rounded-lg border border-blue-200 my-6">
      <h3 className="text-2xl font-bold text-blue-900 mb-4">
        Start with a Free Positioning Audit
      </h3>
      <p className="text-blue-800 mb-6">
        Get an evidence-based analysis of your current positioning and specific
        recommendations for improvement.
      </p>
      <form
        onSubmit={handleStartAudit}
        className="flex flex-col sm:flex-row gap-3"
      >
        <input
          type="url"
          placeholder="Enter your website URL ex: www.website.com"
          required
          className="flex-grow px-4 py-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
        />
        <Button
          type="submit"
          className="px-6 h-12 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          Run Free Audit <ArrowRight className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
