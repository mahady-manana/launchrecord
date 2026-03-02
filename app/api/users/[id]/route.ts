import { z } from "zod";
import User from "@/models/user";
import { connectToDatabase } from "@/lib/db";
import { getUserSession } from "@/lib/session";
import { jsonError, jsonSuccess } from "@/utils/response";
import { sanitizeText } from "@/utils/sanitize";
import { isSameOrigin } from "@/utils/security";
import { NextRequest } from "next/server";

const updateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  role: z.enum(["user", "admin"]).optional(),
});

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getUserSession({ required: true });
  if (session.response) {
    return session.response;
  }
  const sessionUser = session.user;

  if (!sessionUser) {
    return jsonError("Unauthorized", 401);
  }

  const { id: userId } = await params;
  if (sessionUser.role !== "admin" && sessionUser.id !== userId) {
    return jsonError("Forbidden", 403);
  }

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

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
  if (sessionUser.role !== "admin" && sessionUser.id !== userId) {
    return jsonError("Forbidden", 403);
  }

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
  if (parsed.data.role) {
    if (sessionUser.role !== "admin") {
      return jsonError("Forbidden", 403);
    }
    updateData.role = parsed.data.role;
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

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
  if (sessionUser.role !== "admin" && sessionUser.id !== userId) {
    return jsonError("Forbidden", 403);
  }

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
