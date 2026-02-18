"use client";

import { Launch } from "@/types";
import { Clock, MessageCircle } from "lucide-react";
import Link from "next/link";

interface LaunchCardProps {
  launch: Launch;
  isFeatured?: boolean;
}

function isLaunchToday(launch: Launch): boolean {
  const launchDate = new Date(launch.createdAt);
  const today = new Date();
  return (
    launchDate.getDate() === today.getDate() &&
    launchDate.getMonth() === today.getMonth() &&
    launchDate.getFullYear() === today.getFullYear()
  );
}

function isLaunchThisWeek(launch: Launch): boolean {
  const launchDate = new Date(launch.createdAt);
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return launchDate >= startOfWeek && launchDate <= endOfWeek;
}

export function LaunchCard({ launch, isFeatured = false }: LaunchCardProps) {
  return (
    <Link
      href={`/app/${launch.slug}`}
      className="group block relative bg-gray-800/40 backdrop-blur-sm border border-gray-800 rounded-xl p-4 hover:bg-gray-800/60 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 cursor-pointer"
    >
      {isFeatured && (
        <div className="absolute -top-2 -left-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg z-10">
          <svg
            className="w-3 h-3"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          FEATURED
        </div>
      )}

      {!isFeatured && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
          <Clock className="w-3 h-3" />
          NEW
        </div>
      )}

      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
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
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors truncate">
                {launch.name}
              </h3>
              <p className="text-sm text-gray-400">{launch.tagline}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {Array.isArray(launch.category) ? (
                <div className="flex flex-wrap gap-1">
                  {launch.category.slice(0, 2).map((cat, index) => (
                    <span
                      key={cat}
                      className="rounded-md bg-gray-800/80 px-2 py-0.5 text-[11px] font-mono text-muted-foreground"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="rounded-md bg-gray-800/80 px-2 py-0.5 text-[11px] font-mono text-muted-foreground">
                  {launch.category}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex gap-2">
                {launch.commentCount ? (
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {launch.commentCount} discussions
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
