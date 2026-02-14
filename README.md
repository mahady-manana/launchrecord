# LaunchRecord

LaunchRecord is a launch listing platform where founders, builders, and vibe coders can submit apps and SaaS products to get discovery and traffic.

## MVP Scope

- Homepage with hero, listing, placements, filters, and pagination
- Launch submission modal
- Authentication with Google and email/password
- API routes for users and launches
- Zustand-based user and launch state

## Main API Routes

- `POST /api/users/create`
- `GET /api/users/me`
- `POST /api/launches/create`
- `GET /api/launches/get`
- `PUT /api/launches/update`

## Stack

- Next.js App Router + TypeScript
- MongoDB + Mongoose
- NextAuth (Google + credentials)
- Zustand
- Tailwind CSS
