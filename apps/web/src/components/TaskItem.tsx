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
            className={`break-words text-lg font-semibold ${
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
                  ? "var(--success-soft)"
                  : "var(--pending-soft)",
                color: "var(--text)",
                border: "1px solid var(--border)",
              }}
              aria-label={`Task status: ${statusLabel}`}
            >
              <span aria-hidden="true">{statusSymbol}</span>
              {statusLabel}
            </span>

            <span className="text-sm" style={{ color: "var(--muted)" }}>
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
            title={
              task.completed
                ? "Mark task as pending"
                : "Mark task as completed"
            }
            className="rounded-xl px-4 py-2 text-sm font-semibold outline-none"
            style={{
              backgroundColor: task.completed
                ? "var(--warning)"
                : "var(--primary)",
              color: task.completed
                ? "var(--warning-text)"
                : "var(--primary-text)",
            }}
            aria-label={
              task.completed
                ? `Mark "${task.title}" as pending`
                : `Mark "${task.title}" as completed`
            }
          >
            <span aria-hidden="true" className="mr-2">
              {task.completed ? "↺" : "✓"}
            </span>
            {task.completed ? "Mark as pending" : "Mark as completed"}
          </button>

          <button
            type="button"
            onClick={() => onDelete(task.id)}
            title="Delete task"
            className="rounded-xl px-4 py-2 text-sm font-semibold outline-none"
            style={{
              backgroundColor: "var(--secondary)",
              color: "var(--secondary-text)",
              border: "1px solid var(--border)",
            }}
            aria-label={`Delete task ${task.title}`}
          >
            <span aria-hidden="true" className="mr-2">
              ✕
            </span>
            Delete task
          </button>
        </div>
      </div>
    </article>
  );
}

export default TaskItem;