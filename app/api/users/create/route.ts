import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import { getClientIdentifier, isSameOrigin } from "@/lib/security";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeText } from "@/lib/sanitize";
import User from "@/lib/models/user";

const createUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .max(128)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must include upper, lower, and number.",
    ),
});

export async function POST(request: Request) {
  try {
    if (!isSameOrigin(request)) {
      return NextResponse.json({ success: false, message: "Invalid origin." }, { status: 403 });
    }

    const identifier = getClientIdentifier(request);
    const limitResult = rateLimit({
      key: `users:create:${identifier}`,
      limit: 10,
      windowMs: 10 * 60 * 1000,
    });

    if (!limitResult.allowed) {
      return NextResponse.json(
        { success: false, message: "Too many signup attempts. Try again later." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(limitResult.retryAfterMs / 1000)) } },
      );
    }

    const body = await request.json();
    const validatedBody = createUserSchema.parse(body);

    await connectToDatabase();

    const normalizedEmail = validatedBody.email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "An account with this email already exists." },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(validatedBody.password, 12);

    const createdUser = await User.create({
      name: sanitizeText(validatedBody.name),
      email: normalizedEmail,
      password: hashedPassword,
      provider: "credentials",
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: createdUser._id.toString(),
          name: createdUser.name,
          email: createdUser.email,
          image: createdUser.image || null,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.errors[0]?.message || "Invalid data." },
        { status: 400 },
      );
    }

    console.error("Error creating user:", error);
    return NextResponse.json(
      { success: false, message: "Unable to create account right now." },
      { status: 500 },
    );
  }
}
