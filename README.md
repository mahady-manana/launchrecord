# SaaS Starter

Production-ready Next.js SaaS skeleton with authentication, Stripe billing, and S3-compatible uploads.

## Quick Start

```
cp .env.example .env.local
npm install
npm run dev
```

## Key Features

- Credentials auth with JWT sessions
- Optional Google OAuth (set `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`)
- Password reset flow
- Stripe subscriptions + one-time payments
- Secure webhook verification
- S3 / Backblaze B2 uploads with signed URLs
- Zustand stores and hooks
- TailwindCSS + reusable UI components
