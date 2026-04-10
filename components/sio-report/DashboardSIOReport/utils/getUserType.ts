import { SubscriptionRecord } from "@/types/subscription";

export type UserType = "guest" | "free" | "paid";

export function getUserType(
  isGuest?: boolean,
  subscription?: SubscriptionRecord | null,
): UserType {
  if (isGuest) return "guest";
  if (!subscription || subscription.planType === "free") return "free";
  return "paid";
}
