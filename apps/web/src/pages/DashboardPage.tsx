import { useEffect, useState } from "react";
import { getToken, clearToken } from "../lib/session";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  type Task,
} from "../lib/tasks";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const navigate = useNavigate();

  const token = getToken();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [loadingTasks, setLoadingTasks] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    async function loadTasks() {
      const fetchedTasks = await getTasks(token);
      setTasks(fetchedTasks);
      setLoadingTasks(false);
    }

    loadTasks();
  }, [token]);

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();

    if (!token) return;

    const createdTask = await createTask(newTaskTitle, token);

    setTasks((prev) => [createdTask, ...prev]);

    setNewTaskTitle("");
  }

  async function handleToggleTask(taskId: string, completed: boolean) {
    if (!token) return;

    const updated = await updateTask(taskId, completed, token);

    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? updated : task))
    );
  }

  async function handleDeleteTask(taskId: string) {
    if (!token) return;

    await deleteTask(taskId, token);

    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  }

  function handleLogout() {
    clearToken();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between rounded-2xl bg-white p-6 shadow">
          <h1 className="text-3xl font-bold">NextTask</h1>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-slate-900 px-4 py-2 text-white"
          >
            Logout
          </button>
        </div>

        <TaskForm
          value={newTaskTitle}
          onChange={setNewTaskTitle}
          onSubmit={handleCreateTask}
        />

        <TaskList
          tasks={tasks}
          loading={loadingTasks}
          onToggle={handleToggleTask}
          onDelete={handleDeleteTask}
        />
      </div>
    </div>
  );
}

export default DashboardPage;
