"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import clsx from "clsx";
import { ExternalLink, Loader2, RefreshCw, TrendingUp } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  website: string;
  tagline?: string;
  description?: string;
  score?: number;
  logo?: string;
  addedByAdmin?: boolean;
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
}

export function ProductsList({
  products,
  loading,
  onAudit,
}: ProductsListProps) {
  return (
    <div className="space-y-3">
      {products.map((product) => {
        const hasAudit = product.score;
        const score = product.score || product.reports?.[0]?.overallScore;

        return (
          <div
            key={product._id}
            className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex gap-4">
                <div>
                  <img
                    src={product.logo || "/logo.svg"}
                    height={40}
                    width={40}
                    alt=""
                    className={clsx(
                      "w-full h-full object-cover",
                      !product.logo && "opacity-50",
                    )}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{product.name}</span>
                    <a
                      href={product.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    {product.addedByAdmin && (
                      <Badge variant="secondary" className="text-xs">
                        Admin
                      </Badge>
                    )}
                  </div>
                  {product.tagline && (
                    <p className="text-sm text-muted-foreground truncate">
                      {product.tagline}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 mt-2">
                {hasAudit ? (
                  <>
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingUp className="h-3 w-3" />
                      <span className="font-medium">{score}</span>
                    </div>
                  </>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    Not Audited
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAudit(product)}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Audit
                  </>
                )}
              </Button>
              <ProductDialog product={product} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProductDialog({ product }: { product: Product }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View Report
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
