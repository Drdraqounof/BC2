"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { mockTasks, activeCampaigns, type TaskRecord } from "../../dashboard-data";
import TaskDetail from "../../components/task-detail";

export default function ViewTasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<TaskRecord[]>(mockTasks);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "in-progress" | "completed" | "revision-submitted">("all");

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filterStatus !== "all" && task.status !== filterStatus) {
        return false;
      }
      return true;
    });
  }, [tasks, filterStatus]);

  const selectedTask = useMemo(
    () => tasks.find((t) => t.id === selectedTaskId) ?? null,
    [tasks, selectedTaskId]
  );

  const statusColors: Record<string, string> = {
    pending: "bg-[var(--signal-gold)]",
    "in-progress": "bg-[var(--signal-blue)]",
    completed: "bg-[var(--signal-green)]",
    "revision-submitted": "bg-[var(--signal-red)]",
  };

  const priorityColors: Record<string, string> = {
    LOW: "bg-[var(--signal-green)]",
    MEDIUM: "bg-[var(--signal-gold)]",
    HIGH: "bg-[var(--signal-red)]",
  };

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      {/* Header */}
      <section className="rounded-[34px] border border-white/60 bg-white/74 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">Task Management</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              View and manage task submissions.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted)]">
              Review student submissions, provide ratings and feedback, and track progress.
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard/task-assignment")}
            className="flex-shrink-0 rounded-2xl bg-[var(--signal-blue)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Create new task
          </button>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Task List */}
        <section className="space-y-4 lg:col-span-1">
          <div className="rounded-[30px] border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
            <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
              Filter by status
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)]"
              >
                <option value="all">All tasks</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="revision-submitted">Revision Submitted</option>
              </select>
            </label>
          </div>

          <div className="space-y-2">
            {filteredTasks.map((task) => (
              <button
                key={task.id}
                onClick={() => setSelectedTaskId(task.id)}
                className={`w-full rounded-[20px] border p-4 text-left transition ${
                  selectedTaskId === task.id
                    ? "border-[var(--signal-blue)] bg-[var(--signal-blue)]/10"
                    : "border-[var(--border)] bg-[var(--panel)] hover:border-[var(--signal-blue)]"
                }`}
              >
                <h3 className="font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                  {task.title}
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className={`rounded px-2 py-1 text-xs font-semibold text-white ${priorityColors[task.priority]}`}>
                    {task.priority}
                  </span>
                  <span className={`rounded px-2 py-1 text-xs font-semibold text-white ${statusColors[task.status]}`}>
                    {task.status.replace(/-/g, " ")}
                  </span>
                </div>
                <p className="mt-2 text-xs text-[var(--muted)]">
                  {task.completedCount}/{task.studentCount} completed
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Task Detail */}
        <section className="lg:col-span-2">
          {selectedTask ? (
            <div className="rounded-[30px] border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)] md:p-8">
              <TaskDetail
                task={selectedTask}
                onUpdateTask={(updatedTask) => {
                  setTasks((current) =>
                    current.map((t) => (t.id === updatedTask.id ? updatedTask : t))
                  );
                }}
                onClose={() => setSelectedTaskId(null)}
              />
            </div>
          ) : (
            <div className="rounded-[30px] border border-[var(--border)] bg-[var(--panel)] p-6 text-center shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
              <p className="text-sm text-[var(--muted)]">Select a task to view details</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
