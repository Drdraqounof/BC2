"use client";

import { useState } from "react";
import type { Comment } from "../dashboard-data";

type TaskCommentsProps = {
  comments: Comment[];
  onAddComment: (text: string) => void;
  onDeleteComment: (id: string) => void;
};

export default function TaskComments({
  comments,
  onAddComment,
  onDeleteComment,
}: TaskCommentsProps) {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment("");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Comments</p>
        <div className="mt-3 space-y-3">
          {comments.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No comments yet</p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-[var(--border)] bg-white p-3"
              >
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[var(--foreground)]">
                    {comment.author}
                  </p>
                  <p className="mt-1 text-sm text-[var(--foreground)]">{comment.text}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {new Date(comment.timestamp).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => onDeleteComment(comment.id)}
                  className="flex-shrink-0 rounded border border-[var(--signal-red)] px-2 py-1 text-xs font-medium text-[var(--signal-red)] transition hover:bg-[var(--signal-red)]/10"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="min-h-20 rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)]"
        />
        <button
          type="submit"
          className="rounded-2xl bg-[var(--signal-blue)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Add comment
        </button>
      </form>
    </div>
  );
}
