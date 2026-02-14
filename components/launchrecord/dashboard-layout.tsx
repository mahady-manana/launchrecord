"use client";

import { Navbar } from "@/components/launchrecord/navbar";
import { useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, authStatus } = useUser();
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (authStatus === "loading") return;

    if (authStatus !== "authenticated") {
      router.push("/auth/signin?callbackUrl=/dashboard");
    }
  }, [authStatus, router]);

  if (authStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (authStatus !== "authenticated") {
    return null; // Redirect handled by useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <Navbar
        query={query}
        onQueryChange={setQuery}
        user={user}
        authStatus={authStatus}
      />
      <main className="container mx-auto py-8 px-4">{children}</main>
    </div>
  );
}
