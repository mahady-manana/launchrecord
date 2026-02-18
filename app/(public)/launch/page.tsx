import { Metadata } from "next";
import Link from "next/link";
import { Rocket, TrendingUp, Users, MessageCircle, Zap, Award, Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Launch Your Product | LaunchRecord - The #1 Product Launch Platform",
  description: "Launch your product to thousands of early adopters and tech enthusiasts. Get valuable feedback, increase visibility, and grow your community. Free to get started.",
  keywords: [
    "launch product",
    "product launch platform",
    "startup launch",
    "product marketing",
    "early adopters",
    "product visibility",
    "launch startup",
    "product promotion",
    "tech launch",
    "SaaS launch",
  ],
  authors: [{ name: "LaunchRecord" }],
  creator: "LaunchRecord",
  publisher: "LaunchRecord",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.launchrecord.com"),
  alternates: {
    canonical: "/launch",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/launch",
    siteName: "LaunchRecord",
    title: "Launch Your Product | LaunchRecord",
    description: "Launch your product to thousands of early adopters and tech enthusiasts. Get valuable feedback and grow your community.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Launch Your Product on LaunchRecord",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Launch Your Product | LaunchRecord",
    description: "Launch your product to thousands of early adopters. Free to get started.",
    images: ["/og-image.png"],
    creator: "@launchrecord",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Launch Your Product",
  description: "Launch your product to thousands of early adopters and tech enthusiasts",
  url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.launchrecord.com"}/launch`,
  isPartOf: {
    "@type": "WebSite",
    name: "LaunchRecord",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.launchrecord.com",
  },
  about: {
    "@type": "Service",
    name: "Product Launch Service",
    serviceType: "Product Launch Platform",
    description: "Platform for launching and discovering new products, startups, and tools",
    provider: {
      "@type": "Organization",
      name: "LaunchRecord",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.launchrecord.com"}/logo.png`,
      },
    },
    areaServed: {
      "@type": "Country",
      name: "Worldwide",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Product Launch Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Product Launch",
            description: "Launch your product to our community",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Featured Placement",
            description: "Get premium visibility for your product",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Community Engagement",
            description: "Connect with early adopters and get feedback",
          },
        },
      ],
    },
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "500",
    bestRating: "5",
    worstRating: "1",
  },
};

const statsStructuredData = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "QuantitativeValue",
        name: "Products Launched",
        value: "500+",
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "QuantitativeValue",
        name: "Community Members",
        value: "10000+",
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "QuantitativeValue",
        name: "Monthly Visitors",
        value: "50000+",
      },
    },
    {
      "@type": "ListItem",
      position: 4,
      item: {
        "@type": "QuantitativeValue",
        name: "Success Rate",
        value: "95%",
      },
    },
  ],
};

export default function LaunchPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(statsStructuredData) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold text-white">
            LaunchRecord
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/launch/today" className="text-sm text-gray-400 hover:text-white transition-colors">
              Today's Launches
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm">
                Browse All
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 mb-8">
              <Zap className="h-4 w-4 text-cyan-400" />
              <span className="text-sm text-cyan-400 font-medium">The #1 Product Launch Platform</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Launch Your Product
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                To The World
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of makers who have successfully launched their products, 
              gained early adopters, and built thriving communities.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/signin?callbackUrl=/">
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-6 text-lg shadow-lg shadow-cyan-500/25">
                  Start Launching
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/launch/today">
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-gray-700 hover:bg-gray-800">
                  View Today's Launches
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-gray-800 bg-gray-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-sm text-gray-400">Products Launched</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">10K+</div>
              <div className="text-sm text-gray-400">Community Members</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">50K+</div>
              <div className="text-sm text-gray-400">Monthly Visitors</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">95%</div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need to Launch Successfully
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Our platform provides all the tools and exposure you need to make your launch a success.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Rocket className="h-6 w-6" />}
              title="Instant Visibility"
              description="Get your product in front of thousands of early adopters and tech enthusiasts from day one."
            />
            <FeatureCard
              icon={<TrendingUp className="h-6 w-6" />}
              title="Trending Potential"
              description="Top launches get featured prominently, driving even more traffic and engagement."
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Community Support"
              description="Connect with fellow makers, get feedback, and build lasting relationships."
            />
            <FeatureCard
              icon={<MessageCircle className="h-6 w-6" />}
              title="Valuable Feedback"
              description="Engage with users through comments and discussions to improve your product."
            />
            <FeatureCard
              icon={<Award className="h-6 w-6" />}
              title="Featured Placements"
              description="Premium placement options to maximize your product's visibility and reach."
            />
            <FeatureCard
              icon={<Globe className="h-6 w-6" />}
              title="Global Reach"
              description="Share your product with a worldwide audience of tech enthusiasts and early adopters."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-t border-gray-800 py-20 sm:py-32 bg-gray-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Launch your product in three simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              step="01"
              title="Create Your Launch"
              description="Fill in your product details, add visuals, and craft a compelling story."
            />
            <StepCard
              step="02"
              title="Submit for Review"
              description="Our team reviews your launch to ensure quality and compliance."
            />
            <StepCard
              step="03"
              title="Go Live & Engage"
              description="Your product goes live! Engage with the community and track your progress."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl border border-gray-800 bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 sm:p-12 lg:p-16 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />
            <div className="relative text-center max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Launch Your Product?
              </h2>
              <p className="text-xl text-gray-400 mb-10">
                Join our community of successful makers and start sharing your product with the world today.
              </p>
              <Link href="/auth/signin?callbackUrl=/">
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-10 py-6 text-lg shadow-lg shadow-cyan-500/25">
                  Launch Now - It's Free
                  <Rocket className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <p className="text-sm text-gray-500 mt-6">
                No credit card required • Get started in minutes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} LaunchRecord. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group rounded-2xl border border-gray-800 bg-gray-800/30 p-6 hover:bg-gray-800/50 hover:border-cyan-500/30 transition-all duration-300">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ step, title, description }: { step: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-2xl font-bold mb-6">
        {step}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}
