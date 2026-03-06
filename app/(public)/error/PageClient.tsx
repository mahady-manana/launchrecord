"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ERROR_MESSAGES: Record<string, string> = {
  CredentialsSignin: "Invalid email or password.",
  AccessDenied: "Access denied.",
  Configuration: "Auth configuration error.",
};

function ErrorContent() {
  const params = useSearchParams();
  const error = params.get("error") || "";
  const message = ERROR_MESSAGES[error] || "Something went wrong.";

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 py-10">
      <Card className="border-border/80 shadow-lg shadow-slate-200/40">
        <CardHeader>
          <CardTitle>Authentication error</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{message}</p>
          <Button asChild className="w-full">
            <Link href="/login">Return to login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
