import { getUserFromSession } from "@/lib/get-user-from-session";
import Placement from "@/lib/models/placement";
import User from "@/lib/models/user";
import { connectToDatabase } from "@/lib/mongodb";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIdentifier, isSameOrigin } from "@/lib/security";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

const createPlacementSchema = z.object({
  placementCode: z.string().min(1).max(50),
  duration: z.number().min(1).max(365),
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
    const validatedBody = createPlacementSchema.parse(body);

    await connectToDatabase();

    // Find the user in the database
    const dbUser = await User.findById(user._id);
    if (!dbUser) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 },
      );
    }

    // Calculate price based on duration (15 days = 70% of 30-day price)
    // For simplicity, assuming sidebar placement is $299 and featured is $599
    const basePrice = validatedBody.placementCode.startsWith("HERO")
      ? 599
      : 299;
    let amount = basePrice;

    if (validatedBody.duration === 15) {
      amount = Math.round(basePrice * 0.7); // 70% of base price for 15 days
    } else if (validatedBody.duration === 30) {
      amount = basePrice; // Full price for 30 days
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid duration. Use 15 or 30 days." },
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

    // Calculate start and end dates
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + validatedBody.duration);

    // Create a temporary placement record to hold the checkout info
    const tempPlacement = await Placement.create({
      title: `Placement ${validatedBody.placementCode}`,
      tagline: `Premium placement for ${validatedBody.duration} days`,
      website: dbUser.website || "https://launchrecord.com",
      placementType: validatedBody.placementCode.startsWith("HERO")
        ? "featured"
        : "sidebar",
      position: validatedBody.placementCode.includes("LEFT")
        ? "left"
        : validatedBody.placementCode.includes("RIGHT")
          ? "right"
          : "hero",
      startDate,
      endDate,
      price: amount,
      status: "inactive", // Will become active after payment
      userId: user._id,
      paymentStatus: "pending",
      codeName: validatedBody.placementCode,
      duration: validatedBody.duration,
    });

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Placement: ${validatedBody.placementCode}`,
              description: `Premium placement for ${validatedBody.duration} days`,
            },
            unit_amount: amount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer: stripeCustomerId,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
      metadata: {
        placementId: tempPlacement._id.toString(),
        userId: user._id.toString(),
        placementCode: validatedBody.placementCode,
        duration: validatedBody.duration.toString(),
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      paymentIntentId: session.payment_intent,
      url: session.url,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: error.errors[0]?.message || "Invalid payload.",
        },
        { status: 400 },
      );
    }

    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create checkout session." },
      { status: 500 },
    );
  }
}
