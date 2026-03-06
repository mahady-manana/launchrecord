import { connectToDatabase } from "@/lib/db";
import { getUserSession } from "@/lib/session";
import User from "@/models/user";
import { hashPassword } from "@/utils/password";
import { jsonError, jsonSuccess } from "@/utils/response";
import { sanitizeText } from "@/utils/sanitize";
import { isSameOrigin } from "@/utils/security";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  role: z.enum(["user", "admin"]),
});

export async function GET() {
  const session = await getUserSession({ required: true });
  if (session.response) {
    return session.response;
  }
  const sessionUser = session.user;

  if (!sessionUser) {
    return jsonError("Unauthorized", 401);
  }

  await connectToDatabase();

  const user = await User.findOne({
    _id: sessionUser.id,
    deletedAt: null,
  });

  if (!user) {
    return jsonError("User not found", 404);
  }

  return jsonSuccess({
    data: {
      users: [
        {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      ],
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
  const sessionUser = session.user;

  if (!sessionUser) {
    return jsonError("Unauthorized", 401);
  }

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
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
    role: parsed.data.role,
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
