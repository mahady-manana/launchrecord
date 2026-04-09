"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Check, Star, Zap } from "lucide-react";
import Link from "next/link";

interface AuditUpgradeCardProps {
  planType?: "free" | "onetime";
  used: number;
  limit: number;
  errorMessage: string;
  productId: string;
  onBack?: () => void;
}

const planBenefits = {
  onetime: [
    "5 full SIO-V5 audits",
    "Complete reports with all insights",
    "Positioning insights & fixes",
    "PosiMessaging insights & fixes",
    "Pay once, use forever",
  ],
  founder: [
    "Unlimited SIO-V5 audits",
    "Weekly Auto Audit",
    "Competitor Spy",
    "Private Audit Mode",
    "Historical Analytics",
    "Strategy Recommendations",
  ],
};

export function AuditUpgradeCard({
  planType = "free",
  used,
  limit,
  errorMessage,
  productId,
  onBack,
}: AuditUpgradeCardProps) {
  return (
    <Card className="border-2 border-orange-200 shadow-xl">
      <CardHeader className="text-center pb-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center mb-4">
          <Star className="h-8 w-8 text-orange-600" />
        </div>
        <CardTitle className="text-2xl text-orange-600">
          {planType === "free" ? "Unlock More Audits" : "All Audits Used"}
        </CardTitle>
        <CardDescription className="text-base mt-2">
          {planType === "free"
            ? `You've used your 1 free audit. Upgrade to keep going!`
            : `You've used all ${limit} audits included in your plan.`}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Usage Summary */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-600">Audits Used</span>
            <span className="font-semibold text-slate-900">
              {used} / {limit}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="h-full bg-orange-500 rounded-full"
              style={{ width: `${Math.min((used / limit) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Plan Options */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* One-Time Pass */}
          <Card className="border-2 border-orange-200 bg-gradient-to-b from-orange-50 to-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">One-Time Pass</CardTitle>
                <Badge className="bg-orange-100 text-orange-700">
                  Most Popular
                </Badge>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-orange-600">$29</span>
                <span className="text-slate-500 text-sm">one-time</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {planBenefits.onetime.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              >
                <Link href={`/dashboard/${productId}/subscription`}>
                  Get 5 Audits <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Founder Plan */}
          <Card className="border-2 border-primary bg-gradient-to-b from-primary/5 to-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Founder Plan</CardTitle>
                <Badge className="bg-primary/10 text-primary">Best Value</Badge>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-primary">$49</span>
                <span className="text-slate-500 text-sm">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {planBenefits.founder.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary hover:to-primary/80"
              >
                <Link href={`/dashboard/${productId}/subscription`}>
                  Go Unlimited <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-6">
        {onBack && (
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
