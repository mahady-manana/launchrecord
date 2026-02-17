"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ClaimLaunchModal } from "@/components/launchrecord/ClaimLaunchModal";

interface ClaimLaunchButtonProps {
  slug: string;
  onSuccess?: () => void;
}

export function ClaimLaunchButton({ slug, onSuccess }: ClaimLaunchButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)} variant="default">
        Claim This Launch
      </Button>
      <ClaimLaunchModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        slug={slug}
        onSuccess={onSuccess}
      />
    </>
  );
}
