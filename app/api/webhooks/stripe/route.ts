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
): "onetime" | "founder" | "growth" | "sovereign" {
  const priceMap: Record<
    string,
    "onetime" | "founder" | "growth" | "sovereign"
  > = {
    [process.env.STRIPE_ONETIMEPASS_PRICE_ID || ""]: "onetime",
    [process.env.STRIPE_FOUNDER_PRICE_ID || ""]: "founder",
    [process.env.STRIPE_GROWTH_PRICE_ID || ""]: "growth",
    [process.env.STRIPE_SOVEREIGN_PRICE_ID || ""]: "sovereign",
  };
  return priceMap[priceId] || "founder";
}

// Helper to get audit limits based on plan type
function getAuditLimits(planType: string): {
  monthly: number;
  weekly: number;
  total: number;
} {
  const limits: Record<
    string,
    { monthly: number; weekly: number; total: number }
  > = {
    free: { monthly: 1, weekly: 0, total: 0 },
    onetime: { monthly: 0, weekly: 0, total: 5 }, // 5 audits forever
    founder: { monthly: 15, weekly: 5, total: 0 },
    growth: { monthly: 30, weekly: 5, total: 0 },
    sovereign: { monthly: 9999, weekly: 9999, total: 0 },
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

        console.log("Checkout session completed:", {
          mode: session.mode,
          metadata: session.metadata,
          customerId: session.customer,
        });

        // Handle both subscription and payment modes
        if (session.mode !== "subscription" && session.mode !== "payment") {
          console.log("Skipping session - not subscription or payment mode");
          break;
        }

        const metadata = session.metadata || {};
        const productId = metadata.productId;
        const planType = metadata.planType;

        if (!productId) {
          console.error("No productId in checkout session metadata");
          break;
        }

        const isOneTime = session.mode === "payment";
        const resolvedPlanType =
          planType ||
          getPlanTypeFromPriceId((session.metadata as any)?.priceId || "") ||
          (isOneTime ? "onetime" : "founder");

        const limits = getAuditLimits(resolvedPlanType);

        console.log("Processing checkout:", {
          productId,
          planType: resolvedPlanType,
          isOneTime,
          limits,
        });

        // Fetch the subscription details from Stripe if subscription mode
        let stripeSubscription = null;
        if (!isOneTime && session.subscription) {
          try {
            stripeSubscription = await stripe.subscriptions.retrieve(
              session.subscription as string,
            );
            console.log("Retrieved Stripe subscription:", {
              id: stripeSubscription.id,
              status: stripeSubscription.status,
            });
          } catch (err) {
            console.error("Failed to retrieve Stripe subscription:", err);
          }
        }

        console.log("====================================");
        console.log(stripeSubscription);
        console.log("====================================");

        // Build subscription data
        const subscriptionData: any = {
          productId,
          stripeCustomerId: session.customer as string,
          status: isOneTime ? "active" : stripeSubscription?.status || "active",
          planType: resolvedPlanType,
          monthlyAuditLimit: limits.monthly,
          weeklyAuditLimit: limits.weekly,
          totalAuditLimit: limits.total,
          auditsUsed: 0,
          canceledAt: null,
          deletedAt: null,
        };

        if (isOneTime) {
          subscriptionData.stripePaymentIntentId =
            session.payment_intent as string;
          subscriptionData.stripeSubscriptionId = undefined;
        } else {
          subscriptionData.stripeSubscriptionId =
            session.subscription as string;
          subscriptionData.stripePaymentIntentId = undefined;
        }

        console.log("Subscription data:", subscriptionData);

        // Check if subscription already exists
        let subscription;
        if (isOneTime) {
          subscription = await Subscription.findOne({
            productId,
            stripePaymentIntentId: session.payment_intent as string,
          });
        } else {
          subscription = await Subscription.findOne({
            productId,
            stripeSubscriptionId: session.subscription as string,
          });
        }

        if (subscription) {
          // Update existing
          Object.assign(subscription, subscriptionData);
          await subscription.save();
          console.log("Updated existing subscription:", subscription._id);
        } else {
          // Create new
          subscription = await Subscription.create(subscriptionData);
          console.log("Created new subscription:", subscription._id);
        }

        // Update product's subscription reference
        await Product.findByIdAndUpdate(productId, {
          subscription: subscription._id,
        });

        console.log(
          `Successfully processed ${isOneTime ? "one-time payment" : "subscription"} for product ${productId}`,
        );
        break;
      }

      case "customer.subscription.updated": {
        const stripeSubscription = event.data.object as Stripe.Subscription;

        console.log("Subscription updated:", {
          id: stripeSubscription.id,
          status: stripeSubscription.status,
        });

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
        if ((stripeSubscription as any).current_period_end) {
          subscription.currentPeriodEnd = new Date(
            (stripeSubscription as any).current_period_end * 1000,
          );
        }

        if ((stripeSubscription as any).canceled_at) {
          subscription.canceledAt = new Date(
            (stripeSubscription as any).canceled_at * 1000,
          );
        }

        await subscription.save();

        console.log(
          `Subscription updated successfully: ${stripeSubscription.id}`,
        );
        break;
      }

      case "customer.subscription.deleted": {
        const stripeSubscription = event.data.object as Stripe.Subscription;

        console.log("Subscription deleted:", {
          id: stripeSubscription.id,
        });

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

          console.log(
            `Subscription deleted and product updated: ${stripeSubscription.id}`,
          );
        } else {
          console.warn(
            `Subscription not found for deletion: ${stripeSubscription.id}`,
          );
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = (invoice as any).subscription as string;

        console.log("Payment failed:", {
          subscriptionId,
          amount: invoice.amount_due,
        });

        const subscription = await Subscription.findOne({
          stripeSubscriptionId: subscriptionId,
        });

        if (subscription) {
          subscription.status = "past_due";
          await subscription.save();

          console.log(`Subscription marked as past_due: ${subscriptionId}`);
        }
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
