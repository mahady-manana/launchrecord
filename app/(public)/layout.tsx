import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default:
      "Verified Defensibility Ledger for Sovereign Founders | LaunchRecord",
    template: "%s | LaunchRecord",
  },
  description:
    "The SF-1 Weekly War Briefing shows where your positioning is weak, why AI ignores you, and what to fix before competitors or LLMs commoditize your product.",
  metadataBase: new URL(appUrl),
  openGraph: {
    title: "LaunchRecord",
    description: "Stop Being a Commodity. Become a Category King.",
    url: appUrl,
    siteName: "LaunchRecord",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LaunchRecord - SF-1 War Briefing Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LaunchRecord",
    description: "Stop Being a Commodity. Become a Category King.",
    images: ["/og-image.png"],
  },
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-6xl gap-4 items-end justify-between px-6 py-6">
        <Link href="/" className="flex items-end gap-2">
          <Image
            src="/logo.svg"
            alt="LaunchRecord"
            width={40}
            height={40}
            priority
          />
          <span className="text-2xl font-bold text-secondary tracking-tight">
            Launch <span className="text-primary"> Record</span>
          </span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            href="/sio-v5-engine"
            className="font-bold text p-1 bg-primary/20 text-primary rounded-xl px-4"
          >
            SIO-V5 Engine
          </Link>
          <Link
            href="/leaderboard"
            className="font-bold text p-1 bg-slate-200 text-slate-800 rounded-xl px-4"
          >
            Leaderboard
          </Link>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-6xl px-6 pb-20">{children}</main>
      <footer className="mx-auto w-full max-w-6xl px-6 py-10 text-center text-sm text-muted-foreground">
        LaunchRecord - The Strategic Architect's Weapon ©{" "}
        {new Date().getFullYear()}
      </footer>
    </div>
  );
}
