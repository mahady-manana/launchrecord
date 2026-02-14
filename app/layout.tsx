import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/providers/session-provider";

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
  },
  twitter: {
    card: "summary_large_image",
    title: "LaunchRecord",
    description:
      "A launch listing platform for founders, makers, and vibe coders.",
  },
  icons: {
    icon: "/lr-logo.svg",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
