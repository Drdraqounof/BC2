import { activeCampaigns } from "../../dashboard-data";

export default function ActiveCampaignsPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <section className="rounded-[34px] border border-white/60 bg-white/74 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
        <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">
          Active Campaigns
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
          Structured interventions with clear goals and visible status.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted)]">
          Review the students affected, the goal for each campaign, and the next action teachers should take.
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {activeCampaigns.map((campaign) => (
          <article
            key={campaign.title}
            className="rounded-[30px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold tracking-[-0.03em]">
                  {campaign.title}
                </h2>
                <p className="mt-2 text-sm text-[var(--muted)]">{campaign.students}</p>
              </div>
              <span className={`h-3 w-3 rounded-full ${campaign.accent}`} />
            </div>
            <p className="mt-5 text-sm leading-7 text-[var(--foreground)]/82">
              Goal: {campaign.goal}
            </p>
            <div className="mt-5 rounded-[24px] bg-white p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--muted)]">Status</span>
                <span className="font-medium">{campaign.status}</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-[var(--panel-strong)]">
                <div className={`h-2 rounded-full ${campaign.accent}`} style={{ width: `${campaign.progress}%` }} />
              </div>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                {campaign.progress}% toward goal
              </p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}