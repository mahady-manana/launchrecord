"use client";

import { Button } from "@/components/ui/button";
import { useFileUpload } from "@/hooks/use-file-upload";
import { UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface ImageUploadProps {
  value?: string | null;
  onChange: (value: string) => void;
  onRemove?: () => void;
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const { uploadFile, deleteFile, progress, isUploading } = useFileUpload();
  const publicBaseUrl = process.env.NEXT_PUBLIC_S3_PUBLIC_URL || "";

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError(null);
      const file = acceptedFiles[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadFile(file);
      if (!result) {
        setError("Upload failed");
        return;
      }
      if (result.url) {
        onChange(result.url);
      }
    },
    [onChange, uploadFile],
  );

  const handleRemove = async () => {
    if (value) {
      const normalizedBase = publicBaseUrl.replace(/\/$/, "");
      const key =
        normalizedBase && value.startsWith(normalizedBase)
          ? value.replace(`${normalizedBase}/`, "")
          : value.split("/").slice(-1)[0];
      await deleteFile(key);
    }
    onRemove?.();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border">
          <Image src={value} alt="Uploaded" fill className="object-cover" />
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="absolute right-3 top-3"
            onClick={handleRemove}
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/40 px-6 text-center transition ${
            isDragActive ? "border-primary bg-primary/10" : ""
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud className="size-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Drag and drop an image here, or click to upload.
          </p>
          {isUploading ? (
            <p className="text-xs text-muted-foreground">
              Uploading {progress}%
            </p>
          ) : null}
        </div>
      )}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
