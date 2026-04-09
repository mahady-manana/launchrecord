import { connectToDatabase } from "@/lib/db";
import { getUserSession } from "@/lib/session";
import Product from "@/models/product";
import Subscription from "@/models/subscription";

import { jsonError, jsonSuccess } from "@/utils/response";
import { isSameOrigin } from "@/utils/security";
import { z } from "zod";

const createSchema = z.object({
  productId: z.string(),
  stripeSubscriptionId: z.string(),
  stripeCustomerId: z.string(),
  status: z.string(),
  planType: z.enum(["founder", "growth", "sovereign"]).optional(),
  currentPeriodEnd: z.string().optional(),
});

export async function GET(request: Request) {
  const session = await getUserSession({ required: true });
  if (session.response) {
    return session.response;
  }
  const user = session.user;

  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  await connectToDatabase();

  // If productId is provided, get subscription for that specific product
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

    const subscription = await Subscription.findOne({
      productId: product._id,
      deletedAt: null,
    })
      .sort({ createdAt: -1 })
      .populate("productId");

    if (!subscription) {
      return jsonSuccess({ data: { subscription: null } });
    }

    return jsonSuccess({
      data: {
        subscription: {
          id: subscription._id.toString(),
          productId: subscription.productId.toString(),
          stripeSubscriptionId: subscription.stripeSubscriptionId,
          stripePaymentIntentId: subscription.stripePaymentIntentId,
          stripeCustomerId: subscription.stripeCustomerId,
          planType: subscription.planType,
          status: subscription.status,
          currentPeriodEnd:
            subscription.currentPeriodEnd?.toISOString() || null,
          monthlyAuditLimit: subscription.monthlyAuditLimit,
          weeklyAuditLimit: subscription.weeklyAuditLimit,
          totalAuditLimit: subscription.totalAuditLimit,
          auditsUsed: subscription.auditsUsed,
        },
      },
    });
  }

  // Otherwise, get all subscriptions for user's products
  const userProducts = await Product.find({
    users: user.id,
    deletedAt: null,
  }).select("_id name");

  const productIds = userProducts.map((p) => p._id);

  const subscriptions = await Subscription.find({
    productId: { $in: productIds },
    deletedAt: null,
  }).sort({ createdAt: -1 });

  const subscriptionData = subscriptions.map((subscription) => ({
    id: subscription._id.toString(),
    productId: subscription.productId.toString(),
    stripeSubscriptionId: subscription.stripeSubscriptionId,
    stripePaymentIntentId: subscription.stripePaymentIntentId,
    stripeCustomerId: subscription.stripeCustomerId,
    planType: subscription.planType,
    status: subscription.status,
    currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() || null,
    monthlyAuditLimit: subscription.monthlyAuditLimit,
    weeklyAuditLimit: subscription.weeklyAuditLimit,
    totalAuditLimit: subscription.totalAuditLimit,
    auditsUsed: subscription.auditsUsed,
  }));

  return jsonSuccess({
    data: {
      subscriptions: subscriptionData,
    },
  });
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return jsonError("Invalid origin", 403);
  }

  const session = await getUserSession({ required: true });
  if (session.response) {
    return session.response;
  }

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Invalid request payload", 400);
  }

  await connectToDatabase();

  // Verify user has access to this product
  const product = await Product.findOne({
    _id: parsed.data.productId,
    users: session.user.id,
    deletedAt: null,
  });

  if (!product) {
    return jsonError("Product not found or access denied", 404);
  }

  const subscription = await Subscription.findOneAndUpdate(
    {
      productId: parsed.data.productId,
      stripeSubscriptionId: parsed.data.stripeSubscriptionId,
    },
    {
      productId: parsed.data.productId,
      stripeCustomerId: parsed.data.stripeCustomerId,
      status: parsed.data.status,
      planType: parsed.data.planType || "founder",
      currentPeriodEnd: parsed.data.currentPeriodEnd
        ? new Date(parsed.data.currentPeriodEnd)
        : null,
    },
    { new: true, upsert: true },
  );

  return jsonSuccess({
    data: {
      subscription: {
        id: subscription._id.toString(),
        productId: subscription.productId.toString(),
        stripeSubscriptionId: subscription.stripeSubscriptionId,
        stripeCustomerId: subscription.stripeCustomerId,
        planType: subscription.planType,
        status: subscription.status,
        currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() || null,
      },
    },
  });
}
