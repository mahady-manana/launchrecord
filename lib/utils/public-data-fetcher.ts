import Launch from "@/lib/models/launch";
import { connectToDatabase } from "@/lib/mongodb";

export async function fetchPublicLaunchBySlug(slug: string) {
  if (!slug) {
    return { success: false, message: "Slug is required." };
  }

  await connectToDatabase();

  const launch = await Launch.findOne({ slug, isArchived: false }).lean();

  if (!launch) {
    return { success: false, message: "Launch not found." };
  }

  return { success: true, launch };
}
