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
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function PlacementForm({
  placement,
  onSubmit,
  onCancel,
}: PlacementFormProps) {
  const [formData, setFormData] = useState({
    title: placement.title || "",
    tagline: placement.tagline || "",
    logoUrl: placement.logoUrl || "",
    backgroundImage: placement.backgroundImage || "",
    website: placement.website || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, logoUrl: url }));
  };

  const handleBackgroundUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, backgroundImage: url }));
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
                <LogoUpload
                  onChange={(s) => {
                    // toast.error(`Upload failed: ${error.message}`);
                  }}
                />
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
                <UploadDropzone
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (res && res[0]) {
                      handleBackgroundUpload(res[0].url);
                      toast.success("Background image uploaded successfully!");
                    }
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(`Upload failed: ${error.message}`);
                  }}
                />
                {formData.backgroundImage && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Current: {formData.backgroundImage.split("/").pop()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Placement"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
