import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/lib/models/user";

export interface SessionUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
}

export async function getUserFromSession(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  await connectToDatabase();

  const user = await User.findOne({ email: session.user.email })
    .select("name email image")
    .lean();

  if (!user) {
    return null;
  }

  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    image: user.image,
  };
}
