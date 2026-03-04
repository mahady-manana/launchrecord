"use client";

import { EarlyDashboard } from "@/components/early-dashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AuditReportV1 } from "@/types/audit-report-v1";
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  Rocket,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [report, setReport] = useState<AuditReportV1 | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch latest audit report for this user
    const fetchReport = async () => {
      try {
        // In production, this would fetch from /api/user/audits or similar
        // For now, we'll check localStorage or fetch from a user-specific endpoint
        const response = await fetch("/api/user/audits/latest");
        if (response.ok) {
          const data = await response.json();
          setReport(data.report);
        }
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, []);

  // Show full report if available
  if (report) {
    return <EarlyDashboard report={report} showNavigation={false} />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
      {/* Hero Banner */}
      <div className="text-center space-y-4">
        <Badge className="bg-orange-600 hover:bg-orange-700">
          <Rocket className="h-3 w-3 mr-1" />
          Launching Soon
        </Badge>
        <h1 className="text-5xl font-bold text-foreground">
          Early Access Dashboard
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          LaunchRecord is launching soon! As an early access member, you'll get
          exclusive access to daily news, development progress, and powerful
          positioning tools.
        </p>
      </div>

      {/* Coming Soon Features */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-600" />
              <CardTitle>Daily News</CardTitle>
            </div>
            <CardDescription>
              Curated insights on AEO, positioning, and SaaS growth
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Coming in 2-3 weeks</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-orange-600" />
              <CardTitle>Development Progress</CardTitle>
            </div>
            <CardDescription>
              Track our roadmap and vote on feature priorities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Coming in 2-3 weeks</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-orange-600" />
              <CardTitle>Audit History</CardTitle>
            </div>
            <CardDescription>
              Track your positioning score over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Coming in 2-3 weeks</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Your Latest Audit */}
      {isLoading ? (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <CardTitle>Your Latest Audit</CardTitle>
            </div>
            <CardDescription>Loading your report...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <CardTitle>No Audit Found</CardTitle>
            </div>
            <CardDescription>
              Complete the survey to generate your first audit report
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => (window.location.href = "/survey")}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Start Free Audit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Notify on Launch */}
      <Card className="border-2 border-green-200 bg-green-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-green-600" />
            <CardTitle>Get Notified on Launch</CardTitle>
          </div>
          <CardDescription>
            Be the first to know when LaunchRecord goes live
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <p className="text-sm text-green-700 flex-1">
              As an early access member, you'll get priority access and special
              founding member pricing when we launch.
            </p>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <CheckCircle className="h-4 w-4 mr-2" />
              You're on the list!
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground pt-8 border-t">
        <p>LaunchRecord - Sovereign Defensibility for SaaS Founders</p>
        <p className="mt-2">
          Questions? Reach out at{" "}
          <a
            href="mailto:hello@launchrecord.com"
            className="text-orange-600 hover:underline"
          >
            hello@launchrecord.com
          </a>
        </p>
      </div>
    </div>
  );
}
