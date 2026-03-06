import { Suspense } from "react";
import VerifyClaimPageClient from "./PageClient";

export default function VerifyClaimPage() {
  return (
    <Suspense>
      <VerifyClaimPageClient />
    </Suspense>
  );
}
