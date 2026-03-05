"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const token = searchParams.get("token");
    const verified = searchParams.get("verified");

    if (verified === "true") {
      setStatus("success");
      return;
    }

    if (!token) {
      setStatus("error");
      setErrorMessage("Missing verification token");
      return;
    }

    // Automatically verify the email
    fetch(`/api/auth/verify-email?token=${token}`)
      .then((res) => {
        if (res.ok) {
          setStatus("success");
        } else {
          return res.json().then((data) => {
            setStatus("error");
            setErrorMessage(data.error || "Verification failed");
          });
        }
      })
      .catch(() => {
        setStatus("error");
        setErrorMessage("Network error. Please try again.");
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {status === "verifying" && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <CardTitle>Verifying Your Email</CardTitle>
              <CardDescription>
                Please wait while we verify your email address...
              </CardDescription>
            </>
          )}
          {status === "success" && (
            <>
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <CardTitle>Email Verified!</CardTitle>
              <CardDescription>
                Your email has been successfully verified. You can now sign in to your account.
              </CardDescription>
            </>
          )}
          {status === "error" && (
            <>
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <CardTitle>Verification Failed</CardTitle>
              <CardDescription>
                {errorMessage || "Unable to verify your email. Please try again."}
              </CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {status === "success" && (
            <Button asChild className="w-full">
              <Link href="/login">Sign In</Link>
            </Button>
          )}
          {status === "error" && (
            <>
              <Button asChild variant="outline" className="w-full">
                <Link href="/register">Create New Account</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/login">Back to Login</Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
