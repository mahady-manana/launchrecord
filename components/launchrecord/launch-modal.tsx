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
  CreateLaunchPayload,
  LAUNCH_CATEGORIES,
  Launch,
  PRICING_MODELS,
  UpdateLaunchPayload,
} from "@/types";
import { FormEvent, useEffect, useRef, useState } from "react";

interface LaunchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    payload: CreateLaunchPayload,
  ) => Promise<{ success: boolean; message?: string; launch?: Launch }>;
  onCompleteDetails: (
    payload: UpdateLaunchPayload,
  ) => Promise<{ success: boolean; message?: string }>;
}

interface LaunchModalForm extends Omit<CreateLaunchPayload, "category"> {
  category: (typeof LAUNCH_CATEGORIES)[number][];
}

const initialForm: LaunchModalForm = {
  name: "",
  logoUrl: "",
  tagline: "",
  description: "",
  website: "",
  category: [LAUNCH_CATEGORIES[0]],
  businessModel: BUSINESS_MODELS[0],
  pricingModel: PRICING_MODELS[1],
};

interface OptionalDetailsForm {
  valueProposition: string;
  problem: string;
  audience: string;
  x: string;
  linkedin: string;
}

const initialOptionalDetails: OptionalDetailsForm = {
  valueProposition: "",
  problem: "",
  audience: "",
  x: "",
  linkedin: "",
};

