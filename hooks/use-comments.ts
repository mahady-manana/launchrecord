import { useState, useCallback } from "react";

interface Comment {
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
}

interface CommentActions {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  fetchComments: (launchId: string, page?: number, limit?: number) => Promise<void>;
  addComment: (
    launchId: string,
    content: string,
    parentCommentId?: string,
  ) => Promise<any>;
  deleteComment: (commentId: string) => Promise<void>;
}

export function useComments(): CommentActions {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async (
    launchId: string,
    page: number = 1,
    limit: number = 20,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/comments?launchId=${launchId}&page=${page}&limit=${limit}`,
      );
      const data = await response.json();

      if (data.success) {
        if (page === 1) {
          // If it's the first page, replace all comments
          setComments(data.comments || []);
        } else {
          // If it's a subsequent page, append to existing comments
          setComments((prev) => [...prev, ...(data.comments || [])]);
        }
      } else {
        setError(data.message || "Failed to fetch comments");
      }
    } catch (err) {
      setError("An error occurred while fetching comments");
      console.error("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addComment = useCallback(async (
    launchId: string,
    content: string,
    parentCommentId?: string,
  ): Promise<any> => {
    setLoading(true);
    setError(null);

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
        // Add the new comment to the list
        setComments((prev) => [data.comment, ...prev]);
        return data.comment; // Return the new comment
      } else {
        setError(data.message || "Failed to add comment");
        return null;
      }
    } catch (err) {
      setError("An error occurred while adding the comment");
      console.error("Error adding comment:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteComment = useCallback(async (commentId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/comments/delete?id=${commentId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        // Remove the deleted comment from the list
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentId),
        );
      } else {
        setError(data.message || "Failed to delete comment");
      }
    } catch (err) {
      setError("An error occurred while deleting the comment");
      console.error("Error deleting comment:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    comments,
    loading,
    error,
    fetchComments,
    addComment,
    deleteComment,
  };
}
