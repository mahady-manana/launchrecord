"use client";

import { ProofGuidancePage } from "@/components/guidance";
import { useParams } from "next/navigation";

export default function ProofGuidanceRoute() {
  const params = useParams();
  const productId = params.product as string;

  return <ProofGuidancePage productId={productId} />;
}
