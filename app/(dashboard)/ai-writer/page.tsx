import { writerPrompts } from "../../dashboard-data";

export default function AiWriterPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <section className="rounded-[34px] border border-white/60 bg-white/74 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
        <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">AI Writer</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
          Draft outreach, summaries, and teacher follow-up faster.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted)]">
          Keep communication aligned with the campaign goals by starting from focused prompts instead of blank documents.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[32px] border border-[var(--border)] bg-[var(--panel-dark)] p-5 text-white shadow-[0_24px_70px_rgba(17,24,39,0.28)] md:p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-white/60">Prompt Library</p>
          <div className="mt-5 space-y-3">
            {writerPrompts.map((prompt) => (
              <article key={prompt} className="rounded-[24px] border border-white/10 bg-white/6 p-4">
                <p className="font-mono text-sm leading-6 text-white/84">{prompt}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] md:p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">Draft Preview</p>
          <div className="mt-5 rounded-[28px] border border-[var(--border)] bg-white p-5">
            <p className="text-sm text-[var(--muted)]">Subject</p>
            <p className="mt-2 text-lg font-semibold tracking-[-0.03em]">
              Quick update on missing assignments this week
            </p>
            <div className="mt-5 space-y-4 text-sm leading-7 text-[var(--foreground)]/84">
              <p>Hello family,</p>
              <p>
                I am reaching out because your student currently has multiple missing assignments in Algebra 2. I have started a recovery campaign this week to help students catch up before Friday.
              </p>
              <p>
                Please encourage them to complete the attached tasks and let me know if you would like extra support or a short check-in plan.
              </p>
              <p>Thank you,</p>
              <p>Ms. Carter</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}