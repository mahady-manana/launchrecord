"use client";

import { uploadToS3 } from "@/lib/s3-upload";
import { UploadResult, UseImageUploadReturn } from "@/types/s3-upload";
import { useCallback, useState } from "react";

export const useImageUpload = (
  uploadMethod: "presigned" | "direct" = "direct",
): UseImageUploadReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = useCallback(
    async (
      file: File,
      method: "presigned" | "direct" = uploadMethod,
    ): Promise<UploadResult | null> => {
      setIsLoading(true);
      setError(null);

      try {
        // Validate file
        if (!file) {
          throw new Error("No file provided");
        }

        // Check file size (optional: limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error("File size exceeds 5MB limit");
        }

        // Direct upload approach
        const formData = new FormData();
        formData.append("file", file);

        const response = await uploadToS3(file);

        if (!response.url) {
          throw new Error("Failed to upload file");
        }

        return {
          url: response.url,
          key: response.key,
        };
      } catch (err) {
        console.error("Image upload error:", err);
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [uploadMethod],
  );

  return { uploadImage, isLoading, error };
};
