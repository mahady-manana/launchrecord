"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUser } from "@/hooks/use-user";
import { Megaphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";

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
  const [campaignTitle, setCampaignTitle] = useState("New Campaign");
  const [isCreating, setIsCreating] = useState(false);

  const handleAdvertiseClick = () => {
    if (authStatus !== "authenticated") {
      router.push("/auth/signin?callbackUrl=/advertise");
      return;
    }

    setIsOpen(true);
  };

  const handleCreateNewCampaign = async () => {
    if (!campaignTitle.trim()) {
      toast.error("Please enter a campaign title");
      return;
    }

    setIsCreating(true);
    try {
      // Create a new placement (campaign) via API
      const response = await fetch("/api/placements/create-temp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: campaignTitle,
          tagline: "Your campaign tagline", // Default tagline
          website: "https://example.com", // Default website
          placementType: "sidebar", // Default to sidebar
          position: "left", // Default to left
          price: 0, // Price will be set when user selects a slot
          status: "draft", // Start as draft
          codeName: `CAMPAIGN-${Date.now()}`, // Generate a temporary code
          duration: 30, // Default duration
        }),
      });

      const data = await response.json();

      if (data.success && data.placement) {
        // Redirect to the setup page for the new campaign
        setIsOpen(false);
        router.push(`/dashboard/placement/${data.placement._id}`);
      } else {
        toast.error(data.message || "Failed to create campaign");
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("An error occurred while creating the campaign");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={handleAdvertiseClick}>
          <Megaphone /> Advertise
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[80%] md:max-w-[80%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Advertise Your Product</DialogTitle>
          <DialogDescription>
            Create a new campaign to promote your product to thousands of users.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-4 mb-6">
            <div>
              <label className="text-sm font-medium">Campaign Title</label>
              <Input
                value={campaignTitle}
                onChange={(e) => setCampaignTitle(e.target.value)}
                placeholder="Enter your campaign title"
                className="mt-1"
              />
            </div>
          </div>

          <Button
            onClick={handleCreateNewCampaign}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isCreating || !campaignTitle}
          >
            {isCreating ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating...
              </>
            ) : (
              "Create New Campaign"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
