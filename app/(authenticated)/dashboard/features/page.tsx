"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFileUpload } from "@/hooks/use-file-upload";
import { ExternalLink, FileText, Trash2, UploadCloud } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

type UploadedFile = {
  name: string;
  size: number;
  key: string;
  publicUrl: string;
};

const formatBytes = (bytes: number) => {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / 1024 ** index;
  return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

export default function FeaturesDemoPage() {
  const { uploadFile, deleteFile, progress, isUploading } = useFileUpload();
  const [uploaded, setUploaded] = useState<UploadedFile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError(null);
      const file = acceptedFiles[0];
      if (!file) return;
      const result = await uploadFile(file);
      if (!result) {
        setError("Upload failed.");
        return;
      }
      setUploaded({
        name: file.name,
        size: file.size,
        key: result.key,
        publicUrl: result.url,
      });
    },
    [uploadFile],
  );

  const handleRemove = async () => {
    setUploaded(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  return (
    <div className="space-y-6 text-foreground">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Playground
        </p>
        <h1 className="mt-2 text-2xl font-semibold">Features demo</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Test core integrations and UI building blocks from here.
        </p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <UploadCloud className="size-4" /> Upload test (react-dropzone)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {uploaded ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-muted/40 px-4 py-3">
              <div className="flex items-center gap-3">
                <FileText className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{uploaded.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(uploaded.size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={uploaded.publicUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  View file <ExternalLink className="size-3" />
                </a>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRemove}
                >
                  <Trash2 className="mr-1 size-4" />
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className={`flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/40 px-6 text-center transition ${
                isDragActive ? "border-primary/60 bg-primary/10" : ""
              }`}
            >
              <input {...getInputProps()} />
              <UploadCloud className="size-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag and drop a file here, or click to upload.
              </p>
              {isUploading ? (
                <p className="text-xs text-muted-foreground">Uploading {progress}%</p>
              ) : (
                <p className="text-xs text-muted-foreground">Max 1 file.</p>
              )}
            </div>
          )}
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
