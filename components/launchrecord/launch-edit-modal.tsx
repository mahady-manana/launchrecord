"use client";

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
import {
  BUSINESS_MODELS,
  LAUNCH_CATEGORIES,
  Launch,
  PRICING_MODELS,
  UpdateLaunchPayload,
} from "@/types";
import { useEffect, useRef, useState } from "react";

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
  category:
    | (typeof LAUNCH_CATEGORIES)[number]
    | (typeof LAUNCH_CATEGORIES)[number][];
  valueProposition: string;
  problem: string;
  audience: string;
  businessModel: (typeof BUSINESS_MODELS)[number];
  pricingModel: (typeof PRICING_MODELS)[number];
  status: "draft" | "prelaunch" | "launched";
}

function getInitialForm(launch: Launch): LaunchEditForm {
  return {
    name: launch.name,
    slug: launch.slug,
    logoUrl: launch.logoUrl || "",
    tagline: launch.tagline || "",
    description: launch.description || "",
    website: launch.website || "",
    category: Array.isArray(launch.category)
      ? launch.category
      : [launch.category],
    valueProposition: launch.valueProposition || "",
    problem: launch.problem || "",
    audience: launch.audience || "",
    businessModel: launch.businessModel || BUSINESS_MODELS[0],
    pricingModel: launch.pricingModel || PRICING_MODELS[1],
    status: launch.status || "draft",
  };
}

