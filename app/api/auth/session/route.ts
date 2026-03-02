import { getUserSession } from "@/lib/session";
import { jsonSuccess } from "@/utils/response";

export async function GET() {
  const session = await getUserSession({ required: true });
  if (session.response) {
    return session.response;
  }
  return jsonSuccess({ data: { user: session.user } });
}
