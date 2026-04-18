import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import StatusBadge from "../components/StatusBadge";
import { getProjects, type Project } from "../lib/projects";
import { getToken } from "../lib/session";
import { getTasks, type Task } from "../lib/tasks";

type NextAction = {
  project: Project;
  task: Task | null;
};

function DashboardPage() {
  const navigate = useNavigate();
  const token = getToken();

  const [projects, setProjects] = useState<Project[]>([]);
  const [nextAction, setNextAction] = useState<NextAction | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    async function loadDashboardData() {
      try {
        setPageError("");

        const fetchedProjects = await getProjects(token);
        setProjects(fetchedProjects);

        const unfinishedProjects = fetchedProjects
          .filter((project) => project.progress < 100)
          .sort((a, b) => b.progress - a.progress);

        if (unfinishedProjects.length > 0) {
          const candidateProject = unfinishedProjects[0];
          const projectTasks = await getTasks(token, candidateProject.id);
          const nextTask = projectTasks.find((task) => !task.completed) ?? null;

          setNextAction({
            project: candidateProject,
            task: nextTask,
          });
        } else if (fetchedProjects.length > 0) {
          const topCompletedProject = [...fetchedProjects].sort(
            (a, b) => b.progress - a.progress
          )[0];

          setNextAction({
            project: topCompletedProject,
            task: null,
          });
        } else {
          setNextAction(null);
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        setPageError("Unable to load your dashboard right now.");
      } finally {
        setLoading(false);
      }
    }

    void loadDashboardData();
  }, [token, navigate]);

  const recentProjects = useMemo(() => projects.slice(0, 2), [projects]);

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

  const nextMilestone = useMemo(() => {
    if (!nextAction) return null;

    const progress = nextAction.project.progress;

    if (progress < 25) return 25;
    if (progress < 50) return 50;
    if (progress < 75) return 75;
    if (progress < 100) return 100;

    return null;
  }, [nextAction]);

  const motivationMessage = useMemo(() => {
    if (!nextAction) return "Create your first project to get started.";

    if (nextAction.project.progress === 100) {
      return "You completed your top project. Review it or start a new one.";
    }

    if (nextAction.task && nextMilestone) {
      return `Complete this task to move “${nextAction.project.title}” closer to ${nextMilestone}% progress.`;
    }

    if (nextAction.task) {
      return `Your next best step is “${nextAction.task.title}”. Keeping the next action visible makes it easier to begin.`;
    }

    return "Open this project and continue with the next unfinished task.";
  }, [nextAction, nextMilestone]);

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
              View recent projects and track task progress at a glance.
            </p>
          </div>
        </header>

        {pageError && (
          <div className="mb-6">
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
          </div>
        )}

        <section
          className="mb-6 rounded-[28px] p-6 shadow-sm"
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
          }}
        >
          {loading ? (
            <EmptyBox text="Preparing your next action..." />
          ) : totalProjects === 0 ? (
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <p
                  className="text-sm font-semibold uppercase tracking-wide"
                  style={{ color: "var(--muted)" }}
                >
                  Next action
                </p>
                <h2
                  className="mt-2 text-3xl font-bold tracking-tight"
                  style={{ color: "var(--text)" }}
                >
                  Create your first project
                </h2>
                <p className="mt-3 text-sm leading-6" style={{ color: "var(--muted)" }}>
                  Start with one project and one clear task. Keeping the first step small
                  helps reduce friction and makes it easier to begin.
                </p>
              </div>

              <div className="shrink-0">
                <Link
                  to="/projects"
                  className="inline-block rounded-xl px-5 py-3 text-sm font-semibold no-underline"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "var(--primary-text)",
                  }}
                >
                  Go to projects
                </Link>
              </div>
            </div>
          ) : nextAction ? (
            <div className="grid gap-5 lg:grid-cols-[1.35fr_0.7fr]">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <p
                    className="text-sm font-semibold uppercase tracking-wide"
                    style={{ color: "var(--muted)" }}
                  >
                    Next action
                  </p>

                  <StatusBadge
                    status={nextAction.project.progress === 100 ? "completed" : "pending"}
                  />
                </div>

                <h2
                  className="mt-3 text-4xl font-bold tracking-tight"
                  style={{ color: "var(--text)" }}
                >
                  {nextAction.task
                    ? `Start “${nextAction.task.title}”`
                    : `Continue “${nextAction.project.title}”`}
                </h2>

                <p
                  className="mt-3 max-w-2xl text-sm leading-6"
                  style={{ color: "var(--muted)" }}
                >
                  {motivationMessage}
                </p>

                <div
                  className="mt-4 flex flex-wrap gap-4 text-sm"
                  style={{ color: "var(--muted)" }}
                >
                  <span>
                    <strong style={{ color: "var(--text)" }}>Project:</strong>{" "}
                    {nextAction.project.title}
                  </span>
                  <span>
                    <strong style={{ color: "var(--text)" }}>Progress:</strong>{" "}
                    {nextAction.project.progress}%
                  </span>
                  <span>
                    <strong style={{ color: "var(--text)" }}>Tasks:</strong>{" "}
                    {nextAction.project.completedTasks}/{nextAction.project.totalTasks}
                  </span>
                </div>
              </div>

              <div
                className="rounded-2xl p-3"
                style={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                {nextAction.task && (
                  <div
                    className="mb-3 rounded-xl px-3 py-3"
                    style={{
                      backgroundColor: "var(--pending-soft)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <p
                      className="text-xs font-semibold uppercase tracking-wide"
                      style={{ color: "var(--muted)" }}
                    >
                      Next micro-task
                    </p>
                    <p
                      className="mt-1 text-sm font-semibold"
                      style={{ color: "var(--text)" }}
                    >
                      {nextAction.task.title}
                    </p>
                  </div>
                )}

                <div
                  className="h-2 w-full overflow-hidden rounded-full"
                  style={{ backgroundColor: "var(--border)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${nextAction.project.progress}%`,
                      backgroundColor:
                        nextAction.project.progress === 100
                          ? "var(--success)"
                          : "var(--primary)",
                    }}
                  />
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {nextAction.task ? (
                    <Link
                      to={`/projects/${nextAction.project.id}/tasks/${nextAction.task.id}`}
                      className="inline-block rounded-xl px-4 py-3 text-sm font-semibold no-underline"
                      style={{
                        backgroundColor: "var(--primary)",
                        color: "var(--primary-text)",
                      }}
                    >
                      Open focus
                    </Link>
                  ) : (
                    <Link
                      to={`/projects/${nextAction.project.id}`}
                      className="inline-block rounded-xl px-4 py-3 text-sm font-semibold no-underline"
                      style={{
                        backgroundColor: "var(--primary)",
                        color: "var(--primary-text)",
                      }}
                    >
                      Open project
                    </Link>
                  )}

                  <Link
                    to="/projects"
                    className="inline-block rounded-xl px-4 py-3 text-sm font-semibold no-underline"
                    style={{
                      backgroundColor: "var(--secondary)",
                      color: "var(--secondary-text)",
                    }}
                  >
                    View all projects
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </section>

        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Projects"
            value={totalProjects}
            helper="Active workspaces"
          />
          <StatCard
            label="Tasks to do"
            value={tasksToDo}
            helper="Open actions remaining"
          />
          <StatCard
            label="Completed"
            value={totalCompletedAcrossProjects}
            helper="Tasks finished"
          />
        </section>

        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[0.72fr_1.28fr]">
          <section
            className="rounded-[28px] p-5 shadow-sm"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <h2
              className="text-xl font-semibold"
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
              <div className="mt-4">
                <div className="flex justify-center">
                  <div
                    className="flex h-32 w-32 items-center justify-center rounded-full"
                    style={{
                      background: `conic-gradient(${
                        averageProjectProgress === 100
                          ? "var(--success)"
                          : "var(--primary)"
                      } ${averageProjectProgress}%, var(--border) ${averageProjectProgress}% 100%)`,
                    }}
                  >
                    <div
                      className="flex items-center justify-center rounded-full text-xl font-bold"
                      style={{
                        height: "5.5rem",
                        width: "5.5rem",
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
                  className="mt-4 grid grid-cols-2 gap-2 text-sm"
                  style={{ color: "var(--muted)" }}
                >
                  <MiniStat label="Projects" value={totalProjects} />
                  <MiniStat label="To do" value={tasksToDo} />
                  <MiniStat label="Completed" value={totalCompletedAcrossProjects} />
                  <MiniStat label="Avg." value={`${averageProjectProgress}%`} />
                </div>
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
                recentProjects.map((project) => {
                  const projectIsComplete = project.progress === 100;

                  return (
                    <article
                      key={project.id}
                      className="rounded-[20px] p-4 shadow-sm"
                      style={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        color: "var(--text)",
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="text-base font-semibold">{project.title}</h3>
                          <p
                            className="mt-1 truncate text-xs"
                            title={project.description || "No description yet."}
                            style={{ color: "var(--muted)" }}
                          >
                            {project.description || "No description yet."}
                          </p>
                        </div>

                        <div className="shrink-0">
                          <StatusBadge
                            status={projectIsComplete ? "completed" : "pending"}
                          />
                        </div>
                      </div>

                      <div
                        className="mt-3 h-2 w-full overflow-hidden rounded-full"
                        style={{ backgroundColor: "var(--border)" }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${project.progress}%`,
                            backgroundColor: projectIsComplete
                              ? "var(--success)"
                              : "var(--primary)",
                          }}
                        />
                      </div>

                      <div
                        className="mt-2 flex justify-between text-xs"
                        style={{ color: "var(--muted)" }}
                      >
                        <span>{project.progress}%</span>
                        <span>
                          {project.completedTasks}/{project.totalTasks} completed
                        </span>
                      </div>

                      <div className="mt-3">
                        <Link
                          to={`/projects/${project.id}`}
                          className="inline-block rounded-lg px-3 py-1.5 text-xs font-semibold no-underline"
                          style={{
                            backgroundColor: "var(--secondary)",
                            color: "var(--secondary-text)",
                          }}
                        >
                          Open project
                        </Link>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
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
      className="rounded-[20px] p-4 shadow-sm"
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>
        {label}
      </p>
      <p
        className="mt-2 text-3xl font-bold"
        style={{ color: "var(--text)" }}
      >
        {value}
      </p>
      <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
        {helper}
      </p>
    </article>
  );
}

function MiniStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div
      className="rounded-lg px-2 py-2"
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      <p style={{ color: "var(--text)", fontWeight: 600 }}>{value}</p>
      <p className="text-[11px]" style={{ color: "var(--muted)" }}>
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