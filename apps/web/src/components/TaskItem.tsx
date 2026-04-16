import type { Task } from "../lib/tasks";

type TaskItemProps = {
  task: Task;
  onToggle: (taskId: string, completed: boolean) => void;
  onDelete: (taskId: string) => void;
};

function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const statusLabel = task.completed ? "Completed" : "Pending";
  const statusSymbol = task.completed ? "✓" : "○";

  return (
    <article
      className="rounded-2xl p-4 shadow-sm"
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <h3
            className={`text-lg font-semibold break-words ${
              task.completed ? "line-through opacity-80" : ""
            }`}
            style={{ color: "var(--text)" }}
          >
            {task.title}
          </h3>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                backgroundColor: task.completed
                  ? "rgba(16, 185, 129, 0.18)"
                  : "rgba(59, 130, 246, 0.18)",
                color: "var(--text)",
                border: "1px solid var(--border)",
              }}
              aria-label={`Task status: ${statusLabel}`}
            >
              <span aria-hidden="true">{statusSymbol}</span>
              {statusLabel}
            </span>

            <span
              className="text-sm"
              style={{ color: "var(--muted)" }}
            >
              {task.completed
                ? "This micro-task has been finished."
                : "This micro-task still needs to be done."}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onToggle(task.id, !task.completed)}
            className="rounded-xl px-4 py-2 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              backgroundColor: task.completed ? "#0f766e" : "#2563eb",
              color: "#ffffff",
            }}
            aria-label={
              task.completed
                ? `Mark "${task.title}" as not completed`
                : `Mark "${task.title}" as completed`
            }
          >
            {task.completed ? "Mark as pending" : "Mark as completed"}
          </button>

          <button
            type="button"
            onClick={() => onDelete(task.id)}
            className="rounded-xl px-4 py-2 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              backgroundColor: "#dc2626",
              color: "#ffffff",
            }}
            aria-label={`Delete task ${task.title}`}
          >
            Delete task
          </button>
        </div>
      </div>
    </article>
  );
}

export default TaskItem;