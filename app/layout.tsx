import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/providers/auth-provider";
import { DataInitializer } from "@/providers/data-initializer";
import { ThemeProvider } from "@/providers/theme-provider";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Akshar, Space_Grotesk } from "next/font/google";

import Script from "next/script";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});
const belanosima = Akshar({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: "LaunchRecord",
    template: "%s | LaunchRecord",
  },
  description:
    "The Strategic Architect's weapon against AI-driven commoditization. Get your SF-1 Weekly War Briefing with AEO Pulse, Market Position Vector, and AI Threat Radar.",
  metadataBase: new URL(appUrl),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: {
      rel: "android-chrome-192x192",
      url: "/android-chrome-192x192.png",
    },
  },
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
  },
  twitter: {
    card: "summary_large_image",
    title: "LaunchRecord",
    description: "Stop Being a Commodity. Become a Category King.",
    images: ["/og-image.png"],
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${belanosima.variable} font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <AuthProvider>
            <DataInitializer />
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
        <GoogleAnalytics gaId="G-Z31MSTXKKS" />
        <Script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
        (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "vy29f2ooqo");
        `,
          }}
        />
      </body>
    </html>
  );
}
