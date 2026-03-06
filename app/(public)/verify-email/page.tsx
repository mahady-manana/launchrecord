"use client";

import { Suspense } from "react";
import VerifyEmailPageClient from "./page_client";

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailPageClient></VerifyEmailPageClient>
    </Suspense>
  );
}
