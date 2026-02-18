import { AppPageOwnerActions } from "@/components/launchrecord/app-page-owner-actions";
import { ClaimLaunchButton } from "@/components/launchrecord/ClaimLaunchButton";
import { ClientLaunchDetailPage } from "@/components/launchrecord/client-launch-detail-page";
import { LaunchClickTracker } from "@/components/launchrecord/LaunchClickTracker";
import { Logo } from "@/components/launchrecord/logo";
import { VisitWebsiteButton } from "@/components/launchrecord/VisitWebsiteButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUserFromSession } from "@/lib/get-user-from-session";
import Launch from "@/lib/models/launch";
import { connectToDatabase } from "@/lib/mongodb";
import { Launch as LaunchType } from "@/types";
import { Search } from "lucide-react";
import { PipelineStage } from "mongoose";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface LaunchPageProps {
  params: Promise<{ slug: string }>;
}

type LeanLaunch = {
  _id: { toString: () => string } | string;
  submittedBy: { toString: () => string } | string;
  slug: string;
  name: string;
  logoUrl?: string;
  tagline?: string;
  description: string;
  website: string;
  category: string | string[];
  businessModel?: string;
  pricingModel?: string;
  x?: string;
  linkedin?: string;
  valueProposition?: string;
  problem?: string;
  audience?: string;
  placement: "none" | "hero" | "left" | "right";
  status: "draft" | "prelaunch" | "launched";
  commentCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  claimed?: boolean;
};

function getWebsiteHost(website: string) {
  try {
    return new URL(website).host.replace("www.", "");
  } catch {
    return website;
  }
}

async function getLaunchBySlug(slug: string) {
  await connectToDatabase();

  return Launch.findOne({ slug, isArchived: false })
    .select("+claimed")
    .lean<LeanLaunch | null>();
}

