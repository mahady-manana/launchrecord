"use client";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle, Loader2, Mail } from "lucide-react";
import { useState } from "react";

interface SurveyAnswers {
  founderName: string;
  saasName: string;
  saasUrl: string;
  role: string;
  teamSize: string;
  revenue: string;
  biggestChallenge: string;
  aeoAwareness: string;
  description: string;
  willingToInvest: string;
}

interface SurveyAuthProps {
  answers: SurveyAnswers;
  productId: string | null;
  onBack: () => void;
  onAuthComplete: () => void;
  isClaimFlow?: boolean;
}

export function SurveyAuth({ answers, productId, onBack, isClaimFlow = false }: SurveyAuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [authMode, setAuthMode] = useState<"signup" | "login">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(answers.founderName || "");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      sessionStorage.setItem(
        "pendingSurveyData",
        JSON.stringify({
          productId,
          answers,
          email,
        }),
      );
      await signIn("credentials", {
        name,
        email,
        password,
        signup: "true",
        callbackUrl: "/dashboard/audit?product=" + productId,
      });
    } catch (err: any) {
      setError(err.message || "Failed to create account");
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Use NextAuth signIn
      sessionStorage.setItem(
        "pendingSurveyData",
        JSON.stringify({
          productId,
          answers,
          email,
        }),
      );
      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/dashboard/audit?product=" + productId,
      });
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="border-2 border-orange-200 mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {isClaimFlow ? (
                <>
                  <span>
                    Complete Your Claim & <br /> Create Your Account
                  </span>
                </>
              ) : (
                <>
                  <span>
                    Generate SIO V5 Audit & <br /> Create Your Account
                  </span>
                </>
              )}
            </CardTitle>
            <CardDescription className="text-center">
              {isClaimFlow
                ? "Sign in to verify ownership and complete your product information in the dashboard"
                : "Sign up to save your survey and generate your audit report"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Toggle between signup and login */}
            <div className="flex gap-2">
              <Button
                variant={authMode === "signup" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setAuthMode("signup")}
              >
                Sign Up
              </Button>
              <Button
                variant={authMode === "login" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setAuthMode("login")}
              >
                Log In
              </Button>
            </div>

            <Button
              onClick={() => {
                sessionStorage.setItem(
                  "pendingSurveyData",
                  JSON.stringify({
                    productId,
                    answers,
                  }),
                );
                signIn("google", {
                  callbackUrl: "/dashboard/audit?product=" + productId,
                });
              }}
              disabled={isLoading}
              variant="outline"
              className="w-full h-12"
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or sign up with email
                </span>
              </div>
            </div>
            {authMode === "signup" ? (
              <>
                {/* Google Sign Up */}

                {/* Email/Password Signup */}
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12"
                      required
                      minLength={8}
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-orange-600 hover:bg-orange-700"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Create & Audit my Record
                      </>
                    )}
                  </Button>
                </form>
              </>
            ) : (
              /* Login Form */
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-orange-600 hover:bg-orange-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>
            )}

            <div className="flex gap-4 pt-4 border-t">
              <Button
                onClick={onBack}
                variant="outline"
                className="flex-1 h-12"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          🔒 Your data is secure. By signing up, you agree to our Terms of
          Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
