"use client";

import { CommentList } from "@/components/launchrecord/comments/comment-list";
import { useComments } from "@/hooks/use-comments";
import { useEffect, useState } from "react";

interface ClientLaunchDetailPageProps {
  launchId: string;
  commentCount: number;
}

export function ClientLaunchDetailPage({
  launchId,
  commentCount: initialCommentCount,
}: ClientLaunchDetailPageProps) {
  const { comments, loading, error, fetchComments } = useComments();
  const [commentCount, setCommentCount] = useState(initialCommentCount);

  useEffect(() => {
    fetchComments(launchId, 1, 20); // Fetch first page with 20 comments
  }, [launchId, fetchComments]);

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border bg-card p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Comments ({commentCount})</h2>
          <p className="text-sm text-muted-foreground">
            Join the discussion about this launch
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm text-muted-foreground">
              Loading comments...
            </span>
          </div>
        ) : error ? (
          <div className="rounded-lg border bg-destructive/10 p-4 text-center">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        ) : (
          <CommentList launchId={launchId} initialComments={comments} />
        )}
      </div>
    </section>
  );
}
