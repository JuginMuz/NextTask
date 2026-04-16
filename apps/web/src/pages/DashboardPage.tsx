import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import FocusTimer from "../components/FocusTimer";
import { useTheme } from "../lib/theme";
import { createSession, getSessions, type FocusSession } from "../lib/sessions";
import { getProjects, type Project } from "../lib/projects";
import { clearToken, getToken } from "../lib/session";

function DashboardPage() {
  const navigate = useNavigate();
  const token = getToken();
  const { theme, motion, toggleTheme, toggleMotion } = useTheme();

  const [projects, setProjects] = useState<Project[]>([]);
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [loading, setLoading] = useState(true);
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

        const [fetchedProjects, fetchedSessions] = await Promise.all([
          getProjects(token),
          getSessions(token),
        ]);

        setProjects(fetchedProjects);
        setSessions(fetchedSessions);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        setPageError("Unable to load your dashboard right now.");
      } finally {
        setLoading(false);
      }
    }

    void loadDashboardData();
  }, [token, navigate]);

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

  const recentProjects = useMemo(() => projects.slice(0, 3), [projects]);

  const totalProjects = projects.length;

  const totalTasksAcrossProjects = useMemo(
    () => projects.reduce((sum, project) => sum + project.totalTasks, 0),
    [projects]
  );

  const totalCompletedAcrossProjects = useMemo(
    () => projects.reduce((sum, project) => sum + project.completedTasks, 0),
    [projects]
  );

  const tasksToDo = totalTasksAcrossProjects - totalCompletedAcrossProjects;

  const averageProjectProgress = useMemo(() => {
    if (projects.length === 0) return 0;
    return Math.round(
      projects.reduce((sum, project) => sum + project.progress, 0) / projects.length
    );
  }, [projects]);

  const totalSessions = sessions.length;

  const totalFocusMinutes = useMemo(
    () => sessions.reduce((sum, session) => sum + session.duration, 0),
    [sessions]
  );

  const topProject = useMemo(() => {
    if (projects.length === 0) return null;
    return [...projects].sort((a, b) => b.progress - a.progress)[0];
  }, [projects]);

  return (
    <main
      className="min-h-screen px-6 py-8"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <div className="mx-auto max-w-6xl">
        <header
          className="mb-6 rounded-[28px] px-6 py-6 shadow-sm"
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <p
                className="text-sm font-semibold uppercase tracking-wide"
                style={{ color: "var(--muted)" }}
              >
                Dashboard
              </p>
              <h1
                className="mt-2 text-4xl font-bold tracking-tight"
                style={{ color: "var(--text)" }}
              >
                Stay on top of your projects
              </h1>
              <p
                className="mt-3 text-sm leading-6"
                style={{ color: "var(--muted)" }}
              >
                View recent projects, track task progress, and keep momentum with
                short focus sessions.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/projects"
                  className="rounded-xl px-4 py-2 text-sm font-semibold no-underline"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "var(--primary-text)",
                  }}
                >
                  View projects
                </Link>

                <Link
                  to="/profile"
                  className="rounded-xl px-4 py-2 text-sm font-semibold no-underline"
                  style={{
                    backgroundColor: "var(--secondary)",
                    color: "var(--secondary-text)",
                    border: "1px solid var(--border)",
                  }}
                >
                  Profile settings
                </Link>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={toggleTheme}
                className="rounded-xl px-4 py-2 text-sm font-semibold outline-none"
                style={{
                  backgroundColor: "var(--card)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                }}
              >
                {theme === "default" ? "High Contrast" : "Normal Mode"}
              </button>

              <button
                type="button"
                onClick={toggleMotion}
                className="rounded-xl px-4 py-2 text-sm font-semibold outline-none"
                style={{
                  backgroundColor: "var(--card)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                }}
              >
                {motion === "default" ? "Reduced Motion" : "Standard Motion"}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl px-4 py-2 text-sm font-semibold outline-none"
                style={{
                  backgroundColor: "var(--secondary)",
                  color: "var(--secondary-text)",
                  border: "1px solid var(--border)",
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {(pageError || sessionMessage) && (
          <div className="mb-6 space-y-3">
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

        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Projects" value={totalProjects} helper="Active workspaces" />
          <StatCard label="Tasks to do" value={tasksToDo} helper="Open actions remaining" />
          <StatCard label="Completed" value={totalCompletedAcrossProjects} helper="Tasks finished" />
          <StatCard label="Focus minutes" value={totalFocusMinutes} helper="Total recorded time" />
        </section>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section
            className="rounded-[28px] p-6 shadow-sm"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2
                  className="text-2xl font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  Recent projects
                </h2>
                <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                  Your latest projects with quick progress insight.
                </p>
              </div>

              <Link
                to="/projects"
                className="rounded-xl px-4 py-2 text-sm font-semibold no-underline"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--primary-text)",
                }}
              >
                All projects
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4">
              {loading ? (
                <EmptyBox text="Loading your projects..." />
              ) : recentProjects.length === 0 ? (
                <EmptyBox text="No projects yet. Create your first project from the Projects page." />
              ) : (
                recentProjects.map((project) => (
                  <Link
                    key={project.id}
                    to={`/projects/${project.id}`}
                    className="block rounded-[22px] p-5 no-underline shadow-sm"
                    style={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      color: "var(--text)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold">{project.title}</h3>
                        <p
                          className="mt-1 line-clamp-2 text-sm"
                          style={{ color: "var(--muted)" }}
                        >
                          {project.description || "No description yet."}
                        </p>
                      </div>

                      <span
                        className="rounded-full px-3 py-1 text-xs font-semibold"
                        style={{
                          backgroundColor: "var(--pending-soft)",
                          color: "var(--text)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        {project.progress}%
                      </span>
                    </div>

                    <div
                      className="mt-4 h-3 w-full overflow-hidden rounded-full"
                      style={{ backgroundColor: "var(--border)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${project.progress}%`,
                          backgroundColor: "var(--primary)",
                        }}
                      />
                    </div>

                    <div
                      className="mt-4 grid grid-cols-2 gap-3 text-sm"
                      style={{ color: "var(--muted)" }}
                    >
                      <div
                        className="rounded-xl px-3 py-3"
                        style={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        <p style={{ color: "var(--text)", fontWeight: 600 }}>
                          {project.totalTasks}
                        </p>
                        <p className="mt-1 text-xs">Tasks</p>
                      </div>

                      <div
                        className="rounded-xl px-3 py-3"
                        style={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        <p style={{ color: "var(--text)", fontWeight: 600 }}>
                          {project.completedTasks}
                        </p>
                        <p className="mt-1 text-xs">Completed</p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>

          <section className="space-y-6">
            <section
              className="rounded-[28px] p-6 shadow-sm"
              style={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
              }}
            >
              <h2
                className="text-2xl font-semibold"
                style={{ color: "var(--text)" }}
              >
                Overall progress
              </h2>

              {loading ? (
                <div className="mt-6">
                  <EmptyBox text="Loading project summary..." />
                </div>
              ) : totalProjects === 0 ? (
                <div className="mt-6">
                  <EmptyBox text="Create a project to see progress here." />
                </div>
              ) : (
                <div className="mt-6">
                  <div className="flex justify-center">
                    <div
                      className="flex h-44 w-44 items-center justify-center rounded-full"
                      style={{
                        background: `conic-gradient(var(--primary) ${averageProjectProgress}%, var(--border) ${averageProjectProgress}% 100%)`,
                      }}
                    >
                      <div
                        className="flex h-30 w-30 items-center justify-center rounded-full text-2xl font-bold"
                        style={{
                          height: "7.5rem",
                          width: "7.5rem",
                          backgroundColor: "var(--card)",
                          color: "var(--text)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        {averageProjectProgress}%
                      </div>
                    </div>
                  </div>

                  <div
                    className="mt-6 grid grid-cols-2 gap-3 text-sm"
                    style={{ color: "var(--muted)" }}
                  >
                    <MiniStat label="Projects" value={totalProjects} />
                    <MiniStat label="To do" value={tasksToDo} />
                    <MiniStat label="Completed" value={totalCompletedAcrossProjects} />
                    <MiniStat label="Sessions" value={totalSessions} />
                  </div>

                  {topProject && (
                    <div
                      className="mt-6 rounded-2xl px-4 py-4"
                      style={{
                        backgroundColor: "var(--card)",
                        border: "1px dashed var(--border)",
                      }}
                    >
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "var(--text)" }}
                      >
                        Current top project
                      </p>
                      <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                        {topProject.title} — {topProject.progress}% complete
                      </p>

                      <Link
                        to={`/projects/${topProject.id}`}
                        className="mt-4 inline-block rounded-xl px-4 py-2 text-sm font-semibold no-underline"
                        style={{
                          backgroundColor: "var(--primary)",
                          color: "var(--primary-text)",
                        }}
                      >
                        Continue
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </section>

            <section
              className="rounded-[28px] p-6 shadow-sm"
              style={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
              }}
            >
              <h2
                className="text-2xl font-semibold"
                style={{ color: "var(--text)" }}
              >
                Focus session
              </h2>
              <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                Use a short timed session to build momentum.
              </p>

              <div className="mt-5">
                <FocusTimer onComplete={handleSessionComplete} />
              </div>

              <div
                className="mt-4 rounded-2xl px-4 py-4"
                style={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                  Focus summary
                </p>
                <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                  You have completed {totalSessions} focus session
                  {totalSessions === 1 ? "" : "s"} and logged {totalFocusMinutes} minutes.
                </p>
                <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                  {savingSession ? "Saving latest session..." : "Everything is up to date."}
                </p>
              </div>
            </section>
          </section>
        </div>
      </div>
    </main>
  );
}

type StatCardProps = {
  label: string;
  value: number | string;
  helper: string;
};

function StatCard({ label, value, helper }: StatCardProps) {
  return (
    <article
      className="rounded-[24px] p-5 shadow-sm"
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>
        {label}
      </p>
      <p
        className="mt-3 text-4xl font-bold tracking-tight"
        style={{ color: "var(--text)" }}
      >
        {value}
      </p>
      <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
        {helper}
      </p>
    </article>
  );
}

function MiniStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div
      className="rounded-xl px-3 py-3"
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      <p style={{ color: "var(--text)", fontWeight: 600 }}>{value}</p>
      <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
        {label}
      </p>
    </div>
  );
}

function EmptyBox({ text }: { text: string }) {
  return (
    <div
      className="rounded-2xl px-5 py-6"
      style={{
        backgroundColor: "var(--card)",
        border: "1px dashed var(--border)",
        color: "var(--text)",
      }}
    >
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        {text}
      </p>
    </div>
  );
}

export default DashboardPage;