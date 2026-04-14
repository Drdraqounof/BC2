import { studentList } from "../../dashboard-data";

export default function StudentsPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <section className="rounded-[34px] border border-white/60 bg-white/74 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
        <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">Students</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
          View students by signal, support status, and current intervention.
        </h1>
      </section>

      <section className="rounded-[32px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] md:p-6">
        <div className="grid gap-3">
          {studentList.map((student) => (
            <article
              key={student.name}
              className="grid gap-3 rounded-[24px] border border-[var(--border)] bg-white p-4 md:grid-cols-[1.2fr_1fr_1fr_1fr] md:items-center"
            >
              <div>
                <p className="text-lg font-semibold tracking-[-0.03em]">{student.name}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{student.grade}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Signal</p>
                <p className="mt-2 text-sm font-medium">{student.signal}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Status</p>
                <p className="mt-2 text-sm font-medium">{student.status}</p>
              </div>
              <button className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--panel-strong)]">
                View Student
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}