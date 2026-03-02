export interface SubscriptionRecord {
  id: string;
  userId: string;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  status: string;
  currentPeriodEnd?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
