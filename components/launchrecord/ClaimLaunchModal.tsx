"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ClaimLaunchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slug: string;
  onSuccess?: () => void;
}

export function ClaimLaunchModal({
  open,
  onOpenChange,
  slug,
  onSuccess,
}: ClaimLaunchModalProps) {
  const [claimKey, setClaimKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/launches/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, claimKey }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to claim launch");
      }

      onSuccess?.();
      onOpenChange(false);
      setClaimKey("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to claim launch");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Claim This Launch</DialogTitle>
          <DialogDescription>
            Enter the claim key to take ownership of this launch. If you don&apos;t have
            a claim key, please contact support.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleClaim}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="claimKey">Claim Key</Label>
              <Input
                id="claimKey"
                value={claimKey}
                onChange={(e) => setClaimKey(e.target.value)}
                placeholder="LR_XXXXXXXXXXXXXXXX"
                disabled={isLoading}
                autoComplete="off"
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Claiming..." : "Claim Launch"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
