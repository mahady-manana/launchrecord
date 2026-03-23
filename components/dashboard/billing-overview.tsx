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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, CreditCard, TrendingUp } from "lucide-react";

interface ProductBilling {
  productId: string;
  productName: string;
  plan: "free" | "starter" | "pro" | "enterprise";
  status: "active" | "past_due" | "canceled" | "trialing";
  nextInvoiceDate?: string;
  nextInvoiceAmount?: number;
  usage?: {
    // SIO Audit usage
    sioAuditsUsed?: number;
    sioAuditsLimit?: number;
    // Positioning Audit usage
    positioningAuditsUsed?: number;
    positioningAuditsLimit?: number;
    // Legacy fields for backward compatibility
    auditsUsed?: number;
    auditsLimit?: number;
    // Common
    productsUsed?: number;
    productsLimit?: number;
  };
}

interface BillingOverviewProps {
  billings: ProductBilling[];
  onManageBilling?: (productId: string) => void;
  onUpgrade?: (productId: string) => void;
  className?: string;
}

const planColors: Record<string, string> = {
  free: "bg-gray-100 text-gray-700",
  starter: "bg-blue-100 text-blue-700",
  pro: "bg-purple-100 text-purple-700",
  enterprise: "bg-green-100 text-green-700",
};

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  past_due: "bg-orange-100 text-orange-700",
  canceled: "bg-red-100 text-red-700",
  trialing: "bg-blue-100 text-blue-700",
};

const planFeatures: Record<string, string> = {
  free: "Free Tier",
  starter: "Starter Plan",
  pro: "Pro Plan",
  enterprise: "Enterprise",
};

export function BillingOverview({
  billings,
  onManageBilling,
  onUpgrade,
  className,
}: BillingOverviewProps) {
  const totalMonthly = billings.reduce((sum, b) => {
    if (b.plan === "starter") return sum + 29;
    if (b.plan === "pro") return sum + 79;
    if (b.plan === "enterprise") return sum + 199;
    return sum;
  }, 0);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-orange-600" />
            <div>
              <CardTitle>Billing Overview</CardTitle>
              <CardDescription>
                Manage your product subscriptions
              </CardDescription>
            </div>
          </div>
          {totalMonthly > 0 && (
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Total Monthly</div>
              <div className="text-xl font-bold">${totalMonthly}</div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {billings.length === 0 ? (
          <div className="flex items-center gap-4 p-6 text-center text-muted-foreground">
            <AlertCircle className="h-8 w-8" />
            <div>
              <div className="font-medium">No billing information yet</div>
              <div className="text-sm">
                Billing will be set up when you run your first audit
              </div>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Next Invoice</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billings.map((billing) => (
                <TableRow key={billing.productId}>
                  <TableCell className="font-medium">
                    {billing.productName}
                  </TableCell>
                  <TableCell>
                    <Badge className={planColors[billing.plan]}>
                      {planFeatures[billing.plan]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[billing.status]}>
                      {billing.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {billing.nextInvoiceDate ? (
                      <div>
                        <div className="font-medium">
                          ${billing.nextInvoiceAmount?.toFixed(2) || "0.00"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {billing.nextInvoiceDate}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {billing.usage ? (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 w-24">
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-600 rounded-full"
                              style={{
                                width: `${
                                  ((billing.usage.sioAuditsUsed ||
                                    billing.usage.auditsUsed ||
                                    0) /
                                    (billing.usage.sioAuditsLimit ||
                                      billing.usage.auditsLimit ||
                                      1)) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {billing.usage.sioAuditsUsed ||
                              billing.usage.auditsUsed ||
                              0}
                            /
                            {billing.usage.sioAuditsLimit ||
                              billing.usage.auditsLimit ||
                              1}{" "}
                            audits
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Unlimited</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {billing.plan === "free" && onUpgrade && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUpgrade(billing.productId)}
                        >
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Upgrade
                        </Button>
                      )}
                      {onManageBilling && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onManageBilling(billing.productId)}
                        >
                          Manage
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      {billings.length > 0 && (
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            Manage your subscription and billing details
          </div>
          <Button variant="outline" size="sm">
            <CreditCard className="h-4 w-4 mr-2" />
            Billing Settings
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
