type StatusBadgeProps = {
  status: "pending" | "completed";
};

function StatusBadge({ status }: StatusBadgeProps) {
  const isCompleted = status === "completed";

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
      style={{
        backgroundColor: isCompleted ? "var(--success-soft)" : "var(--pending-soft)",
        color: isCompleted ? "var(--success)" : "var(--primary)",
        border: "1px solid var(--border)",
      }}
    >
      <span aria-hidden="true">{isCompleted ? "✔" : "⏳"}</span>
      {isCompleted ? "Completed" : "In progress"}
    </span>
  );
}

export default StatusBadge;