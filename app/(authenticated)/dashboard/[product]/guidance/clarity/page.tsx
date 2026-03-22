"use client";

import { ClarityGuidancePage } from "@/components/guidance";
import { useParams } from "next/navigation";

export default function ClarityGuidanceRoute() {
  const params = useParams();
  const productId = params.product as string;

  return <ClarityGuidancePage productId={productId} />;
}
