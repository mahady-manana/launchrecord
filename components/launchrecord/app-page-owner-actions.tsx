"use client";

import { LaunchEditModal } from "@/components/launchrecord/launch-edit-modal";
import { Button } from "@/components/ui/button";
import { Launch, UpdateLaunchPayload } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AppPageOwnerActionsProps {
  launch: Launch;
  isOwner: boolean;
}

export function AppPageOwnerActions({
  launch,
  isOwner,
}: AppPageOwnerActionsProps) {
  const router = useRouter();
  const [isEditOpen, setEditOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareLabel, setShareLabel] = useState("Share");

  const handleSave = async (payload: UpdateLaunchPayload) => {
    try {
      const response = await fetch("/api/launches/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.message || "Failed to update launch.",
        };
      }

      router.refresh();

      return { success: true };
    } catch (error) {
      console.error("Error updating launch:", error);
      return { success: false, message: "Failed to update launch." };
    }
  };

  const handleShare = async () => {
    try {
      setIsSharing(true);
      const shareUrl = `${window.location.origin}/app/${launch.slug}`;

      if (navigator.share) {
        await navigator.share({
          title: launch.name,
          text: launch.tagline,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
      }

      setShareLabel("Shared");
      setTimeout(() => setShareLabel("Share"), 1500);
    } catch (error) {
      console.error("Share failed:", error);
      setShareLabel("Failed");
      setTimeout(() => setShareLabel("Share"), 1500);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {isOwner ? (
        <Button
          variant="ghost"
          className="bg-green-900"
          size="sm"
          onClick={() => setEditOpen(true)}
        >
          {launch.status}
        </Button>
      ) : null}
      {isOwner ? (
        <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
          Edit launch
        </Button>
      ) : null}
      <Button asChild size="sm">
        <Link href={launch.website} target="_blank" rel="noreferrer">
          Visit website
        </Link>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleShare}
        disabled={isSharing}
      >
        {isSharing ? "Sharing..." : shareLabel}
      </Button>
      <LaunchEditModal
        launch={launch}
        open={isEditOpen}
        onOpenChange={setEditOpen}
        onSave={handleSave}
      />
    </div>
  );
}
