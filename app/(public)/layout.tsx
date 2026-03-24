import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import type { Metadata } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default:
      "Audit Your Startup’s Market Positioning, Clarity and Strategic Moat.",
    template: "%s",
  },
  description:
    "LaunchRecord analyzes your startup’s market positioning & differentiation, product clarity, AEO presence, and strategic moat. Our SIO-V5 engine benchmarks your startup against 10,000+ records to ensure you stand out",
  metadataBase: new URL(appUrl),
  openGraph: {
    title:
      "Audit Your Startup’s Market Positioning, Clarity and Strategic Moat.",
    description:
      "Analyze your positioning, clarity, AEO presence, and strategic moat.",
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
    title:
      "Audit Your Startup’s Market Positioning, Clarity and Strategic Moat.",
    description:
      "Analyze your positioning, clarity, AEO presence, and strategic moat.",
    images: ["/og-image.png"],
  },
  keywords: [
    "SaaS audit",
    "positioning analysis",
    "AEO",
    "AI visibility",
    "startup defensibility",
    "product score",
    "SIO-V5",
    "LaunchRecord",
  ],
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-white text-foreground flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
