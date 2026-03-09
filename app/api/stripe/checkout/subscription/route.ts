import { connectToDatabase } from "@/lib/db";
import { getUserSession } from "@/lib/session";
import { stripe } from "@/lib/stripe";
import Product from "@/models/product";
import { isSameOrigin } from "@/utils/security";
import { z } from "zod";
import Stripe from "stripe";

const checkoutSchema = z.object({
  productId: z.string().optional(),
  planType: z.enum(["founder", "growth", "sovereign"]).optional(),
  priceId: z.string().optional(),
});

// Map plan types to price IDs from environment
const PLAN_PRICE_MAP: Record<string, string | undefined> = {
  founder: process.env.STRIPE_FOUNDER_PRICE_ID,
  growth: process.env.STRIPE_GROWTH_PRICE_ID,
  sovereign: process.env.STRIPE_SOVEREIGN_PRICE_ID,
};

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json(
      { success: false, error: "Invalid origin" },
      { status: 403 }
    );
  }

  const session = await getUserSession({ required: true });
  if (!session.user) {
    return Response.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { success: false, error: "Invalid request payload" },
      { status: 400 }
    );
  }

  await connectToDatabase();

  const { productId, planType = "founder", priceId } = parsed.data;

  // If productId is provided, verify user has access
  let targetProductId = productId;
  if (targetProductId) {
    const product = await Product.findOne({
      _id: targetProductId,
      users: session.user.id,
      deletedAt: null,
    });

    if (!product) {
      return Response.json(
        { success: false, error: "Product not found or access denied" },
        { status: 404 }
      );
    }
    targetProductId = product._id.toString();
  } else {
    // Get user's first product if none specified
    const userProducts = await Product.find({
      users: session.user.id,
      deletedAt: null,
    }).limit(1);

    if (userProducts.length === 0) {
      return Response.json(
        {
          success: false,
          error: "No products found. Please create a product first.",
        },
        { status: 400 }
      );
    }

    targetProductId = userProducts[0]._id.toString();
  }

  // Determine the price ID to use
  let finalPriceId = priceId;
  if (!finalPriceId) {
    finalPriceId = PLAN_PRICE_MAP[planType];
  }

  if (!finalPriceId) {
    return Response.json(
      {
        success: false,
        error: "No price ID configured for this plan. Please contact support.",
      },
      { status: 500 }
    );
  }

  try {
    // Create Stripe Checkout Session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: finalPriceId as string,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?canceled=true`,
      metadata: {
        userId: session.user.id,
        productId: targetProductId,
        planType: planType,
      },
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      customer_email: session.user.email,
    } as Stripe.Checkout.SessionCreateParams);

    return Response.json({
      success: true,
      data: {
        url: stripeSession.url,
        sessionId: stripeSession.id,
      },
    });
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    return Response.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create checkout session",
      },
      { status: 500 }
    );
  }
}
