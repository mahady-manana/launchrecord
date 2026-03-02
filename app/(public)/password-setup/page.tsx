"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function PasswordSetupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");
  const plan = searchParams.get("plan");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [setupMethod, setSetupMethod] = useState<"password" | "google">(
    "password",
  );

  const passwordValid = password.length >= 8 && password === confirmPassword;

  const handleSetPassword = async () => {
    if (!passwordValid) {
      alert("Password must be at least 8 characters and passwords must match");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          sessionId,
        }),
      });

      if (!response.ok) throw new Error("Password setup failed");

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      alert("Error setting up password");
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    // In production, this would trigger Google OAuth
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <Badge className="mx-auto bg-green-100 text-green-800 border-green-300">
            ✅ Payment Confirmed
          </Badge>
          <h1 className="text-3xl font-bold text-foreground">
            Secure Your Account
          </h1>
          <p className="text-muted-foreground">
            Just one more step before you see your personalized dashboard
          </p>
        </div>

        {/* Method Selector */}
        <div className="grid grid-cols-2 gap-4">
          <Card
            className={`cursor-pointer transition-all ${
              setupMethod === "password"
                ? "border-2 border-green-600 bg-green-50"
                : "border border-border"
            }`}
            onClick={() => setSetupMethod("password")}
          >
            <CardContent className="p-4 text-center">
              <Lock className="h-6 w-6 mx-auto mb-2 text-foreground" />
              <p className="font-medium text-sm">Password</p>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all ${
              setupMethod === "google"
                ? "border-2 border-green-600 bg-green-50"
                : "border border-border"
            }`}
            onClick={() => setSetupMethod("google")}
          >
            <CardContent className="p-4 text-center">
              <p className="text-lg mb-1">🔵</p>
              <p className="font-medium text-sm">Google</p>
            </CardContent>
          </Card>
        </div>

        {/* Password Setup */}
        {setupMethod === "password" ? (
          <Card className="border-2 border-green-300 bg-white">
            <CardHeader>
              <CardTitle>Create a Strong Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {password.length >= 8 ? "✅" : "❌"} At least 8 characters
                </p>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
                <p className="text-xs text-muted-foreground">
                  {confirmPassword && password === confirmPassword
                    ? "✅"
                    : confirmPassword && password !== confirmPassword
                      ? "❌"
                      : ""}{" "}
                  Passwords match
                </p>
              </div>

              {/* CTA Button */}
              <Button
                onClick={handleSetPassword}
                disabled={!passwordValid || isLoading}
                className="w-full h-12 bg-green-600 hover:bg-green-700"
              >
                {isLoading ? "Setting Up..." : "Go to Dashboard"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-green-300 bg-white">
            <CardHeader>
              <CardTitle>Sign Up with Google</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Quick sign-up with your Google account
              </p>
              <Button
                onClick={handleGoogleSignup}
                disabled={isLoading}
                variant="outline"
                className="w-full h-12"
              >
                <span className="mr-2">🔵</span>
                Continue with Google
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-sm text-blue-800">
            🎉 Your dashboard is ready! One more step and you'll see all your
            recommendations.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PasswordSetupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PasswordSetupContent />
    </Suspense>
  );
}
