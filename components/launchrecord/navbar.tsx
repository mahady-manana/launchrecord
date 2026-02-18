"use client";

import { Logo } from "@/components/launchrecord/logo";
import { PlacementAdvertiseButton } from "@/components/launchrecord/placement-advertise-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppUser } from "@/types";
import {
  CreditCard,
  LayoutDashboard,
  LogOut,
  Rocket,
  Search,
  User,
} from "lucide-react";
import { signIn, signOut } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLaunches } from "@/hooks/use-launches";
import { useUser } from "@/hooks/use-user";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LaunchModal } from "./launch-modal";

interface NavbarProps {
  query: string;
  onQueryChange: (query: string) => void;

  user: AppUser | null;
  authStatus: "loading" | "authenticated" | "unauthenticated";
}

export function Navbar({ query, onQueryChange }: NavbarProps) {
  const router = useRouter();
  const { user, authStatus } = useUser();
  const launchStore = useLaunches();
  const [isLaunchModalOpen, setLaunchModalOpen] = useState(false);

  const handleOpenLaunchModal = () => {
    if (authStatus !== "authenticated") {
      router.push("/auth/signin?callbackUrl=/");
      return;
    }

    setLaunchModalOpen(true);
  };
  return (
    <header className="sticky top-0 z-20 border-b bg-gray-900/80 backdrop-blur-xl">
      <div className="mx-auto justify-between flex h-16 w-full max-w-7xl items-center gap-3 px-4">
        <Logo />
        <div className="flex items-center md:gap-4 gap-2">
          <div className="relative hidden max-w-xs flex-1 md:block">
            <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search launches..."
              className="pl-9"
            />
          </div>

          <PlacementAdvertiseButton />
          <Button onClick={handleOpenLaunchModal}>
            <Rocket></Rocket> New launch
          </Button>

          {authStatus === "authenticated" && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 p-0"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.image || undefined}
                      alt={user.name}
                    />
                    <AvatarFallback>
                      {user.name.slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/dashboard">
                  <DropdownMenuItem>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/dashboard/placements">
                  <DropdownMenuItem>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Manage Placements</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/profile">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => signIn(undefined, { callbackUrl: "/" })}
              disabled={authStatus === "loading"}
            >
              Sign in
            </Button>
          )}
        </div>
        <LaunchModal
          open={isLaunchModalOpen}
          onOpenChange={setLaunchModalOpen}
          onSubmit={launchStore.createLaunch}
          onCompleteDetails={launchStore.updateLaunch}
        />
      </div>
    </header>
  );
}
