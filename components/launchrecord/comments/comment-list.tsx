"use client";

import { Button } from "@/components/ui/button";
import { useComments } from "@/hooks/use-comments";
import { useUser } from "@/hooks/use-user";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { CommentForm } from "./comment-form";
import { CommentItem } from "./comment-item";

interface CommentListProps {
  launchId: string;
  initialComments: any[];
}

// Add reply counts to comments
type CommentWithReplies = {
  comment: any;
  replyCount: number;
  repliesLoaded: boolean;
  replies: any[];
};

export function CommentList({ launchId, initialComments }: CommentListProps) {
  const { addComment, deleteComment } = useComments();
  const [localComments, setLocalComments] = useState<CommentWithReplies[]>(
    initialComments.map((comment) => ({
      comment,
      replyCount: 0, // Will fetch this separately
      repliesLoaded: false,
      replies: [],
    })),
  );
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { authStatus } = useUser();

  // Function to fetch reply count for a specific comment
  const fetchReplyCount = async (commentId: string) => {
    try {
      if (!commentId) {
        return;
      }
      const response = await fetch(
        `/api/comments?launchId=${launchId}&parentId=${commentId}`,
      );
      const data = await response.json();

      if (data.success) {
        setLocalComments((prev) =>
          prev.map((item) =>
            item.comment._id === commentId
              ? { ...item, replyCount: data.comments.length }
              : item,
          ),
        );
      }
    } catch (error) {
      console.error(
        `Error fetching reply count for comment ${commentId}:`,
        error,
      );
    }
  };

  // Function to fetch replies for a specific comment
  const fetchReplies = async (commentId: string) => {
    try {
      if (!commentId) {
        return;
      }
      const response = await fetch(
        `/api/comments?launchId=${launchId}&parentId=${commentId}`,
      );
      const data = await response.json();

      if (data.success) {
        setLocalComments((prev) =>
          prev.map((item) =>
            item.comment._id === commentId
              ? {
                  ...item,
                  repliesLoaded: true,
                  replies: data.comments || [],
                }
              : item,
          ),
        );
      }
    } catch (error) {
      console.error(`Error fetching replies for comment ${commentId}:`, error);
    }
  };

  const handleLoadMore = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/comments?launchId=${launchId}&page=${currentPage + 1}&limit=20`,
      );
      const data = await response.json();

      if (data.success) {
        if (data.comments && data.comments.length > 0) {
          setLocalComments((prev) => [...prev, ...data.comments]);
          setCurrentPage((prev) => prev + 1);

          // If we got fewer comments than the limit, there's no more to load
          if (data.comments.length < 20) {
            setHasMore(false);
          }
        } else {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Error loading more comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    await deleteComment(commentId);
    // Update local state immediately for better UX
    setLocalComments((prev) =>
      prev.filter((item) => item.comment._id !== commentId),
    );

    // If this was a reply, update the parent's reply count
    setLocalComments((prev) =>
      prev.map((item) => {
        // Check if any of the replies in this item matches the deleted comment
        const replyExists = item.replies.some(
          (reply) => reply._id === commentId,
        );
        if (replyExists) {
          return {
            ...item,
            replyCount: Math.max(0, item.replyCount - 1),
            replies: item.replies.filter((reply) => reply._id !== commentId),
          };
        }
        return item;
      }),
    );

    // Optionally refresh from server to ensure consistency
    // await refreshComments();
  };

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const handleReplySuccess = () => {
    // We don't need to refresh everything, just the UI will update via the callback
    // The parent component will handle any necessary refresh
  };
  console.log("====================================");
  console.log(localComments);
  console.log("====================================");
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        <h2 className="text-lg font-semibold">
          Comments ({localComments.length})
        </h2>
      </div>

      <CommentForm
        launchId={launchId}
        onCommentSubmit={(newComment) => {
          // The newComment is the response from the API
          // Add to local state immediately for better UX
          // This is a top-level comment (no parentCommentId)
          setLocalComments((prev) => [
            {
              comment: newComment,
              replies: [],
              repliesLoaded: false,
              replyCount: 0,
            },
            ...prev,
          ]);
        }}
      />

      <div className="space-y-4">
        {localComments.length === 0 ? (
          <div className="rounded-lg border bg-muted p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          <>
            {localComments.map((commentWithReplies) => (
              <CommentItem
                key={commentWithReplies?.comment?._id}
                comment={commentWithReplies.comment}
                replyCount={commentWithReplies.replyCount}
                replies={commentWithReplies.replies}
                repliesLoaded={commentWithReplies.repliesLoaded}
                onReply={handleReply}
                onDelete={handleDeleteComment}
                isReplyingTo={replyingTo || undefined}
                onCancelReply={handleCancelReply}
                onReplySuccess={handleReplySuccess}
                onLoadReplies={() =>
                  fetchReplies(commentWithReplies?.comment?._id)
                }
                onLoadReplyCount={() =>
                  fetchReplyCount(commentWithReplies?.comment?._id)
                }
              />
            ))}

            {hasMore && localComments.length >= 20 && (
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Load More Comments"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