export function LaunchModal({
  open,
  onOpenChange,
  onSubmit,
  onCompleteDetails,
}: LaunchModalProps) {
  const [form, setForm] = useState<LaunchModalForm>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const [createdLaunch, setCreatedLaunch] = useState<Launch | null>(null);
  const [showOptionalModal, setShowOptionalModal] = useState(false);
  const [optionalDetails, setOptionalDetails] = useState<OptionalDetailsForm>(
    initialOptionalDetails,
  );
  const [optionalError, setOptionalError] = useState<string | null>(null);
  const [isSavingOptional, setIsSavingOptional] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Prepare the payload with the category as either a single value or array
    const payload: CreateLaunchPayload = {
      ...form,
      category: form.category.length === 1 ? form.category[0] : form.category,
    };

    const result = await onSubmit(payload);

    if (!result.success) {
      setError(result.message || "Failed to submit launch.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    onOpenChange(false);
    setForm(initialForm);

    if (result.launch) {
      setCreatedLaunch(result.launch);
      setOptionalDetails(initialOptionalDetails);
      setOptionalError(null);
      setShowOptionalModal(true);
    }
  };

  const validateOptionalDetails = () => {
    if (
      optionalDetails.valueProposition &&
      optionalDetails.valueProposition.trim().length < 6
    ) {
      return "Value proposition must be at least 6 characters.";
    }

    if (optionalDetails.problem && optionalDetails.problem.trim().length < 10) {
      return "Problem must be at least 10 characters.";
    }

    if (
      optionalDetails.audience &&
      optionalDetails.audience.trim().length < 4
    ) {
      return "Audience must be at least 4 characters.";
    }

    return null;
  };

  const handleSaveOptionalDetails = async () => {
    if (!createdLaunch) {
      return;
    }

    const validationError = validateOptionalDetails();

    if (validationError) {
      setOptionalError(validationError);
      return;
    }

    setOptionalError(null);
    setIsSavingOptional(true);

    const result = await onCompleteDetails({
      id: createdLaunch._id,
      valueProposition: optionalDetails.valueProposition.trim() || undefined,
      problem: optionalDetails.problem.trim() || undefined,
      audience: optionalDetails.audience.trim() || undefined,
    });

    if (!result.success) {
      setOptionalError(result.message || "Failed to save additional details.");
      setIsSavingOptional(false);
      return;
    }

    setIsSavingOptional(false);
    setShowOptionalModal(false);
    setCreatedLaunch(null);
  };

  const handleSkipOptionalDetails = () => {
    setShowOptionalModal(false);
    setCreatedLaunch(null);
    setOptionalDetails(initialOptionalDetails);
    setOptionalError(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Submit new launch</DialogTitle>
            <DialogDescription>
              Add your app to LaunchRecord so builders can discover it.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="launch-name">Name</Label>
              <Input
                id="launch-name"
                required
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Logo</Label>
              <LogoUpload
                value={form.logoUrl}
                onChange={(url) =>
                  setForm((current) => ({ ...current, logoUrl: url || "" }))
                }
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="launch-tagline">Tagline</Label>
              <Input
                id="launch-tagline"
                required
                maxLength={140}
                placeholder="One-line hook founders remember"
                value={form.tagline}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    tagline: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="launch-description">Description</Label>
              <Textarea
                id="launch-description"
                required
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                rows={4}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="launch-website">Website</Label>
                <Input
                  id="launch-website"
                  type="url"
                  required
                  placeholder="https://"
                  value={form.website}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      website: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Categories (up to 3)</Label>
                <div className="relative">
                  <button
                    type="button"
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onClick={() =>
                      setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                    }
                  >
                    <span className="truncate">
                      {form.category.length === 0
                        ? "Select categories..."
                        : `${form.category.length} category${form.category.length > 1 ? "s" : ""} selected`}
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
                      className="absolute z-10 mt-1 w-full rounded-md border bg-popover p-2 shadow-md"
                    >
                      {LAUNCH_CATEGORIES.map((category) => (
                        <div
                          key={category}
                          className="flex items-center space-x-2 py-1.5"
                        >
                          <input
                            type="checkbox"
                            id={`category-${category}`}
                            checked={form.category.includes(category)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                // Add category if not already selected and less than 3
                                if (
                                  form.category.length < 3 &&
                                  !form.category.includes(category)
                                ) {
                                  setForm((current) => ({
                                    ...current,
                                    category: [...current.category, category],
                                  }));
                                }
                              } else {
                                // Remove category
                                setForm((current) => ({
                                  ...current,
                                  category: current.category.filter(
                                    (c) => c !== category,
                                  ),
                                }));
                              }
                            }}
                            disabled={
                              !form.category.includes(category) &&
                              form.category.length >= 3
                            }
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <label
                            htmlFor={`category-${category}`}
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
                  {form.category.length}/3 selected
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
                      businessModel:
                        value as CreateLaunchPayload["businessModel"],
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
                      pricingModel:
                        value as CreateLaunchPayload["pricingModel"],
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

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit launch"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showOptionalModal} onOpenChange={setShowOptionalModal}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Add more details (optional)</DialogTitle>
            <DialogDescription>
              Your launch is live. You can enrich it now or skip and do it
              later.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="optional-value-proposition">
                Value proposition
              </Label>
              <Input
                id="optional-value-proposition"
                maxLength={220}
                value={optionalDetails.valueProposition}
                onChange={(event) =>
                  setOptionalDetails((current) => ({
                    ...current,
                    valueProposition: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="optional-problem">Problem</Label>
              <Textarea
                id="optional-problem"
                rows={3}
                maxLength={600}
                value={optionalDetails.problem}
                onChange={(event) =>
                  setOptionalDetails((current) => ({
                    ...current,
                    problem: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="optional-audience">Audience</Label>
              <Input
                id="optional-audience"
                maxLength={220}
                value={optionalDetails.audience}
                onChange={(event) =>
                  setOptionalDetails((current) => ({
                    ...current,
                    audience: event.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="optional-author-x">X handle</Label>
                <Input
                  id="optional-author-x"
                  value={optionalDetails.x}
                  onChange={(event) =>
                    setOptionalDetails((current) => ({
                      ...current,
                      x: event.target.value,
                    }))
                  }
                  placeholder="@username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="optional-author-linkedin">LinkedIn</Label>
                <Input
                  id="optional-author-linkedin"
                  type="url"
                  value={optionalDetails.linkedin}
                  onChange={(event) =>
                    setOptionalDetails((current) => ({
                      ...current,
                      linkedin: event.target.value,
                    }))
                  }
                  placeholder="https://linkedin.com/in/"
                />
              </div>
            </div>

            {optionalError ? (
              <p className="text-sm text-destructive">{optionalError}</p>
            ) : null}

            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={handleSkipOptionalDetails}
                disabled={isSavingOptional}
              >
                Skip for now
              </Button>
              <Button
                type="button"
                onClick={handleSaveOptionalDetails}
                disabled={isSavingOptional}
              >
                {isSavingOptional ? "Saving..." : "Save details"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
