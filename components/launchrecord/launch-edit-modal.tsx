"use client";

import { useEffect, useRef, useState } from "react";
import {
  BUSINESS_MODELS,
  LAUNCH_CATEGORIES,
  Launch,
  PRICING_MODELS,
  UpdateLaunchPayload,
} from "@/types";
import LogoUpload from "@/components/LogoUpload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface LaunchEditModalProps {
  launch: Launch;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (payload: UpdateLaunchPayload) => Promise<{
    success: boolean;
    message?: string;
  }>;
}

interface LaunchEditForm {
  name: string;
  slug: string;
  logoUrl: string;
  tagline: string;
  description: string;
  website: string;
  category: (typeof LAUNCH_CATEGORIES)[number] | (typeof LAUNCH_CATEGORIES)[number][];
  valueProposition: string;
  problem: string;
  audience: string;
  businessModel: (typeof BUSINESS_MODELS)[number];
  pricingModel: (typeof PRICING_MODELS)[number];
  name: string;
  x: string;
  linkedin: string;
}

function getInitialForm(launch: Launch): LaunchEditForm {
  return {
    name: launch.name,
    slug: launch.slug,
    logoUrl: launch.logoUrl || "",
    tagline: launch.tagline || "",
    description: launch.description || "",
    website: launch.website || "",
    category: Array.isArray(launch.category) ? launch.category : [launch.category],
    valueProposition: launch.valueProposition || "",
    problem: launch.problem || "",
    audience: launch.audience || "",
    businessModel: launch.businessModel || BUSINESS_MODELS[0],
    pricingModel: launch.pricingModel || PRICING_MODELS[1],
    name: launch.name || "",
    x: launch.x || "",
    linkedin: launch.linkedin || "",
  };
}

export function LaunchEditModal({
  launch,
  open,
  onOpenChange,
  onSave,
}: LaunchEditModalProps) {
  const [form, setForm] = useState<LaunchEditForm>(() => getInitialForm(launch));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isCategoryDropdownOpen && 
        categoryDropdownRef.current && 
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCategoryDropdownOpen]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setForm(getInitialForm(launch));
    setError(null);
  }, [launch, open]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    // Prepare the payload with the category as either a single value or array
    const payload: UpdateLaunchPayload = {
      id: launch._id,
      name: form.name,
      slug: form.slug,
      logoUrl: form.logoUrl,
      tagline: form.tagline,
      description: form.description,
      website: form.website,
      category: Array.isArray(form.category) && form.category.length === 1 
        ? form.category[0] 
        : form.category,
      valueProposition: form.valueProposition,
      problem: form.problem,
      audience: form.audience,
      businessModel: form.businessModel,
      pricingModel: form.pricingModel,
      name: form.name,
      x: form.x,
      linkedin: form.linkedin,
    };

    const result = await onSave(payload);

    if (!result.success) {
      setError(result.message || "Failed to update launch.");
      setIsSaving(false);
      return;
    }

    setIsSaving(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit launch</DialogTitle>
          <DialogDescription>
            Update your launch details and save changes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-launch-name">Name</Label>
            <Input
              id="edit-launch-name"
              required
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-launch-slug">Slug</Label>
            <Input
              id="edit-launch-slug"
              required
              value={form.slug}
              onChange={(event) =>
                setForm((current) => ({ ...current, slug: event.target.value }))
              }
              placeholder="my-app_slug"
            />
            <p className="text-xs text-muted-foreground">
              Allowed: letters, numbers, hyphen, underscore.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Logo</Label>
            <LogoUpload
              value={form.logoUrl}
              onChange={(url) =>
                setForm((current) => ({ ...current, logoUrl: url || "" }))
              }
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-launch-tagline">Tagline</Label>
            <Input
              id="edit-launch-tagline"
              required
              maxLength={140}
              value={form.tagline}
              onChange={(event) =>
                setForm((current) => ({ ...current, tagline: event.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-launch-description">Description</Label>
            <Textarea
              id="edit-launch-description"
              required
              rows={4}
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({ ...current, description: event.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-launch-value-proposition">Value proposition</Label>
            <Input
              id="edit-launch-value-proposition"
              maxLength={220}
              value={form.valueProposition}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  valueProposition: event.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-launch-problem">Problem</Label>
            <Textarea
              id="edit-launch-problem"
              rows={3}
              maxLength={600}
              value={form.problem}
              onChange={(event) =>
                setForm((current) => ({ ...current, problem: event.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-launch-audience">Audience</Label>
            <Input
              id="edit-launch-audience"
              maxLength={220}
              value={form.audience}
              onChange={(event) =>
                setForm((current) => ({ ...current, audience: event.target.value }))
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-launch-website">Website</Label>
              <Input
                id="edit-launch-website"
                type="url"
                required
                value={form.website}
                onChange={(event) =>
                  setForm((current) => ({ ...current, website: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Categories (up to 3)</Label>
              <div className="relative">
                <button
                  type="button"
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                >
                  <span className="truncate">
                    {Array.isArray(form.category) ? 
                      (form.category.length === 0
                        ? "Select categories..."
                        : `${form.category.length} category${form.category.length > 1 ? "s" : ""} selected`)
                      : "1 category selected"}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 opacity-50"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                
                {isCategoryDropdownOpen && (
                  <div ref={categoryDropdownRef} className="absolute z-10 mt-1 w-full rounded-md border bg-popover p-2 shadow-md">
                    {LAUNCH_CATEGORIES.map((category) => (
                      <div key={category} className="flex items-center space-x-2 py-1.5">
                        <input
                          type="checkbox"
                          id={`edit-category-${category}`}
                          checked={Array.isArray(form.category) ? form.category.includes(category) : form.category === category}
                          onChange={(e) => {
                            const currentCategories = Array.isArray(form.category) ? form.category : [form.category];

                            if (e.target.checked) {
                              // Add category if not already selected and less than 3
                              if (currentCategories.length < 3 && !currentCategories.includes(category)) {
                                setForm((current) => ({
                                  ...current,
                                  category: [...currentCategories, category],
                                }));
                              }
                            } else {
                              // Remove category
                              setForm((current) => ({
                                ...current,
                                category: Array.isArray(current.category)
                                  ? current.category.filter(c => c !== category)
                                  : current.category === category ? [LAUNCH_CATEGORIES[0]] : current.category,
                              }));
                            }
                          }}
                          disabled={
                            !(
                              Array.isArray(form.category)
                                ? form.category.includes(category)
                                : form.category === category
                            ) &&
                            Array.isArray(form.category) &&
                            form.category.length >= 3
                          }
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label
                          htmlFor={`edit-category-${category}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {Array.isArray(form.category) ? form.category.length : 1}/3 selected
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Business model</Label>
              <Select
                value={form.businessModel}
                onValueChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    businessModel: value as LaunchEditForm["businessModel"],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_MODELS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Pricing model</Label>
              <Select
                value={form.pricingModel}
                onValueChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    pricingModel: value as LaunchEditForm["pricingModel"],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRICING_MODELS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-author-name">Maker name</Label>
            <Input
              id="edit-author-name"
              required
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-author-x">X handle</Label>
              <Input
                id="edit-author-x"
                value={form.x}
                onChange={(event) =>
                  setForm((current) => ({ ...current, x: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-author-linkedin">LinkedIn</Label>
              <Input
                id="edit-author-linkedin"
                type="url"
                value={form.linkedin}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    linkedin: event.target.value,
                  }))
                }
              />
            </div>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <Button type="submit" className="w-full" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
