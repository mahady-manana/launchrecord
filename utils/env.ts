import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  NEXTAUTH_SECRET: z.string().min(16, "NEXTAUTH_SECRET is required"),
  NEXT_PUBLIC_APP_URL: z.string().url("NEXT_PUBLIC_APP_URL is required"),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().min(1, "STRIPE_SECRET_KEY is required"),
  STRIPE_WEBHOOK_SECRET: z
    .string()
    .min(1, "STRIPE_WEBHOOK_SECRET is required")
    .optional(),
  STRIPE_DEFAULT_SUBSCRIPTION_PRICE_ID: z.string().optional(),
  STRIPE_API_VERSION: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is required"),
  AWS_REGION: z.string().min(1, "S3_REGION is required"),
  AWS_BUCKET_NAME: z.string().min(1, "S3_BUCKET is required"),
  AWS_ACCESS_KEY_ID: z.string().min(1, "S3_ACCESS_KEY_ID is required"),
  AWS_SECRET_ACCESS_KEY: z.string().min(1, "S3_SECRET_ACCESS_KEY is required"),
  AWS_ENDPOINT: z.string().optional(),
  AWS_FORCE_PATH_STYLE: z.string().optional(),
  SMTP_HOST: z.string().min(1, "SMTP_HOST is required").optional(),
  SMTP_PORT: z.string().min(1, "SMTP_PORT is required").optional(),
  SMTP_USER: z.string().min(1, "SMTP_USER is required").optional(),
  SMTP_PASS: z.string().min(1, "SMTP_PASS is required").optional(),
  EMAIL_FROM: z.string().email("EMAIL_FROM is required").optional(),
});

export const env = envSchema.parse(process.env);
