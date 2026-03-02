"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

export function DataInitializer() {
  const { refreshSession } = useAuth();

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  return null;
}
