"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validateUrl } from "@/lib/url-validation";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

export interface AuditFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
  error?: string | null;
  defaultUrl?: string;
  placeholder?: string;
  buttonText?: string;
  loadingText?: string;
  className?: string;
}

export function AuditForm({
  onSubmit,
  isLoading,
  error,
  defaultUrl = "",
  placeholder = "https://your-startup.com",
  buttonText = "Get Free Audit",
  loadingText = "Running audit...",
  className,
}: AuditFormProps) {
  const [url, setUrl] = useState(defaultUrl);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    // Client-side URL validation
    const validation = validateUrl(url);
    if (!validation.isValid || !validation.normalizedUrl) {
      return; // Error will be shown from parent
    }

    onSubmit(validation.normalizedUrl);
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Input
          placeholder={placeholder}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
          required
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="min-w-[200px] bg-orange-500 hover:bg-orange-600"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {loadingText}
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              {buttonText}
            </>
          )}
        </Button>
      </form>
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
