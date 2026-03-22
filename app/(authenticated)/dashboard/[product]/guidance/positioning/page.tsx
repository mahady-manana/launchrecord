"use client";

import { PositioningGuidancePage } from "@/components/guidance";
import { useParams } from "next/navigation";

export default function PositioningGuidanceRoute() {
  const params = useParams();
  const productId = params.product as string;

  return <PositioningGuidancePage productId={productId} />;
}
