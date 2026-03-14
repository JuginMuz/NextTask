import type { Task } from "../lib/tasks";

type TaskItemProps = {
  task: Task;
  onToggle: (taskId: string, completed: boolean) => void;
  onDelete: (taskId: string) => void;
};

function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <li className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p
            className={`font-medium ${
              task.completed ? "text-slate-400 line-through" : "text-slate-900"
            }`}
          >
            {task.title}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {task.completed ? "Completed" : "Not completed"}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onToggle(task.id, !task.completed)}
            className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            {task.completed ? "Undo" : "Complete"}
          </button>

          <button
            onClick={() => onDelete(task.id)}
            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}

export default TaskItem;