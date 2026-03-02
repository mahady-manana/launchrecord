import { z } from "zod";
import User from "@/models/user";
import { connectToDatabase } from "@/lib/db";
import { hashPassword } from "@/utils/password";
import { sanitizeText } from "@/utils/sanitize";
import { getClientIp, isSameOrigin } from "@/utils/security";
import { rateLimit } from "@/utils/rate-limit";
import { jsonError, jsonSuccess } from "@/utils/response";

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return jsonError("Invalid origin", 403);
  }

  const limiter = rateLimit(`register:${getClientIp(request)}`, {
    limit: 5,
    windowMs: 60_000,
  });

  if (!limiter.allowed) {
    return jsonError("Too many requests", 429);
  }

  const body = await request.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Invalid request payload", 400);
  }

  const name = sanitizeText(parsed.data.name);
  const email = sanitizeText(parsed.data.email).toLowerCase();

  await connectToDatabase();

  const existingUser = await User.findOne({ email, deletedAt: null });
  if (existingUser) {
    return jsonError("Email is already registered", 409);
  }

  const hashedPassword = await hashPassword(parsed.data.password);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "user",
    provider: "credentials",
  });

  return jsonSuccess({
    data: {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
}
