import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jsonError } from "@/utils/response";
import type { SessionUser } from "@/types/user";

export async function getUserSession(options?: { required?: boolean }) {
  const session = await getServerSession(authOptions);
  const user = (session?.user || null) as SessionUser | null;

  if (!user && options?.required) {
    return { user: null as SessionUser | null, response: jsonError("Unauthorized", 401) };
  }

  return { user, response: null };
}
