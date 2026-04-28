"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type Comment = {
  id: string;
  author: string;
  text: string;
  timestamp: string;
};

type StudentSubmission = {
  id: string;
  studentId: string;
  studentName: string;
  submittedAt: string | null;
  grade: string | null;
  evidence: string;
  comments: Comment[];
  isSubmitted: boolean;
};

type Task = {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: string;
  rubric: string | null;
  submissions: StudentSubmission[];
};

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [newGrade, setNewGrade] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // In a real app, fetch from API
    // For now, using mock data
    const mockTask: Task = {
      id: taskId,
      title: "Algebra Worksheet 5-7",
      description: "Complete problems 1-20 on pages 34-35",
      dueDate: "2026-05-05",
      priority: "MEDIUM",
      rubric: "Show all work for full credit",
      submissions: [
        {
          id: "sub-1",
          studentId: "student-1",
          studentName: "Alice Johnson",
          submittedAt: "2026-04-28",
          grade: "A",
          evidence: "Submitted worksheet with all 20 problems completed correctly. All work is clearly shown with step-by-step solutions.",
          comments: [
            {
              id: "c1",
              author: "Teacher",
              text: "Great work! All problems are correct and work is clearly shown.",
              timestamp: "2026-04-28T10:30:00",
            },
          ],
          isSubmitted: true,
        },
        {
          id: "sub-2",
          studentId: "student-2",
          studentName: "Bob Smith",
          submittedAt: "2026-04-27",
          grade: "B+",
          evidence: "Submitted worksheet with 18/20 problems completed. Some work is shown but could be more detailed.",
          comments: [
            {
              id: "c2",
              author: "Teacher",
              text: "Good effort! You missed problems 15 and 17. Review the notes on order of operations.",
              timestamp: "2026-04-27T14:15:00",
            },
          ],
          isSubmitted: true,
        },
        {
          id: "sub-3",
          studentId: "student-3",
          studentName: "Carol Davis",
          submittedAt: null,
          grade: null,
          evidence: "Not submitted",
          comments: [],
          isSubmitted: false,
        },
      ],
    };

    setTask(mockTask);
    if (mockTask.submissions.length > 0) {
      setSelectedStudent(mockTask.submissions[0]);
    }
    setIsLoading(false);
  }, [taskId]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedStudent) return;

    const comment: Comment = {
      id: `c-${Date.now()}`,
      author: "Teacher",
      text: newComment,
      timestamp: new Date().toISOString(),
    };

    setIsSaving(true);
    try {
      setTask(
        task
          ? {
              ...task,
              submissions: task.submissions.map((s) =>
                s.id === selectedStudent.id
                  ? { ...s, comments: [...s.comments, comment] }
                  : s
              ),
            }
          : null
      );

      setSelectedStudent((prev) =>
        prev ? { ...prev, comments: [...prev.comments, comment] } : null
      );
      setNewComment("");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveGrade = async () => {
    if (!newGrade.trim() || !selectedStudent) return;

    setIsSaving(true);
    try {
      setTask(
        task
          ? {
              ...task,
              submissions: task.submissions.map((s) =>
                s.id === selectedStudent.id ? { ...s, grade: newGrade } : s
              ),
            }
          : null
      );

      setSelectedStudent((prev) =>
        prev ? { ...prev, grade: newGrade } : null
      );
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="rounded-[24px] border border-[var(--border)] bg-white p-6 text-center">
          <p className="text-sm text-[var(--muted)]">Loading task details...</p>
        </div>
      </main>
    );
  }

  if (!task) {
    return (
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="rounded-[24px] border border-[var(--border)] bg-white p-6 text-center">
          <p className="text-sm text-[var(--muted)]">Task not found</p>
          <Link href="/task-assignment" className="mt-4 inline-block rounded-full bg-[var(--signal-blue)] px-4 py-2 text-sm font-medium text-white">
            Back to Tasks
          </Link>
        </div>
      </main>
    );
  }

  const submittedCount = task.submissions.filter((s) => s.isSubmitted).length;
  const priorityColors: Record<string, string> = {
    LOW: "bg-[var(--signal-green)]",
    MEDIUM: "bg-[var(--signal-gold)]",
    HIGH: "bg-[var(--signal-red)]",
  };

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      {/* Header */}
      <section className="rounded-[34px] border border-white/60 bg-white/74 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link href="/task-assignment" className="text-sm text-[var(--signal-blue)] hover:underline">
              ← Back to Tasks
            </Link>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">{task.title}</h1>
            {task.description && (
              <p className="mt-2 text-sm text-[var(--muted)]">{task.description}</p>
            )}
            <div className="mt-4 flex flex-wrap gap-3">
              <span className={`rounded px-3 py-1 text-xs font-semibold text-white ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>
              {task.dueDate && (
                <span className="text-sm text-[var(--muted)]">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
              <span className="font-semibold text-[var(--signal-green)]">
                {submittedCount} of {task.submissions.length} submitted
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left Side - Student Evidence and Comments */}
        <div className="space-y-6">
          {selectedStudent ? (
            <>
              {/* Evidence Section */}
              <section className="rounded-[30px] border border-[var(--border)] bg-white p-6 md:p-8">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold">
                      {selectedStudent.studentName}
                    </h2>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {selectedStudent.isSubmitted
                        ? `Submitted: ${new Date(selectedStudent.submittedAt!).toLocaleDateString()}`
                        : "Not submitted"}
                    </p>
                  </div>
                  <span
                    className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                      selectedStudent.isSubmitted
                        ? "bg-[var(--signal-green)]/10 text-[var(--signal-green)]"
                        : "bg-[var(--signal-red)]/10 text-[var(--signal-red)]"
                    }`}
                  >
                    {selectedStudent.isSubmitted ? "✓ Submitted" : "✗ Not Submitted"}
                  </span>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6">
                  <h3 className="text-sm uppercase tracking-[0.28em] text-[var(--muted)] mb-3">
                    Student Evidence
                  </h3>
                  <p className="text-base leading-relaxed text-[var(--foreground)]">
                    {selectedStudent.evidence}
                  </p>
                </div>
              </section>

              {/* Comments Section */}
              <section className="rounded-[30px] border border-[var(--border)] bg-white p-6 md:p-8">
                <h2 className="text-2xl font-semibold mb-6">Comments & Feedback</h2>

                {/* Existing Comments */}
                <div className="space-y-4 mb-6">
                  {selectedStudent.comments.length === 0 ? (
                    <p className="text-sm text-[var(--muted)] italic">
                      No comments yet. Add feedback below.
                    </p>
                  ) : (
                    selectedStudent.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-sm">{comment.author}</p>
                            <p className="text-xs text-[var(--muted)] mt-1">
                              {new Date(comment.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <p className="mt-3 text-sm text-[var(--foreground)]">
                          {comment.text}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Comment */}
                <div className="border-t border-[var(--border)] pt-6">
                  <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)] mb-3">
                    Add Feedback
                  </label>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write your feedback here..."
                    className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)]"
                    rows={4}
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={isSaving || !newComment.trim()}
                    className="mt-3 rounded-2xl bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-92 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? "Saving..." : "Add Comment"}
                  </button>
                </div>
              </section>
            </>
          ) : (
            <div className="rounded-[30px] border border-[var(--border)] bg-white p-8 text-center">
              <p className="text-[var(--muted)]">Select a student to view their evidence and add feedback</p>
            </div>
          )}
        </div>

        {/* Right Side - Student List and Rating */}
        <div className="space-y-6 lg:sticky lg:top-6 h-fit">
          {/* Student List */}
          <section className="rounded-[30px] border border-[var(--border)] bg-white p-5">
            <h3 className="text-sm uppercase tracking-[0.28em] text-[var(--muted)] mb-4 font-semibold">
              Submissions ({submittedCount}/{task.submissions.length})
            </h3>
            <div className="space-y-2">
              {task.submissions.map((submission) => (
                <button
                  key={submission.id}
                  onClick={() => setSelectedStudent(submission)}
                  className={`w-full text-left rounded-2xl p-3 transition ${
                    selectedStudent?.id === submission.id
                      ? "border border-[var(--signal-blue)] bg-[var(--signal-blue)]/10"
                      : "border border-[var(--border)] hover:border-[var(--signal-blue)]/50 hover:bg-[var(--panel)]"
                  }`}
                >
                  <p className="text-sm font-semibold">{submission.studentName}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-xs text-[var(--muted)]">
                      {submission.isSubmitted ? (
                        <span className="text-[var(--signal-green)]">✓ Submitted</span>
                      ) : (
                        <span className="text-[var(--signal-red)]">✗ Pending</span>
                      )}
                    </p>
                    {submission.grade && (
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-[var(--signal-blue)]/10 text-[var(--signal-blue)]">
                        {submission.grade}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Rating Section */}
          {selectedStudent && (
            <section className="rounded-[30px] border border-[var(--border)] bg-white p-5">
              <h3 className="text-sm uppercase tracking-[0.28em] text-[var(--muted)] mb-4 font-semibold">
                Rating & Grade
              </h3>

              {!isEditing ? (
                <div>
                  <div className="rounded-2xl bg-[var(--panel)] p-4 text-center mb-4">
                    <p className="text-xs text-[var(--muted)] mb-1">Current Grade</p>
                    <p className="text-3xl font-semibold text-[var(--signal-blue)]">
                      {selectedStudent.grade || "—"}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setNewGrade(selectedStudent.grade || "");
                    }}
                    className="w-full rounded-2xl border border-[var(--border)] px-3 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--panel)]"
                  >
                    {selectedStudent.grade ? "Edit Grade" : "Add Grade"}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    placeholder="e.g., A, 95%, 90/100"
                    className="w-full rounded-2xl border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none transition focus:border-[var(--signal-blue)]"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 rounded-2xl border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--foreground)] transition hover:bg-[var(--panel)]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveGrade}
                      disabled={isSaving || !newGrade.trim()}
                      className="flex-1 rounded-2xl bg-[var(--signal-blue)] px-3 py-2 text-xs font-semibold text-white transition hover:opacity-92 disabled:opacity-50"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
