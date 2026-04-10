import { Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

interface LockedOverlayProps {
  title: string;
  description: string;
  signupHref: string;
  ctaLabel: string;
  metricLabels?: string[];
}

export function LockedOverlay({
  title,
  description,
  signupHref,
  ctaLabel,
  metricLabels,
}: LockedOverlayProps) {
  return (
    <div className=" bg-gradient-to-t from-white via-white/80 to-transparent flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-sm p-6 text-center max-w-2xl text-center">
        <Lock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-600 mb-4">{description}</p>
        {metricLabels && metricLabels.length > 0 && (
          <div className="gap-2 mb-5">
            {metricLabels.map((label) => (
              <p
                key={label}
                className="gap-1 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-500"
              >
                {label}
              </p>
            ))}
          </div>
        )}
        <Link href={signupHref}>
          <Button className="bg-orange-500 hover:bg-orange-600">
            {ctaLabel}
          </Button>
        </Link>
      </div>
    </div>
  );
}
