import { connectToDatabase } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import Product from "@/models/product";
import Subscription from "@/models/subscription";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Helper to read raw body from Next.js request
async function readRawBody(request: NextRequest): Promise<string> {
  const reader = request.body?.getReader();
  if (!reader) return "";

  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  const concatenated = new Uint8Array(
    chunks.reduce((acc, chunk) => acc + chunk.length, 0),
  );
  let offset = 0;
  for (const chunk of chunks) {
    concatenated.set(chunk, offset);
    offset += chunk.length;
  }

  return new TextDecoder().decode(concatenated);
}

// Helper to get plan type from price ID
function getPlanTypeFromPriceId(
  priceId: string,
): "founder" | "growth" | "sovereign" {
  const priceMap: Record<string, "founder" | "growth" | "sovereign"> = {
    [process.env.STRIPE_FOUNDER_PRICE_ID || ""]: "founder",
    [process.env.STRIPE_GROWTH_PRICE_ID || ""]: "growth",
    [process.env.STRIPE_SOVEREIGN_PRICE_ID || ""]: "sovereign",
  };
  return priceMap[priceId] || "founder";
}

// Helper to get audit limits based on plan type
function getAuditLimits(planType: string): { monthly: number; weekly: number } {
  const limits: Record<string, { monthly: number; weekly: number }> = {
    free: { monthly: 3, weekly: 0 },
    founder: { monthly: 10, weekly: 1 },
    growth: { monthly: 30, weekly: 5 },
    sovereign: { monthly: 9999, weekly: 9999 },
  };
  return limits[planType] || limits.free;
}

/**
 * Stripe Webhook Handler
 *
 * Handles the following events:
 * - checkout.session.completed: Payment succeeded, create/update subscription
 * - customer.subscription.updated: Subscription details changed
 * - customer.subscription.deleted: Subscription canceled
 * - invoice.payment_failed: Payment failed
 */
export async function POST(request: NextRequest) {
  const rawBody = await readRawBody(request);
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed:`, err);
    return NextResponse.json(
      { success: false, error: "Webhook signature verification failed" },
      { status: 400 },
    );
  }

  await connectToDatabase();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Only handle subscription mode sessions
        if (session.mode !== "subscription") {
          break;
        }

        const subscriptionId = session.subscription as string;
        const { productId, planType } = session.metadata || {};

        if (!productId) {
          console.error("No productId in checkout session metadata");
          break;
        }

        // Fetch the subscription details from Stripe
        const stripeSubscription = await stripe.subscriptions.retrieve(
          subscriptionId,
          { expand: ["default_payment_method"] },
        );

        const lineItems = await stripe.checkout.sessions.listLineItems(
          session.id,
        );
        const priceId = lineItems.data[0]?.price?.id;
        const sessionPlanType =
          (planType as string) || getPlanTypeFromPriceId(priceId || "");
        const limits = getAuditLimits(sessionPlanType);

        // Upsert subscription in database
        const subscription = await Subscription.findOneAndUpdate(
          {
            productId,
            stripeSubscriptionId: subscriptionId,
          },
          {
            productId,
            stripeSubscriptionId: subscriptionId,
            stripeCustomerId: session.customer as string,
            status: stripeSubscription.status,
            planType: sessionPlanType as "founder" | "growth" | "sovereign",
            monthlyAuditLimit: limits.monthly,
            weeklyAuditLimit: limits.weekly,
            canceledAt: null,
            deletedAt: null,
          },
          { new: true, upsert: true },
        );

        // Update product's subscription reference
        await Product.findByIdAndUpdate(productId, {
          subscription: subscription._id,
        });

        console.log(
          `Subscription created/updated for product ${productId}: ${subscriptionId}`,
        );
        break;
      }

      case "customer.subscription.updated": {
        const stripeSubscription = event.data.object as Stripe.Subscription;

        const subscription = await Subscription.findOne({
          stripeSubscriptionId: stripeSubscription.id,
        });

        if (!subscription) {
          console.warn(
            `Subscription not found for update: ${stripeSubscription.id}`,
          );
          break;
        }

        subscription.status = stripeSubscription.status;
        subscription.currentPeriodEnd = new Date(
          (stripeSubscription as any).current_period_end * 1000,
        );

        if ((stripeSubscription as any).canceled_at) {
          subscription.canceledAt = new Date(
            (stripeSubscription as any).canceled_at * 1000,
          );
        }

        await subscription.save();

        console.log(`Subscription updated: ${stripeSubscription.id}`);
        break;
      }

      case "customer.subscription.deleted": {
        const stripeSubscription = event.data.object as Stripe.Subscription;

        const subscription = await Subscription.findOne({
          stripeSubscriptionId: stripeSubscription.id,
        });

        if (subscription) {
          subscription.status = "canceled";
          subscription.canceledAt = new Date();
          await subscription.save();

          // Remove subscription reference from product
          await Product.findByIdAndUpdate(subscription.productId, {
            subscription: null,
          });

          console.log(`Subscription deleted: ${stripeSubscription.id}`);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = (invoice as any).subscription as string;

        const subscription = await Subscription.findOne({
          stripeSubscriptionId: subscriptionId,
        });

        if (subscription) {
          subscription.status = "past_due";
          await subscription.save();

          console.log(`Payment failed for subscription: ${subscriptionId}`);
        }
        break;
      }

      case "customer.subscription.created": {
        // Subscription will be created when checkout.session.completed fires
        console.log(
          `Subscription created event received (waiting for checkout completion)`,
        );
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { success: false, error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}

// Note: bodyParser is disabled for this route via next.config.mjs
// Stripe needs the raw body for signature verification
