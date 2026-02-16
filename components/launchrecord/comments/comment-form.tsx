"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/hooks/use-user";
import { SendHorizonal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CommentFormProps {
  launchId: string;
  parentCommentId?: string;
  onCommentSubmit: (comment: any) => void;
  onCancelReply?: () => void;
}

export function CommentForm({
  launchId,
  parentCommentId,
  onCommentSubmit,
  onCancelReply,
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, authStatus } = useUser();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (authStatus !== "authenticated") {
      toast.error("Please sign in to comment");
      return;
    }

    if (!content.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          launchId,
          parentCommentId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setContent("");
        onCommentSubmit(data.comment);
        toast.success("Comment added successfully!");
      } else {
        toast.error(data.message || "Failed to add comment");
      }
    } catch (error) {
      toast.error("An error occurred while submitting your comment");
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authStatus !== "authenticated") {
    return (
      <div className="rounded-lg border bg-muted p-4 text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Sign in to leave a comment
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => (window.location.href = "/auth/signin")}
        >
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-muted">
          {user?.image ? (
            <img
              src={user.image}
              alt={user.name || "User"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-medium text-muted-foreground">
              {user?.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              parentCommentId
                ? "Write your reply..."
                : "Share your thoughts about this launch..."
            }
            rows={3}
            className="resize-none"
            maxLength={1000}
          />
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              {content.length}/1000 characters
            </div>
            <div className="flex items-center gap-2">
              {parentCommentId && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onCancelReply}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting || !content.trim()}
              >
                {isSubmitting ? (
                  "Posting..."
                ) : (
                  <>
                    Post <SendHorizonal className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
