import { progressMetrics, progressTrends } from "../../dashboard-data";

export default function ProgressTrackingPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <section className="rounded-[34px] border border-white/60 bg-white/74 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
        <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">
          Progress Tracking
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
          Check whether classroom action is producing better outcomes.
        </h1>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {progressMetrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-[28px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)]"
          >
            <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">{metric.label}</p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.04em]">{metric.value}</p>
            <p className="mt-2 text-sm text-[var(--muted)]">{metric.note}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {progressTrends.map((trend) => (
          <article
            key={trend.label}
            className="rounded-[30px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)]"
          >
            <h2 className="text-xl font-semibold tracking-[-0.03em]">{trend.label}</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">4 week trend</p>
            <div className="mt-6 grid grid-cols-4 gap-2">
              {trend.values.map((value, index) => (
                <div key={`${trend.label}-${index}`} className="space-y-2">
                  <div className="flex h-28 items-end rounded-[18px] bg-white p-2">
                    <div
                      className="progress-bar-fill w-full rounded-[14px] bg-[var(--signal-green)]"
                      style={{
                        height: `${value}%`,
                        ["--bar-delay" as string]: `${index * 120}ms`,
                      }}
                    />
                  </div>
                  <p className="text-center text-xs uppercase tracking-[0.16em] text-[var(--muted)]">W{index + 1}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}