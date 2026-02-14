import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Launch from "@/lib/models/launch";
import { connectToDatabase } from "@/lib/mongodb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/launchrecord/logo";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getUserFromSession } from "@/lib/get-user-from-session";
import { Launch as LaunchType } from "@/types";
import { AppPageOwnerActions } from "@/components/launchrecord/app-page-owner-actions";

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
  authorName: string;
  authorX?: string;
  authorLinkedIn?: string;
  valueProposition?: string;
  problem?: string;
  audience?: string;
  placement: "none" | "hero" | "left" | "right";
  createdAt: Date | string;
  updatedAt: Date | string;
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

  return Launch.findOne({ slug, isArchived: false }).lean<LeanLaunch | null>();
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
          <p className="mt-1 text-xs text-primary">{getWebsiteHost(launch.website)}</p>
        </div>
      </div>
    </Link>
  );
}

async function getSectionData(currentLaunch: LeanLaunch) {
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

  const [similarApps, newApps, topLaunchesRaw] = await Promise.all([
    Launch.find(similarAppsQuery)
      .sort({ createdAt: -1 })
      .limit(6)
      .lean<LeanLaunch[]>(),

    Launch.find({
      isArchived: false,
      _id: { $ne: currentId },
    })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean<LeanLaunch[]>(),

    Launch.find({
      isArchived: false,
      _id: { $ne: currentId },
      placement: { $in: ["hero", "left", "right"] },
    })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean<LeanLaunch[]>(),
  ]);

  const topLaunches =
    topLaunchesRaw.length > 0
      ? topLaunchesRaw
      : await Launch.find({
          isArchived: false,
          _id: { $ne: currentId },
        })
          .sort({ createdAt: -1 })
          .limit(6)
          .lean<LeanLaunch[]>();

  return { similarApps, newApps, topLaunches };
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

  return {
    title: `${launch.name} | LaunchRecord`,
    description: launch.tagline || launch.description,
    alternates: {
      canonical: `/app/${launch.slug}`,
    },
    openGraph: {
      title: launch.name,
      description: launch.tagline || launch.description,
      url: `https://www.launchrecord.com/app/${launch.slug}`,
      type: "article",
    },
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
    authorName: launch.authorName,
    authorX: launch.authorX,
    authorLinkedIn: launch.authorLinkedIn,
    placement: launch.placement,
    createdAt: new Date(launch.createdAt).toISOString(),
    updatedAt: new Date(launch.updatedAt).toISOString(),
  };

  const { similarApps, newApps, topLaunches } = await getSectionData(launch);
  const valueProposition = launch.valueProposition?.trim();
  const problem = launch.problem?.trim();
  const audience = launch.audience?.trim();

  return (
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
                <h1 className="text-2xl font-semibold sm:text-3xl">{launch.name}</h1>
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
            <AppPageOwnerActions launch={editableLaunch} isOwner={isOwner} />
          </header>

          <section className="space-y-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Description
              </h2>
              <p className="mt-2 text-sm text-foreground/90">{launch.description}</p>
            </div>
            {valueProposition ? (
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Value proposition
                </h2>
                <p className="mt-2 text-sm text-foreground/90">{valueProposition}</p>
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

          <footer className="flex flex-wrap items-center gap-3 border-t pt-4 text-sm text-muted-foreground">
            <span>By {launch.authorName}</span>
            {launch.authorX ? <span>X: {launch.authorX}</span> : null}
            {launch.authorLinkedIn ? (
              <Link
                href={launch.authorLinkedIn}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                LinkedIn
              </Link>
            ) : null}
          </footer>
        </article>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Similar Apps</h2>
          {similarApps.length ? (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {similarApps.map((item) => (
                <LaunchMiniCard key={item._id.toString()} launch={item} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No similar apps yet.</p>
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
    </main>
  );
}
