"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Loader2, Mail, ShieldAlert, ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function ClaimProductContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [productId, setProductId] = useState<string | null>(null);
  const [productName, setProductName] = useState("");
  const [productWebsite, setProductWebsite] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const id = searchParams.get("product");
    const name = searchParams.get("name");
    const website = searchParams.get("website");

    if (!id) {
      router.push("/survey");
      return;
    }

    setProductId(id);
    setProductName(name || "Unknown Product");
    setProductWebsite(website || "");
    setIsLoading(false);
  }, [searchParams, router]);

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

  const handleBack = () => {
    router.push("/survey");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto" />
          <p className="text-muted-foreground">Loading claim form...</p>
        </div>
      </div>
    );
  }

  if (!productId) {
    return null;
  }

  const domain = productWebsite.split("//").pop()?.split("/")[0] || "domain.com";

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="border-2 border-orange-200 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="-ml-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <ShieldAlert className="h-6 w-6" />
              Claim This Product
            </CardTitle>
            <CardDescription className="text-base">
              Verify you own {productName} to claim it
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium">{message}</p>
                  <p className="text-sm text-muted-foreground">
                    Click the link in the email to complete your claim.
                    After verification, you&apos;ll be redirected to complete the survey.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendEmail}>
                <div className="grid gap-6">
                  <Alert>
                    <ShieldAlert className="h-4 w-4" />
                    <AlertDescription>
                      This product ({productName}) already exists in our database.
                      To claim ownership, enter your work email with the product domain.
                    </AlertDescription>
                  </Alert>

                  <div className="grid gap-2">
                    <Label htmlFor="claim-email" className="text-base">
                      Work Email (must match product domain)
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="claim-email"
                        type="email"
                        placeholder={`you@${domain}`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12 text-base"
                        required
                        disabled={status === "loading"}
                        autoFocus
                      />
                    </div>
                  </div>

                  {status === "error" && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-600">{message}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full h-12 text-base bg-orange-600 hover:bg-orange-700"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending Email...
                      </>
                    ) : (
                      "Send Verification Email"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ClaimProductPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <ClaimProductContent />
    </Suspense>
  );
}
