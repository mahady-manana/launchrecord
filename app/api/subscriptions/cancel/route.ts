import { connectToDatabase } from "@/lib/db";
import { getUserSession } from "@/lib/session";
import { stripe } from "@/lib/stripe";
import Product from "@/models/product";
import Subscription from "@/models/subscription";
import { jsonError, jsonSuccess } from "@/utils/response";
import { isSameOrigin } from "@/utils/security";
import { z } from "zod";

const cancelSchema = z.object({
  productId: z.string().optional(),
  immediate: z.boolean().optional(),
});

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return jsonError("Invalid origin", 403);
  }

  const session = await getUserSession({ required: true });
  if (session.response) {
    return session.response;
  }
  const user = session.user;

  const body = await request.json();
  const parsed = cancelSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Invalid request payload", 400);
  }

  await connectToDatabase();

  const { productId, immediate = false } = parsed.data;

  // Find the subscription to cancel
  let subscription;
  if (productId) {
    // Verify user has access to this product
    const product = await Product.findOne({
      _id: productId,
      users: user.id,
      deletedAt: null,
    });

    if (!product) {
      return jsonError("Product not found or access denied", 404);
    }

    subscription = await Subscription.findOne({
      productId: product._id,
      deletedAt: null,
    }).sort({ createdAt: -1 });
  } else {
    // Get user's products and find subscription
    const userProducts = await Product.find({
      users: user.id,
      deletedAt: null,
    }).select("_id");

    const productIds = userProducts.map((p) => p._id);

    subscription = await Subscription.findOne({
      productId: { $in: productIds },
      deletedAt: null,
    }).sort({ createdAt: -1 });
  }

  if (!subscription) {
    return jsonError("No active subscription found", 404);
  }

  try {
    if (immediate) {
      // Cancel immediately
      await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
      subscription.status = "canceled";
      subscription.canceledAt = new Date();
    } else {
      // Cancel at period end
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });
      subscription.status = "canceling";
      subscription.canceledAt = new Date();
    }

    await subscription.save();

    return jsonSuccess({
      message: immediate
        ? "Subscription canceled immediately"
        : "Subscription will be canceled at the end of the billing period",
      subscription: {
        id: subscription._id.toString(),
        status: subscription.status,
        currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() || null,
      },
    });
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return jsonError(
      error instanceof Error ? error.message : "Failed to cancel subscription",
      500
    );
  }
}
