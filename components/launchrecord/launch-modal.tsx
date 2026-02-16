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
  status: "draft",
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

// Step types
type Step = "name" | "details" | "info" | "publish";

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
  const [step, setStep] = useState<Step>("name"); // Track current step

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

  // Navigation functions
  const goToNextStep = () => {
    if (step === "name") {
      if (!form.name.trim()) {
        setError("Name is required");
        return;
      }
      setStep("details");
    } else if (step === "details") {
      if (!form.tagline.trim() || !form.description.trim()) {
        setError("Tagline and Description are required");
        return;
      }
      setStep("info");
    } else if (step === "info") {
      if (!form.website.trim()) {
        setError("Website is required");
        return;
      }
      setStep("publish");
    }
    setError(null);
  };

  const goToPrevStep = () => {
    if (step === "details") setStep("name");
    else if (step === "info") setStep("details");
    else if (step === "publish") setStep("info");
    setError(null);
  };

  // Handle publishing options
  const handleSaveAsDraft = async () => {
    setError(null);
    setIsSubmitting(true);

    const payload: CreateLaunchPayload = {
      ...form,
      category: form.category.length === 1 ? form.category[0] : form.category,
      status: "draft",
    };

    const result = await onSubmit(payload);

    if (!result.success) {
      setError(result.message || "Failed to save as draft.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    onOpenChange(false);
    setForm(initialForm);
    setStep("name");
  };

  const handlePrelaunch = async () => {
    setError(null);
    setIsSubmitting(true);

    const payload: CreateLaunchPayload = {
      ...form,
      category: form.category.length === 1 ? form.category[0] : form.category,
      status: "prelaunch",
    };

    const result = await onSubmit(payload);

    if (!result.success) {
      setError(result.message || "Failed to submit for prelaunch.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    onOpenChange(false);
    setForm(initialForm);
    setStep("name");
  };

  const handleLaunch = async () => {
    setError(null);
    setIsSubmitting(true);

    const payload: CreateLaunchPayload = {
      ...form,
      category: form.category.length === 1 ? form.category[0] : form.category,
      status: "launched",
    };

    const result = await onSubmit(payload);

    if (!result.success) {
      setError(result.message || "Failed to launch.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    onOpenChange(false);
    setForm(initialForm);
    setStep("name");

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

  // Render step indicator
  const renderStepIndicator = () => (
    <div className="mb-6">
      <div className="flex justify-between relative">
        {/* Progress bar */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10">
          <div 
            className="h-full bg-blue-500 transition-all duration-300 ease-in-out" 
            style={{ 
              width: step === "name" ? "25%" : 
                     step === "details" ? "50%" : 
                     step === "info" ? "75%" : "100%" 
            }}
          />
        </div>
        
        {/* Step indicators */}
        <div className="flex-1 flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
            step === "name" || step === "details" || step === "info" || step === "publish" 
              ? "bg-blue-500 text-white" 
              : "bg-gray-200 text-gray-500"
          }`}>
            1
          </div>
          <span className={`text-xs ${step === "name" ? "font-medium text-blue-500" : "text-gray-500"}`}>
            Name
          </span>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
            step === "details" || step === "info" || step === "publish" 
              ? "bg-blue-500 text-white" 
              : "bg-gray-200 text-gray-500"
          }`}>
            2
          </div>
          <span className={`text-xs ${step === "details" ? "font-medium text-blue-500" : "text-gray-500"}`}>
            Details
          </span>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
            step === "info" || step === "publish" 
              ? "bg-blue-500 text-white" 
              : "bg-gray-200 text-gray-500"
          }`}>
            3
          </div>
          <span className={`text-xs ${step === "info" ? "font-medium text-blue-500" : "text-gray-500"}`}>
            Info
          </span>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
            step === "publish" 
              ? "bg-blue-500 text-white" 
              : "bg-gray-200 text-gray-500"
          }`}>
            4
          </div>
          <span className={`text-xs ${step === "publish" ? "font-medium text-blue-500" : "text-gray-500"}`}>
            Publish
          </span>
        </div>
      </div>
    </div>
  );

  // Render current step content
  const renderStepContent = () => {
    switch (step) {
      case "name":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="launch-name">App Name *</Label>
              <Input
                id="launch-name"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="Enter your app name"
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
          </div>
        );
      
      case "details":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="launch-tagline">Tagline *</Label>
              <Input
                id="launch-tagline"
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
              <p className="text-xs text-muted-foreground">
                {form.tagline.length}/140 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="launch-description">Description *</Label>
              <Textarea
                id="launch-description"
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                rows={4}
                placeholder="Describe your app in detail"
              />
            </div>
          </div>
        );
      
      case "info":
        return (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="launch-website">Website *</Label>
                <Input
                  id="launch-website"
                  type="url"
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
          </div>
        );
      
      case "publish":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium">Ready to publish?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Choose how you want to publish your launch
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 flex flex-col items-center text-center">
                <h4 className="font-medium mb-2">Save Draft</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Keep it private for now
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleSaveAsDraft}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Draft"}
                </Button>
              </div>
              
              <div className="border rounded-lg p-4 flex flex-col items-center text-center border-blue-300 bg-blue-50">
                <h4 className="font-medium mb-2 text-blue-700">Prelaunch</h4>
                <p className="text-xs text-blue-600 mb-3">
                  Get early feedback from the community
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border-blue-600 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                  onClick={handlePrelaunch}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Publishing..." : "Prelaunch"}
                </Button>
              </div>
              
              <div className="border rounded-lg p-4 flex flex-col items-center text-center border-green-300 bg-green-50">
                <h4 className="font-medium mb-2 text-green-700">Launch</h4>
                <p className="text-xs text-green-600 mb-3">
                  Go live to the world
                </p>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleLaunch}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Launching..." : "Launch Now"}
                </Button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {step === "name" && "What's your app called?"}
              {step === "details" && "Tell us about your app"}
              {step === "info" && "Add more details"}
              {step === "publish" && "Ready to publish?"}
            </DialogTitle>
            <DialogDescription>
              {step === "name" && "Give your app a name and upload a logo"}
              {step === "details" && "Share your tagline and description"}
              {step === "info" && "Add website, categories, and pricing"}
              {step === "publish" && "Choose how you want to publish - your launch will appear differently based on your selection"}
            </DialogDescription>
          </DialogHeader>

          {renderStepIndicator()}

          {renderStepContent()}

          {error ? <p className="text-sm text-destructive mt-2">{error}</p> : null}

          {/* Navigation buttons */}
          {step !== "publish" && (
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={goToPrevStep}
                disabled={step === "name"}
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={goToNextStep}
              >
                Continue
              </Button>
            </div>
          )}

          {/* For the last step, we show the publish options instead of navigation */}
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
