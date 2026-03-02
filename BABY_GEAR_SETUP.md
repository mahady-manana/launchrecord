# Baby Gear Planner - Setup & Integration Guide

## Overview

This is a complete MVP for a personalized baby gear recommendations platform. Below is everything that's been built and how to set it up.

## 📄 Pages Created

### Public Pages (No Auth Required)

1. **Landing Page** (`/`) - `app/(public)/page.tsx`
   - Hero section with headline and main CTA
   - 5 pain-killer feature cards
   - "How It Works" section
   - Pricing cards for two plans ($29 and $39)
   - Risk reversal guarantee
   - Social proof section

2. **Survey Page** (`/survey`) - `app/(public)/survey/page.tsx`
   - Multi-step form with 6 questions
   - Questions cover: email, transport, home layout, feeding plan, philosophy, market comfort
   - Progress bar showing completion percentage
   - Form validation
   - Submission to API

3. **Checkout Page** (`/checkout`) - `app/(public)/checkout/page.tsx`
   - Plan selection UI (can switch between $29 and $39)
   - Order summary
   - Email input field
   - Trust signals and security badges
   - Features preview
   - FAQ section

4. **Personalized Plan Page** (`/plan`) - `app/(public)/plan/page.tsx`
   - Tabbed interface: Must-Haves | Optional | Skip
   - Must-Haves organized by timeline (Now, Month 3, Month 6)
   - Priority badges for each item
   - 3-Option Matchmaker for Stroller and Car Seat
   - Download PDF button
   - Create shopping list button
   - Confirmation email and feedback CTA

## 🔌 API Endpoints

### Survey API

**Endpoint:** `POST /api/survey`

**Request Body:**

```json
{
  "email": "parent@example.com",
  "transport": "city-walking|suburb-car|mixed",
  "homeLayout": "apartment|house-single|house-multi",
  "feedingPlan": "nursing|pumping|formula|combination|undecided",
  "philosophy": "minimalist|balanced|fully-equipped",
  "marketComfort": "new-only|open-used|buy-used"
}
```

**Response:**

```json
{
  "sessionId": "session_1234567890",
  "message": "Survey saved successfully"
}
```

**What it does:**

- Validates survey data
- Generates a personalized gear plan based on answers
- Returns a session ID to store the plan temporarily

### Checkout API

**Endpoint:** `POST /api/checkout`

**Request Body:**

```json
{
  "planAmount": 29 or 39,
  "email": "parent@example.com",
  "sessionId": "session_1234567890"
}
```

**Response:**

```json
{
  "clientSecret": "mock_secret_...",
  "checkoutUrl": "/plan?session=...",
  "message": "Checkout session created successfully"
}
```

**What it does:**

- Creates a checkout session
- In production, this connects to Stripe
- Stores order in database
- Redirects to plan page

### Email API

**Endpoint:** `POST /api/email`

**Request Body:**

```json
{
  "type": "confirmation|feedback",
  "email": "parent@example.com",
  "planName": "0-6 Months Plan",
  "planAmount": 39
}
```

**Response:**

```json
{
  "message": "Email sent successfully",
  "messageId": "msg_1234567890"
}
```

**What it does:**

- Sends confirmation email after purchase
- Sends feedback request email after 48 hours
- Integrates with email service (Resend, SendGrid, etc.)

## 🎨 Theme & Colors

The app uses a **light theme** with:

- **Primary Color:** Soft sage green (`oklch(0.55 0.12 160)`)
- **Accent Color:** Warm gold (`oklch(0.75 0.15 40)`)
- **Background:** Off-white (`oklch(0.98 0 0)`)
- **Text:** Dark gray (`oklch(0.2 0 0)`)

Updated in `app/globals.css` `:root` section.

## 🚀 Production Setup Checklist

### 1. Stripe Integration

**Install Stripe:**

```bash
npm install stripe @stripe/react-js
```

**Add Environment Variables:**

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Update Checkout API** (`app/api/checkout/route.ts`):

