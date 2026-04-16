import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import FocusTimer from "../components/FocusTimer";
import { getProjects, type Project } from "../lib/projects";
import { createSession, type FocusSession } from "../lib/sessions";
import { getToken } from "../lib/session";
import {
  getTasks,
  updateTask,
  type Task,
} from "../lib/tasks";

function TaskFocusPage() {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();
  const token = getToken();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [task, setTask] = useState<Task | null>(null);
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [pageError, setPageError] = useState("");
  const [sessionMessage, setSessionMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (!projectId || !taskId) {
      navigate("/projects");
      return;
    }

    async function loadTaskFocusPage() {
      try {
        setPageError("");

        const [projects, projectTasks] = await Promise.all([
          getProjects(token),
          getTasks(token, projectId),
        ]);

        const currentProject = projects.find((p) => p.id === projectId);
        const currentTask = projectTasks.find((t) => t.id === taskId);

        if (!currentProject) {
          setPageError("Project not found.");
          return;
        }

        if (!currentTask) {
          setPageError("Task not found.");
          return;
        }

        setProject(currentProject);
        setTasks(projectTasks);
        setTask(currentTask);
      } catch (error) {
        console.error("Failed to load focus page:", error);
        setPageError("Unable to load this task right now.");
      } finally {
        setLoading(false);
      }
    }

    void loadTaskFocusPage();
  }, [projectId, taskId, token, navigate]);

  async function handleCompleteTask() {
    if (!token || !task) return;

    try {
      const updatedTask = await updateTask(task.id, true, token);
      setTask(updatedTask);
      setTasks((prev) =>
        prev.map((item) => (item.id === task.id ? updatedTask : item))
      );
      setSessionMessage(`Task "${updatedTask.title}" marked as completed.`);
      setPageError("");
    } catch (error) {
      console.error("Failed to complete task:", error);
      setPageError("Could not complete the task.");
    }
  }

  async function handleTimerComplete(duration: number) {
    if (!token) return;

    try {
      const newSession = await createSession(duration, token);
      setSessions((prev) => [newSession, ...prev]);
      setSessionMessage(`Nice work — ${duration} minutes saved to your focus history.`);
      setPageError("");
    } catch (error) {
      console.error("Failed to save focus session:", error);
      setPageError("Focus session completed, but it could not be saved.");
    }
  }

  const completedTasks = useMemo(
    () => tasks.filter((item) => item.completed).length,
    [tasks]
  );

  const totalTasks = tasks.length;
  const progress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const totalFocusMinutes = useMemo(
    () => sessions.reduce((sum, session) => sum + session.duration, 0),
    [sessions]
  );

  return (
    <main
      className="min-h-screen px-6 py-8"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <div className="mx-auto max-w-5xl space-y-6">
        <header
          className="rounded-3xl px-6 py-5 shadow-sm"
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
          }}
        >
          <Link
            to={projectId ? `/projects/${projectId}` : "/projects"}
            className="text-sm font-medium no-underline"
            style={{ color: "var(--muted)" }}
          >
            ← Back to project
          </Link>

          <h1
            className="mt-3 text-4xl font-bold tracking-tight"
            style={{ color: "var(--text)" }}
          >
            Task focus
          </h1>

          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            Work on one task at a time with a clear timer and visible progress.
          </p>
        </header>

        {(pageError || sessionMessage) && (
          <div className="space-y-3">
            {pageError && (
              <div
                className="rounded-2xl px-4 py-3 text-sm"
                role="alert"
                style={{
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--danger-soft)",
                  color: "var(--text)",
                }}
              >
                {pageError}
              </div>
            )}

            {sessionMessage && (
              <div
                className="rounded-2xl px-4 py-3 text-sm"
                aria-live="polite"
                style={{
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--success-soft)",
                  color: "var(--text)",
                }}
              >
                {sessionMessage}
              </div>
            )}
          </div>
        )}

        {loading ? (
          <section
            className="rounded-3xl px-5 py-6 shadow-sm"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              color: "var(--muted)",
            }}
          >
            Loading task...
          </section>
        ) : !project || !task ? (
          <section
            className="rounded-3xl px-5 py-6 shadow-sm"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
          >
            <p className="text-base font-semibold">Task not available</p>
            <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
              The task or project may have been removed.
            </p>
          </section>
        ) : (
          <>
            <section
              className="rounded-3xl p-6 shadow-sm"
              style={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
              }}
            >
              <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>
                Project
              </p>
              <h2
                className="mt-2 text-2xl font-semibold"
                style={{ color: "var(--text)" }}
              >
                {project.title}
              </h2>

              <p className="mt-4 text-sm font-medium" style={{ color: "var(--muted)" }}>
                Current task
              </p>
              <p
                className={`mt-2 text-3xl font-bold ${
                  task.completed ? "line-through opacity-80" : ""
                }`}
                style={{ color: "var(--text)" }}
              >
                {task.title}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleCompleteTask}
                  disabled={task.completed}
                  className="rounded-xl px-5 py-3 text-sm font-semibold outline-none"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "var(--primary-text)",
                    opacity: task.completed ? 0.6 : 1,
                  }}
                >
                  {task.completed ? "Task completed" : "Complete task"}
                </button>
              </div>
            </section>

            <FocusTimer onComplete={handleTimerComplete} />

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
                Project progress
              </h2>

              <div
                className="mt-5 h-4 w-full overflow-hidden rounded-full"
                style={{ backgroundColor: "var(--border)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: "var(--primary)",
                  }}
                />
              </div>

              <div
                className="mt-4 flex flex-wrap gap-4 text-sm"
                style={{ color: "var(--muted)" }}
              >
                <span>
                  <strong style={{ color: "var(--text)" }}>Progress:</strong>{" "}
                  {progress}%
                </span>
                <span>
                  <strong style={{ color: "var(--text)" }}>Completed:</strong>{" "}
                  {completedTasks} / {totalTasks}
                </span>
                <span>
                  <strong style={{ color: "var(--text)" }}>Focus minutes here:</strong>{" "}
                  {totalFocusMinutes}
                </span>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

export default TaskFocusPage;