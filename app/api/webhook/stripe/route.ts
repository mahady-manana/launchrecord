import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { connectToDatabase } from "@/lib/mongodb";
import Placement from "@/lib/models/placement";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error(`Webhook signature verification failed.`, err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object as Stripe.PaymentIntent;
        
        // Update placement status to paid
        await Placement.updateOne(
          { paymentIntentId: paymentIntentSucceeded.id },
          { 
            paymentStatus: "paid",
            status: "active"
          }
        );
        
        console.log(`Payment succeeded for placement with payment intent: ${paymentIntentSucceeded.id}`);
        break;

      case "payment_intent.payment_failed":
        const paymentIntentFailed = event.data.object as Stripe.PaymentIntent;
        
        // Update placement status to failed
        await Placement.updateOne(
          { paymentIntentId: paymentIntentFailed.id },
          { 
            paymentStatus: "failed",
            status: "inactive"
          }
        );
        
        console.log(`Payment failed for placement with payment intent: ${paymentIntentFailed.id}`);
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        // Handle subscription events if needed
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Error processing webhook event:", err);
    return NextResponse.json(
      { error: "Error processing webhook event" },
      { status: 500 }
    );
  }
}