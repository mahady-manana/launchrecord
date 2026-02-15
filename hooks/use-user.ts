"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useUserStore } from "@/stores/use-user.store";
import { useCurrentUser } from "./use-current-user";

export function useUser() {
  const session = useSession();
  const { user, authStatus } = useUserStore();
  const { refreshUser, clearUser } = useCurrentUser();

  // Store the previous session status to detect changes
  const prevSessionStatusRef = useRef(session.status);

  useEffect(() => {
    const prevStatus = prevSessionStatusRef.current;
    const currentStatus = session.status;

    // Only run if session status has changed
    if (prevStatus !== currentStatus) {
      prevSessionStatusRef.current = currentStatus;

      if (currentStatus === "loading") {
        useUserStore.setState({ authStatus: "loading" });
        return;
      }

      if (currentStatus === "authenticated") {
        refreshUser();
        return;
      }

      clearUser();
    }
  }, [session.status, refreshUser, clearUser]);

  return {
    user,
    authStatus,
    sessionStatus: session.status,
  };
}
