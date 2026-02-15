"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, MoreHorizontal, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CommentForm } from "./comment-form";

interface CommentItemProps {
  comment: {
    _id: string;
    content: string;
    author: {
      _id: string;
      name: string;
      avatar?: string;
    };
    createdAt: string;
    updatedAt: string;
    isEdited: boolean;
    parentComment?: string;
    launch: string;
  };
  replyCount: number;
  replies: any[];
  repliesLoaded: boolean;
  onReply: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  isReplyingTo?: string;
  onCancelReply: () => void;
  onReplySuccess: () => void; // Callback to notify parent when reply is successful
  onLoadReplies: () => void;
  onLoadReplyCount: () => void;
}

export function CommentItem({
  comment,
  replyCount,
  replies,
  repliesLoaded,
  onReply,
  onDelete,
  isReplyingTo,
  onCancelReply,
  onReplySuccess,
  onLoadReplies,
  onLoadReplyCount,
}: CommentItemProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const { user, authStatus } = useUser();
  const isOwnComment = user?._id === comment.author._id;

  // Load reply count when component mounts
  useEffect(() => {
    onLoadReplyCount();
  }, []);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      const response = await fetch(`/api/comments/delete?id=${comment._id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        onDelete(comment._id);
        toast.success("Comment deleted successfully");
      } else {
        toast.error(data.message || "Failed to delete comment");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the comment");
      console.error("Error deleting comment:", error);
    }
  };

  const formattedDate = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
  });

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
          <AvatarFallback>
            {comment.author.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="font-medium text-sm">{comment.author.name}</div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">
                  {formattedDate}
                  {comment.isEdited && " (edited)"}
                </span>
                {(isOwnComment || authStatus === "authenticated") && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setShowOptions(!showOptions)}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <p className="mt-1 text-sm">{comment.content}</p>
          </div>

          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 text-xs"
              onClick={() => {
                if (showReplies) {
                  setShowReplies(false);
                } else {
                  setShowReplies(true);
                  if (!repliesLoaded) {
                    onLoadReplies();
                  }
                }
                onReply(comment._id);
              }}
            >
              <MessageSquare className="mr-1 h-3 w-3" />
              {showReplies ? "Hide Replies" : "Reply"}
            </Button>

            {replyCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-1 text-xs"
                onClick={() => {
                  setShowReplies(true);
                  onLoadReplies();
                }}
              >
                {replyCount} {replyCount === 1 ? "reply" : "replies"}
              </Button>
            )}

            {showOptions && isOwnComment && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-1 text-xs text-red-600 hover:text-red-700"
                onClick={handleDelete}
              >
                <Trash2 className="mr-1 h-3 w-3" />
                Delete
              </Button>
            )}
          </div>

          {/* Show replies if loaded and user clicked show replies */}
          {showReplies && repliesLoaded && (
            <div className="mt-3 space-y-3 border-t pt-3">
              {replies.map((reply) => (
                <div
                  key={reply._id}
                  className="ml-6 pl-3 border-l-2 border-gray-200"
                >
                  <CommentItem
                    comment={reply}
                    replyCount={0} // For simplicity, we're not showing reply counts for replies
                    replies={[]}
                    repliesLoaded={false}
                    onReply={() => onReply(comment._id)}
                    onDelete={onDelete}
                    isReplyingTo={isReplyingTo}
                    onCancelReply={onCancelReply}
                    onReplySuccess={onReplySuccess}
                    onLoadReplies={() => {}} // No-op for replies
                    onLoadReplyCount={() => {}} // No-op for replies
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reply form if this is the comment being replied to */}
      {isReplyingTo === comment._id && (
        <div className="ml-11 mt-3 border-l pl-4">
          <CommentForm
            launchId={comment.launch}
            parentCommentId={comment._id}
            onCommentSubmit={async (newComment) => {
              // Notify parent that reply was successful
              setShowReplies(true);
              onLoadReplies();
              toast.success("Reply added successfully!");

              // Update local state to show the new reply
              if (showReplies && repliesLoaded) {
                // The parent will handle updating the state
              }
            }}
            onCancelReply={onCancelReply}
          />
        </div>
      )}
    </div>
  );
}
