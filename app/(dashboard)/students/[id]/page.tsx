"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type StudentDetail = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gradeLabel?: string | null;
  classroomCode?: string | null;
  classroomId?: string | null;
  classroom?: {
    id: string;
    name: string;
    code: string;
    teacherId: string;
  } | null;
};

type TaskApiRecord = {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  rubric: string | null;
  attachmentLinks: string | null;
  campaignId: string | null;
  creatorId: string;
  taskAssignments: Array<{
    id: string;
    completedAt: string | null;
    grade: string | null;
  }>;
};

type CampaignApiRecord = {
  id: string;
  title: string;
  description: string | null;
  goal: string;
  status: string;
  tasks: Array<{
    id: string;
    title: string;
  }>;
};

type ProfileTask = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  statusLabel: string;
  grade: string | null;
  attachmentLinks: string[];
};

type ProfileCampaign = {
  id: string;
  title: string;
  description: string;
  goal: string;
  status: string;
  taskCount: number;
};

function parseAttachmentLinks(rawValue: string | null): string[] {
  if (!rawValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(rawValue) as unknown;
    return Array.isArray(parsedValue)
      ? parsedValue.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function normalizeTaskRecord(task: TaskApiRecord): ProfileTask {
  const assignment = task.taskAssignments[0];
  const isComplete = assignment?.completedAt !== null && assignment?.completedAt !== undefined;

  return {
    id: task.id,
    title: task.title,
    description: task.description ?? "",
    dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
    priority: task.priority,
    statusLabel: isComplete ? "Completed" : "Assigned",
    grade: assignment?.grade ?? null,
    attachmentLinks: parseAttachmentLinks(task.attachmentLinks),
  };
}

function normalizeCampaignRecord(campaign: CampaignApiRecord): ProfileCampaign {
  return {
    id: campaign.id,
    title: campaign.title,
    description: campaign.description ?? "",
    goal: campaign.goal,
    status: campaign.status.replace(/_/g, " "),
    taskCount: campaign.tasks.length,
  };
}

export default function StudentProfilePage() {
  const params = useParams<{ id: string }>();
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [tasks, setTasks] = useState<ProfileTask[]>([]);
  const [campaigns, setCampaigns] = useState<ProfileCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function loadStudentProfile() {
      try {
        setIsLoading(true);
        setLoadError("");

        const [studentResponse, taskResponse, campaignResponse] = await Promise.all([
          fetch(`/api/students/${params.id}`, { cache: "no-store" }),
          fetch(`/api/tasks?studentId=${encodeURIComponent(params.id)}`, { cache: "no-store" }),
          fetch(`/api/campaigns?studentId=${encodeURIComponent(params.id)}`, { cache: "no-store" }),
        ]);

        if (!studentResponse.ok) {
          throw new Error("Failed to load this student profile.");
        }

        if (!taskResponse.ok) {
          throw new Error("Failed to load assigned classwork.");
        }

        if (!campaignResponse.ok) {
          throw new Error("Failed to load assigned campaigns.");
        }

        const [studentData, taskData, campaignData] = await Promise.all([
          studentResponse.json() as Promise<StudentDetail>,
          taskResponse.json() as Promise<TaskApiRecord[]>,
          campaignResponse.json() as Promise<CampaignApiRecord[]>,
        ]);

        setStudent(studentData);
        setTasks(taskData.map(normalizeTaskRecord));
        setCampaigns(campaignData.map(normalizeCampaignRecord));
      } catch (error) {
        console.error("Failed to load student profile page:", error);
        setLoadError(error instanceof Error ? error.message : "Failed to load this student profile.");
      } finally {
        setIsLoading(false);
      }
    }

    loadStudentProfile();
  }, [params.id]);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <section className="rounded-[34px] border border-white/60 bg-white/74 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">Student Profile</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              {student ? `${student.firstName} ${student.lastName}` : "Loading student"}
            </h1>
          </div>
          <Link
            href="/students"
            className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--panel)]"
          >
            Back to students
          </Link>
        </div>
      </section>

      {isLoading ? (
        <section className="rounded-[32px] border border-[var(--border)] bg-[var(--panel)] p-6 text-sm text-[var(--muted)] shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
          Loading student profile...
        </section>
      ) : loadError ? (
        <section className="rounded-[32px] border border-red-200 bg-red-50/60 p-6 text-sm text-red-700 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
          {loadError}
        </section>
      ) : student ? (
        <>
          <section className="rounded-[32px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] md:p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">Student Information</p>
            <div className="mt-5 flex flex-wrap gap-3 overflow-x-auto">
              <article className="min-w-40 rounded-[22px] border border-[var(--border)] bg-white px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Full Name</p>
                <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                  {student.firstName} {student.lastName}
                </p>
              </article>
              <article className="min-w-52 rounded-[22px] border border-[var(--border)] bg-white px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Email</p>
                <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">{student.email}</p>
              </article>
              <article className="min-w-32 rounded-[22px] border border-[var(--border)] bg-white px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Grade</p>
                <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">{student.gradeLabel || "-"}</p>
              </article>
              <article className="min-w-44 rounded-[22px] border border-[var(--border)] bg-white px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Classroom</p>
                <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                  {student.classroom?.name || "No classroom assigned"}
                </p>
              </article>
              <article className="min-w-32 rounded-[22px] border border-[var(--border)] bg-white px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Classroom Code</p>
                <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                  {student.classroom?.code || student.classroomCode || "-"}
                </p>
              </article>
            </div>
          </section>

          <section className="rounded-[32px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] md:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">Assigned Classwork</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Current Tasks</h2>
              </div>
              <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[var(--foreground)]">
                {tasks.length} task{tasks.length === 1 ? "" : "s"}
              </span>
            </div>

            {tasks.length === 0 ? (
              <div className="mt-6 rounded-[24px] border border-[var(--border)] bg-white p-6 text-center text-sm text-[var(--muted)]">
                No classwork is assigned to this student yet.
              </div>
            ) : (
              <div className="mt-6 grid gap-3">
                {tasks.map((task) => (
                  <article key={task.id} className="rounded-[24px] border border-[var(--border)] bg-white p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-lg font-semibold tracking-[-0.03em] text-[var(--foreground)]">{task.title}</p>
                          <span className="rounded-full bg-[var(--panel)] px-3 py-1 text-xs font-medium text-[var(--foreground)]">
                            {task.priority}
                          </span>
                          <span className="rounded-full bg-[var(--signal-blue)]/10 px-3 py-1 text-xs font-medium text-[var(--signal-blue)]">
                            {task.statusLabel}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-[var(--muted)]">{task.description || "No description provided."}</p>
                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-[var(--muted)]">
                          <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}</span>
                          <span>Grade: {task.grade || "Not graded"}</span>
                          <span>Attachments: {task.attachmentLinks.length}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-[32px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] md:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">Assigned Campaigns</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Current Campaigns</h2>
              </div>
              <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[var(--foreground)]">
                {campaigns.length} campaign{campaigns.length === 1 ? "" : "s"}
              </span>
            </div>

            {campaigns.length === 0 ? (
              <div className="mt-6 rounded-[24px] border border-[var(--border)] bg-white p-6 text-center text-sm text-[var(--muted)]">
                No campaigns are assigned to this student yet.
              </div>
            ) : (
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {campaigns.map((campaign) => (
                  <article key={campaign.id} className="rounded-[24px] border border-[var(--border)] bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold tracking-[-0.03em] text-[var(--foreground)]">{campaign.title}</p>
                        <p className="mt-2 text-sm text-[var(--muted)]">
                          {campaign.description || "No description provided."}
                        </p>
                      </div>
                      <span className="rounded-full bg-[var(--panel)] px-3 py-1 text-xs font-medium text-[var(--foreground)]">
                        {campaign.status}
                      </span>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Goal</p>
                        <p className="mt-2 text-sm font-medium text-[var(--foreground)]">{campaign.goal}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Linked Tasks</p>
                        <p className="mt-2 text-sm font-medium text-[var(--foreground)]">{campaign.taskCount}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      ) : null}
    </main>
  );
}