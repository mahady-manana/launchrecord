import Stripe from "stripe";
import { env } from "@/utils/env";

const apiVersion = env.STRIPE_API_VERSION || "2024-04-10";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: apiVersion as Stripe.LatestApiVersion,
  typescript: true,
});

export const DEFAULT_SUBSCRIPTION_PRICE_ID =
  env.STRIPE_DEFAULT_SUBSCRIPTION_PRICE_ID || "";
