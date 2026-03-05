import { authOptions } from "@/lib/auth";
import User from "@/models/user";
import type { SessionUser } from "@/types/user";
import { jsonError } from "@/utils/response";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "./db";

export async function getUserSession(options?: { required?: boolean }) {
  const session = await getServerSession(authOptions);
  const user = (session?.user || null) as SessionUser | null;
  await connectToDatabase();

  if (!user?.email && options?.required) {
    return {
      user: null as SessionUser | null,
      response: jsonError("Unauthorized", 401),
    };
  }

  const userDB = await User.findOne({ email: user?.email })
    .select("name email image")
    .lean();
  if (!userDB?._id && options?.required) {
    return {
      user: null as SessionUser | null,
      response: jsonError("Unauthorized", 401),
    };
  }
  const data = {
    _id: userDB?._id,
    id: userDB?._id?.toString(),
    name: userDB?.name,
    email: userDB?.email,
  };

  return { user: data, response: null };
}
