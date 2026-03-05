"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Loader2, Mail, ShieldAlert, XCircle } from "lucide-react";
import { useState } from "react";

interface ClaimProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productName: string;
  productWebsite: string;
  onClaimSuccess: () => void;
  alreadyClaimed?: boolean;
}

export function ClaimProductDialog({
  open,
  onOpenChange,
  productId,
  productName,
  productWebsite,
  onClaimSuccess,
  alreadyClaimed = false,
}: ClaimProductDialogProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  // If product is already claimed, show different UI
  if (alreadyClaimed) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              Product Already Claimed
            </DialogTitle>
            <DialogDescription>
              This product cannot be claimed
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-sm font-medium">
              {productName} has already been claimed by another user.
            </p>
            <p className="text-xs text-muted-foreground">
              Only the owner of a product can claim it. If you believe this is an error, please contact support.
            </p>
          </div>

          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="w-full"
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/products/claim/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Verification email sent! Please check your inbox.");
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to send verification email");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      setTimeout(() => {
        setEmail("");
        setStatus("idle");
        setMessage("");
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" />
            Claim This Product
          </DialogTitle>
          <DialogDescription>
            Verify you own {productName} to claim it.
          </DialogDescription>
        </DialogHeader>

        {status === "success" ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
            <p className="text-sm font-medium mb-2">{message}</p>
            <p className="text-xs text-muted-foreground">
              Click the link in the email to complete your claim and sign in.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSendEmail}>
            <div className="grid gap-4 py-4">
              <Alert>
                <ShieldAlert className="h-4 w-4" />
                <AlertDescription>
                  This product ({productName}) already exists in our database.
                  To claim ownership, enter your email with the product domain.
                </AlertDescription>
              </Alert>
              <div className="grid gap-2">
                <Label htmlFor="claim-email">
                  Work Email (must match product domain)
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="claim-email"
                    type="email"
                    placeholder={`you@${productWebsite.split("//").pop()?.split("/")[0] || "domain.com"}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    disabled={status === "loading"}
                  />
                </div>
              </div>
              {status === "error" && (
                <p className="text-sm text-destructive">{message}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={status === "loading"}
              className="w-full"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Email...
                </>
              ) : (
                "Send Verification Email"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
