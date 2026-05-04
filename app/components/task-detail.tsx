"use client";

import { useState } from "react";
import type { TaskRecord, Comment, Rating, Evidence } from "../dashboard-data";
import TaskComments from "./task-comments";
import TaskRatings from "./task-ratings";
import TaskEvidence from "./task-evidence";

type TaskDetailProps = {
  task: TaskRecord;
  onUpdateTask: (updatedTask: TaskRecord) => void;
  onClose: () => void;
};

const statusColors: Record<string, string> = {
  pending: "bg-[var(--signal-gold)]",
  "in-progress": "bg-[var(--signal-blue)]",
  completed: "bg-[var(--signal-green)]",
  "revision-submitted": "bg-[var(--signal-red)]",
};

const priorityColors: Record<string, string> = {
  LOW: "bg-[var(--signal-green)]",
  MEDIUM: "bg-[var(--signal-gold)]",
  HIGH: "bg-[var(--signal-red)]",
};

export default function TaskDetail({
  task,
  onUpdateTask,
  onClose,
}: TaskDetailProps) {
  const [status, setStatus] = useState(task.status);

  const handleStatusChange = (newStatus: TaskRecord["status"]) => {
    setStatus(newStatus);
    onUpdateTask({ ...task, status: newStatus });
  };

  const handleAddComment = (text: string) => {
    const newComment: Comment = {
      id: `com-${Date.now()}`,
      author: "Teacher-1",
      text,
      timestamp: new Date().toISOString(),
    };
    onUpdateTask({
      ...task,
      comments: [...(task.comments || []), newComment],
    });
  };

  const handleDeleteComment = (id: string) => {
    onUpdateTask({
      ...task,
      comments: (task.comments || []).filter((c) => c.id !== id),
    });
  };

  const handleAddRating = (category: string, value: number) => {
    const newRating: Rating = {
      id: `rat-${Date.now()}`,
      category,
      value,
      author: "Teacher-1",
    };
    onUpdateTask({
      ...task,
      ratings: [...(task.ratings || []), newRating],
    });
  };

  const handleDeleteRating = (id: string) => {
    onUpdateTask({
      ...task,
      ratings: (task.ratings || []).filter((r) => r.id !== id),
    });
  };

  const handleAddEvidence = (linkTitle: string, url: string) => {
    const now = new Date();
    const newEvidence: Evidence = {
      id: `ev-${Date.now()}`,
      time: now.toLocaleTimeString(),
      date: now.toLocaleDateString(),
      linkTitle,
      url,
    };
    onUpdateTask({
      ...task,
      evidence: [...(task.evidence || []), newEvidence],
    });
  };

  const handleDeleteEvidence = (id: string) => {
    onUpdateTask({
      ...task,
      evidence: (task.evidence || []).filter((e) => e.id !== id),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-[-0.05em]">{task.title}</h2>
          {task.description && (
            <p className="mt-2 text-base text-[var(--muted)]">{task.description}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-medium text-white transition hover:opacity-92"
        >
          Close
        </button>
      </div>

      {/* Status and Priority */}
      <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-white p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Status & Details</p>
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <p className="mb-2 text-sm font-medium text-[var(--foreground)]">Status</p>
            <select
              value={status}
              onChange={(e) =>
                handleStatusChange(e.target.value as TaskRecord["status"])
              }
              className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none transition focus:border-[var(--signal-blue)]"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="revision-submitted">Revision Submitted</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded px-3 py-2 text-sm font-medium text-white ${priorityColors[task.priority]}`}
            >
              Priority: {task.priority}
            </span>
            <span
              className={`rounded px-3 py-2 text-sm font-medium text-white ${statusColors[status]}`}
            >
              {status.replace(/-/g, " ").toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Task Info */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-white p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
              Due Date
            </p>
            <p className="mt-2 text-sm text-[var(--foreground)]">
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
            </p>
          </div>
          {task.expirationDate && (
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                Expiration Date
              </p>
              <p className="mt-2 text-sm text-[var(--foreground)]">
                {new Date(task.expirationDate).toLocaleDateString()}
              </p>
            </div>
          )}
          {task.taskType && (
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                Task Type
              </p>
              <p className="mt-2 text-sm text-[var(--foreground)]">{task.taskType}</p>
            </div>
          )}
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
              Completion
            </p>
            <p className="mt-2 text-sm text-[var(--foreground)]">
              {task.completedCount} of {task.studentCount} students
            </p>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-white p-6">
          {task.rubric && (
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                Rubric
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--foreground)]">
                {task.rubric}
              </p>
            </div>
          )}

          {((task.resources && task.resources.length > 0) || (task.attachmentLinks && task.attachmentLinks.length > 0)) && (
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                Resources
              </p>
              <ul className="mt-2 space-y-2">
                {(task.resources && task.resources.length > 0
                  ? task.resources.map((resource) => ({
                      id: resource.id,
                      title: resource.title,
                      url: resource.url,
                    }))
                  : (task.attachmentLinks || []).map((link, index) => ({
                      id: `attachment-${index}`,
                      title: `Attachment ${index + 1}`,
                      url: link,
                    }))
                ).map((resource) => (
                  <li key={resource.id}>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[var(--signal-blue)] hover:underline"
                    >
                      {resource.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Evidence, Ratings, Comments */}
      <div className="space-y-6">
        <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
          <TaskEvidence
            evidence={task.evidence || []}
            onAddEvidence={handleAddEvidence}
            onDeleteEvidence={handleDeleteEvidence}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
            <TaskRatings
              ratings={task.ratings || []}
              onAddRating={handleAddRating}
              onDeleteRating={handleDeleteRating}
            />
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
            <TaskComments
              comments={task.comments || []}
              onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
            />
          </div>
        </div>
      </div>

      {/* Un-Submit Button */}
      {status === "revision-submitted" && (
        <button
          onClick={() => handleStatusChange("in-progress")}
          className="rounded-2xl border border-[var(--signal-gold)] bg-[var(--signal-gold)]/10 px-5 py-3 text-sm font-semibold text-[var(--signal-gold)] transition hover:bg-[var(--signal-gold)]/20"
        >
          Un-Submit for Revision
        </button>
      )}
    </div>
  );
}
