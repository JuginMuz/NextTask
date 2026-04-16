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
        Each task shows its status with text as well as visual styling.
      </p>

      <div className="mt-6 space-y-4">
        {loading ? (
          <div
            className="rounded-2xl px-4 py-4 text-sm"
            style={{
              backgroundColor: "var(--card)",
              color: "var(--muted)",
              border: "1px dashed var(--border)",
            }}
          >
            Loading tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div
            className="rounded-2xl px-4 py-4 text-sm"
            style={{
              backgroundColor: "var(--card)",
              color: "var(--muted)",
              border: "1px dashed var(--border)",
            }}
          >
            No tasks yet. Add your first micro-task.
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