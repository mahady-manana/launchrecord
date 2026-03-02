# Deployment

## 1. Environment variables

Set the values from `.env.example` in your hosting provider. These are required for auth, Stripe, and storage.

## 2. Build and run

```
npm install
npm run build
npm start
```

## 3. Stripe webhook

Configure your Stripe webhook to point to:

```
{APP_URL}/api/stripe/webhook
```

Use the signing secret in `STRIPE_WEBHOOK_SECRET`.

## 4. Storage

Ensure the S3-compatible bucket exists and the credentials have `PutObject` and `DeleteObject` permissions.
