import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import FocusTimer from "../components/FocusTimer";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { clearToken, getToken } from "../lib/session";
import {
  createSession,
  getSessions,
  type FocusSession,
} from "../lib/sessions";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  type Task,
} from "../lib/tasks";

function DashboardPage() {
  const navigate = useNavigate();
  const token = getToken();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const [loadingTasks, setLoadingTasks] = useState(true);
  const [savingSession, setSavingSession] = useState(false);
  const [pageError, setPageError] = useState("");
  const [sessionMessage, setSessionMessage] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    async function loadDashboardData() {
      try {
        setPageError("");

        const [fetchedTasks, fetchedSessions] = await Promise.all([
          getTasks(token),
          getSessions(token),
        ]);

        setTasks(fetchedTasks);
        setSessions(fetchedSessions);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        setPageError("Unable to load your dashboard right now.");
      } finally {
        setLoadingTasks(false);
      }
    }

    void loadDashboardData();
  }, [token, navigate]);

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    const trimmedTitle = newTaskTitle.trim();
    if (!trimmedTitle) return;

    try {
      const createdTask = await createTask(trimmedTitle, token);
      setTasks((prev) => [createdTask, ...prev]);
      setNewTaskTitle("");
      setPageError("");
    } catch (error) {
      console.error("Failed to create task:", error);
      setPageError("Could not create the task.");
    }
  }

  async function handleToggleTask(taskId: string, completed: boolean) {
    if (!token) return;

    try {
      const updated = await updateTask(taskId, completed, token);
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? updated : task))
      );
      setPageError("");
    } catch (error) {
      console.error("Failed to update task:", error);
      setPageError("Could not update the task.");
    }
  }

  async function handleDeleteTask(taskId: string) {
    if (!token) return;

    try {
      await deleteTask(taskId, token);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      setPageError("");
    } catch (error) {
      console.error("Failed to delete task:", error);
      setPageError("Could not delete the task.");
    }
  }

  async function handleSessionComplete(duration: number) {
    if (!token) return;

    try {
      setSavingSession(true);
      setSessionMessage("");

      const newSession = await createSession(duration, token);
      setSessions((prev) => [newSession, ...prev]);
      setSessionMessage(`Nice work — ${duration} focus minutes recorded.`);
      setPageError("");
    } catch (error) {
      console.error("Failed to save focus session:", error);
      setPageError("Focus session completed, but it could not be saved.");
    } finally {
      setSavingSession(false);
    }
  }

  function handleLogout() {
    clearToken();
    navigate("/login");
  }

  const completedTasks = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks]
  );

  const totalTasks = tasks.length;
  const totalSessions = sessions.length;

  const totalFocusMinutes = useMemo(
    () => sessions.reduce((sum, session) => sum + session.duration, 0),
    [sessions]
  );

  const completionRate =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-950">
              NextTask
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              An accessible workflow for micro-tasks and focus sessions.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Logout
          </button>
        </header>

        {(pageError || sessionMessage) && (
          <div className="mb-6 space-y-3">
            {pageError && (
              <div
                className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
              >
                {pageError}
              </div>
            )}

            {sessionMessage && (
              <div
                className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                aria-live="polite"
              >
                {sessionMessage}
              </div>
            )}
          </div>
        )}

        <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <StatCard label="Total tasks" value={totalTasks} />
          <StatCard label="Completed tasks" value={completedTasks} />
          <StatCard label="Focus sessions" value={totalSessions} />
          <StatCard label="Focus minutes" value={totalFocusMinutes} />
          <StatCard label="Completion rate" value={`${completionRate}%`} />
        </section>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
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

          <div className="space-y-4">
            <FocusTimer onComplete={handleSessionComplete} />

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">
                Session summary
              </h2>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <p>
                  <span className="font-semibold text-slate-900">
                    Sessions completed:
                  </span>{" "}
                  {totalSessions}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">
                    Total focus time:
                  </span>{" "}
                  {totalFocusMinutes} minutes
                </p>
                <p>
                  <span className="font-semibold text-slate-900">
                    Saving status:
                  </span>{" "}
                  {savingSession ? "Saving..." : "Up to date"}
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

type StatCardProps = {
  label: string;
  value: number | string;
};

function StatCard({ label, value }: StatCardProps) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <p className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
        {value}
      </p>
    </article>
  );
}

export default DashboardPage;