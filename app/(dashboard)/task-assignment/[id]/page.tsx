"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { mockTasks, type TaskRecord, type Comment, type Rating, type Evidence } from "../../../dashboard-data";

const RATING_CATEGORIES = [
  "Accuracy",
  "Completeness",
  "Clarity",
  "Effort",
  "Organization",
  "Creativity",
  "Participation",
  "Collaboration",
  "Problem-solving",
  "Critical thinking",
  "Communication",
  "Presentation",
];

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;
  const [tasks, setTasks] = useState<TaskRecord[]>(mockTasks);
  const task = tasks.find((t) => t.id === taskId);

  const [newCommentText, setNewCommentText] = useState("");
  const [newRatingCategory, setNewRatingCategory] = useState("");
  const [showRatingCategories, setShowRatingCategories] = useState(false);
  const [newRatingValue, setNewRatingValue] = useState(5);
  const [newEvidenceTitle, setNewEvidenceTitle] = useState("");
  const [newEvidenceUrl, setNewEvidenceUrl] = useState("");

  const priorityColors: Record<string, string> = {
    LOW: "bg-[var(--signal-green)]",
    MEDIUM: "bg-[var(--signal-gold)]",
    HIGH: "bg-[var(--signal-red)]",
  };

  const filteredCategories = RATING_CATEGORIES.filter((cat) =>
    cat.toLowerCase().includes(newRatingCategory.toLowerCase()),
  );

  const handleSelectCategory = (category: string) => {
    setNewRatingCategory(category);
    setShowRatingCategories(false);
  };

  if (!task) {
    return (
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6">
        <button
          onClick={() => router.back()}
          className="inline-flex w-fit rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-medium text-white transition hover:opacity-92"
        >
          ← Back
        </button>
        <div className="text-center text-[var(--muted)]">Task not found</div>
      </main>
    );
  }

  const handleUpdateTask = (updatedTask: TaskRecord) => {
    setTasks((current) =>
      current.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  };

  const handleAddComment = () => {
    if (newCommentText.trim()) {
      const newComment: Comment = {
        id: `com-${Date.now()}`,
        author: "Teacher-1",
        text: newCommentText,
        timestamp: new Date().toISOString(),
      };
      handleUpdateTask({
        ...task,
        comments: [...(task.comments || []), newComment],
      });
      setNewCommentText("");
    }
  };

  const handleDeleteComment = (id: string) => {
    handleUpdateTask({
      ...task,
      comments: (task.comments || []).filter((c) => c.id !== id),
    });
  };

  const handleAddRating = () => {
    if (newRatingCategory.trim()) {
      const newRating: Rating = {
        id: `rat-${Date.now()}`,
        category: newRatingCategory,
        value: newRatingValue,
        author: "Teacher-1",
      };
      handleUpdateTask({
        ...task,
        ratings: [...(task.ratings || []), newRating],
      });
      setNewRatingCategory("");
      setNewRatingValue(5);
    }
  };

  const handleDeleteRating = (id: string) => {
    handleUpdateTask({
      ...task,
      ratings: (task.ratings || []).filter((r) => r.id !== id),
    });
  };

  const handleAddEvidence = () => {
    if (newEvidenceTitle.trim() && newEvidenceUrl.trim()) {
      const now = new Date();
      const newEvidence: Evidence = {
        id: `ev-${Date.now()}`,
        time: now.toLocaleTimeString(),
        date: now.toLocaleDateString(),
        linkTitle: newEvidenceTitle,
        url: newEvidenceUrl,
      };
      handleUpdateTask({
        ...task,
        evidence: [...(task.evidence || []), newEvidence],
      });
      setNewEvidenceTitle("");
      setNewEvidenceUrl("");
    }
  };

  const handleDeleteEvidence = (id: string) => {
    handleUpdateTask({
      ...task,
      evidence: (task.evidence || []).filter((e) => e.id !== id),
    });
  };

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="inline-flex w-fit rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-medium text-white transition hover:opacity-92"
      >
        ← Back
      </button>

      {/* Header */}
      <div className="flex items-center justify-between rounded-[30px] border border-[var(--border)] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:p-8">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">Task details</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">{task.title}</h1>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-[30px] border border-[var(--border)] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:p-8">
          <div className="space-y-4">
            {task.description && (
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Description</p>
                <p className="mt-2 text-base leading-8 text-[var(--foreground)]">{task.description}</p>
              </div>
            )}

            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Details</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className={`rounded px-3 py-2 text-sm font-medium text-white ${priorityColors[task.priority]}`}>
                  Priority: {task.priority}
                </span>
                {task.dueDate && (
                  <span className="rounded bg-[var(--panel)] px-3 py-2 text-sm font-medium text-[var(--foreground)]">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
                <span className="rounded bg-[var(--panel)] px-3 py-2 text-sm font-medium text-[var(--foreground)]">
                  {task.completedCount}/{task.studentCount} completed
                </span>
              </div>
            </div>

            {task.rubric && (
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Rubric</p>
                <p className="mt-2 whitespace-pre-wrap text-base leading-8 text-[var(--foreground)]">{task.rubric}</p>
              </div>
            )}

            {task.attachmentLinks && task.attachmentLinks.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Links</p>
                <div className="mt-2 flex flex-col gap-2">
                  {task.attachmentLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-[var(--signal-blue)] underline"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-[30px] border border-[var(--border)] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:p-8">
          <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">Student completion</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
            {task.completedCount} of {task.studentCount}
          </h3>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() =>
                handleUpdateTask({
                  ...task,
                  completedCount: task.studentCount,
                  status: "completed" as const,
                })
              }
              className="flex-1 rounded-2xl bg-[var(--signal-green)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Mark all complete
            </button>
          </div>
        </section>
      </div>

      {/* Evidence Section */}
      <section className="rounded-[30px] border border-[var(--border)] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Evidence</p>
        <div className="mt-3 overflow-x-auto">
          {(task.evidence || []).length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No evidence submitted yet</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="px-3 py-2 text-left font-semibold text-[var(--foreground)]">Time</th>
                  <th className="px-3 py-2 text-left font-semibold text-[var(--foreground)]">Date</th>
                  <th className="px-3 py-2 text-left font-semibold text-[var(--foreground)]">Link</th>
                  <th className="px-3 py-2 text-left font-semibold text-[var(--foreground)]">Action</th>
                </tr>
              </thead>
              <tbody>
                {(task.evidence || []).map((item) => (
                  <tr key={item.id} className="border-b border-[var(--border)]">
                    <td className="px-3 py-2 text-[var(--foreground)]">{item.time}</td>
                    <td className="px-3 py-2 text-[var(--foreground)]">{item.date}</td>
                    <td className="px-3 py-2">
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[var(--signal-blue)] hover:underline">
                        {item.linkTitle}
                      </a>
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => handleDeleteEvidence(item.id)}
                        className="rounded border border-[var(--signal-red)] px-2 py-1 text-xs font-medium text-[var(--signal-red)] transition hover:bg-[var(--signal-red)]/10"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="mt-4 space-y-2 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
          <input
            value={newEvidenceTitle}
            onChange={(e) => setNewEvidenceTitle(e.target.value)}
            placeholder="Evidence title"
            className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none transition focus:border-[var(--signal-blue)]"
          />
          <input
            value={newEvidenceUrl}
            onChange={(e) => setNewEvidenceUrl(e.target.value)}
            placeholder="https://example.com/evidence.pdf"
            className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none transition focus:border-[var(--signal-blue)]"
          />
          <button
            onClick={handleAddEvidence}
            className="w-full rounded-xl bg-[var(--signal-blue)] px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Add evidence
          </button>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Ratings Section */}
        <section className="rounded-[30px] border border-[var(--border)] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Ratings</p>
          <div className="mt-3 space-y-3">
            {(task.ratings || []).length === 0 ? (
              <p className="text-sm text-[var(--muted)]">No ratings yet</p>
            ) : (
              (task.ratings || []).map((rating) => (
                <div key={rating.id} className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[var(--foreground)]">{rating.category}</p>
                    <div className="mt-2 flex gap-1">
                      {[...Array(10)].map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-2 w-2 rounded-full ${
                            idx < rating.value ? "bg-[var(--signal-blue)]" : "bg-[var(--border)]"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-[var(--muted)]">{rating.value}/10</p>
                  </div>
                  <button
                    onClick={() => handleDeleteRating(rating.id)}
                    className="flex-shrink-0 rounded border border-[var(--signal-red)] px-2 py-1 text-xs font-medium text-[var(--signal-red)] transition hover:bg-[var(--signal-red)]/10"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 space-y-2 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
            <div className="relative">
              <input
                value={newRatingCategory}
                onChange={(e) => {
                  setNewRatingCategory(e.target.value);
                  setShowRatingCategories(true);
                }}
                onFocus={() => setShowRatingCategories(true)}
                onBlur={() => setTimeout(() => setShowRatingCategories(false), 150)}
                placeholder="Category (e.g., Accuracy)"
                className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none transition focus:border-[var(--signal-blue)]"
              />
              {showRatingCategories && filteredCategories.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 z-10 rounded-xl border border-[var(--border)] bg-white shadow-lg">
                  {filteredCategories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => handleSelectCategory(category)}
                      className="w-full px-3 py-2 text-left text-sm text-[var(--foreground)] hover:bg-[var(--panel)] transition first:rounded-t-xl last:rounded-b-xl"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
              Rating (1-10)
              <input
                type="range"
                min="1"
                max="10"
                value={newRatingValue}
                onChange={(e) => setNewRatingValue(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-[var(--muted)]">{newRatingValue}/10</span>
            </label>
            <button
              onClick={handleAddRating}
              className="w-full rounded-xl bg-[var(--signal-blue)] px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Add rating
            </button>
          </div>
        </section>

        {/* Comments Section */}
        <section className="rounded-[30px] border border-[var(--border)] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Comments</p>
          <div className="mt-3 space-y-3">
            {(task.comments || []).length === 0 ? (
              <p className="text-sm text-[var(--muted)]">No comments yet</p>
            ) : (
              (task.comments || []).map((comment) => (
                <div key={comment.id} className="flex items-start justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--panel)] p-3">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-[var(--foreground)]">{comment.author}</p>
                    <p className="mt-1 text-sm text-[var(--foreground)]">{comment.text}</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">{new Date(comment.timestamp).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="flex-shrink-0 rounded border border-[var(--signal-red)] px-2 py-1 text-xs font-medium text-[var(--signal-red)] transition hover:bg-[var(--signal-red)]/10"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 space-y-2 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
            <textarea
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="min-h-20 w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none transition focus:border-[var(--signal-blue)]"
            />
            <button
              onClick={handleAddComment}
              className="w-full rounded-xl bg-[var(--signal-blue)] px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Add comment
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
