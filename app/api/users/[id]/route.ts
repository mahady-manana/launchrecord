import { connectToDatabase } from "@/lib/db";
import { getUserSession } from "@/lib/session";
import User from "@/models/user";
import { jsonError, jsonSuccess } from "@/utils/response";
import { sanitizeText } from "@/utils/sanitize";
import { isSameOrigin } from "@/utils/security";
import { NextRequest } from "next/server";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  role: z.enum(["user", "admin"]).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getUserSession({ required: true });
  if (session.response) {
    return session.response;
  }
  const sessionUser = session.user;

  if (!sessionUser) {
    return jsonError("Unauthorized", 401);
  }

  const { id: userId } = await params;

  await connectToDatabase();
  const user = await User.findOne({ _id: userId, deletedAt: null });
  if (!user) {
    return jsonError("User not found", 404);
  }

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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

  const { id: userId } = await params;

  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Invalid request payload", 400);
  }

  const updateData: Record<string, string> = {};
  if (parsed.data.name) {
    updateData.name = sanitizeText(parsed.data.name);
  }
  if (parsed.data.email) {
    updateData.email = sanitizeText(parsed.data.email).toLowerCase();
  }

  if (Object.keys(updateData).length === 0) {
    return jsonError("No fields to update", 400);
  }

  await connectToDatabase();

  if (updateData.email) {
    const existing = await User.findOne({
      email: updateData.email,
      _id: { $ne: userId },
      deletedAt: null,
    });
    if (existing) {
      return jsonError("Email is already registered", 409);
    }
  }

  const user = await User.findOneAndUpdate(
    { _id: userId, deletedAt: null },
    updateData,
    { new: true },
  );

  if (!user) {
    return jsonError("User not found", 404);
  }

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

  const { id: userId } = await params;

  await connectToDatabase();
  const user = await User.findOneAndUpdate(
    { _id: userId, deletedAt: null },
    { deletedAt: new Date() },
    { new: true },
  );

  if (!user) {
    return jsonError("User not found", 404);
  }

  return jsonSuccess({ message: "User removed" });
}
