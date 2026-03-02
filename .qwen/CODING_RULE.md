# Retold.me Coding Rulebook (Current Beta)

## 1) Architecture and Routing

- Use App Router only (`app/`).
- Keep route-group boundaries clear:
  - Public pages in `app/(public)`
  - Authenticated product pages in `app/(authenticated)`
  - APIs in `app/api`
- Follow current architecture: API-route first for mutations and privileged reads.
- Do not add direct database access in client components.

## 2) Server/API Rules

- For any new or modified endpoint:
  - Validate input with Zod.
  - Enforce auth/authorization server-side.
  - Enforce ownership checks (user-company-resource relationship).
  - Return explicit success/error payloads.
- Reuse shared server utilities where possible (`lib/get-user-from-session`, `lib/mongodb`, model modules).
- Keep public endpoint behavior backward-compatible unless a breaking change is explicitly requested.

## 3) Data and Model Rules

- Use existing Mongoose models in `lib/models/*`.
- Prefer additive, backward-compatible schema evolution.
- Avoid breaking field renames/removals without migration planning.
- For new deletion behavior, prefer soft-delete-compatible patterns.

## 4) Security Rules

- Never trust client payloads.
- Treat these as mandatory for touched flows:
  - Zod validation
  - Ownership checks
  - Sanitization for user-generated content before persistence/display
- If you touch public submit/auth surfaces, prioritize hardening:
  - Rate limiting
  - CSRF protection
  - Header/CSP consistency
- Preserve secure webhook signature verification on billing/webhooks.

## 5) Frontend Rules

- Server Components by default.
- Add `use client` only when state/effects/browser APIs/events are required.
- Keep business rules on server paths; keep UI components focused on rendering and interactions.
- Encapsulate repeated client-side behavior in hooks (`hooks/use-*.ts`).
- Use existing Zustand stores; avoid parallel/duplicate client state sources.

## 6) SEO and Public Pages

- Public pages must include strong metadata and semantic structure.
- Preserve canonical URLs, indexability expectations, and sitemap/robots consistency.
- Do not accidentally expose authenticated routes/content to indexing.

## 7) Code Quality

- Keep files focused and maintainable.
- Use clear naming and avoid speculative abstractions.
- Log server errors; do not swallow failures silently.
- Keep TypeScript strictness intact; do not work around types with unsafe shortcuts.

## 8) Performance and DX

- Prefer server data fetching for initial render when feasible.
- Use client fetching for interactive refreshes and dashboard actions.
- Prefer `next/image` for new media-heavy UI work; do not force broad refactors unless requested.

## 9) Verification

- Validate changed behavior with the lightest reliable check (typecheck/lint/build/test as relevant).
- When tests are missing around changed logic, add targeted tests where practical.

## Objective

Ship stable beta improvements quickly without breaking current route contracts, data flows, or security posture.
