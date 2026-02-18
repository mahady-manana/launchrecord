import { Launch } from "@/types/launch";
import { Crown, TrendingUp } from "lucide-react";
import Link from "next/link";

interface SidebarProps {
  featuredLaunches: Launch[];
  todayLaunches: Launch[];
}

export function SidebarRight({
  featuredLaunches,
  todayLaunches,
}: SidebarProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-xl p-5 sticky top-20">
        <div className="flex items-center gap-2 mb-4">
          <Crown className="w-5 h-5 text-yellow-500" />
          <h2 className="text-lg font-bold text-white">Featured Launches</h2>
        </div>

        <div className="space-y-3">
          {featuredLaunches.slice(0, 5).map((launch, index) => (
            <Link
              href={`/app/${launch.slug}`}
              key={launch._id}
              className="group flex items-start gap-3 p-3 bg-gray-900/30 hover:bg-gray-900/50 rounded-lg border border-gray-700/50 hover:border-cyan-500/30 transition-all cursor-pointer"
            >
              <div className="flex-shrink-0 relative">
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
                <div className="absolute -top-1 -left-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-900 border-2 border-gray-800">
                  {index + 1}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors truncate">
                  {launch.name}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                  {launch.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 backdrop-blur-sm border border-cyan-700/30 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">Launched Today</h2>
        </div>

        <div className="space-y-2">
          {todayLaunches.slice(0, 6).map((launch) => (
            <Link
              href={`/app/${launch.slug}`}
              key={launch._id}
              className="group flex gap-3 p-2.5 bg-gray-900/30 hover:bg-gray-900/50 rounded-lg border border-gray-700/30 hover:border-cyan-500/30 transition-all cursor-pointer"
            >
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

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors truncate">
                  {launch.name}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                  {launch.tagline}
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
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
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
