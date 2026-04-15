import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/use-subscription";
import clsx from "clsx";
import { Lock } from "lucide-react";
import Link from "next/link";

interface LockedContentProps {
  title: string;
  icon?: React.ReactNode;
  borderColor?: string;
  bgGradient?: string;
  textColor?: string;
  children?: React.ReactNode;
  ctaHref?: string;
  ctaLabel?: string;
}

/**
 * Renders a section where the TITLE is visible but CONTENT is locked.
 * Used for recommendations and suggestions which are paid-only.
 * Shows an upgrade/sign-up CTA instead of hidden content.
 */
export function LockedContent({
  title,
  icon,
  textColor = "text-slate-500",
  children,
  ctaHref,
  ctaLabel,
}: LockedContentProps) {
  const { tier } = useSubscription();

  const message =
    tier === "guest"
      ? "Sign up to get recommendations and fixes"
      : "Upgrade to get exact fixes and recommendations";

  return (
    <div className={`overflow-hidden`}>
      {/* Visible Title */}
      <div className={`bg-white`}>
        <div className={clsx("flex items-center justify-between", textColor)}>
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-xs font-bold uppercase tracking-wide">
              {title}
            </span>
          </div>
          {tier !== "paid" ? (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <Lock className="h-3 w-3" />
              <span>Locked</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Hidden Content Area with CTA */}
      <div className="py-4">
        {tier !== "paid" ? (
          <div className="flex flex-col sm:flex-row items-center justify-between border p-6 rounded-md gap-4">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-600">{message}</p>
                <p className={`text-xs mt-0.5 text-slate-600`}>
                  {tier === "guest"
                    ? "Create a free account to get recommendations and exact fixes"
                    : "Upgrade to get recommendations and exact fixes - Remove friction & Boost conversions"}
                </p>
              </div>
            </div>
            {ctaHref && (
              <Link href={ctaHref} className="flex-shrink-0">
                <Button
                  size="sm"
                  className="bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                >
                  {tier === "guest" ? "Sign up for free" : "Upgrade now"}
                </Button>
              </Link>
            )}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
