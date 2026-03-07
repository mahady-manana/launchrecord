"use client";

import { useAuth } from "@/hooks/use-auth";
import { LogOut } from "lucide-react";
import { useMemo, useState } from "react";

interface UserActionsProps {
  compact?: boolean;
}

export function UserActions({ compact = false }: UserActionsProps) {
  const { user, logout, isLoading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const initials = useMemo(() => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [user?.name]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
  };

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/40 px-3 py-2">
      <div className="flex size-9 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
        {initials}
      </div>
      {!compact ? (
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">
            {user?.name || "User"}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {user?.email}
          </p>
        </div>
      ) : null}
      <button
        onClick={handleLogout}
        disabled={isLoggingOut || isLoading}
        className="flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Logout"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}