```typescript
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// In the POST handler:
const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  line_items: [
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: planName,
        },
        unit_amount: planAmount * 100,
      },
      quantity: 1,
    },
  ],
  mode: "payment",
  success_url: `${baseUrl}/plan?session={CHECKOUT_SESSION_ID}`,
  cancel_url: `${baseUrl}/checkout`,
  customer_email: email,
});
```

### 2. Email Service Integration

**Option A: Resend (Recommended)**

```bash
npm install resend
```

```env
RESEND_API_KEY=re_...
```

```typescript
// In utils/email-templates.ts or app/api/email/route.ts
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: "support@babygearplanner.com",
  to: email,
  subject: subject,
  html: html,
});
```

**Option B: SendGrid**

```bash
npm install @sendgrid/mail
```

**Option C: AWS SES**
Use AWS SDK with SES

### 3. Database Setup

**Schema needed:**

```sql
-- Users/Customers
CREATE TABLE customers (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Survey Responses
CREATE TABLE surveys (
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  transport VARCHAR,
  home_layout VARCHAR,
  feeding_plan VARCHAR,
  philosophy VARCHAR,
  market_comfort VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders/Payments
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  survey_id UUID REFERENCES surveys(id),
  plan_type VARCHAR, -- "0-3-months" or "0-6-months"
  amount_cents INT,
  stripe_session_id VARCHAR,
  stripe_payment_id VARCHAR,
  status VARCHAR, -- "pending", "completed", "refunded"
  created_at TIMESTAMP DEFAULT NOW()
);

-- Personalized Plans (Results)
CREATE TABLE personalized_plans (
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  survey_id UUID REFERENCES surveys(id),
  plan_data JSONB, -- Store the entire personalized plan
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Update Middleware (if needed)

The survey and checkout flows don't require auth, so they should work with existing middleware.

### 5. Environment Variables Template

Create `.env.local`:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...

# Email
RESEND_API_KEY=re_...

# Database
DATABASE_URL=postgresql://...

# NextAuth (if using)
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
```

## 🔄 User Flow

1. **Landing Page** → User sees benefits and clicks "Get Personalized Plan"
2. **Survey** → User answers 6 questions (2 minutes)
3. **Checkout** → User selects plan ($29 or $39) and enters email
4. **Payment** → Stripe processes payment
5. **Confirmation Email** → Auto-sent to user
6. **Plan Page** → User sees personalized gear recommendations
7. **Feedback Email** → Sent after 48 hours

## 📊 Analytics to Track

- Landing page visits
- Survey completions (track drop-off by question)
- Checkout completions
- Payment success rate
- Conversion rate (visitors → paying customers)
- Email open rates
- Plan page views

## 🚨 Security Considerations

✅ **Already Implemented:**

- CSRF protection (Next.js built-in)
- No sensitive data in URLs
- Email validation
- Server-side survey validation

⚠️ **For Production:**

- Add rate limiting on survey and checkout APIs
- Verify email addresses before sending
- Sanitize all user inputs
- Add request validation (Zod recommended)
- Log all transactions
- Implement Stripe webhook verification
- Use HTTPS everywhere
- Store passwords/secrets in environment variables

## 🧪 Testing Stripe Locally

Use Stripe test keys and test card: `4242 4242 4242 4242`

For webhook testing, use Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## 📧 Email Testing

In development, emails are logged to console. For production, verify with Resend or your chosen service.

## 🎯 Next Steps for MVP Validation

1. Deploy to Vercel
2. Set up Stripe dashboard
3. Configure email service
4. Monitor conversion rates
5. Collect customer feedback
6. Iterate based on data

## 📱 Mobile Responsiveness

All pages are mobile-first:

- Survey on mobile shows one question per screen
- Checkout plan selector is vertical on mobile
- Plan page is fully responsive
- All CTAs are full-width on mobile

## 🔐 Refund Handling

For manual refunds, implement an admin page:

- List recent orders
- Search by email
- Process refunds via Stripe API
- Update order status in database

---

**Questions?** Check the AGENTS.md guide for framework-specific setup details.
