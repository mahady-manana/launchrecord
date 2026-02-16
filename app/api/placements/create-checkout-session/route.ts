import { getUserFromSession } from "@/lib/get-user-from-session";
import Placement from "@/lib/models/placement";
import User from "@/lib/models/user";
import { connectToDatabase } from "@/lib/mongodb";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIdentifier, isSameOrigin } from "@/lib/security";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export async function POST(request: Request) {
  try {
    if (!isSameOrigin(request)) {
      return NextResponse.json(
        { success: false, message: "Invalid origin." },
        { status: 403 },
      );
    }

    const identifier = getClientIdentifier(request);
    const limitResult = rateLimit({
      key: `placements:create-checkout:${identifier}`,
      limit: 10,
      windowMs: 60 * 60 * 1000,
    });

    if (!limitResult.allowed) {
      return NextResponse.json(
        { success: false, message: "Rate limit exceeded. Try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(limitResult.retryAfterMs / 1000)),
          },
        },
      );
    }

    const user = await getUserFromSession();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "You need to sign in first." },
        { status: 401 },
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.placementId || !body.placementCode || !body.duration) {
      return NextResponse.json(
        { success: false, message: "Invalid data" },
        { status: 400 },
      );
    }

    await connectToDatabase();
    const currentDate = new Date();
    // Check if placement with this codeName already exists and is active
    const existingActivePlacement = await Placement.findOne({
      codeName: body.placementCode,
      status: "active",
      paymentStatus: "paid",
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
    });

    if (existingActivePlacement) {
      return NextResponse.json(
        {
          success: false,
          message: "This placement is already taken or reserved.",
        },
        { status: 400 },
      );
    }

    // Find the user in the database
    const dbUser = await User.findById(user._id);
    if (!dbUser) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 },
      );
    }

    // Calculate price based on duration (15 days = 70% of 20-day price)
    // For simplicity, assuming sidebar placement is $299 and featured is $599
    const basePrice = body.placementCode.startsWith("HERO") ? 599 : 299;
    let amount = basePrice;

    if (body.duration === 15) {
      amount = Math.round(basePrice * 0.7); // 70% of base price for 15 days
    } else if (body.duration === 20) {
      amount = basePrice; // Full price for 20 days
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid duration. Use 10 or 20 days." },
        { status: 400 },
      );
    }

    // Create or retrieve Stripe customer
    let stripeCustomerId = dbUser.stripeCustomerId;

    if (!stripeCustomerId) {
      // Create a new customer in Stripe
      const customer = await stripe.customers.create({
        email: dbUser.email,
        name: dbUser.name,
        metadata: {
          userId: dbUser._id.toString(),
        },
      });

      stripeCustomerId = customer.id;

      // Save the customer ID to the user record
      await User.findByIdAndUpdate(user._id, {
        stripeCustomerId: stripeCustomerId,
      });
    }

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Premium placement on LaunchRecord: ${body.name}`,
              description: `${body.description} for ${body.duration} days`,
            },
            unit_amount: amount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      mode: "payment",
      customer: stripeCustomerId,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/placement/${body.placementId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
      metadata: {
        placementId: body.placementId,
        userId: user._id.toString(),
        placementCode: body.placementCode,
        duration: body.duration.toString(),
      },
    });
    // Create a temporary placement record to hold the checkout info
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + body.duration + 1);

    await Placement.findByIdAndUpdate(body.placementId, {
      paymentStatus: "pending",
      codeName: body.placementCode,
      duration: body.duration,
      paymentIntentId: session.id,
      startDate,
      endDate,
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      paymentIntentId: session.payment_intent,
      url: session.url,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create checkout session." },
      { status: 500 },
    );
  }
}
