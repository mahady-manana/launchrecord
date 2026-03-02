import { connectToDatabase } from "@/lib/db";
import { getUserSession } from "@/lib/session";
import User from "@/models/user";
import { jsonError, jsonSuccess } from "@/utils/response";

export async function GET() {
  // require an active session
  const session = await getUserSession({ required: true });
  if (session.response) {
    return session.response;
  }

  if (!session.user) {
    return jsonError("Unauthorized", 401);
  }

  // look up the latest user record in case something changed since the JWT was issued
  await connectToDatabase();
  const user = await User.findOne({ _id: session.user.id, deletedAt: null });
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
