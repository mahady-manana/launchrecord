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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUser } from "@/hooks/use-user";
import { Placement, PlacementSlot } from "@/types/placement";
import { DotSquareIcon, Loader2 } from "lucide-react";
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

  // State for publish campaign modal
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(20); // Default to 30 days
  const [slots, setSlots] = useState<PlacementSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

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

      toast.success("Campaign updated"); // Redirect to placements dashboard after successful update
    } catch (err: any) {
      setError(err.message || "Failed to update placement");
      console.error("Error updating placement:", err);
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

  // Function to fetch available slots
  const fetchSlots = async () => {
    setSlotsLoading(true);
    try {
      const response = await fetch("/api/placements/available");
      const data = await response.json();

      if (data.success) {
        setSlots(data.slots);
      } else {
        toast.error(data.message || "Failed to fetch available slots");
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
      toast.error("Failed to fetch available slots");
    } finally {
      setSlotsLoading(false);
    }
  };

  // Function to handle slot selection
  const handleSlotSelect = (slotId: string) => {
    setSelectedSlot(slotId);
    setSelectedDuration(20); // Default to 30 days when selecting a slot
  };

  // Function to handle payment
  const handlePayment = async () => {
    if (!selectedSlot) {
      toast.error("Please select a placement slot");
      return;
    }

    try {
      // Find the selected slot
      const selectedSlotObj = slots.find((slot) => slot.id === selectedSlot);
      if (!selectedSlotObj) {
        toast.error("Selected slot not found");
        return;
      }

      // Show notification about redirecting to Stripe
      toast.info("Redirecting to secure payment page...", {
        duration: 2000,
      });

      // Call the API to create a Stripe checkout session
      const response = await fetch("/api/placements/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          placementId: placementId, // Use placementId instead of placementCode
          placementCode: selectedSlotObj.codeName, // Also send the selected slot code
          duration: selectedDuration, // Use the selected duration
          name: selectedSlotObj.name,
          description: selectedSlotObj.description,
        }),
      });

      const data = await response.json();

      if (data.success && data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        // Show error notification
        toast.error(data.message || "Failed to create checkout session");
        console.error("Failed to create checkout session:", data.message);
      }
    } catch (error) {
      // Show error notification
      toast.error("An error occurred while processing your payment request");
      console.error("Error creating checkout session:", error);
    }
  };

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
            {placement.paymentStatus === "pending" ? (
              <Button
                size="lg"
                className="bg-yellow-600 hover:bg-yellow-700"
                disabled
              >
                Payment Under Process
              </Button>
            ) : null}
            {placement.paymentStatus !== "draft" ? (
              <Button
                onClick={() => {
                  setIsPublishModalOpen(true);
                  fetchSlots(); // Fetch available slots when modal opens
                }}
                size="lg"
                className="bg-green-600 hover:bg-green-700"
              >
                Publish Campaign
              </Button>
            ) : null}
            {placement.paymentStatus === "paid" &&
            placement.status === "active" ? (
              <Button
                size="lg"
                variant="ghost"
                className="bg-green-600 hover:bg-green-700"
              >
                <DotSquareIcon size={20} />
                Campaign published
              </Button>
            ) : null}
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

      <Dialog open={isPublishModalOpen} onOpenChange={setIsPublishModalOpen}>
        <DialogContent className="max-w-[80%] md:max-w-[80%]  max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Publish Your Campaign</DialogTitle>
            <DialogDescription>
              Follow these steps to publish your campaign
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {selectedSlot ? (
              // Second screen: Notification and legal engagement
              <div>
                <h3 className="text-lg font-medium mb-4">Complete Payment</h3>

                {/* Duration Selection */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Select Duration</h4>
                  <div className="flex gap-4">
                    <div
                      className={`border rounded-lg p-4 flex-1 text-center cursor-pointer transition-all ${
                        selectedDuration === 10
                          ? "border-green-500 bg-green-700"
                          : "hover:border-primary"
                      }`}
                      onClick={() => setSelectedDuration(10)}
                    >
                      <div className="font-medium">
                        $$
                        {Math.round(
                          (slots.find((s) => s.id === selectedSlot)?.price ||
                            0) * 0.7 || 0,
                        )}
                      </div>
                      <div className="text-sm text-white">10 Days</div>
                    </div>
                    <div
                      className={`border rounded-lg p-4 flex-1 text-center cursor-pointer transition-all ${
                        selectedDuration === 20
                          ? "border-green-500 bg-green-700"
                          : "hover:border-primary"
                      }`}
                      onClick={() => setSelectedDuration(20)}
                    >
                      <div className="font-medium">
                        $${slots.find((s) => s.id === selectedSlot)?.price || 0}
                      </div>
                      <div className="text-sm text-white">20 Days</div>
                    </div>
                  </div>
                </div>

                <div className="border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm mb-4">
                    <strong>Important:</strong> You will be redirected to Stripe
                    for secure payment processing. Your invoice will be issued
                    under <strong>Retold.me</strong> name because LaunchRecord
                    operates under Retold.me and Azesapce, Inc jurisdiction.
                  </p>
                  <div className="text-sm">
                    <p className="font-medium mb-2">Legal Agreement:</p>
                    <ul className="list-disc pl-5 space-y-1 text-xs">
                      <li>
                        I acknowledge that I am purchasing a placement slot on
                        LaunchRecord
                      </li>
                      <li>
                        I agree to the terms of service and privacy policy
                      </li>
                      <li>
                        I understand that payments are processed securely
                        through Stripe
                      </li>
                      <li>
                        I consent to receiving billing information under the
                        Retold.me & Azespace, Inc. name
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedSlot(null)}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handlePayment}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Go to payment ($
                    {selectedDuration === 10
                      ? Math.round(
                          (slots.find((s) => s.id === selectedSlot)?.price ||
                            0) * 0.7 || 0,
                        )
                      : slots.find((s) => s.id === selectedSlot)?.price || 0}
                    )
                  </Button>
                </div>
              </div>
            ) : (
              // First screen: Select placement slot
              <div>
                <h3 className="text-lg font-medium mb-2">
                  Select a Placement Slot
                </h3>
                {slotsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {slots.map((slot) => (
                      <div
                        key={slot.id}
                        className={`border rounded-lg p-4 space-y-2 cursor-pointer transition-all ${
                          selectedSlot === slot.id
                            ? "border-green-500 bg-green-700"
                            : "hover:border-primary bg-green-900"
                        }`}
                        onClick={() => handleSlotSelect(slot.id)}
                      >
                        <h4 className="font-medium">{slot.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {slot.description}
                        </p>
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="font-bold text-white bg-primary p-1 px-2 rounded-full block">
                              <span className="">
                                ${Math.round(slot.price * 0.7)}
                              </span>{" "}
                              <span className="">for 10 days</span>{" "}
                            </p>
                            <p className="font-bold text-white bg-primary p-1 px-2 rounded-full block">
                              <span className="">${slot.price}</span>{" "}
                              <span className="">for 20 days</span>{" "}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
