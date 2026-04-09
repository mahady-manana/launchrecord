export interface SubscriptionRecord {
  id: string;
  productId: string;
  stripeSubscriptionId?: string;
  stripePaymentIntentId?: string;
  stripeCustomerId?: string;
  planType: "free" | "onetime" | "founder" | "growth" | "sovereign";
  status: string;
  currentPeriodEnd?: string | null;
  monthlyAuditLimit: number;
  weeklyAuditLimit: number;
  totalAuditLimit: number;
  auditsUsed: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubscriptionResponse {
  subscription: SubscriptionRecord | null;
  subscriptions?: SubscriptionRecord[];
}
