"use client";

import { Launch } from "@/types";
import { Clock, MessageCircle } from "lucide-react";
import Link from "next/link";

interface LaunchCardProps {
  launch: Launch;
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

export function LaunchCard({ launch }: LaunchCardProps) {
  return (
    <Link
      href={`/app/${launch.slug}`}
      className="group block relative bg-gray-800/40 backdrop-blur-sm border border-gray-800 rounded-xl p-4 hover:bg-gray-800/60 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 cursor-pointer"
    >
      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
        <Clock className="w-3 h-3" />
        NEW
      </div>

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
