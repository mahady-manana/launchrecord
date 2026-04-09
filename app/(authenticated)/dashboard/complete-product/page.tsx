"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProducts } from "@/hooks/use-products";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

interface SuggestedProduct {
  website: string;
  name: string;
  description: string;
  tagline: string;
  logo: string;
}

function CompleteProductForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { fetchProducts } = useProducts();

  const [websiteUrl, setWebsiteUrl] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tagline, setTagline] = useState("");
  const [logo, setLogo] = useState("");
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const productUrl = params.get("productUrl");

  const applySuggested = (data: SuggestedProduct) => {
    setWebsiteUrl(data.website || websiteUrl);
    setName(data.name || name);
    setDescription(data.description || description);
    setTagline(data.tagline || tagline);
    setLogo(data.logo || logo);
  };

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
        applySuggested(data.data);
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
  }, [productUrl, websiteUrl]);

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
        router.push(`/dashboard/${productId}/subscription`);
        return;
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to complete product setup");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Complete your product profile
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Confirm your details so we can attach your audit and unlock the
          dashboard.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product details</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
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
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => loadPreview(websiteUrl)}
                  disabled={!websiteUrl || isPreviewLoading}
                  className="sm:w-40"
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={tagline}
                onChange={(event) => setTagline(event.target.value)}
                placeholder="Short one-line description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe what your product does"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                value={logo}
                onChange={(event) => setLogo(event.target.value)}
                placeholder="https://your-startup.com/logo.png"
              />
            </div>

            {logo ? (
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <div className="h-10 w-10 rounded-lg border border-slate-200 bg-white flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logo} alt="Logo preview" className="h-8 w-8" />
                </div>
                Logo preview
              </div>
            ) : null}

            {error ? (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            ) : null}
          </CardContent>
          <CardFooter className="flex justify-end gap-3">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Create product"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function CompleteProductPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompleteProductForm />
    </Suspense>
  );
}
