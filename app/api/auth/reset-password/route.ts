import crypto from "crypto";
import { z } from "zod";
import User from "@/models/user";
import { connectToDatabase } from "@/lib/db";
import { hashPassword } from "@/utils/password";
import { jsonError, jsonSuccess } from "@/utils/response";
import { sanitizeText } from "@/utils/sanitize";
import { getClientIp, isSameOrigin } from "@/utils/security";
import { rateLimit } from "@/utils/rate-limit";

const resetSchema = z.object({
  token: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return jsonError("Invalid origin", 403);
  }

  const limiter = rateLimit(`reset:${getClientIp(request)}`, {
    limit: 5,
    windowMs: 60_000,
  });

  if (!limiter.allowed) {
    return jsonError("Too many requests", 429);
  }

  const body = await request.json();
  const parsed = resetSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Invalid request payload", 400);
  }

  const email = sanitizeText(parsed.data.email).toLowerCase();
  const tokenHash = crypto
    .createHash("sha256")
    .update(parsed.data.token)
    .digest("hex");

  await connectToDatabase();

  const user = await User.findOne({
    email,
    deletedAt: null,
    resetTokenHash: tokenHash,
    resetTokenExpiresAt: { $gt: new Date() },
  }).select("+resetTokenHash +resetTokenExpiresAt");

  if (!user) {
    return jsonError("Reset token is invalid or expired", 400);
  }

  user.password = await hashPassword(parsed.data.password);
  user.resetTokenHash = null;
  user.resetTokenExpiresAt = null;
  await user.save();

  return jsonSuccess({ message: "Password reset successfully." });
}
