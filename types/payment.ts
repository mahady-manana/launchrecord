export interface PaymentRecord {
  id: string;
  userId: string;
  stripePaymentIntentId: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}
