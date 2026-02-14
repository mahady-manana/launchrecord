import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getUserFromSession } from "@/lib/get-user-from-session";
import { getClientIdentifier, isSameOrigin } from "@/lib/security";
import { rateLimit } from "@/lib/rate-limit";
import Stripe from "stripe";
import Placement from "@/lib/models/placement";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json(
      { success: false, message: "Session ID is required." },
      { status: 400 },
    );
  }

  try {
    await connectToDatabase();

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      // Update the placement record with payment information
      await Placement.findOneAndUpdate(
        { _id: session.metadata?.placementId },
        {
          paymentIntentId: session.payment_intent,
          paymentStatus: 'paid',
          status: 'active',
        }
      );

      return NextResponse.json({ 
        success: true, 
        message: "Payment successful! Your placement is now active.",
        placementId: session.metadata?.placementId,
      });
    } else {
      // Payment wasn't successful, update status accordingly
      await Placement.findOneAndUpdate(
        { _id: session.metadata?.placementId },
        {
          paymentStatus: 'failed',
          status: 'inactive',
        }
      );

      return NextResponse.json(
        { success: false, message: "Payment failed. Please try again." },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error handling checkout success:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process checkout success." },
      { status: 500 },
    );
  }
}