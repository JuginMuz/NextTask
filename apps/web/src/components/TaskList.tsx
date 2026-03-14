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
    <div className="rounded-2xl bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold text-slate-900">Your tasks</h2>

      {loading ? (
        <p className="text-slate-600">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-slate-600">No tasks yet. Add your first one.</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default TaskList;