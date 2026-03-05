"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/dashboard";
  const claimSuccess = params.get("claim-success");
  const claimEmail = params.get("email");
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState(claimEmail || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const result = await login(email, password);
    if (!result.ok) {
      setError(result.error || "Login failed.");
      return;
    }
    // If claim success, redirect to dashboard
    if (claimSuccess) {
      router.push("/dashboard?claimed=true");
    } else {
      router.push(callbackUrl);
    }
    router.refresh();
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 py-10">
      <Card className="border-border/80 shadow-lg shadow-slate-200/40">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
        </CardHeader>
        <CardContent>
          {claimSuccess && (
            <div className="mb-4 rounded-md bg-green-50 p-4 border border-green-200">
              <p className="text-sm font-medium text-green-800">
                🎉 Product claimed successfully!
              </p>
              <p className="text-xs text-green-600 mt-1">
                Sign in with <strong>{claimEmail}</strong> to access your dashboard.
                {claimEmail?.includes('@') && ' A password has been sent to your email.'}
              </p>
            </div>
          )}
          <div className="mb-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => signIn("google", { callbackUrl })}
              disabled={isLoading}
            >
              Continue with Google
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            {error ? (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          No account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Create one
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
