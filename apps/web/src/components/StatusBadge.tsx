type Status = "pending" | "completed" | "warning" | "blocked";

const statusConfig = {
  pending: {
    label: "In progress",
    bg: "var(--pending-soft)",
    color: "var(--primary)",
    icon: "⏳",
  },
  completed: {
    label: "Completed",
    bg: "var(--success-soft)",
    color: "var(--success)",
    icon: "✔",
  },
  warning: {
    label: "Needs attention",
    bg: "var(--warning-soft)",
    color: "var(--warning)",
    icon: "⚠",
  },
  blocked: {
    label: "Blocked",
    bg: "var(--danger-soft)",
    color: "var(--danger)",
    icon: "⛔",
  },
};

function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status];

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
      style={{
        backgroundColor: config.bg,
        color: config.color,
      }}
    >
      <span aria-hidden>{config.icon}</span>
      {config.label}
    </span>
  );
}

export default StatusBadge;