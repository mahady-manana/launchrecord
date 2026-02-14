"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

import { toast } from "sonner";
import LogoUpload from "../LogoUpload";

// Define preset colors
const PRESET_COLORS = [
  "#3B82F6", // blue-500
  "#EF4444", // red-500
  "#10B981", // emerald-500
  "#F59E0B", // amber-500
  "#8B5CF6", // violet-500
  "#EC4899", // pink-500
  "#06B6D4", // cyan-500
  "#84CC16", // lime-500
  "#F97316", // orange-500
  "#6366F1", // indigo-500
];

interface PlacementFormProps {
  placement: {
    _id: string;
    title: string;
    tagline: string;
    logoUrl?: string;
    backgroundImage?: string;
    website: string;
    placementType: string;
    position?: string;
    price: number;
    codeName: string;
    status: string;
    color?: string;
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
  onSetLive?: () => void; // Optional callback to set placement live
  onChange?: (data: Partial<any>) => void; // Optional callback to notify parent of changes for preview
}

export function PlacementForm({
  placement,
  onSubmit,
  onCancel,
  onChange,
  onSetLive,
}: PlacementFormProps) {
  const [formData, setFormData] = useState({
    title: placement.title || "",
    tagline: placement.tagline || "",
    logoUrl: placement.logoUrl || "",
    backgroundImage: placement.backgroundImage || "",
    website: placement.website || "",
    color: placement.color || "#3B82F6", // Default to blue
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Notify parent component of changes for preview
    if (onChange) {
      onChange({ [name]: value });
    }
  };

  const handleLogoUpload = (url?: string) => {
    setFormData((prev) => ({ ...prev, logoUrl: url || "" }));

    // Notify parent component of changes for preview
    if (onChange) {
      onChange({ logoUrl: url || "" });
    }
  };

  const handleBackgroundUpload = (url?: string) => {
    setFormData((prev) => ({ ...prev, backgroundImage: url || "" }));

    // Notify parent component of changes for preview
    if (onChange) {
      onChange({ backgroundImage: url || "" });
    }
  };

  const handleColorChange = (color: string) => {
    setFormData((prev) => ({ ...prev, color }));

    // Notify parent component of changes for preview
    if (onChange) {
      onChange({ color });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      toast.success("Placement updated successfully!");
    } catch (error) {
      console.error("Error updating placement:", error);
      toast.error("Failed to update placement. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Your Placement</CardTitle>
        <CardDescription>
          Customize your placement details. This will appear on the site once
          activated.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Your product/service name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              placeholder="A catchy tagline for your placement"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website URL</Label>
            <Input
              id="website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://yourwebsite.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Logo</Label>
            <div className="flex flex-col sm:flex-row gap-4">
              {formData.logoUrl && (
                <div className="flex-shrink-0">
                  <img
                    src={formData.logoUrl}
                    alt="Current logo"
                    className="h-16 w-16 object-contain rounded-md border"
                  />
                </div>
              )}
              <div className="flex-1">
                <LogoUpload onChange={handleLogoUpload} />
                {formData.logoUrl && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Current: {formData.logoUrl.split("/").pop()}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Background Image</Label>
            <div className="flex flex-col sm:flex-row gap-4">
              {formData.backgroundImage && (
                <div className="flex-shrink-0">
                  <img
                    src={formData.backgroundImage}
                    alt="Current background"
                    className="h-16 w-16 object-cover rounded-md border"
                  />
                </div>
              )}
              <div className="flex-1">
                <LogoUpload onChange={handleBackgroundUpload} />
                {formData.backgroundImage && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Current: {formData.backgroundImage.split("/").pop()}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Placement Color</Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 ${formData.color === color ? "border-primary ring-2 ring-offset-2" : "border-gray-300"}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Selected:{" "}
              <span className="font-medium" style={{ color: formData.color }}>
                {formData.color}
              </span>
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Placement"}
            </Button>
            {placement.status === "inactive" && (
              <Button
                type="button"
                variant="default"
                onClick={() => {
                  // Call a function to set the placement live
                  if (onSetLive) {
                    onSetLive();
                  }
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Set Live"}
              </Button>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
