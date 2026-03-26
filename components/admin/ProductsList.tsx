"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import clsx from "clsx";
import {
  Check,
  ExternalLink,
  Loader2,
  Pencil,
  RefreshCw,
  TrendingUp,
  X,
} from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";

interface Product {
  _id: string;
  name: string;
  website: string;
  tagline?: string;
  description?: string;
  score?: number;
  logo?: string;
  addedByAdmin?: boolean;
  metadata?: {
    phUrl?: string;
  };
  reports?: Array<{
    overallScore: number;
    status: string;
    createdAt: string;
  }>;
}

interface ProductsListProps {
  products: Product[];
  loading: boolean;
  onAudit: (product: Product) => void;
  selectedProducts: Set<string>;
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onUpdateWebsite?: (productId: string, website: string) => void;
}

export function ProductsList({
  products,
  loading,
  onAudit,
  selectedProducts,
  onToggleSelect,
  onSelectAll,
  onUpdateWebsite,
}: ProductsListProps) {
  const [filterNoWebsite, setFilterNoWebsite] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingUrl, setEditingUrl] = useState("");

  const allSelected =
    products.length > 0 && selectedProducts.size === products.length;
  const someSelected =
    selectedProducts.size > 0 && selectedProducts.size < products.length;

  const filteredProducts = filterNoWebsite
    ? products.filter((p) => !p.website)
    : products;

  const handleStartEdit = (product: Product) => {
    setEditingId(product._id);
    setEditingUrl(product.website || product.metadata?.phUrl || "");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingUrl("");
  };

  const handleSaveEdit = (productId: string) => {
    if (onUpdateWebsite && editingUrl.trim()) {
      onUpdateWebsite(productId, editingUrl.trim());
    }
    setEditingId(null);
    setEditingUrl("");
  };

  return (
    <div className="space-y-2">
      {/* Header with select all and filter */}
      <div className="flex items-center justify-between gap-3 px-4 py-2 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={allSelected}
            onCheckedChange={onSelectAll}
            className="h-4 w-4"
          />
          <span className="text-sm text-muted-foreground">
            {selectedProducts.size} selected
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="filter-no-website"
            checked={filterNoWebsite}
            onCheckedChange={(checked) =>
              setFilterNoWebsite(checked as boolean)
            }
            className="h-4 w-4"
          />
          <Label
            htmlFor="filter-no-website"
            className="text-sm font-normal cursor-pointer"
          >
            No website ({products.filter((p) => !p.website).length})
          </Label>
        </div>
      </div>

      {/* Product list */}
      <div className="space-y-2">
        {filteredProducts.map((product) => {
          const hasAudit = product.score;
          const score = product.score || product.reports?.[0]?.overallScore;
          const isSelected = selectedProducts.has(product._id);
          const isEditing = editingId === product._id;

          return (
            <div
              key={product._id}
              className={clsx(
                "flex items-center gap-3 p-3 border rounded-lg transition-colors",
                isSelected
                  ? "bg-green-50 border-green-300"
                  : "hover:bg-muted/50",
              )}
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onToggleSelect(product._id)}
                className="h-4 w-4 shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex gap-3">
                  <div>
                    <img
                      src={product.logo || "/logo.svg"}
                      height={32}
                      width={32}
                      alt=""
                      className={clsx(
                        "w-12 h-12 object-cover",
                        !product.logo && "opacity-50",
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">
                        {product.name}
                      </span>

                      {product.addedByAdmin && (
                        <Badge variant="secondary" className="text-xs">
                          Admin
                        </Badge>
                      )}
                    </div>
                    {product.tagline && (
                      <p className="text-xs text-muted-foreground truncate">
                        {product.tagline}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-1">
                      {hasAudit ? (
                        <div className="flex items-center gap-1 text-xs">
                          <TrendingUp className="h-3 w-3" />
                          <span className="font-medium">{score}</span>
                        </div>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          Not Audited
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isEditing ? (
                  <>
                    <Input
                      value={editingUrl}
                      onChange={(e) => setEditingUrl(e.target.value)}
                      placeholder="Paste URL..."
                      className="h-8 w-48"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveEdit(product._id);
                        if (e.key === "Escape") handleCancelEdit();
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSaveEdit(product._id)}
                      disabled={loading || !editingUrl.trim()}
                      className="h-8"
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                      className="h-8"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAudit(product)}
                      disabled={loading}
                      className="h-8"
                    >
                      {loading ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <>
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Audit
                        </>
                      )}
                    </Button>
                    <ProductDialog product={product} />
                    {!product.website && onUpdateWebsite && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartEdit(product)}
                        className="h-8"
                        title="Add website URL"
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                    )}
                    {product.website ? (
                      <a
                        href={product.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary shrink-0 w-8 flex justify-center bg-green-700 h-8 items-center rounded-md text-white"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : product.metadata?.phUrl ? (
                      <a
                        href={product.metadata.phUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary shrink-0 w-8 flex justify-center bg-blue-500 h-8 items-center rounded-md text-white"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProductDialog({ product }: { product: Product }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product.name} - Audit Report</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="grid gap-2">
            <Label>Website</Label>
            <a
              href={product.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {product.website}
            </a>
          </div>
          {product.tagline && (
            <div className="grid gap-2">
              <Label>Tagline</Label>
              <p>{product.tagline}</p>
            </div>
          )}
          {product.description && (
            <div className="grid gap-2">
              <Label>Description</Label>
              <p>{product.description}</p>
            </div>
          )}
          {product.reports && product.reports.length > 0 && (
            <div className="grid gap-2">
              <Label>Latest Score</Label>
              <div className="text-2xl font-bold">
                {product.reports[0].overallScore}/100
              </div>
              <Badge>{product.reports[0].status}</Badge>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
