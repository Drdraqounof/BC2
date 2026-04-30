"use client";

import Link from "next/link";

import { useStudentWorkspace } from "../use-student-workspace";

export default function StudentCampaignsPage() {
  const { student, campaigns, tasks, isLoading, loadError } = useStudentWorkspace();

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
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">My Campaigns</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              Support plans affecting you
            </h1>
            <p className="mt-4 text-lg text-[var(--muted)]">
              See the campaigns you are part of, the goals behind them, and the tasks connected to each one.
            </p>
          </section>

          {campaigns.length === 0 ? (
            <section className="rounded-[32px] border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
              <p className="text-sm text-[var(--muted)]">No campaigns are currently attached to your account.</p>
            </section>
          ) : (
            <section className="grid gap-4">
              {campaigns.map((campaign) => {
                const campaignTasks = tasks.filter((task) => task.campaignId === campaign.id);

                return (
                  <article
                    key={campaign.id}
                    className="rounded-[32px] border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)]"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="max-w-3xl">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className={`h-3 w-3 rounded-full ${campaign.accent}`} />
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--foreground)]">
                            {campaign.status}
                          </span>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--foreground)]">
                            {campaign.goalType}
                          </span>
                        </div>
                        <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">{campaign.title}</h2>
                        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{campaign.description}</p>
                        <p className="mt-4 text-sm text-[var(--foreground)]">Goal: {campaign.goal}</p>
                      </div>

                      <div className="min-w-60 rounded-[24px] border border-[var(--border)] bg-white p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Campaign Progress</p>
                        <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">{campaign.progress}%</p>
                        <p className="mt-2 text-sm text-[var(--muted)]">{campaignTasks.length} linked task{campaignTasks.length === 1 ? "" : "s"}</p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-3 md:grid-cols-2">
                      {campaignTasks.map((task) => (
                        <Link
                          key={task.id}
                          href={`/student/tasks/${task.id}`}
                          className="rounded-[24px] border border-[var(--border)] bg-white p-4 transition hover:shadow-md"
                        >
                          <p className="text-sm font-semibold text-[var(--foreground)]">{task.title}</p>
                          <p className="mt-2 text-sm text-[var(--muted)]">Due {new Date(task.dueDate).toLocaleDateString()}</p>
                        </Link>
                      ))}
                    </div>
                  </article>
                );
              })}
            </section>
          )}
        </>
      )}
    </main>
  );
}