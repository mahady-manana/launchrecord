# SaaS Starter — Contributor Guide

This repository is a production-grade Next.js SaaS skeleton. It is intentionally generic and designed for reuse.

## Core Principles

- Keep the surface area lean and reusable.
- Security first: validate inputs, enforce auth, and sanitize user-provided data.
- API-route first for privileged mutations and reads.
- No direct database access from client components.

## Quick Start

1. Copy `.env.example` to `.env.local` and fill in values.
2. Install dependencies: `npm install`.
3. Run the dev server: `npm run dev`.

## Auth + Billing

- Authentication uses NextAuth with credentials and JWT sessions.
- Google OAuth is available when `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set.
- Billing uses Stripe checkout + webhook verification.
- Password reset flows are fully wired.

## Reuse Checklist

- Update `app/(public)/page.tsx` copy and branding.
- Replace logos in `public/`.
- Customize theme tokens in `app/globals.css`.
- Adjust roles and permissions in API routes if needed.

## Security Expectations

When touching auth, public endpoints, or billing flows:

- Add Zod validation.
- Enforce ownership checks.
- Preserve CSRF protections (origin checks).
- Consider rate limiting.
- Sanitize content before persistence.

## Core URLs

- `/login`, `/register`, `/forgot-password`, `/reset-password`
- `/dashboard/*`
- `/api/*`
