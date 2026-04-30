"use client";

import { useStudentWorkspace } from "../use-student-workspace";

export default function StudentProgressPage() {
  const { student, tasks, isLoading, loadError } = useStudentWorkspace();
  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const revisionTasks = tasks.filter((task) => task.status === "revision-submitted").length;
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress").length;
  const completionRate = tasks.length === 0 ? 0 : Math.round((completedTasks / tasks.length) * 100);

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
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">My Progress</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              Progress for {student.firstName}
            </h1>
            <p className="mt-4 text-lg text-[var(--muted)]">
              Track how much work is complete, what still needs attention, and where feedback is waiting.
            </p>
          </section>

          <section className="grid gap-4 md:grid-cols-4">
            <article className="rounded-[28px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">Completion</p>
              <p className="mt-4 text-4xl font-semibold tracking-[-0.05em]">{completionRate}%</p>
            </article>
            <article className="rounded-[28px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">Completed</p>
              <p className="mt-4 text-4xl font-semibold tracking-[-0.05em]">{completedTasks}</p>
            </article>
            <article className="rounded-[28px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">In Progress</p>
              <p className="mt-4 text-4xl font-semibold tracking-[-0.05em]">{inProgressTasks}</p>
            </article>
            <article className="rounded-[28px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">Needs Revision</p>
              <p className="mt-4 text-4xl font-semibold tracking-[-0.05em]">{revisionTasks}</p>
            </article>
          </section>

          <section className="rounded-[32px] border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">Progress Bar</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Task Completion Rate</h2>
              </div>
              <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[var(--foreground)]">
                {completedTasks} of {tasks.length}
              </span>
            </div>

            <div className="mt-6 h-4 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-[var(--accent-blue)] transition-all"
                style={{ width: `${completionRate}%` }}
              />
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {tasks.map((task) => (
                <article key={task.id} className="rounded-[24px] border border-[var(--border)] bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold tracking-[-0.03em]">{task.title}</h3>
                    <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
                      {task.status.replace("-", " ")}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[var(--muted)]">Due {new Date(task.dueDate).toLocaleDateString()}</p>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}