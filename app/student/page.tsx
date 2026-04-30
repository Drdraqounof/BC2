"use client";

import Link from "next/link";

import { useStudentWorkspace } from "./use-student-workspace";

const statusStyles = {
  pending: "bg-amber-100 text-amber-700",
  "in-progress": "bg-sky-100 text-sky-700",
  completed: "bg-emerald-100 text-emerald-700",
  "revision-submitted": "bg-violet-100 text-violet-700",
};

const priorityStyles = {
  LOW: "bg-stone-100 text-stone-700",
  MEDIUM: "bg-orange-100 text-orange-700",
  HIGH: "bg-rose-100 text-rose-700",
};

export default function StudentPage() {
  const { student, tasks, campaigns, isLoading, loadError } = useStudentWorkspace();
  const activeTaskCount = tasks.filter((task) => task.status !== "completed").length;

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4">
      {isLoading ? (
        <div className="rounded-[34px] border border-white/60 bg-white/74 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8 animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-16 bg-gray-200 rounded w-2/3"></div>
        </div>
      ) : !student ? (
        <section className="rounded-[34px] border border-white/60 bg-white/74 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
          <p className="text-lg text-[var(--muted)]">
            {loadError || "No student profile is available for this account."}
          </p>
        </section>
      ) : (
        <>
          <section className="rounded-[34px] border border-white/60 bg-white/74 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">My Tasks</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              Hello, {student.firstName} {student.lastName}
            </h1>
            <p className="mt-4 text-lg text-[var(--muted)]">
              Review your assigned work, due dates, and feedback in one place.
            </p>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <article className="rounded-[28px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">Assigned</p>
              <p className="mt-4 text-4xl font-semibold tracking-[-0.05em]">{tasks.length}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">Total tasks currently visible in your workspace.</p>
            </article>

            <article className="rounded-[28px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">In Motion</p>
              <p className="mt-4 text-4xl font-semibold tracking-[-0.05em]">{activeTaskCount}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">Tasks that still need action or follow-up from you.</p>
            </article>

            <article className="rounded-[28px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">Completed</p>
              <p className="mt-4 text-4xl font-semibold tracking-[-0.05em]">
                {tasks.filter((task) => task.status === "completed").length}
              </p>
              <p className="mt-2 text-sm text-[var(--muted)]">Finished work that has already been submitted or closed out.</p>
            </article>

            <article className="rounded-[28px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] md:col-span-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">Campaigns</p>
                  <p className="mt-2 text-sm text-[var(--muted)]">You are currently part of {campaigns.length} active support campaign{campaigns.length === 1 ? "" : "s"}.</p>
                </div>
                <Link
                  href="/student/campaigns"
                  className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--panel)]"
                >
                  View campaigns
                </Link>
              </div>
            </article>
          </section>

          <section className="rounded-[32px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] md:p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">
                  Task Queue
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                  Your Assigned Work
                </h2>
              </div>
              <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[var(--foreground)]">
                {tasks.length} total
              </span>
            </div>

            {tasks.length === 0 ? (
              <div className="rounded-[24px] border border-[var(--border)] bg-white p-6 text-center">
                <p className="text-sm text-[var(--muted)]">
                  No tasks are assigned to you yet.
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                {tasks.map((task) => (
                  <article
                    key={task.id}
                    className="rounded-[24px] border border-[var(--border)] bg-white p-5 transition hover:shadow-md"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="max-w-3xl flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[task.status]}`}>
                            {task.status.replace("-", " ")}
                          </span>
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityStyles[task.priority]}`}>
                            {task.priority} priority
                          </span>
                          {task.taskType ? (
                            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
                              {task.taskType}
                            </span>
                          ) : null}
                        </div>

                        <h3 className="mt-4 text-xl font-semibold tracking-[-0.03em]">
                          {task.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                          {task.description}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-5 text-sm text-[var(--muted)]">
                          <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                          <p>Submitted: {task.completedCount} of {task.studentCount}</p>
                          <p>Teacher notes: {task.comments?.length ?? 0}</p>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-3">
                          <Link
                            href={`/student/tasks/${task.id}`}
                            className="rounded-full bg-[var(--foreground)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                          >
                            Open task
                          </Link>
                          <Link
                            href="/student/submissions"
                            className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--panel)]"
                          >
                            Go to submissions
                          </Link>
                        </div>
                      </div>

                      <div className="min-w-52 rounded-[22px] border border-[var(--border)] bg-[var(--panel)] p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Task Snapshot</p>
                        <p className="mt-3 text-sm text-[var(--foreground)]">
                          {task.rubric || "No rubric has been attached yet."}
                        </p>
                        <p className="mt-4 text-sm text-[var(--muted)]">
                          Resources: {task.resources?.length ?? 0} available
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
