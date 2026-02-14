"use client";

import { Button } from "@/components/ui/button";
import { useImageUpload } from "@/hooks/use-image-upload";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

interface LogoUploadProps {
  value?: string;
  onChange: (url?: string) => void;
  disabled?: boolean;
}

const MAX_FILE_SIZE_MB = 5;

export default function LogoUpload({
  value,
  onChange,
  disabled = false,
}: LogoUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { uploadImage } = useImageUpload();
  const handleSelectFile = async (file?: File) => {
    if (!file) {
      return;
    }

    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setIsUploading(true);

    try {
      const uploadMetaResponse = await uploadImage(file);

      if (!uploadMetaResponse?.url) {
        setError("Failed to upload.");
        setIsUploading(false);
        return;
      }

      onChange(uploadMetaResponse.url);
      return uploadMetaResponse.url;
    } catch (uploadError) {
      console.error("Logo upload error:", uploadError);
      setError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg border bg-muted">
          {value ? (
            <img
              src={value}
              alt="Launch logo"
              className="h-full w-full object-cover"
            />
          ) : (
            <ImagePlus className="h-5 w-5 text-muted-foreground" />
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
            className="hidden"
            onChange={(event) => handleSelectFile(event.target.files?.[0])}
            disabled={disabled || isUploading}
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || isUploading}
            onClick={() => inputRef.current?.click()}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                Uploading
              </>
            ) : (
              "Upload image"
            )}
          </Button>

          {value ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={disabled || isUploading}
              onClick={() => onChange(undefined)}
              aria-label="Remove logo"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </div>

      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
