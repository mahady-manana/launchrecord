"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useUserStore } from "@/stores/use-user.store";

export function useUser() {
  const session = useSession();
  const { user, authStatus, setAuthStatus, refreshUser, clear } = useUserStore();

  useEffect(() => {
    if (session.status === "loading") {
      setAuthStatus("loading");
      return;
    }

    if (session.status === "authenticated") {
      refreshUser();
      return;
    }

    clear();
  }, [session.status, setAuthStatus, refreshUser, clear]);

  return {
    user,
    authStatus,
    sessionStatus: session.status,
  };
}
