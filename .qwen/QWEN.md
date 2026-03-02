Retold.me — Current Product Context (Post-MVP Beta)

## Stage

Retold.me has moved beyond MVP-only scope and is currently in beta stabilization/hardening.

## Product Principle

- Zero friction for submitters
- Full control for company owners
- Security-first, with active hardening work

## Current Features

Public:
- Marketing and trust pages: landing, features, pricing, FAQ, docs, legal, roadmap/changelog
- Company public pages: `/companies/[slug]`
- Targeted testimonial flow: `/[publickey]`
- Organic testimonial flow: `/companies/[slug]/testimonial`
- SEO support: metadata, `sitemap.ts`, `robots.ts`

Authentication:
- NextAuth
- OAuth: Google, LinkedIn, Facebook
- Credentials sign-in/signup
- Forgot and reset password flows

Dashboard:
- `/dashboard`
- `/dashboard/companies`
- `/dashboard/links`
- `/dashboard/testimonials`
- `/dashboard/account`
- `/dashboard/billing`
- `/dashboard/form-builder`
- `/dashboard/widgets`

Platform modules:
- Stripe subscription checkout and webhook processing
- S3 upload APIs
- Widget/public embed endpoints with publishable key checks
- Zustand-backed client stores and action hooks

## Current Architecture

- App Router route groups:
  - `app/(public)`
  - `app/(authenticated)`
  - `app/api`
- API-route first implementation for mutations and privileged reads
- Server-side DB access only
- Core models:
  - `User`
  - `Company`
  - `Link`
  - `Testimonial`
  - `Form`
  - `Subscription`
  - `Widget`
  - `TestimonialRequest`

## Current Route Summary

- Targeted submit: `/[publickey]`
- Organic submit: `/companies/[slug]/testimonial`
- Public wall: `/companies/[slug]`
- Dashboard: `/dashboard/*`

## Security Status

Implemented in many paths:
- Server-side auth and ownership checks for private APIs
- Zod validation across many write routes
- Cookie/session handling and Stripe webhook signature verification

Still open and must be treated as active hardening priorities:
- Inconsistent/global rate limiting coverage
- CSRF defenses are not uniformly applied
- Input sanitization is not consistently enforced before persistence/display
- CSP/security headers are not centralized
- Hard delete still exists in some endpoints

## Scope Notes

In scope now (already present in codebase):
- Widgets and embeds
- Billing/subscription flows
- File upload

Not yet mature platform capabilities:
- Multi-user company roles/permissions
- Full audit log and complete soft-delete lifecycle

## Contributor Guidance

Before coding, read:
- `.qwen/instructions.md`
- `.qwen/CODING_RULE.md`

Keep changes backward-compatible by default and avoid route contract breaks unless explicitly requested.
