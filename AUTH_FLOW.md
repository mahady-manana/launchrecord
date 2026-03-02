# Auth Flow

## Login

- Client uses `useAuth().login()`.
- `next-auth` credentials provider validates email + password.
- JWT session includes `id` and `role`.
- Optional Google OAuth is enabled when `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set.

## Register

- `POST /api/auth/register` validates payload, hashes password, and creates user.

## Forgot / Reset Password

- `POST /api/auth/forgot-password` creates a short-lived reset token and emails a link.
- `POST /api/auth/reset-password` validates the token and updates the password.

## Session Validation

- `GET /api/users/me` returns the current authenticated user's profile. This endpoint looks up the
  latest record from the database and should be used by clients instead of the
  older `/api/auth/session` route (which remains for compatibility).

## Middleware

- `middleware.ts` protects `/dashboard` and protected API routes.
