import { BookOpen, Square } from "lucide-react";
import { LockedContent } from "./LockedContent";

interface RecommendationsCardProps {
  title?: string;
  recommendations: string[];
  ctaHref: string;
  ctaLabelGuest?: string;
  ctaLabelUpgrade?: string;
  borderColor?: string;
}

/**
 * Reusable recommendations section.
 * Always shows the section (title + locked state).
 * Paid users see full content, guest/free see locked title + CTA.
 */
export function RecommendationsCard({
  title = "What to fix",
  recommendations,
  ctaHref,
  ctaLabelGuest = "Sign up",
  ctaLabelUpgrade = "Upgrade",
  borderColor = "border-amber-200",
}: RecommendationsCardProps) {
  return (
    <LockedContent
      title={title}
      icon={<BookOpen className="h-4 w-4 text-blue-600 flex-shrink-0" />}
      borderColor={borderColor}
      ctaHref={ctaHref}
      ctaLabel={ctaLabelGuest}
      textColor="text-blue-600"
    >
      <div>
        <ul className="space-y-1.5">
          {recommendations.map((item, idx) => (
            <li
              key={idx}
              className="text-sm flex items-center gap-2 text-slate-600"
            >
              <Square size={15} className="text-blue-600"></Square>
              {item}
            </li>
          ))}
        </ul>
        {!recommendations.length ? (
          <div>
            <p className="text-sm text-slate-400">
              No recommendations needed for this metric
            </p>
          </div>
        ) : null}
      </div>
    </LockedContent>
  );
}