export function LaunchEditModal({
  launch,
  open,
  onOpenChange,
  onSave,
}: LaunchEditModalProps) {
  const [form, setForm] = useState<LaunchEditForm>(() =>
    getInitialForm(launch),
  );
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
      category:
        Array.isArray(form.category) && form.category.length === 1
          ? form.category[0]
          : form.category,
      valueProposition: form.valueProposition,
      problem: form.problem,
      audience: form.audience,
      businessModel: form.businessModel,
      pricingModel: form.pricingModel,
      status: form.status,
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-border/50 shadow-2xl">
        <div className="p-1">
          <div className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-0.5">
            <div className="rounded-md bg-background p-6">
              <DialogHeader className="mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Edit Launch
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground mt-1">
                      Update your launch details and manage its status
                    </DialogDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        launch.status === "launched"
                          ? "bg-green-100 text-green-800"
                          : launch.status === "prelaunch"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {launch.status.charAt(0).toUpperCase() +
                        launch.status.slice(1)}
                    </span>
                  </div>
                </div>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="edit-launch-name"
                      className="text-sm font-medium"
                    >
                      App Name
                    </Label>
                    <Input
                      id="edit-launch-name"
                      required
                      value={form.name}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                      className="h-11 rounded-lg border border-input/50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="edit-launch-slug"
                      className="text-sm font-medium"
                    >
                      URL Slug
                    </Label>
                    <Input
                      id="edit-launch-slug"
                      required
                      value={form.slug}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          slug: event.target.value,
                        }))
                      }
                      placeholder="my-app-slug"
                      className="h-11 rounded-lg border border-input/50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                    />
                    <p className="text-xs text-muted-foreground">
                      Letters, numbers, hyphens only
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Logo</Label>
                  <div className="flex items-center gap-4">
                    <LogoUpload
                      value={form.logoUrl}
                      onChange={(url) =>
                        setForm((current) => ({
                          ...current,
                          logoUrl: url || "",
                        }))
                      }
                      disabled={isSaving}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="edit-launch-tagline"
                    className="text-sm font-medium"
                  >
                    Tagline
                  </Label>
                  <Input
                    id="edit-launch-tagline"
                    required
                    maxLength={140}
                    value={form.tagline}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        tagline: event.target.value,
                      }))
                    }
                    className="h-11 rounded-lg border border-input/50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>One-line hook founders remember</span>
                    <span>{form.tagline.length}/140</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="edit-launch-description"
                    className="text-sm font-medium"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="edit-launch-description"
                    required
                    rows={4}
                    value={form.description}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-input/50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 min-h-[120px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="edit-launch-value-proposition"
                      className="text-sm font-medium"
                    >
                      Value Proposition
                    </Label>
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
                      placeholder="What value does your product provide?"
                      className="h-11 rounded-lg border border-input/50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="edit-launch-audience"
                      className="text-sm font-medium"
                    >
                      Target Audience
                    </Label>
                    <Input
                      id="edit-launch-audience"
                      maxLength={220}
                      value={form.audience}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          audience: event.target.value,
                        }))
                      }
                      placeholder="Who is this for?"
                      className="h-11 rounded-lg border border-input/50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="edit-launch-problem"
                    className="text-sm font-medium"
                  >
                    Problem
                  </Label>
                  <Textarea
                    id="edit-launch-problem"
                    rows={3}
                    maxLength={600}
                    value={form.problem}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        problem: event.target.value,
                      }))
                    }
                    placeholder="What problem does your product solve?"
                    className="rounded-lg border border-input/50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="edit-launch-website"
                      className="text-sm font-medium"
                    >
                      Website
                    </Label>
                    <Input
                      id="edit-launch-website"
                      type="url"
                      required
                      value={form.website}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          website: event.target.value,
                        }))
                      }
                      placeholder="https://example.com"
                      className="h-11 rounded-lg border border-input/50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Categories (up to 3)
                    </Label>
                    <div className="relative">
                      <button
                        type="button"
                        className="flex h-11 w-full items-center justify-between rounded-lg border border-input/50 bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={() =>
                          setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                        }
                      >
                        <span className="truncate">
                          {Array.isArray(form.category)
                            ? form.category.length === 0
                              ? "Select categories..."
                              : `${form.category.length} category${form.category.length > 1 ? "s" : ""} selected`
                            : "1 category selected"}
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 opacity-50"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </button>

                      {isCategoryDropdownOpen && (
                        <div
                          ref={categoryDropdownRef}
                          className="absolute z-50 mt-1 w-full rounded-lg border border-input/50 bg-popover p-2 shadow-lg"
                        >
                          {LAUNCH_CATEGORIES.map((category) => (
                            <div
                              key={category}
                              className="flex items-center space-x-2 py-2 px-3 hover:bg-accent rounded-md cursor-pointer"
                              onClick={() => {
                                const currentCategories = Array.isArray(
                                  form.category,
                                )
                                  ? form.category
                                  : [form.category];
                                if (currentCategories.includes(category)) {
                                  // Remove category
                                  setForm((current) => ({
                                    ...current,
                                    category: Array.isArray(current.category)
                                      ? current.category.filter(
                                          (c) => c !== category,
                                        )
                                      : current.category === category
                                        ? [LAUNCH_CATEGORIES[0]]
                                        : current.category,
                                  }));
                                } else {
                                  // Add category if not already selected and less than 3
                                  if (currentCategories.length < 3) {
                                    setForm((current) => ({
                                      ...current,
                                      category: [
                                        ...currentCategories,
                                        category,
                                      ],
                                    }));
                                  }
                                }
                              }}
                            >
                              <input
                                type="checkbox"
                                id={`edit-category-${category}`}
                                checked={
                                  Array.isArray(form.category)
                                    ? form.category.includes(category)
                                    : form.category === category
                                }
                                readOnly
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <label
                                htmlFor={`edit-category-${category}`}
                                className="text-sm font-medium leading-none"
                              >
                                {category}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {Array.isArray(form.category) ? form.category.length : 1}
                      /3 selected
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Business Model
                    </Label>
                    <Select
                      value={form.businessModel}
                      onValueChange={(value) =>
                        setForm((current) => ({
                          ...current,
                          businessModel:
                            value as LaunchEditForm["businessModel"],
                        }))
                      }
                    >
                      <SelectTrigger className="h-11 rounded-lg border border-input/50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0">
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
                    <Label className="text-sm font-medium">Pricing Model</Label>
                    <Select
                      value={form.pricingModel}
                      onValueChange={(value) =>
                        setForm((current) => ({
                          ...current,
                          pricingModel: value as LaunchEditForm["pricingModel"],
                        }))
                      }
                    >
                      <SelectTrigger className="h-11 rounded-lg border border-input/50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0">
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

                {error && (
                  <div className="rounded-lg bg-red-50 p-3 border border-red-200">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Status update buttons */}
                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Manage Status
                  </h3>
                  <div className="space-y-3">
                    {launch.status === "draft" && (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1 h-11 rounded-lg text-base"
                          disabled={isSaving}
                          onClick={async () => {
                            setIsSaving(true);
                            setError(null);

                            const payload: UpdateLaunchPayload = {
                              id: launch._id,
                              status: "prelaunch",
                            };

                            const result = await onSave(payload);

                            if (!result.success) {
                              setError(
                                result.message || "Failed to update status.",
                              );
                              setIsSaving(false);
                              return;
                            }

                            setIsSaving(false);
                            onOpenChange(false);
                          }}
                        >
                          {isSaving ? (
                            <span className="flex items-center">
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Updating...
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-2"
                              >
                                <path d="M12 5v14M5 12h14" />
                              </svg>
                              Prelaunch Now
                            </span>
                          )}
                        </Button>

                        <Button
                          type="button"
                          className="flex-1 h-11 rounded-lg text-base bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                          disabled={isSaving}
                          onClick={async () => {
                            setIsSaving(true);
                            setError(null);

                            const payload: UpdateLaunchPayload = {
                              id: launch._id,
                              status: "launched",
                            };

                            const result = await onSave(payload);

                            if (!result.success) {
                              setError(
                                result.message || "Failed to update status.",
                              );
                              setIsSaving(false);
                              return;
                            }

                            setIsSaving(false);
                            onOpenChange(false);
                          }}
                        >
                          {isSaving ? (
                            <span className="flex items-center">
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Launching...
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-2"
                              >
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                              </svg>
                              Launch Now
                            </span>
                          )}
                        </Button>
                      </div>
                    )}

                    {launch.status === "prelaunch" && (
                      <Button
                        type="button"
                        className="w-full h-11 rounded-lg text-base bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                        disabled={isSaving}
                        onClick={async () => {
                          setIsSaving(true);
                          setError(null);

                          const payload: UpdateLaunchPayload = {
                            id: launch._id,
                            status: "launched",
                          };

                          const result = await onSave(payload);

                          if (!result.success) {
                            setError(
                              result.message || "Failed to update status.",
                            );
                            setIsSaving(false);
                            return;
                          }

                          setIsSaving(false);
                          onOpenChange(false);
                        }}
                      >
                        {isSaving ? (
                          <span className="flex items-center justify-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Launching...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-2"
                            >
                              <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                            Launch Now
                          </span>
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    className="flex-1 h-11 rounded-lg text-base bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2"
                        >
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                          <polyline points="17 21 17 13 7 13 7 21"></polyline>
                          <polyline points="7 3 7 8 15 8"></polyline>
                          <line x1="10" y1="13" x2="21" y2="2"></line>
                        </svg>
                        Save Changes
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
