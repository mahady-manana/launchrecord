export interface SubscriptionRecord {
  id: string;
  productId: string;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  planType: "founder" | "growth" | "sovereign";
  status: string;
  currentPeriodEnd?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubscriptionResponse {
  subscription: SubscriptionRecord | null;
  subscriptions?: SubscriptionRecord[];
}
