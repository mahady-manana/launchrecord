"use client";

import { FeaturedPlacementCard } from "@/components/launchrecord/featured-placement-card";
import { PlacementCard } from "@/components/launchrecord/placement-card";
import { PlacementForm } from "@/components/launchrecord/placement-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@/hooks/use-user";
import { Placement } from "@/types/placement";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PlacementSetupClientProps {
  initialPlacement: Placement;
  placementId: string;
}

export default function PlacementSetupClient({
  initialPlacement,
  placementId,
}: PlacementSetupClientProps) {
  const router = useRouter();
  const { user, authStatus } = useUser();
  const [placement, setPlacement] = useState<Placement>({
    ...initialPlacement,
    color: initialPlacement.color || "#001b46", // Default to blue if not set
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authStatus === "loading") return;

    if (authStatus !== "authenticated") {
      router.push(
        "/auth/signin?callbackUrl=" +
          encodeURIComponent(window.location.pathname),
      );
      return;
    }
  }, [authStatus, router]);

  const handleUpdatePlacement = async (formData: any) => {
    try {
      setLoading(true);
      const response = await fetch("/api/placements/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: placement._id,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update placement");
      }

      // Redirect to placements dashboard after successful update
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to update placement");
      console.error("Error updating placement:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSetLive = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/placements/update-status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: placement._id,
          status: "active",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to activate placement");
      }

      // Update local state
      setPlacement((prev) => ({ ...prev, status: "active" }));

      toast.success("Placement is now live!");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to activate placement");
      console.error("Error activating placement:", err);
      toast.error(err.message || "Failed to activate placement");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/placements");
  };

  // Update placement state when form data changes for preview
  const handlePlacementChange = (updatedData: Partial<Placement>) => {
    setPlacement((prev) => ({
      ...prev,
      ...updatedData,
    }));
  };

  if (authStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading placement details...</p>
        </div>
      </div>
    );
  }

  if (authStatus !== "authenticated") {
    return null; // Redirect handled by useEffect
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!placement) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Placement Not Found</CardTitle>
            <CardDescription>
              The placement you're looking for doesn't exist.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/dashboard/placements")}>
              Back to Placements
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="md:flex items-center mb-8 justify-between">
        <div className="">
          <h1 className="text-3xl font-bold">Set Up Your Campaign</h1>
          <p className="text-muted-foreground">
            Customize your campaign details for {placement.codeName}
          </p>
        </div>
        <div>
          <div className="flex justify-end">
            <Button
              onClick={() => {
                // Open modal to select placement and pay
                // This would trigger the same flow as the advertise button
                // For now, navigate to the placements page to select and pay
                router.push("/dashboard/placements");
              }}
              size="lg"
              className="bg-green-600 hover:bg-green-700"
            >
              Publish Campaign
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
              <CardDescription>
                Fill in the details for your campaign
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlacementForm
                placement={placement}
                onSubmit={handleUpdatePlacement}
                onCancel={handleCancel}
                onSetLive={handleSetLive}
                onChange={handlePlacementChange} // Pass the change handler to the form
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                How your campaign will appear on the site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Featured Placement Preview */}

                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Featured Campaign
                  </h4>
                  <div className="bg-muted rounded-lg p-4 min-h-[300px] flex items-center justify-center">
                    <div className="w-full max-w-md">
                      <FeaturedPlacementCard
                        preview
                        placements={[
                          {
                            ...placement,
                            appName:
                              placement.appName || "Your Application Name",
                            tagline:
                              placement.tagline ||
                              "Your one tagline hook for founders/users",
                          },
                        ]}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Sidebar Campaign</h4>
                  <div className="bg-muted rounded-lg p-4 min-h-[200px] flex items-center justify-center">
                    <div className="w-full max-w-xs">
                      <PlacementCard
                        placement={{
                          ...placement,
                          appName: placement.appName || "Your Application Name",
                          tagline:
                            placement.tagline ||
                            "Your one tagline hook for founders/users",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                This is how your {placement.placementType || "campaign"} will
                appear on the site
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
