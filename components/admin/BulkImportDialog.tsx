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
import { Upload } from "lucide-react";

interface BulkImportDialogProps {
  onImport: (data: any[]) => void;
}

export function BulkImportDialog({ onImport }: BulkImportDialogProps) {
  const [open, setOpen] = useState(false);
  const [jsonData, setJsonData] = useState("");

  const handleImport = () => {
    try {
      const parsedData = JSON.parse(jsonData);

      if (!Array.isArray(parsedData)) {
        alert("Please provide a valid JSON array of products");
        return;
      }

      onImport(parsedData);
      setOpen(false);
      setJsonData("");
    } catch (error: any) {
      alert(error.message || "Invalid JSON format");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Bulk Import
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Import Products</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Paste your JSON array of products. Each product should have:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>name (required)</li>
              <li>website (required)</li>
              <li>tagline (optional, used as description)</li>
              <li>topics (optional, array of topic names)</li>
            </ul>
          </div>
          <Textarea
            value={jsonData}
            onChange={(e) => setJsonData(e.target.value)}
            placeholder={`[
  {
    "name": "Product Name",
    "website": "https://example.com",
    "tagline": "Product tagline",
    "topics": ["AI", "SaaS"]
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
            >
              Cancel
            </Button>
            <Button onClick={handleImport} className="gap-2">
              <Upload className="h-4 w-4" />
              Import & Start Audits
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
