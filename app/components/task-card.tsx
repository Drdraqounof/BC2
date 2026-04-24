import { TaskRecord } from "@/app/dashboard-data";

interface TaskCardProps {
  task: TaskRecord;
  onSelect?: (taskId: string) => void;
  onMarkComplete?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
  isClickable?: boolean;
}

const priorityColors: Record<string, string> = {
  LOW: "bg-[var(--signal-green)]",
  MEDIUM: "bg-[var(--signal-gold)]",
  HIGH: "bg-[var(--signal-red)]",
};

export function TaskCard({
  task,
  onSelect,
  onMarkComplete,
  onDelete,
  isClickable = true,
}: TaskCardProps) {
  return (
    <div
      className={`rounded-[24px] border border-[var(--border)] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] ${
        isClickable ? "cursor-pointer transition hover:border-[var(--signal-blue)]" : ""
      }`}
      onClick={() => isClickable && onSelect?.(task.id)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold tracking-[-0.03em]">{task.title}</h3>
            <span className={`rounded px-2 py-1 text-xs font-semibold text-white ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
          </div>
          {task.description && (
            <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">{task.description}</p>
          )}
          <div className="mt-3 flex items-center gap-4">
            <span className="text-sm font-medium text-[var(--foreground)]">
              {task.completedCount} of {task.studentCount} completed
            </span>
            {task.dueDate && (
              <span className="text-sm text-[var(--muted)]">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        {(onMarkComplete || onDelete) && (
          <div className="flex flex-col gap-2">
            {onMarkComplete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkComplete(task.id);
                }}
                className="rounded-full border border-[var(--signal-green)] px-3 py-1 text-xs font-medium text-[var(--signal-green)] transition hover:bg-[var(--signal-green)]/10"
              >
                Mark done
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                }}
                className="rounded-full border border-[var(--signal-red)] px-3 py-1 text-xs font-medium text-[var(--signal-red)] transition hover:bg-[var(--signal-red)]/10"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-2 rounded-full bg-[var(--panel)]">
        <div
          className={`h-2 rounded-full ${priorityColors[task.priority]}`}
          style={{ width: `${(task.completedCount / task.studentCount) * 100}%` }}
        />
      </div>
    </div>
  );
}
