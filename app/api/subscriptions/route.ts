import { connectToDatabase } from "@/lib/db";
import { getUserSession } from "@/lib/session";
import Subscription from "@/models/subscription";

import { jsonError, jsonSuccess } from "@/utils/response";
import { isSameOrigin } from "@/utils/security";
import { z } from "zod";

const createSchema = z.object({
  userId: z.string(),
  stripeSubscriptionId: z.string(),
  stripeCustomerId: z.string(),
  status: z.string(),
  currentPeriodEnd: z.string().optional(),
});

export async function GET() {
  const session = await getUserSession({ required: true });
  if (session.response) {
    return session.response;
  }
  const user = session.user;

  await connectToDatabase();

  const subscription = await Subscription.findOne({
    userId: user.id,
    deletedAt: null,
  }).sort({ createdAt: -1 });

  if (!subscription) {
    return jsonSuccess({ data: { subscription: null } });
  }

  return jsonSuccess({
    data: {
      subscription: {
        id: subscription._id.toString(),
        userId: subscription.userId.toString(),
        stripeSubscriptionId: subscription.stripeSubscriptionId,
        stripeCustomerId: subscription.stripeCustomerId,
        status: subscription.status,
        currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() || null,
      },
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
  const subscription = await Subscription.findOneAndUpdate(
    {
      userId: parsed.data.userId,
      stripeSubscriptionId: parsed.data.stripeSubscriptionId,
    },
    {
      stripeCustomerId: parsed.data.stripeCustomerId,
      status: parsed.data.status,
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
        userId: subscription.userId.toString(),
        stripeSubscriptionId: subscription.stripeSubscriptionId,
        stripeCustomerId: subscription.stripeCustomerId,
        status: subscription.status,
        currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() || null,
      },
    },
  });
}
