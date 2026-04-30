"use client";

import { useStudentWorkspace } from "../use-student-workspace";

export default function StudentProfilePage() {
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
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">My Profile</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              {student.firstName} {student.lastName}
            </h1>
            <p className="mt-4 text-lg text-[var(--muted)]">
              Keep your student account details and workload summary visible in one place.
            </p>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <article className="rounded-[32px] border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
              <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">Account</p>
              <div className="mt-6 grid gap-4">
                <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Name</p>
                  <p className="mt-2 text-lg font-semibold">{student.firstName} {student.lastName}</p>
                </div>
                <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Email</p>
                  <p className="mt-2 text-lg font-semibold">{student.email}</p>
                </div>
                <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Grade</p>
                  <p className="mt-2 text-lg font-semibold">{student.gradeLabel || "—"}</p>
                </div>
                <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Classroom Code</p>
                  <p className="mt-2 text-lg font-semibold">{student.classroomCode || "—"}</p>
                </div>
              </div>
            </article>

            <article className="rounded-[32px] border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
              <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">Workload</p>
              <div className="mt-6 grid gap-4">
                <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Assigned Tasks</p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{tasks.length}</p>
                </div>
                <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Completed Tasks</p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    {tasks.filter((task) => task.status === "completed").length}
                  </p>
                </div>
                <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Teacher Feedback Items</p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    {tasks.reduce((total, task) => total + (task.comments?.length ?? 0), 0)}
                  </p>
                </div>
              </div>
            </article>
          </section>
        </>
      )}
    </main>
  );
}