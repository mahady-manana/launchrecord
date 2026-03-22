"use client";

import { MomentumGuidancePage } from "@/components/guidance";
import { useParams } from "next/navigation";

export default function MomentumGuidanceRoute() {
  const params = useParams();
  const productId = params.product as string;

  return <MomentumGuidancePage productId={productId} />;
}
