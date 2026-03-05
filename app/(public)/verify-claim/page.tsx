"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyClaimPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      setStatus("error");
      const errorMessages: Record<string, string> = {
        "invalid-token": "Invalid or malformed verification token",
        "already-claimed": "This claim has already been processed",
        expired: "This verification link has expired",
        "product-not-found": "Product not found",
        "server-error": "Server error. Please try again.",
      };
      setErrorMessage(errorMessages[error] || "Unknown error occurred");
      return;
    }

    if (!token) {
      setStatus("error");
      setErrorMessage("Missing verification token");
      return;
    }

    // Verify the claim by calling the API
    fetch("/api/products/claim/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus("success");
          setEmail(data.email);
          // Redirect to login after short delay
          setTimeout(() => {
            router.push(`/login?claim-success=true&email=${encodeURIComponent(data.email)}`);
          }, 2000);
        } else {
          setStatus("error");
          setErrorMessage(data.error || "Verification failed");
        }
      })
      .catch(() => {
        setStatus("error");
        setErrorMessage("Network error. Please try again.");
      });
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {status === "verifying" && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <CardTitle>Verifying Your Claim</CardTitle>
              <CardDescription>
                Please wait while we verify your ownership...
              </CardDescription>
            </>
          )}
          {status === "success" && (
            <>
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <CardTitle>Claim Successful!</CardTitle>
              <CardDescription>
                {email && (
                  <p className="mt-2 text-sm">
                    Redirecting to sign in with <strong>{email}</strong>...
                  </p>
                )}
              </CardDescription>
            </>
          )}
          {status === "error" && (
            <>
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <CardTitle>Claim Failed</CardTitle>
              <CardDescription>
                {errorMessage || "Unable to verify your claim. Please try again."}
              </CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {status === "error" && (
            <>
              <button
                onClick={() => router.push("/survey")}
                className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
              >
                Back to Survey
              </button>
              <button
                onClick={() => router.push("/")}
                className="w-full px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
              >
                Go Home
              </button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
