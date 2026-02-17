"use client";

import { Button } from "@/components/ui/button";
import { useOutboundClick } from "@/components/launchrecord/LaunchClickTracker";
import { ExternalLink } from "lucide-react";

interface VisitWebsiteButtonProps {
  website: string;
  productId: string;
  className?: string;
}

export function VisitWebsiteButton({
  website,
  productId,
  className,
}: VisitWebsiteButtonProps) {
  const handleOutboundClick = useOutboundClick(productId);

  return (
    <Button
      asChild
      className={className}
      onClick={handleOutboundClick}
    >
      <a
        href={website}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2"
      >
        Visit Website
        <ExternalLink className="h-4 w-4" />
      </a>
    </Button>
  );
}
