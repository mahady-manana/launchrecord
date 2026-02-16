import Placement from "@/lib/models/placement";
import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;
  try {
    if (!sig || !webhookSecret) {
      return new Response(`Webhook Error: Missing SIG or WSEC`, {
        status: 400,
      });
    }
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    await connectToDatabase();

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data
          .object as Stripe.PaymentIntent;
        console.log({ paymentIntentSucceeded });

        // Update only the payment status to paid, leave placement status as inactive
        // The user will need to manually activate the placement after payment

        const x = await Placement.findOneAndUpdate(
          { paymentIntentId: paymentIntentSucceeded.id },
          {
            paymentStatus: "paid",
            status: "active",
          },
        );
        console.log({ x });

        console.log(
          `Payment succeeded for placement with payment intent: ${paymentIntentSucceeded.id}`,
        );
        break;
      case "checkout.session.completed":
        const sessionCompleted = event.data.object as Stripe.Checkout.Session;
        await Placement.findOneAndUpdate(
          { paymentIntentId: sessionCompleted.id },
          {
            paymentStatus: sessionCompleted.payment_status,
            status:
              sessionCompleted.payment_status === "paid"
                ? "active"
                : "inactive",
          },
        );

        break;
      case "payment_intent.payment_failed":
        const paymentIntentFailed = event.data.object as Stripe.PaymentIntent;

        // Update placement status to failed
        await Placement.updateOne(
          { paymentIntentId: paymentIntentFailed.id },
          {
            paymentStatus: "failed",
            status: "inactive",
          },
        );

        console.log(
          `Payment failed for placement with payment intent: ${paymentIntentFailed.id}`,
        );
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Error processing webhook event:", err);
    return NextResponse.json(
      { error: "Error processing webhook event" },
      { status: 500 },
    );
  }
}
