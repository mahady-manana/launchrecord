"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, Save } from "lucide-react";

interface BulkSaveDialogProps {
  onSave: (data: any[]) => Promise<void>;
}

export function BulkSaveDialog({ onSave }: BulkSaveDialogProps) {
  const [open, setOpen] = useState(false);
  const [jsonData, setJsonData] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      const parsedData = JSON.parse(jsonData);

      if (!Array.isArray(parsedData)) {
        alert("Please provide a valid JSON array of products");
        return;
      }

      setIsSaving(true);
      await onSave(parsedData);
      setOpen(false);
      setJsonData("");
    } catch (error: any) {
      alert(error.message || "Invalid JSON format");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Save className="h-4 w-4" />
          Bulk Save (No Audit)
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Save Products (Without Running Audits)</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Paste your JSON array of products to save them without running audits.
            This is useful for pre-populating the database.
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>name (required)</li>
              <li>website (required)</li>
              <li>tagline (optional)</li>
              <li>description (optional)</li>
              <li>logo (optional, URL)</li>
              <li>metadata (optional, object)</li>
            </ul>
            <p className="mt-2 text-orange-600 font-medium">
              Note: Products are matched by normalized URL to prevent duplicates.
            </p>
          </div>
          <Textarea
            value={jsonData}
            onChange={(e) => setJsonData(e.target.value)}
            placeholder={`[
  {
    "name": "Product Name",
    "website": "https://example.com",
    "tagline": "Product tagline",
    "description": "Product description",
    "logo": "https://example.com/logo.png",
    "metadata": {
      "source": "manual",
      "phRating": 5,
      "customField": "value"
    }
  }
]`}
            rows={12}
            className="font-mono text-sm"
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} className="gap-2" disabled={isSaving}>
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Products Only"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
