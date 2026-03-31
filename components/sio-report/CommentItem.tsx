"use client";

import { CheckCircle2, GitCommitHorizontal, XCircle } from "lucide-react";

type CommentVariant = "positive" | "negative" | "neutral";

interface CommentItemProps {
  text: string;
  variant: CommentVariant;
  as?: "div" | "li";
  className?: string;
}

const VARIANT_STYLES: Record<
  CommentVariant,
  { icon: typeof CheckCircle2; text: string; iconClass: string }
> = {
  positive: {
    icon: CheckCircle2,
    text: "text-emerald-700",
    iconClass: "text-emerald-500",
  },
  negative: {
    icon: XCircle,
    text: "text-rose-700",
    iconClass: "text-rose-500",
  },
  neutral: {
    icon: GitCommitHorizontal,
    text: "text-slate-700",
    iconClass: "text-slate-500",
  },
};

export function CommentItem({
  text,
  variant,
  as = "div",
  className,
}: CommentItemProps) {
  const { icon: Icon, text: textClass, iconClass } = VARIANT_STYLES[variant];
  const Comp = as;

  return (
    <Comp
      className={`flex items-start gap-2 text-sm ${textClass} ${className || ""}`.trim()}
    >
      <Icon className={`h-4 w-4 mt-0.5 ${iconClass}`} />
      <span>{text}</span>
    </Comp>
  );
}
