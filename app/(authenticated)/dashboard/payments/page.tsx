"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePayments } from "@/hooks/use-payments";
import { useCreateCheckout } from "@/hooks/use-create-checkout";

export default function PaymentsPage() {
  const { payments } = usePayments();
  const { startCheckout, isLoading } = useCreateCheckout();
  const [amount, setAmount] = useState("4900");
  const [currency, setCurrency] = useState("usd");
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const result = await startCheckout({
      amount: Number(amount),
      currency,
    });
    if (!result.ok) {
      setError(result.error || "Unable to start checkout.");
      return;
    }
    if (result.url) {
      window.location.assign(result.url);
    }
  };

  return (
    <div className="space-y-6 text-foreground">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Payments
        </p>
        <h1 className="mt-2 text-2xl font-semibold">One-time charges</h1>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Create a payment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCheckout} className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="amount">
                Amount (cents)
              </Label>
              <Input
                id="amount"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">
                Currency
              </Label>
              <Input
                id="currency"
                value={currency}
                onChange={(event) => setCurrency(event.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Starting..." : "Create checkout"}
              </Button>
            </div>
            {error ? (
              <p className="md:col-span-3 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            ) : null}
          </form>
        </CardContent>
      </Card>

      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-muted-foreground">Amount</TableHead>
              <TableHead className="text-muted-foreground">Currency</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>${(payment.amount / 100).toFixed(2)}</TableCell>
                <TableCell className="uppercase">{payment.currency}</TableCell>
                <TableCell>{payment.status}</TableCell>
                <TableCell>
                  {new Date(payment.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
