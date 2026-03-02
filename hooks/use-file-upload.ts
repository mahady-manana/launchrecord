import { uploadToS3 } from "@/lib/s3-upload";
import { useCallback, useState } from "react";

interface SignedUploadResponse {
  success: boolean;
  data?: {
    url: string;
    key: string;
    publicUrl: string;
  };
  message?: string;
}

export function useFileUpload() {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = useCallback(async (file: File) => {
    setIsUploading(true);

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
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const deleteFile = useCallback(async (key: string) => {
    const response = await fetch("/api/uploads/sign", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    });
    const result: { success: boolean; message?: string } =
      await response.json();
    if (!response.ok || !result.success) {
      return { ok: false, error: result.message || "Delete failed" };
    }
    return { ok: true };
  }, []);

  return { uploadFile, deleteFile, progress, isUploading };
}
