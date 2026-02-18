import { PlacementDataLoader } from "@/components/launchrecord/placement-data-loader";
import { SessionProvider } from "@/components/providers/session-provider";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const sg = Space_Grotesk({
  subsets: ["latin"], // Specifies which subsets to preload
  display: "swap", // Ensures text remains visible while loading
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.launchrecord.com"),
  title: {
    default: "LaunchRecord",
    template: "%s | LaunchRecord",
  },
  description:
    "LaunchRecord is a launch listing platform where founders and builders submit products to get discovery and traffic.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "LaunchRecord",
    description:
      "Discover and submit SaaS products, apps, and side projects on LaunchRecord.",
    url: "https://www.launchrecord.com",
    siteName: "LaunchRecord",
    type: "website",
    images: "https://www.launchrecord.com/og-image.png",
  },
  twitter: {
    card: "summary_large_image",
    title: "LaunchRecord",
    description:
      "A launch listing platform for founders, makers, and vibe coders.",
    images: "https://www.launchrecord.com/og-image.png",
  },
  icons: {
    icon: "/lr-logo.svg",
    apple: "/apple-icon.png",
  },
  verification: {
    google: "3rLc979DsxiLVvTXtkcmU2TS3rqC1mqgWcTHKc4Iqss",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${sg.className}`}>
        <SessionProvider>{children}</SessionProvider>
        <PlacementDataLoader />
        <GoogleAnalytics gaId="G-Z31MSTXKKS" />
      </body>
    </html>
  );
}
