import type { Task } from "../lib/tasks";
import TaskItem from "./TaskItem";

type TaskListProps = {
  tasks: Task[];
  loading: boolean;
  onToggle: (taskId: string, completed: boolean) => void;
  onDelete: (taskId: string) => void;
};

function TaskList({ tasks, loading, onToggle, onDelete }: TaskListProps) {
  return (
    <section
      className="rounded-3xl p-6 shadow-sm"
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      <h2
        className="text-2xl font-semibold"
        style={{ color: "var(--text)" }}
      >
        Your tasks
      </h2>

      <p
        className="mt-2 text-sm"
        style={{ color: "var(--muted)" }}
      >
        Keep tasks short, specific, and easy to finish.
      </p>

      <div className="mt-6 space-y-4">
        {loading ? (
          <div
            className="rounded-2xl px-4 py-5 text-sm"
            style={{
              backgroundColor: "var(--card)",
              color: "var(--muted)",
              border: "1px dashed var(--border)",
            }}
            aria-live="polite"
          >
            Loading your tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div
            className="rounded-2xl px-5 py-6"
            style={{
              backgroundColor: "var(--card)",
              border: "1px dashed var(--border)",
              color: "var(--text)",
            }}
          >
            <p className="text-base font-semibold">No tasks yet</p>
            <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
              Add your first micro-task above to get started. Try something small
              and specific, like “Read 2 pages” or “Reply to one email”.
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default TaskList;