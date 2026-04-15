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
import FocusTimer from "../components/FocusTimer";
import {
  getSessions,
  type FocusSession,
  createSession,
} from "../lib/sessions";

function DashboardPage() {
  const navigate = useNavigate();

  const token = getToken();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [loadingTasks, setLoadingTasks] = useState(true);

  const [sessions, setSessions] = useState<FocusSession[]>([]);
  

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    async function loadDashboardData() {
      try {
        const [fetchedTasks, fetchedSessions] = await Promise.all([
          getTasks(token),
          getSessions(token),
        ]);

        setTasks(fetchedTasks);
        setSessions(fetchedSessions);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoadingTasks(false);
      }
    }

      loadDashboardData();
  }, [token, navigate]);

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

  async function handleSessionComplete(duration: number) {
    if (!token) return;

    try {
      const newSession = await createSession(duration, token);
      setSessions((prev) => [newSession, ...prev]);
      alert(`Focus session completed! (${duration} minutes)`);
    } catch (error) {
      console.error("Failed to save focus session:", error);
    }
  }

  function handleLogout() {
    clearToken();
    navigate("/login");
  }
  
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const totalSessions = sessions.length;
  const totalFocusMinutes = sessions.reduce(
    (sum, session) => sum + session.duration,
    0
  );

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

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">Total tasks</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{totalTasks}</p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">Completed tasks</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{completedTasks}</p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">Focus sessions</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{totalSessions}</p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">Focus minutes</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {totalFocusMinutes}
            </p>
          </div>
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

        <FocusTimer onComplete={handleSessionComplete} />

      </div>
    </div>
  );
}

export default DashboardPage;
