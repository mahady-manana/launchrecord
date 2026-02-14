Retold.me — Current Product Context (Post-MVP Beta)

## Stage

Retold.me is in post-MVP beta. The codebase already includes features that were originally out of MVP scope.

## Product Principle

- Zero friction for submitters
- Full control for company owners
- Security-first, with ongoing hardening

## Instructions

Please read:
- `.qwen/instructions.md`
- `.qwen/CODING_RULE.md`

These two files are the implementation contract for contributors and agents.

## Current Feature Surface

Public:
- Landing, features, pricing, FAQ, docs, roadmap/changelog, legal pages
- Company showcase: `/companies/[slug]`
- Targeted testimonial submission: `/[publickey]`
- Organic testimonial submission: `/companies/[slug]/testimonial`
- SEO metadata, sitemap, robots

Auth:
- NextAuth
- OAuth: Google, LinkedIn, Facebook
- Credentials auth (email/password)
- Forgot/reset password APIs and pages

Dashboard:
- `/dashboard`
- `/dashboard/companies` (CRUD + slug handling)
- `/dashboard/links` (create/edit/delete/revoke style workflows)
- `/dashboard/testimonials` (moderation + edit/delete)
- `/dashboard/account`
- `/dashboard/billing` (Stripe checkout)
- `/dashboard/form-builder`
- `/dashboard/widgets`

Integrations and platform modules:
- Stripe billing + webhook handling
- S3 upload flow for assets
- Embeddable widgets + publishable key + host checks
- Zustand state layer for dashboard data

## Architecture Summary

- Next.js App Router with route groups:
  - `app/(public)`
  - `app/(authenticated)`
  - `app/api`
- API-route first architecture for business logic and mutations
- MongoDB + Mongoose models:
  - `User`, `Company`, `Link`, `Testimonial`, `Form`, `Subscription`, `Widget`, `TestimonialRequest`
- No client-side DB access

## Security Posture

Implemented in many flows:
- Server-side auth and ownership checks on private APIs
- Zod validation on many write endpoints
- Secure auth cookie options and Stripe webhook signature verification

Still being hardened (treat as active engineering priorities):
- Global rate limiting is not yet consistently enforced
- CSRF protections are not uniformly implemented on public write paths
- Sanitization is not yet consistently applied before persistence/display
- Security headers/CSP are not centralized
- Some endpoints still use hard delete instead of soft delete

When touching submission, auth, public, or billing paths, improve these areas instead of preserving the gap.

## URL Summary (Current)

- Targeted submit: `/[publickey]`
- Organic submit: `/companies/[slug]/testimonial`
- Public wall: `/companies/[slug]`
- Dashboard: `/dashboard/*`

## Scope Notes

Now in scope for this beta codebase:
- Widgets/embeds
- Billing/subscriptions
- File upload

Still not fully implemented as a mature platform capability:
- Multi-user company roles/permissions
- System-wide audit trails and robust soft-delete recovery
