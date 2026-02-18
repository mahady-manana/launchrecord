"use client";

import { Logo } from "@/components/launchrecord/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AppUser, Launch } from "@/types";
import { LayoutDashboard, LogOut, Rocket, Search, User } from "lucide-react";
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
import { useEffect, useState } from "react";
import { LaunchModal } from "./launch-modal";

interface NavbarProps {
  query: string;
  onQueryChange: (query: string) => void;

  user: AppUser | null;
  authStatus: "loading" | "authenticated" | "unauthenticated";
}

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [localQuery, setLocalQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Launch[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Debounce the query input
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only trigger search if query is at least 3 characters
      if (localQuery.length >= 3) {
        fetchSearchResults(localQuery);
      } else {
        setSearchResults([]);
      }
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [localQuery]);

  const fetchSearchResults = async (query: string) => {
    setIsLoading(true);
    try {
      const urlParams = new URLSearchParams({
        q: query,
        limit: "10",
      });
      const response = await fetch(
        `/api/launches/search?${urlParams.toString()}`,
      );
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.launches || []);
      }
    } catch (error) {
      console.error("Error searching launches:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl flex flex-col p-0 min-h-[80vh] gap-0">
        <div>
          <DialogHeader className="py-4 pb-2">
            <DialogTitle className="flex items-center gap-2">
              <span>Search launches</span>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Type to search launches..."
                className="pl-9 h-11"
                autoFocus
              />
            </div>
            {localQuery.length > 0 && localQuery.length < 3 && (
              <p className="text-xs text-muted-foreground mt-2">
                Enter at least 3 characters to search
              </p>
            )}
          </div>
          <div className="max-h-[60vh] overflow-y-auto border-t">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">
                Searching...
              </div>
            ) : localQuery.length < 3 ? (
              <div className="p-8 text-center text-muted-foreground">
                Enter at least 3 characters to search
              </div>
            ) : searchResults.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No launches found for "{localQuery}"
              </div>
            ) : (
              <div className="divide-y">
                {searchResults.map((launch) => (
                  <Link
                    key={launch._id}
                    href={`/app/${launch.slug}`}
                    onClick={() => onOpenChange(false)}
                    className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border bg-muted">
                      {launch.logoUrl ? (
                        <img
                          src={launch.logoUrl}
                          alt={`${launch.name} logo`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-muted-foreground">
                          {launch.name.slice(0, 1).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {launch.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {launch.tagline}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function Navbar({ query, onQueryChange }: NavbarProps) {
  const router = useRouter();
  const { user, authStatus } = useUser();
  const launchStore = useLaunches();
  const [isLaunchModalOpen, setLaunchModalOpen] = useState(false);
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);

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
          <button
            onClick={() => setSearchModalOpen(true)}
            className="relative flex items-center gap-2 px-3 py-1.5 rounded-md border bg-muted/30 hover:bg-muted/50 transition-colors md:min-w-[200px] min-w-[150px]"
          >
            <Search className="text-muted-foreground h-4 w-4" />
            <span className="text-sm text-muted-foreground hidden md:inline">
              Search...
            </span>
            <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
              <span className="text-xs">⌘K</span>
            </kbd>
          </button>

          {/* <PlacementAdvertiseButton /> */}
          <Button onClick={handleOpenLaunchModal}>
            <Rocket></Rocket> New launch
          </Button>

          {authStatus === "authenticated" && user ? (
            <>
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
                  <Link href="/profile">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile Settings</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
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
        <SearchModal
          open={isSearchModalOpen}
          onOpenChange={setSearchModalOpen}
        />
      </div>
    </header>
  );
}
