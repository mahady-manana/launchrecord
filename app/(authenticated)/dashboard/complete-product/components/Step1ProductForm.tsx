"use client";

import { LogoUpload } from "@/components/LogoUpload ";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProducts } from "@/hooks/use-products";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

interface SuggestedProduct {
  website: string;
  name: string;
  description: string;
  tagline: string;
  logo: string;
}

interface Step1ProductFormProps {
  productUrl: string | null;
  onComplete: (productId: string) => void;
  onBack?: () => void;
}

export function Step1ProductForm({
  productUrl,
  onComplete,
  onBack,
}: Step1ProductFormProps) {
  const { fetchProducts } = useProducts();
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tagline, setTagline] = useState("");
  const [logo, setLogo] = useState("");
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPreview = async (url: string) => {
    if (!url) return;
    setIsPreviewLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/products/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ websiteUrl: url, preview: true }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to auto-fill details");
      }

      if (data?.data) {
        setWebsiteUrl(data.data.website || websiteUrl);
        setName(data.data.name || name);
        setDescription(data.data.description || description);
        setTagline(data.data.tagline || tagline);
        setLogo(data.data.logo || logo);
      }
    } catch (err: any) {
      setError(err.message || "Failed to auto-fill product details");
    } finally {
      setIsPreviewLoading(false);
    }
  };

  useEffect(() => {
    if (!productUrl || websiteUrl) return;
    setWebsiteUrl(productUrl);
    void loadPreview(productUrl);
  }, [productUrl]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!websiteUrl || !name) {
      setError("Please provide a product name and website URL.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/products/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          websiteUrl,
          name,
          description,
          tagline,
          logo,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to complete product setup");
      }

      const productId = data.productId as string | undefined;
      if (productId) {
        await fetchProducts(productId);
        onComplete(productId);
        return;
      }

      // Fallback: still move to step 2 but without a productId
      onComplete("");
    } catch (err: any) {
      setError(err.message || "Failed to complete product setup");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl">
      {/* Mobile header */}
      <div className="lg:hidden mb-8">
        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-4">
          <Sparkles className="h-4 w-4 text-orange-500" />
          <span className="text-sm font-medium text-orange-600">
            One step away
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          Complete your product profile
        </h2>
        <p className="text-sm text-slate-600">
          Confirm your details to unlock your full audit report and get a free
          directory listing.
        </p>
      </div>

      <div className="">
        <CardHeader className="hidden lg:block">
          <CardTitle className="text-xl text-slate-800">
            Product details
          </CardTitle>
          <p className="text-sm text-slate-500 mt-1">
            Auto-filled from your website — just review and confirm.
          </p>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Website URL</Label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  id="websiteUrl"
                  type="url"
                  value={websiteUrl}
                  onChange={(event) => setWebsiteUrl(event.target.value)}
                  placeholder="https://your-startup.com"
                  required
                  className="border-slate-300"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => loadPreview(websiteUrl)}
                  disabled={!websiteUrl || isPreviewLoading}
                  className="sm:w-36"
                >
                  {isPreviewLoading ? "Auto-filling..." : "Auto-fill"}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Product name</Label>
              <Input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your product name"
                required
                className="border-slate-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={tagline}
                onChange={(event) => setTagline(event.target.value)}
                placeholder="Short one-line description"
                className="border-slate-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe what your product does"
                rows={3}
                className="border-slate-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Logo - Please upload your logo</Label>

              <LogoUpload value={logo} onChange={(l) => setLogo(l)} />
            </div>
            {error ? (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            ) : null}
          </CardContent>
          <CardFooter className="flex justify-between gap-3 pt-4">
            {onBack && (
              <Button type="button" variant="ghost" onClick={onBack}>
                Back
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-orange-500 w-full hover:bg-orange-600 text-white"
            >
              {isSaving ? (
                "Saving..."
              ) : (
                <>
                  Complete profile
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </div>
    </div>
  );
}
