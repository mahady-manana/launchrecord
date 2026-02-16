"use client";

import { Badge } from "@/components/ui/badge";
import { Launch } from "@/types";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface LaunchCardProps {
  launch: Launch;
}

function getWebsiteHost(website: string) {
  try {
    return new URL(website).host.replace("www.", "");
  } catch {
    return website;
  }
}

export function LaunchCard({ launch }: LaunchCardProps) {
  const router = useRouter();
  const tagline = launch.tagline || launch.description;
  const websiteHost = getWebsiteHost(launch.website);

  const openLaunchPage = () => {
    router.push(`/app/${launch.slug}`);
  };

  return (
    <>
      <div
        className="overflow-hidden p-4 border-b border-neutral-700 shadow-[0_10px_24px_rgba(0,0,0,0.28)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[rgba(28,34,50,0.72)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.38)]"
        role="button"
        tabIndex={0}
        onClick={openLaunchPage}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openLaunchPage();
          }
        }}
      >
        <div className="md:flex cursor-pointer items-center justify-between gap-3 px-2 transition-all duration-300 hover:backdrop-blur-md">
          <div className="flex min-w-0 items-center gap-3 md:mb-0 mb-4">
            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-md border bg-muted">
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
              <p className="line-clamp-1 text-sm font-semibold">
                {launch.name}
              </p>
              <p className="line-clamp-1 text-xs text-muted-foreground">
                {tagline}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-end gap-2 sm:flex-col">
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className="text-xs">
                {launch.businessModel}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {launch.pricingModel}
              </Badge>
              {launch.status === "prelaunch" && (
                <Badge className="bg-blue-500 hover:bg-blue-500 text-xs">
                  Prelaunch
                </Badge>
              )}
            </div>
            {Array.isArray(launch.category) ? (
              <div className="flex flex-wrap gap-1">
                {launch.category.slice(0, 2).map((cat, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {cat}
                  </Badge>
                ))}
                {launch.category.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{launch.category.length - 2}
                  </Badge>
                )}
              </div>
            ) : (
              <Badge variant="outline">{launch.category}</Badge>
            )}
            <div className="flex gap-2">
              {launch.commentCount ? (
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {launch.commentCount} discussions
                  </span>
                </div>
              ) : null}
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
