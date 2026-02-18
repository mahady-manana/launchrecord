import { Placement } from "@/types/placement";
import { TrendingUp, Zap } from "lucide-react";

interface HeroSectionProps {
  heroPlacements: Placement[];
  onOpenLaunchModal: () => void;
}

export function HeroSection({
  heroPlacements,
  onOpenLaunchModal,
}: HeroSectionProps) {
  return (
    <section className="relative border-b border-border overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--neon-glow) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--neon-glow) / 0.3) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow orb */}
      <div
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-10"
        style={{
          background:
            "radial-gradient(circle, hsl(199, 85%, 55%), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-8 md:py-10">
        <div className="flex items-center justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                <Zap className="h-3 w-3" />
                <span>Live now</span>
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                Feb 18, 2026
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">
              Launch your product.
              <span className="text-gradient-neon block">
                Discover the next big thing
              </span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Where founders launch products and the community decides what's
              next. No popularity game
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <div className="text-center px-6 py-3 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 justify-center text-cyan-400 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-2xl font-bold">142</span>
              </div>
              <p className="text-xs text-gray-500">Launches Today</p>
            </div>
            <div className="text-center px-6 py-3 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
              <div className="text-2xl font-bold text-blue-400 mb-1">24K+</div>
              <p className="text-xs text-gray-500">Active Makers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
