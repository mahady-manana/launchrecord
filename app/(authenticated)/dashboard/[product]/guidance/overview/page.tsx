"use client";

import { AuditGuidancePage } from "@/components/guidance";
import { useParams } from "next/navigation";

export default function AuditGuidanceRoute() {
  const params = useParams();
  const productId = params.product as string;

  return <AuditGuidancePage productId={productId} />;
}
