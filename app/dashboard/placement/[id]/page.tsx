import PlacementSetupClient from "@/components/launchrecord/placement-setup-client";
import { getUserFromSession } from "@/lib/get-user-from-session";
import Placement from "@/lib/models/placement";
import { connectToDatabase } from "@/lib/mongodb";
import { Placement as PlacementType } from "@/types/placement";
import { redirect } from "next/navigation";

async function getPlacement(
  id: string,
  userId: string,
): Promise<PlacementType | null> {
  try {
    // Connect to database directly instead of making an API call
    // This avoids potential cookie/session issues when calling from server component
    await connectToDatabase();

    const user = await getUserFromSession();

    if (!user) {
      throw new Error("User not authenticated");
    }

    // Find the placement and ensure it belongs to the user
    const placement = (await Placement.findById(
      id,
    ).lean()) as unknown as PlacementType;

    if (!placement) {
      throw new Error("Placement not found or unauthorized");
    }

    if (placement.userId?.toString() !== userId) {
      return null;
    }

    // Convert ObjectId to string for serialization
    return {
      ...placement,
      _id: placement._id.toString(),
    };
  } catch (error) {
    console.error("Error fetching placement:", error);
    return null;
  }
}

export default async function PlacementSetupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const awaitedParams = await params;
  const id = awaitedParams.id;

  const user = await getUserFromSession();

  if (!user) {
    redirect(
      `/auth/signin?callbackUrl=${encodeURIComponent(`/dashboard/placement/${id}`)}`,
    );
  }

  const placement = await getPlacement(id, user._id);

  if (!placement) {
    // Handle case where placement doesn't exist
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Placement Not Found</h1>
          <p className="text-gray-600">
            The placement you're looking for doesn't exist or you don't have
            access to it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <PlacementSetupClient
      initialPlacement={JSON.parse(JSON.stringify(placement)) as PlacementType}
      placementId={id}
    />
  );
}
