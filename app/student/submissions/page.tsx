"use client";

import Link from "next/link";

import { useStudentWorkspace } from "../use-student-workspace";

export default function StudentSubmissionsPage() {
  const { student, tasks, isLoading, loadError } = useStudentWorkspace();

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
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">Submissions</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              Work you have turned in
            </h1>
            <p className="mt-4 text-lg text-[var(--muted)]">
              Review submitted evidence, pending work, and the next task that still needs a hand-in.
            </p>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <article className="rounded-[28px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">Submitted Items</p>
              <p className="mt-4 text-4xl font-semibold tracking-[-0.05em]">
                {tasks.reduce((total, task) => total + (task.evidence?.length ?? 0), 0)}
              </p>
            </article>
            <article className="rounded-[28px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">Pending Tasks</p>
              <p className="mt-4 text-4xl font-semibold tracking-[-0.05em]">
                {tasks.filter((task) => task.status === "pending" || task.status === "in-progress").length}
              </p>
            </article>
            <article className="rounded-[28px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">Revision Requests</p>
              <p className="mt-4 text-4xl font-semibold tracking-[-0.05em]">
                {tasks.filter((task) => task.status === "revision-submitted").length}
              </p>
            </article>
          </section>

          <section className="grid gap-4">
            {tasks.map((task) => (
              <article
                key={task.id}
                className="rounded-[28px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-3xl">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">{task.status.replace(/-/g, " ")}</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">{task.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{task.description}</p>
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
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Evidence on file</p>
                    {task.evidence?.length ? (
                      <ul className="mt-3 space-y-2 text-sm text-[var(--foreground)]">
                        {task.evidence.map((item) => (
                          <li key={item.id}>
                            <a href={item.url} target="_blank" rel="noreferrer" className="text-[var(--signal-blue)] hover:underline">
                              {item.linkTitle}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 text-sm text-[var(--muted)]">No evidence has been submitted for this task yet.</p>
                    )}
                  </div>

                  <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Submission note</p>
                    <p className="mt-3 text-sm text-[var(--foreground)]">
                      {task.rubric || "Submit work that clearly shows what you completed and any questions you still have."}
                    </p>
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