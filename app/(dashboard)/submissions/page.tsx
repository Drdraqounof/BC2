"use client";

import { useState, useEffect } from "react";

type Student = {
  id: string;
  firstName: string;
  lastName: string;
};

type TaskAssignment = {
  id: string;
  taskId: string;
  studentId: string;
  completedAt: string | null;
  grade: string | null;
  student: Student;
  createdAt: string;
  updatedAt: string;
};

type Task = {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: string;
  rubric: string | null;
  creatorId: string;
  taskAssignments: TaskAssignment[];
};

export default function SubmissionsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "submitted">("submitted");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [gradingModal, setGradingModal] = useState<{ taskId: string; studentId: string } | null>(null);
  const [gradeInput, setGradeInput] = useState("");
  const [isGradingSaving, setIsGradingSaving] = useState(false);
  const [gradingError, setGradingError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/tasks");
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredAssignments = (task: Task) => {
    if (filterStatus === "all") {
      return task.taskAssignments;
    } else if (filterStatus === "submitted") {
      return task.taskAssignments.filter((a) => a.completedAt !== null);
    } else if (filterStatus === "pending") {
      return task.taskAssignments.filter((a) => a.completedAt === null);
    }
    return task.taskAssignments;
  };

  const filteredTasks = tasks.filter((task) => {
    const assignments = getFilteredAssignments(task);
    return assignments.length > 0;
  });

  const handleMarkComplete = async (taskId: string, studentId: string, isComplete: boolean) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/complete`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          isComplete: !isComplete, // Toggle
        }),
      });

      if (response.ok) {
        setSuccessMessage("Work status updated!");
        fetchTasks();
        setTimeout(() => setSuccessMessage(""), 2000);
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingModal) return;

    setGradingError("");
    setIsGradingSaving(true);

    try {
      const response = await fetch(`/api/tasks/${gradingModal.taskId}/complete`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: gradingModal.studentId,
          grade: gradeInput,
          isComplete: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save grade");
      }

      setSuccessMessage("Grade saved successfully!");
      setGradingModal(null);
      setGradeInput("");
      fetchTasks();
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (error) {
      setGradingError(error instanceof Error ? error.message : "Failed to save grade");
    } finally {
      setIsGradingSaving(false);
    }
  };

  const getCompletedCount = (task: Task) => {
    return task.taskAssignments.filter((a) => a.completedAt !== null).length;
  };

  const priorityColors: Record<string, string> = {
    LOW: "bg-[var(--signal-green)]/10 text-[var(--signal-green)]",
    MEDIUM: "bg-[var(--signal-gold)]/10 text-[var(--signal-gold)]",
    HIGH: "bg-[var(--signal-red)]/10 text-[var(--signal-red)]",
  };

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      {/* Header */}
      <section className="rounded-[34px] border border-white/60 bg-white/74 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">Grading & Submissions</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">Student Work Submissions</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">Review, mark complete, and grade student submissions.</p>
          </div>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="flex gap-3">
        <button
          onClick={() => setFilterStatus("submitted")}
          className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
            filterStatus === "submitted"
              ? "bg-[var(--foreground)] text-white"
              : "border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--panel)]"
          }`}
        >
          Submitted
        </button>
        <button
          onClick={() => setFilterStatus("pending")}
          className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
            filterStatus === "pending"
              ? "bg-[var(--foreground)] text-white"
              : "border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--panel)]"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilterStatus("all")}
          className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
            filterStatus === "all"
              ? "bg-[var(--foreground)] text-white"
              : "border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--panel)]"
          }`}
        >
          All
        </button>
      </section>

      {/* Success Message */}
      {successMessage && (
        <div className="rounded-2xl border border-green-200 bg-green-50/50 p-4">
          <p className="text-sm text-green-700">{successMessage}</p>
        </div>
      )}

      {/* Tasks List */}
      {isLoading ? (
        <div className="rounded-[24px] border border-[var(--border)] bg-white p-6 text-center">
          <p className="text-sm text-[var(--muted)]">Loading submissions...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="rounded-[24px] border border-[var(--border)] bg-white p-6 text-center">
          <p className="text-sm text-[var(--muted)]">
            {filterStatus === "submitted"
              ? "No submitted work yet."
              : filterStatus === "pending"
              ? "No pending submissions."
              : "No tasks available."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => {
            const assignments = getFilteredAssignments(task);
            const completedCount = getCompletedCount(task);

            return (
              <div
                key={task.id}
                className="rounded-[24px] border border-[var(--border)] bg-white overflow-hidden"
              >
                {/* Task Header */}
                <div className="p-5 border-b border-[var(--border)] cursor-pointer hover:bg-[var(--panel)] transition" onClick={() => setSelectedTaskId(selectedTaskId === task.id ? null : task.id)}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{task.title}</h3>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority] || "bg-gray-100 text-gray-700"}`}>
                          {task.priority}
                        </span>
                      </div>
                      {task.description && (
                        <p className="text-sm text-[var(--muted)] mb-2">{task.description}</p>
                      )}
                      {task.dueDate && (
                        <p className="text-xs text-[var(--muted)]">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-semibold text-[var(--signal-green)]">{completedCount}</p>
                      <p className="text-xs text-[var(--muted)]">of {task.taskAssignments.length}</p>
                    </div>
                  </div>
                </div>

                {/* Student Assignments */}
                {selectedTaskId === task.id && (
                  <div className="divide-y divide-[var(--border)]">
                    {assignments.map((assignment) => (
                      <div key={assignment.id} className="p-5 hover:bg-[var(--panel)] transition">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1">
                            <p className="font-semibold">
                              {assignment.student.firstName} {assignment.student.lastName}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                  assignment.completedAt
                                    ? "bg-[var(--signal-green)]/10 text-[var(--signal-green)]"
                                    : "bg-[var(--signal-gold)]/10 text-[var(--signal-gold)]"
                                }`}
                              >
                                {assignment.completedAt ? "✓ Submitted" : "⏳ Pending"}
                              </span>
                              {assignment.grade && (
                                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[var(--signal-blue)]/10 text-[var(--signal-blue)]">
                                  Grade: {assignment.grade}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {!assignment.completedAt && (
                              <button
                                onClick={() => handleMarkComplete(task.id, assignment.studentId, false)}
                                className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm font-medium transition hover:bg-[var(--signal-green)]/10 hover:text-[var(--signal-green)]"
                              >
                                Mark Complete
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setGradingModal({ taskId: task.id, studentId: assignment.studentId });
                                setGradeInput(assignment.grade || "");
                              }}
                              className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm font-medium transition hover:bg-[var(--signal-blue)]/10 hover:text-[var(--signal-blue)]"
                            >
                              {assignment.grade ? "Edit Grade" : "Add Grade"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Grading Modal */}
      {gradingModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-md rounded-[34px] border border-white/60 bg-white/98 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.15)] animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-semibold tracking-[-0.04em]">Add Grade</h2>
              <button
                onClick={() => setGradingModal(null)}
                className="text-2xl text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                ✕
              </button>
            </div>

            {gradingError && (
              <div className="rounded-2xl border border-red-200 bg-red-50/50 p-4 mb-4">
                <p className="text-sm text-red-700">{gradingError}</p>
              </div>
            )}

            <form onSubmit={handleGradeSubmit} className="space-y-4">
              <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
                <span>Grade (Letter, Percentage, or Points)</span>
                <input
                  type="text"
                  value={gradeInput}
                  onChange={(e) => setGradeInput(e.target.value)}
                  placeholder="e.g., A, 95%, 90/100"
                  className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)]"
                  autoFocus
                />
              </label>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setGradingModal(null)}
                  className="flex-1 rounded-2xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--panel)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGradingSaving || !gradeInput.trim()}
                  className="flex-1 rounded-2xl bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-92 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGradingSaving ? "Saving..." : "Save Grade"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
