"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

interface UserActionsProps {
  compact?: boolean;
}

export function UserActions({ compact = false }: UserActionsProps) {
  const { user, logout, isLoading } = useAuth();
  const initials = useMemo(() => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [user?.name]);

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/40 px-3 py-2">
      <div className="flex size-9 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
        {initials}
      </div>
      {!compact ? (
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {user?.name || "User"}
          </p>
          <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
        </div>
      ) : null}
      <Button
        variant="ghost"
        size="sm"
        className="text-foreground"
        onClick={() => logout()}
        disabled={isLoading}
      >
        Sign out
      </Button>
    </div>
  );
}
