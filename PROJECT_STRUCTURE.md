# Project Structure

```
app/
  (public)/
  (authenticated)/
  api/
components/
  ui/
hooks/
lib/
models/
providers/
stores/
types/
utils/
```

## Highlights

- `app/(public)`: public marketing and auth pages.
- `app/(authenticated)`: protected dashboard.
- `app/api`: server-side routes for auth, users, billing, uploads.
- `components/ui`: reusable UI primitives.
- `models`: Mongoose models.
- `lib`: server helpers (auth, db, stripe, storage).
- `utils`: shared utilities (env, response, security).
- `stores`: Zustand state layers.
- `hooks`: client hooks for API and state access.
