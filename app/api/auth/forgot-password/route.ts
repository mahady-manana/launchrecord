import crypto from "crypto";
import { z } from "zod";
import User from "@/models/user";
import { connectToDatabase } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/resend-email";
import { sanitizeText } from "@/utils/sanitize";
import { getClientIp, isSameOrigin } from "@/utils/security";
import { rateLimit } from "@/utils/rate-limit";
import { jsonError, jsonSuccess } from "@/utils/response";

const forgotSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return jsonError("Invalid origin", 403);
  }

  const limiter = rateLimit(`forgot:${getClientIp(request)}`, {
    limit: 5,
    windowMs: 60_000,
  });

  if (!limiter.allowed) {
    return jsonError("Too many requests", 429);
  }

  const body = await request.json();
  const parsed = forgotSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Invalid request payload", 400);
  }

  const email = sanitizeText(parsed.data.email).toLowerCase();

  await connectToDatabase();
  const user = await User.findOne({ email, deletedAt: null });

  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    user.resetTokenHash = tokenHash;
    user.resetTokenExpiresAt = expiresAt;
    await user.save();

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}&email=${encodeURIComponent(
      email,
    )}`;

    await sendPasswordResetEmail(user.email, token, user.name);
  }

  return jsonSuccess({
    message: "If an account exists, a password reset link has been sent.",
  });
}
