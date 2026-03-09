import { env } from "@/utils/env";
import Stripe from "stripe";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-01-28.clover",
  typescript: true,
});

export const DEFAULT_SUBSCRIPTION_PRICE_ID =
  env.STRIPE_DEFAULT_SUBSCRIPTION_PRICE_ID || "";