function LaunchMiniCard({ launch }: { launch: LeanLaunch }) {
  return (
    <Link
      href={`/app/${launch.slug}`}
      className="group rounded-xl border bg-card p-4 transition-all hover:border-primary/40 hover:bg-muted/20"
    >
      <div className="flex items-start gap-3">
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

        <div className="min-w-0 flex-1">
          <p className="line-clamp-1 text-sm font-semibold">{launch.name}</p>
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {launch.tagline || launch.description}
          </p>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-xs text-primary">
              {getWebsiteHost(launch.website)}
            </p>
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3 w-3 text-muted-foreground"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span className="text-xs text-muted-foreground">
                {launch.commentCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

async function getSectionData(currentLaunch: LeanLaunch) {
  await connectToDatabase();

  const currentId = currentLaunch._id.toString();

  // Build query for similar apps based on category
  const similarAppsQuery: any = {
    isArchived: false,
    _id: { $ne: currentId },
  };

  // Handle both single category and array of categories
  if (Array.isArray(currentLaunch.category)) {
    similarAppsQuery.category = { $in: currentLaunch.category };
  } else {
    similarAppsQuery.category = currentLaunch.category;
  }

  // Use aggregation to fetch all three sets of launches in one pipeline
  const pipeline: PipelineStage[] = [
    {
      $facet: {
        similarApps: [
          { $match: similarAppsQuery },
          { $sort: { createdAt: -1 } },
          { $limit: 6 },
        ],
        newApps: [
          { $match: { isArchived: false, _id: { $ne: currentId } } },
          { $sort: { createdAt: -1 } },
          { $limit: 6 },
        ],
        topLaunches: [
          {
            $match: {
              isArchived: false,
              _id: { $ne: currentId },
              placement: { $in: ["hero", "left", "right"] },
            },
          },
          { $sort: { createdAt: -1 } },
          { $limit: 6 },
        ],
      },
    },
  ];

  const results = await Launch.aggregate(pipeline);
  const { similarApps, newApps, topLaunches } = results[0];

  // If no top launches were found, get regular launches as fallback
  let finalTopLaunches = topLaunches;
  if (topLaunches.length === 0) {
    finalTopLaunches = await Launch.find({
      isArchived: false,
      _id: { $ne: currentId },
    })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean<LeanLaunch[]>();
  }

  return {
    similarApps: similarApps as LeanLaunch[],
    newApps: newApps as LeanLaunch[],
    topLaunches: finalTopLaunches as LeanLaunch[],
  };
}

export async function generateMetadata({
  params,
}: LaunchPageProps): Promise<Metadata> {
  const { slug } = await params;
  const launch = await getLaunchBySlug(slug);

  if (!launch) {
    return {
      title: "Launch Not Found",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.launchrecord.com";
  const canonicalUrl = `${siteUrl}/app/${launch.slug}`;

  return {
    title: `${launch.name} | LaunchRecord`,
    description: launch.tagline || launch.description,
    keywords: [
      launch.name,
      launch.tagline,
      ...(Array.isArray(launch.category) ? launch.category : [launch.category]),
      "product launch",
      "startup",
      "new product",
      launch.businessModel,
      launch.pricingModel,
    ].filter(Boolean) as string[],
    authors: [{ name: launch.name }, { name: "LaunchRecord" }],
    creator: launch.name,
    publisher: "LaunchRecord",
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonicalUrl,
      siteName: "LaunchRecord",
      title: launch.name,
      description: launch.tagline || launch.description,
      images: launch.logoUrl
        ? [
            {
              url: launch.logoUrl,
              width: 1200,
              height: 630,
              alt: `${launch.name} - ${launch.tagline}`,
            },
          ]
        : [
            {
              url: "/og-image.png",
              width: 1200,
              height: 630,
              alt: launch.name,
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title: launch.name,
      description: launch.tagline || launch.description,
      images: launch.logoUrl ? [launch.logoUrl] : ["/og-image.png"],
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
}

export async function generateStructuredData(launch: LeanLaunch) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.launchrecord.com";
  const canonicalUrl = `${siteUrl}/app/${launch.slug}`;

  const categoryArray = Array.isArray(launch.category)
    ? launch.category
    : [launch.category];

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: launch.name,
    alternateName: launch.tagline,
    description: launch.description,
    url: canonicalUrl,
    applicationCategory: categoryArray.join(", "),
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: launch.pricingModel === "paid" ? "0" : "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      ratingCount: Math.max(launch.commentCount, 1),
      bestRating: "5",
      worstRating: "1",
    },
    author: {
      "@type": "Organization",
      name: launch.name,
      url: launch.website,
    },
    publisher: {
      "@type": "Organization",
      name: "LaunchRecord",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    datePublished: new Date(launch.createdAt).toISOString().split("T")[0],
    dateModified: new Date(launch.updatedAt).toISOString().split("T")[0],
    keywords: categoryArray.join(", "),
    softwareVersion: "1.0",
    installUrl: launch.website,
    downloadUrl: launch.website,
    featureList: [
      launch.tagline,
      launch.valueProposition,
      launch.problem,
    ].filter(Boolean).join(", "),
    audience: {
      "@type": "Audience",
      audienceType: launch.audience || "General",
    },
    inLanguage: "en",
    isAccessibleForFree: launch.pricingModel === "free" || launch.pricingModel === "freemium",
  };
}

export default async function LaunchDetailPage({ params }: LaunchPageProps) {
  const { slug } = await params;
  const launch = await getLaunchBySlug(slug);
  const user = await getUserFromSession();

  if (!launch) {
    notFound();
  }

  const isOwner = user?._id === launch.submittedBy.toString();

  const editableLaunch: LaunchType = {
    _id: launch._id.toString(),
    submittedBy: launch.submittedBy.toString(),
    slug: launch.slug,
    name: launch.name,
    logoUrl: launch.logoUrl,
    tagline: launch.tagline || "",
    description: launch.description,
    website: launch.website,
    category: launch.category as LaunchType["category"],
    valueProposition: launch.valueProposition || "",
    problem: launch.problem || "",
    audience: launch.audience || "",
    businessModel: launch.businessModel as LaunchType["businessModel"],
    pricingModel: launch.pricingModel as LaunchType["pricingModel"],
    status: launch.status || "draft",
    placement: launch.placement,
    commentCount: launch.commentCount || 0,
    createdAt: new Date(launch.createdAt).toISOString(),
    updatedAt: new Date(launch.updatedAt).toISOString(),
  };

  const { similarApps, newApps, topLaunches } = await getSectionData(launch);
  const valueProposition = launch.valueProposition?.trim();
  const problem = launch.problem?.trim();
  const audience = launch.audience?.trim();

  const structuredData = await generateStructuredData(launch);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="min-h-screen">
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6">
          <Logo />
          <form action="/" className="relative hidden flex-1 md:block">
            <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input name="q" placeholder="Search launches..." className="pl-9" />
          </form>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/">Back to listing</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6">
        <article className="space-y-6 rounded-2xl border bg-card p-6">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-muted">
                {launch.logoUrl ? (
                  <img
                    src={launch.logoUrl}
                    alt={`${launch.name} logo`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-muted-foreground">
                    {launch.name.slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold sm:text-3xl">
                  {launch.name}
                </h1>
                <p className="text-muted-foreground">{launch.tagline}</p>
                <div className="flex flex-wrap items-center gap-2">
                  {Array.isArray(launch.category) ? (
                    launch.category.map((cat, index) => (
                      <Badge key={index} variant="outline">
                        {cat}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline">{launch.category}</Badge>
                  )}
                  <Badge variant="outline">{launch.businessModel}</Badge>
                  <Badge variant="outline">{launch.pricingModel}</Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {!launch.claimed && user && !isOwner ? (
                <ClaimLaunchButton slug={launch.slug} />
              ) : (
                <AppPageOwnerActions
                  launch={editableLaunch}
                  isOwner={isOwner}
                />
              )}

              <Button asChild>
                <Link href={launch.website} target="_blank" rel="noreferrer">
                  Visit website
                </Link>
              </Button>
            </div>
          </header>

          <section className="space-y-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Description
              </h2>
              <p className="mt-2 text-sm text-foreground/90">
                {launch.description}
              </p>
            </div>
            {valueProposition ? (
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Value proposition
                </h2>
                <p className="mt-2 text-sm text-foreground/90">
                  {valueProposition}
                </p>
              </div>
            ) : null}
            {problem ? (
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Problem
                </h2>
                <p className="mt-2 text-sm text-foreground/90">{problem}</p>
              </div>
            ) : null}
            {audience ? (
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Audience
                </h2>
                <p className="mt-2 text-sm text-foreground/90">{audience}</p>
              </div>
            ) : null}
          </section>

          <footer className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>By {launch.name}</span>
            </div>
            <VisitWebsiteButton
              website={launch.website}
              productId={launch._id.toString()}
            />
          </footer>
        </article>

        {/* Comments Section */}
        <ClientLaunchDetailPage
          launchId={launch._id.toString()}
          commentCount={launch.commentCount}
        />

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Similar Apps</h2>
          {similarApps.length ? (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {similarApps.map((item) => (
                <LaunchMiniCard key={item._id.toString()} launch={item} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No similar apps yet.
            </p>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">New Apps</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {newApps.map((item) => (
              <LaunchMiniCard key={item._id.toString()} launch={item} />
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Top Launches</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {topLaunches.map((item) => (
              <LaunchMiniCard key={item._id.toString()} launch={item} />
            ))}
          </div>
        </section>
      </div>
      <LaunchClickTracker productId={launch._id?.toString()} enabled />
      </main>
    </>
  );
}
