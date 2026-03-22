"use client";

import { AEOGuidancePage } from "@/components/guidance";
import { useParams } from "next/navigation";

export default function AEOGuidanceRoute() {
  const params = useParams();
  const productId = params.product as string;

  return <AEOGuidancePage productId={productId} />;
}
