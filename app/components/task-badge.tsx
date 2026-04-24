interface TaskBadgeProps {
  count: number;
  variant?: "default" | "compact";
}

export function TaskBadge({ count, variant = "default" }: TaskBadgeProps) {
  if (count === 0) return null;

  if (variant === "compact") {
    return (
      <span className="rounded-full bg-[var(--signal-blue)] px-2 py-1 text-xs font-semibold text-white">
        {count}
      </span>
    );
  }

  return (
    <span className="rounded-full bg-[var(--signal-blue)] px-2 py-1 text-xs font-semibold text-white">
      {count} task{count !== 1 ? "s" : ""}
    </span>
  );
}
