Retold.me is a Next.js App Router SaaS for collecting, moderating, and publishing testimonials.

Current stage: post-MVP beta.

## Core stack

- Next.js 16.x + React 19 + TypeScript
- MongoDB + Mongoose
- NextAuth (OAuth + credentials)
- Stripe billing
- S3 upload flow
- Zustand for client state

## Read these before coding

- Context: `.qwen/QWEN.md`
- Coding contract: `.qwen/CODING_RULE.md`

## Project realities you must follow

- API-route first architecture is the current pattern for business logic and mutations (`app/api/*`).
- No direct DB access from client components.
- AuthZ and ownership checks must happen server-side.
- Zod validation is required on request payloads for endpoints you create or modify.
- Public pages must preserve strong SEO structure and metadata.
- Keep route contracts stable unless a migration plan is explicitly requested.

## Current canonical public routes

- Targeted submit: `/[publickey]`
- Organic submit: `/companies/[slug]/testimonial`
- Company showcase: `/companies/[slug]`

## Delivery expectations

- Prefer clean, incremental changes over rewrites.
- Keep new files/components focused and reasonably small.
- Use hooks for client-side action flows.
- If you touch security-sensitive flows, prioritize hardening gaps (rate limit, CSRF, sanitization, CSP/headers, soft-delete strategy).
