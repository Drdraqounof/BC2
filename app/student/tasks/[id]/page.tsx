"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { useStudentWorkspace } from "../../use-student-workspace";

const statusStyles = {
  pending: "bg-amber-100 text-amber-700",
  "in-progress": "bg-sky-100 text-sky-700",
  completed: "bg-emerald-100 text-emerald-700",
  "revision-submitted": "bg-violet-100 text-violet-700",
};

export default function StudentTaskDetailPage() {
  const params = useParams<{ id: string }>();
  const { student, tasks, campaigns, isLoading, loadError } = useStudentWorkspace();
  const task = tasks.find((item) => item.id === params.id);
  const campaign = campaigns.find((item) => item.id === task?.campaignId);

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
      ) : !task ? (
        <section className="rounded-[34px] border border-white/60 bg-white/74 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
          <p className="text-lg text-[var(--muted)]">This task is not available for your account.</p>
        </section>
      ) : (
        <>
          <section className="rounded-[34px] border border-white/60 bg-white/74 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">Task Detail</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">{task.title}</h1>
                <p className="mt-4 text-lg text-[var(--muted)]">{task.description}</p>
              </div>
              <Link
                href="/student"
                className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--panel)]"
              >
                Back to tasks
              </Link>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-[1.35fr_0.65fr]">
            <article className="rounded-[32px] border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[task.status]}`}>
                  {task.status.replace(/-/g, " ")}
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--foreground)]">
                  {task.priority} priority
                </span>
                {task.taskType ? (
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--foreground)]">
                    {task.taskType}
                  </span>
                ) : null}
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Due Date</p>
                  <p className="mt-2 text-sm font-medium text-[var(--foreground)]">{new Date(task.dueDate).toLocaleDateString()}</p>
                </div>
                <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Campaign</p>
                  <p className="mt-2 text-sm font-medium text-[var(--foreground)]">{campaign?.title || "Standalone task"}</p>
                </div>
              </div>

              <div className="mt-6 rounded-[24px] border border-[var(--border)] bg-white p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Rubric</p>
                <p className="mt-3 text-sm leading-6 text-[var(--foreground)]">
                  {task.rubric || "No rubric has been attached yet."}
                </p>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Resources</p>
                  {task.resources?.length ? (
                    <ul className="mt-3 space-y-2 text-sm">
                      {task.resources.map((resource) => (
                        <li key={resource.id}>
                          <a href={resource.url} target="_blank" rel="noreferrer" className="text-[var(--signal-blue)] hover:underline">
                            {resource.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm text-[var(--muted)]">No resources attached.</p>
                  )}
                </div>

                <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Evidence</p>
                  {task.evidence?.length ? (
                    <ul className="mt-3 space-y-2 text-sm">
                      {task.evidence.map((item) => (
                        <li key={item.id}>
                          <a href={item.url} target="_blank" rel="noreferrer" className="text-[var(--signal-blue)] hover:underline">
                            {item.linkTitle}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm text-[var(--muted)]">No evidence uploaded yet.</p>
                  )}
                </div>
              </div>
            </article>

            <div className="flex flex-col gap-4">
              <article className="rounded-[32px] border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
                <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">Next Actions</p>
                <div className="mt-4 flex flex-col gap-3">
                  <Link
                    href="/student/submissions"
                    className="rounded-2xl bg-[var(--foreground)] px-4 py-3 text-center text-sm font-medium text-white transition hover:opacity-90"
                  >
                    Review submissions
                  </Link>
                  <Link
                    href="/student/feedback"
                    className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-center text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--panel)]"
                  >
                    Review feedback
                  </Link>
                </div>
              </article>

              <article className="rounded-[32px] border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
                <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">Teacher Notes</p>
                {task.comments?.length ? (
                  <ul className="mt-4 space-y-3 text-sm text-[var(--foreground)]">
                    {task.comments.map((comment) => (
                      <li key={comment.id} className="rounded-2xl bg-white p-4">
                        <p>{comment.text}</p>
                        <p className="mt-2 text-xs text-[var(--muted)]">{comment.author}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-[var(--muted)]">No comments yet.</p>
                )}
              </article>
            </div>
          </section>
        </>
      )}
    </main>
  );
}