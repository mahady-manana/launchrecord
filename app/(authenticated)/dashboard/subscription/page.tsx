"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSubscription } from "@/hooks/use-subscription";
import { useSubscribe } from "@/hooks/use-subscribe";
import { useCancelSubscription } from "@/hooks/use-cancel-subscription";

export default function SubscriptionPage() {
  const { subscription } = useSubscription();
  const { startSubscription, isLoading } = useSubscribe();
  const { cancelSubscription, isLoading: isCanceling } = useCancelSubscription();
  const [priceId, setPriceId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const result = await startSubscription({ priceId });
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
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Billing</p>
        <h1 className="mt-2 text-2xl font-semibold">Subscription</h1>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Current subscription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>Status: {subscription?.status || "None"}</p>
          <p>
            Current period end:{" "}
            {subscription?.currentPeriodEnd
              ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
              : "-"}
          </p>
        </CardContent>
      </Card>

      <form onSubmit={handleSubscribe} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="priceId">
            Price ID
          </Label>
          <Input
            id="priceId"
            value={priceId}
            onChange={(event) => setPriceId(event.target.value)}
            placeholder="price_123"
          />
          <p className="text-xs text-muted-foreground">
            Leave blank to use the default subscription price.
          </p>
        </div>
        {error ? (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Starting..." : "Start subscription"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={!subscription || isCanceling}
            onClick={() => cancelSubscription()}
          >
            {isCanceling ? "Canceling..." : "Cancel subscription"}
          </Button>
        </div>
      </form>
    </div>
  );
}
