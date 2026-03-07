"use client";

import { Button } from "@/components/ui/button";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header
      className={clsx(
        "sticky top-0 backdrop-blur-xl z-50 w-full mx-auto",
        "flex max-w-6xl gap-4 items-center justify-between rounded-full px-4 py-2",
      )}
    >
      <Link href="/" className="flex items-end gap-2">
        <Image
          src="/logo.svg"
          alt="LaunchRecord"
          width={40}
          height={40}
          priority
        />
        <span className="text-2xl md:block hidden font-bold text-secondary tracking-tight">
          Launch <span className="text-primary">Record</span>
        </span>
      </Link>
      <nav className="flex items-center gap-3">
        <Link
          href="/sio-v5-engine"
          className="font-bold text p-1 bg-primary/20 text-primary rounded-xl px-4"
        >
          SIO-V5 <span className="md:inline hidden">Engine</span>
        </Link>
        <Link
          href="/leaderboard"
          className="font-bold md:block hidden text p-1 bg-slate-200 text-slate-800 rounded-xl px-4"
        >
          Sovereign 100
        </Link>
        <Link href="/login">
          <Button variant="ghost" size="sm">
            Log in
          </Button>
        </Link>
        <Link href="/survey">
          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
            Audit
          </Button>
        </Link>
      </nav>
    </header>
  );
}
