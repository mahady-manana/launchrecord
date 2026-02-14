"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/hooks/use-user";
import { Clock, DollarSign, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PlacementSlot {
  id: string;
  position: string;
  type: string;
  price: number;
  duration: number;
  codeName: string;
  isAvailable: boolean;
}

export function PlacementAdvertiseButton() {
  const { user, authStatus } = useUser();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [slots, setSlots] = useState<PlacementSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDurations, setSelectedDurations] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    if (isOpen) {
      fetchSlots();
    }
  }, [isOpen]);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/placements/available");
      const data = await response.json();

      if (data.success) {
        setSlots(data.slots);
      }
    } catch (error) {
      console.error("Error fetching placement slots:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdvertiseClick = () => {
    if (authStatus !== "authenticated") {
      router.push("/auth/signin?callbackUrl=/advertise");
      return;
    }

    setIsOpen(true);
  };

  const handleSlotClick = async (slotId: string) => {
    if (!user) return;

    // Find the slot by ID to get its codeName
    const slot = slots.find((s) => s.id === slotId);
    if (!slot) return;

    // Get selected duration for this specific slot (default to 30 days)
    const selectedDuration = selectedDurations[slotId] || 30;

    try {
      // Call the API to create a Stripe checkout session
      const response = await fetch("/api/placements/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          placementCode: slot.codeName,
          duration: selectedDuration,
        }),
      });

      const data = await response.json();

      if (data.success && data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        console.error("Failed to create checkout session:", data.message);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={handleAdvertiseClick}>
          Advertise
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[80%] md:max-w-[80%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Advertise Your Product</DialogTitle>
          <DialogDescription>
            Choose from our premium placement options to promote your product to
            thousands of users.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {slots.map((slot) => (
                <Card
                  key={slot.id}
                  className={`transition-all hover:shadow-md ${!slot.isAvailable ? "opacity-50 pointer-events-none" : "hover:scale-[1.02]"}`}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">
                        {slot.type === "featured" ? "Featured" : "Sidebar"}{" "}
                        {slot.position}
                      </CardTitle>
                      {!slot.isAvailable && (
                        <Badge variant="destructive">Unavailable</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                        <span>${slot.price}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-blue-500" />
                        <span>{slot.duration} days</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-purple-500" />
                        <span>Code: {slot.codeName}</span>
                      </div>
                    </div>

                    {/* Duration selection for available slots */}
                    {slot.isAvailable && (
                      <div className="mt-4">
                        <label className="text-sm font-medium">Duration</label>
                        <Select
                          value={selectedDurations[slot.id]?.toString() || "30"}
                          onValueChange={(value) => {
                            const duration = parseInt(value);
                            setSelectedDurations((prev) => ({
                              ...prev,
                              [slot.id]: duration,
                            }));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">
                              15 days - $
                              {Math.round(slot.price * 0.7).toFixed(0)}
                            </SelectItem>
                            <SelectItem value="30">
                              30 days - ${slot.price}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      disabled={!slot.isAvailable}
                      onClick={() => handleSlotClick(slot.id)}
                    >
                      {slot.isAvailable ? "Purchase" : "Not Available"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">How it works:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  • Select a placement slot that fits your marketing goals
                </li>
                <li>• Choose duration (15 or 30 days)</li>
                <li>• Complete payment securely through Stripe</li>
                <li>• Your ad will go live on the selected start date</li>
                <li>• Track performance through your dashboard</li>
              </ul>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
