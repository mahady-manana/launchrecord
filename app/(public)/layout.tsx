import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
