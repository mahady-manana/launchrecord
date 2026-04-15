import { CommentItem } from "@/components/sio-report/CommentItem";
import { useSubscription } from "@/hooks/use-subscription";
import { useUserStore } from "@/stores/user-store";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

interface CommentListProps {
  positiveComments: string[];
  negativeComments: string[];
  positiveTitle?: string;
  negativeTitle?: string;
}

/**
 * Displays positive/negative comment sections with tier-based limits.
 * Guest: shows 2 items with placeholder for more.
 * Free: shows limited count.
 * Paid: shows all.
 */
export function CommentList({
  positiveComments,
  negativeComments,
  positiveTitle = "Strengths",
  negativeTitle = "Weaknesses",
}: CommentListProps) {
  const { tier, isPaid } = useSubscription(false);
  const isGuest = useUserStore((s) => s.isGuest);

  if (!positiveComments || !negativeComments) {
    return null;
  }
  const visiblePositive = isPaid
    ? positiveComments
    : positiveComments.slice(0, tier === "free" ? 2 : 2);
  const visibleNegative = isPaid
    ? negativeComments
    : negativeComments.slice(0, tier === "free" ? 2 : 2);

  const hasMoreNegative = negativeComments?.length > visibleNegative?.length;

  return (
    <div className="space-y-6">
      {/* Positive Comments */}
      <div className="">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wide text-green-600">
            {positiveTitle}
          </span>
        </div>
        {positiveComments.length > 0 ? (
          <ul className="space-y-2">
            {visiblePositive.map((comment, idx) => (
              <CommentItem
                key={idx}
                as="li"
                variant="positive"
                text={comment}
              />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-green-400">No strengths identified.</p>
        )}
      </div>

      {/* Negative Comments */}
      <div className="">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wide text-red-600">
            {negativeTitle}
          </span>
        </div>
        {negativeComments.length > 0 ? (
          <ul className="space-y-2">
            {visibleNegative.map((comment, idx) => (
              <CommentItem
                key={idx}
                as="li"
                variant="negative"
                text={comment}
              />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-red-400">No weaknesses identified.</p>
        )}
      </div>
    </div>
  );
}
