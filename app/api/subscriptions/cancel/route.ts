import { connectToDatabase } from "@/lib/db";
import { getUserSession } from "@/lib/session";
import { stripe } from "@/lib/stripe";

import Subscription from "@/models/subscription";
import User from "@/models/user";
import { jsonError, jsonSuccess } from "@/utils/response";
import { isSameOrigin } from "@/utils/security";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return jsonError("Invalid origin", 403);
  }

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
    return jsonError("No active subscription", 404);
  }

  await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
    cancel_at_period_end: true,
  });

  subscription.status = "canceled";
  subscription.canceledAt = new Date();
  await subscription.save();

  await User.findByIdAndUpdate(user.id, {
    subscriptionStatus: "canceled",
  });

  return jsonSuccess({ message: "Subscription canceled" });
}
