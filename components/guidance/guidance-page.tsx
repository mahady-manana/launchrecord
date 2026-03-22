"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, BookOpen, CheckCircle, ExternalLink, Lightbulb, Target } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface GuidanceSection {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}

interface GuidancePageProps {
  productId: string;
  pillarName: string;
  pillarDescription: string;
  backToDashboard: string;
  children: ReactNode;
}

export function GuidancePage({
  productId,
  pillarName,
  pillarDescription,
  backToDashboard,
  children,
}: GuidancePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/20">
              <Link href={backToDashboard}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
          <h1 className="text-4xl font-bold mb-2">{pillarName} Guide</h1>
          <p className="text-xl text-orange-100">{pillarDescription}</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Quick Navigation */}
        <Card className="mb-8 border-orange-200 bg-orange-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-orange-600" />
              <CardTitle>What You'll Learn</CardTitle>
            </div>
            <CardDescription>
              Understanding this pillar and how to improve your score
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Lightbulb className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold">What it is</p>
                  <p className="text-xs text-muted-foreground">
                    Understand the concept
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Target className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Why it matters</p>
                  <p className="text-xs text-muted-foreground">
                    See the business impact
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold">How to improve</p>
                  <p className="text-xs text-muted-foreground">
                    Actionable steps
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-8">
          {children}
        </div>

        {/* Footer CTA */}
        <Card className="mt-12 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Ready to improve your score?</h3>
                <p className="text-sm text-muted-foreground">
                  Run a new audit to get personalized recommendations
                </p>
              </div>
              <Button asChild>
                <Link href={`/dashboard/${productId}/audit-page`}>
                  Run Audit
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function GuidanceSection({
  title,
  icon,
  children,
}: GuidanceSection) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          {icon && <div className="text-orange-600">{icon}</div>}
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  );
}
