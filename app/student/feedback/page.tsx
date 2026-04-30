"use client";

import Link from "next/link";

import { useStudentWorkspace } from "../use-student-workspace";

export default function StudentFeedbackPage() {
  const { student, tasks, isLoading, loadError } = useStudentWorkspace();
  const feedbackCount = tasks.reduce((total, task) => total + (task.comments?.length ?? 0), 0);
  const ratingsCount = tasks.reduce((total, task) => total + (task.ratings?.length ?? 0), 0);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4">
      {isLoading ? (
        <div className="rounded-[34px] border border-white/60 bg-white/74 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8 animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-16 bg-gray-200 rounded w-2/3"></div>
        </div>
      ) : !student ? (
        <section className="rounded-[34px] border border-white/60 bg-white/74 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
          <p className="text-lg text-[var(--muted)]">{loadError || "No student profile is available for this account."}</p>
        </section>
      ) : (
        <>
          <section className="rounded-[34px] border border-white/60 bg-white/74 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">Feedback</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              Teacher comments and ratings
            </h1>
            <p className="mt-4 text-lg text-[var(--muted)]">
              Keep all feedback in one place so you can see what to improve next.
            </p>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <article className="rounded-[28px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">Comments</p>
              <p className="mt-4 text-4xl font-semibold tracking-[-0.05em]">{feedbackCount}</p>
            </article>
            <article className="rounded-[28px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">Ratings</p>
              <p className="mt-4 text-4xl font-semibold tracking-[-0.05em]">{ratingsCount}</p>
            </article>
          </section>

          <section className="grid gap-4">
            {tasks.map((task) => (
              <article
                key={task.id}
                className="rounded-[28px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Task</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">{task.title}</h2>
                  </div>
                  <Link
                    href={`/student/tasks/${task.id}`}
                    className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--panel)]"
                  >
                    Open task
                  </Link>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Comments</p>
                    {task.comments?.length ? (
                      <ul className="mt-3 space-y-3 text-sm text-[var(--foreground)]">
                        {task.comments.map((comment) => (
                          <li key={comment.id} className="rounded-2xl bg-[var(--panel)] p-3">
                            <p>{comment.text}</p>
                            <p className="mt-2 text-xs text-[var(--muted)]">{comment.author}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 text-sm text-[var(--muted)]">No comments yet.</p>
                    )}
                  </div>

                  <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Ratings</p>
                    {task.ratings?.length ? (
                      <ul className="mt-3 space-y-3 text-sm text-[var(--foreground)]">
                        {task.ratings.map((rating) => (
                          <li key={rating.id} className="flex items-center justify-between rounded-2xl bg-[var(--panel)] p-3">
                            <span>{rating.category}</span>
                            <span className="font-semibold">{rating.value}/10</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 text-sm text-[var(--muted)]">No ratings yet.</p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </section>
        </>
      )}
    </main>
  );
}