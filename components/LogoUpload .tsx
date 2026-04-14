"use client";

import { useFileUpload } from "@/hooks/use-file-upload";
import { UploadCloud } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface ImageUploadProps {
  value?: string | null;
  onChange: (value: string) => void;
  onRemove?: () => void;
}

export function LogoUpload({ value, onChange, onRemove }: ImageUploadProps) {
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
    <div className="gap-4 flex items-center">
      {value ? (
        <div className="flex items-center text-sm text-slate-500">
          <div className="h-20 w-20 rounded-lg border border-slate-200 bg-white flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Logo preview" className="h-15 w-15" />
          </div>
        </div>
      ) : null}
      <div
        {...getRootProps()}
        className={`flex w-30 h-20 cursor-pointer flex-col items-center relative justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/40 px-6 text-center transition ${
          isDragActive ? "border-primary bg-primary/10" : ""
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="size-6 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">Upload logo.</p>
        {isUploading ? (
          <p className="text-xs text-muted-foreground">Uploading {progress}%</p>
        ) : null}
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
