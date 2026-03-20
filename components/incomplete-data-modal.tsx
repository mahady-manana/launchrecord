"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProductStore } from "@/stores/product-store";
import { AlertTriangle, Globe, Image, List, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface IncompleteDataModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface MissingField {
  key: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const missingFields: MissingField[] = [
  {
    key: "logo",
    label: "Logo",
    icon: <Image className="h-5 w-5" />,
    description: "Add your product logo for better brand recognition",
  },
  {
    key: "tagline",
    label: "Tagline",
    icon: <Tag className="h-5 w-5" />,
    description: "Add a catchy tagline that describes your value proposition",
  },
  {
    key: "description",
    label: "Description",
    icon: <Globe className="h-5 w-5" />,
    description: "Add a detailed description of your product",
  },
  {
    key: "topics",
    label: "Topics",
    icon: <List className="h-5 w-5" />,
    description: "Add relevant topics for better categorization",
  },
];

export function IncompleteDataModal({
  open,
  onOpenChange,
}: IncompleteDataModalProps) {
  const router = useRouter();
  const { selectedProduct, updateProduct } = useProductStore();
  const [missingItems, setMissingItems] = useState<MissingField[]>([]);

  useEffect(() => {
    if (!selectedProduct || !open) return;

    const missing = missingFields.filter((field) => {
      const value = selectedProduct[field.key as keyof typeof selectedProduct];
      if (field.key === "topics") {
        return Array.isArray(value) && value.length;
      }
      return !value || (typeof value === "string" && value.trim() === "");
    });

    setMissingItems(missing);
  }, [selectedProduct, open]);

  const handleComplete = () => {
    if (!selectedProduct) return;
    router.push(`/dashboard/${selectedProduct.id}/settings`);
    onOpenChange(false);
  };

  const hasMissingData = missingItems.length > 0;

  if (!hasMissingData) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <DialogTitle className="text-xl">
              Complete Your Product Information
            </DialogTitle>
          </div>
          <DialogDescription className="text-left pt-2">
            Your product profile is incomplete. Adding these details will
            improve your audit accuracy and brand presentation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {missingItems.map((field) => (
            <div
              key={field.key}
              className="flex items-start gap-3 p-3 border rounded-lg bg-slate-50"
            >
              <div className="p-2 bg-white rounded-md text-orange-600">
                {field.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-slate-900">{field.label}</h4>
                <p className="text-sm text-slate-600 mt-1">
                  {field.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button
            onClick={handleComplete}
            className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto"
          >
            Complete Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
