# Stripe Setup

## Required Environment Variables

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_DEFAULT_SUBSCRIPTION_PRICE_ID` (optional but recommended)

## Checkout Flows

- Subscription checkout: `POST /api/stripe/checkout/subscription`
- One-time checkout: `POST /api/stripe/checkout/payment`

## Webhook Events

The webhook route handles:

- `checkout.session.completed`
- `invoice.payment_succeeded`
- `customer.subscription.updated`
- `customer.subscription.deleted`

Subscriptions and payments are persisted in MongoDB.
