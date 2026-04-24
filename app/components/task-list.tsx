import { useMemo } from "react";
import { TaskRecord, activeCampaigns } from "@/app/dashboard-data";
import { TaskCard } from "./task-card";

interface TaskListProps {
  tasks: TaskRecord[];
  campaignFilter?: string;
  statusFilter?: "all" | "pending" | "completed";
  onSelectTask?: (taskId: string) => void;
  onMarkComplete?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
  isClickable?: boolean;
  emptyMessage?: string;
}

export function TaskList({
  tasks,
  campaignFilter = "all",
  statusFilter = "all",
  onSelectTask,
  onMarkComplete,
  onDelete,
  isClickable = true,
  emptyMessage = "No tasks found",
}: TaskListProps) {
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Campaign filter
      if (campaignFilter !== "all") {
        if (campaignFilter === "none" && task.campaignId) {
          return false;
        }
        if (campaignFilter !== "none" && task.campaignId !== campaignFilter) {
          return false;
        }
      }

      // Status filter
      if (statusFilter === "completed" && task.completedCount !== task.studentCount) {
        return false;
      }
      if (statusFilter === "pending" && task.completedCount === task.studentCount) {
        return false;
      }

      return true;
    });
  }, [tasks, campaignFilter, statusFilter]);

  if (filteredTasks.length === 0) {
    return (
      <div className="rounded-[30px] border border-[var(--border)] bg-[var(--panel)] p-8 text-center">
        <p className="text-sm text-[var(--muted)]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {filteredTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onSelect={onSelectTask}
          onMarkComplete={onMarkComplete}
          onDelete={onDelete}
          isClickable={isClickable}
        />
      ))}
    </div>
  );
}
