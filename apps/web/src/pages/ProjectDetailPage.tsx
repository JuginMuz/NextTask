import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import ConfirmDialog from "../components/ConfirmDialog";
import StatusBadge from "../components/StatusBadge";
import { getProjects, type Project } from "../lib/projects";
import { getToken } from "../lib/session";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  type Task,
} from "../lib/tasks";

function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const token = getToken();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [newTaskError, setNewTaskError] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskError, setEditTaskError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);

  const createTaskRef = useRef<HTMLInputElement | null>(null);
  const editTaskRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (!projectId) {
      navigate("/projects");
      return;
    }

    async function loadProjectPage() {
      try {
        setLoading(true);
        setPageError("");

        const [projects, projectTasks] = await Promise.all([
          getProjects(token),
          getTasks(token, projectId),
        ]);

        const currentProject = projects.find((p) => p.id === projectId);

        if (!currentProject) {
          setPageError("Project not found.");
          setProject(null);
          setTasks([]);
          return;
        }

        setProject(currentProject);
        setTasks(projectTasks);
      } catch (error) {
        console.error("Failed to load project page:", error);
        setPageError("Unable to load this project right now.");
      } finally {
        setLoading(false);
      }
    }

    void loadProjectPage();
  }, [projectId, token, navigate]);

  useEffect(() => {
    if (editingTaskId && editTaskRef.current) {
      editTaskRef.current.focus();
      editTaskRef.current.select();
    }
  }, [editingTaskId]);

  useEffect(() => {
    if (!successMessage) return;
    const timeout = window.setTimeout(() => setSuccessMessage(""), 2200);
    return () => window.clearTimeout(timeout);
  }, [successMessage]);

  function validateNewTask() {
    const trimmedTitle = newTaskTitle.trim();

    if (!trimmedTitle) {
      setNewTaskError("Enter a task title.");
      return false;
    }

    if (trimmedTitle.length < 2) {
      setNewTaskError("Task title must be at least 2 characters.");
      return false;
    }

    setNewTaskError("");
    return true;
  }

  function validateEditTask() {
    const trimmedTitle = editTaskTitle.trim();

    if (!trimmedTitle) {
      setEditTaskError("Enter a task title.");
      return false;
    }

    if (trimmedTitle.length < 2) {
      setEditTaskError("Task title must be at least 2 characters.");
      return false;
    }

    setEditTaskError("");
    return true;
  }

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !projectId) return;

    if (!validateNewTask()) {
      createTaskRef.current?.focus();
      return;
    }

    const trimmedTitle = newTaskTitle.trim();

    try {
      const createdTask = await createTask(trimmedTitle, token, projectId);
      setTasks((prev) => [createdTask, ...prev]);
      setNewTaskTitle("");
      setNewTaskError("");
      setPageError("");
      setSuccessMessage(`Task "${createdTask.title}" created.`);
      createTaskRef.current?.focus();
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
      setSuccessMessage(
        completed
          ? `Task "${updated.title}" marked as completed.`
          : `Task "${updated.title}" reopened.`
      );
    } catch (error) {
      console.error("Failed to update task:", error);
      setPageError("Could not update the task.");
    }
  }

  async function handleConfirmDeleteTask() {
    if (!token || !deleteTarget) return;

    try {
      await deleteTask(deleteTarget.id, token);
      setTasks((prev) => prev.filter((task) => task.id !== deleteTarget.id));
      if (editingTaskId === deleteTarget.id) {
        setEditingTaskId(null);
        setEditTaskTitle("");
        setEditTaskError("");
      }
      setPageError("");
      setSuccessMessage(`Task "${deleteTarget.title}" deleted.`);
      setDeleteTarget(null);
      createTaskRef.current?.focus();
    } catch (error) {
      console.error("Failed to delete task:", error);
      setPageError("Could not delete the task.");
      setDeleteTarget(null);
    }
  }

  function handleStartEditTask(task: Task) {
    setEditingTaskId(task.id);
    setEditTaskTitle(task.title);
    setEditTaskError("");
  }

  function handleCancelEditTask() {
    setEditingTaskId(null);
    setEditTaskTitle("");
    setEditTaskError("");
  }

  async function handleSaveEditTask(task: Task) {
    if (!token) return;

    if (!validateEditTask()) {
      editTaskRef.current?.focus();
      return;
    }

    const trimmedTitle = editTaskTitle.trim();

    try {
      const updated = await updateTask(task.id, task.completed, token, trimmedTitle);
      setTasks((prev) =>
        prev.map((item) => (item.id === task.id ? updated : item))
      );
      setEditingTaskId(null);
      setEditTaskTitle("");
      setEditTaskError("");
      setPageError("");
      setSuccessMessage(`Task "${updated.title}" updated.`);
    } catch (error) {
      console.error("Failed to update task title:", error);
      setPageError("Could not update the task title.");
    }
  }

  const completedTasks = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks]
  );

  const totalTasks = tasks.length;
  const progress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const nextTask = useMemo(() => {
    return (
        [...tasks]
        .filter((task) => !task.completed)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt))[0] ?? null
    );
    }, [tasks]);

  const orderedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return a.createdAt.localeCompare(b.createdAt);
    });
  }, [tasks]);

  const nextMilestone = useMemo(() => {
    if (progress < 25) return 25;
    if (progress < 50) return 50;
    if (progress < 75) return 75;
    if (progress < 100) return 100;
    return null;
  }, [progress]);

  return (
    <>
      <main
        className="min-h-screen px-6 py-8"
        style={{
          backgroundColor: "var(--bg)",
          color: "var(--text)",
        }}
      >
        <div className="mx-auto max-w-6xl space-y-6">
          <header
            className="rounded-[28px] px-6 py-6 shadow-sm"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="max-w-3xl">
              <Link
                to="/projects"
                className="text-sm font-medium no-underline"
                style={{ color: "var(--muted)" }}
              >
                ← Back to projects
              </Link>

              <h1
                className="mt-3 text-4xl font-bold tracking-tight"
                style={{ color: "var(--text)" }}
              >
                {project ? project.title : "Project"}
              </h1>

              <p className="mt-3 text-sm leading-6" style={{ color: "var(--muted)" }}>
                {project?.description || "No description yet."}
              </p>
            </div>
          </header>

          {(pageError || successMessage) && (
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

              {successMessage && (
                <div
                  className="rounded-2xl px-4 py-3 text-sm"
                  aria-live="polite"
                  style={{
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--success-soft)",
                    color: "var(--text)",
                  }}
                >
                  {successMessage}
                </div>
              )}
            </div>
          )}

          {loading ? (
            <section
              className="rounded-[28px] px-5 py-6 shadow-sm"
              style={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                color: "var(--muted)",
              }}
            >
              Loading project...
            </section>
          ) : !project ? (
            <section
              className="rounded-[28px] px-5 py-6 shadow-sm"
              style={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            >
              <p className="text-base font-semibold">Project not found</p>
              <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                The project may have been deleted or you may not have access to it.
              </p>
            </section>
          ) : (
            <>
              <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <InfoCard label="Total tasks" value={totalTasks} />
                <InfoCard label="Completed tasks" value={completedTasks} />
                <InfoCard label="Progress" value={`${progress}%`} />
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
                  Project progress
                </h2>

                <div
                  className="mt-5 h-4 w-full overflow-hidden rounded-full"
                  style={{ backgroundColor: "var(--border)" }}
                  aria-hidden="true"
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${progress}%`,
                      backgroundColor:
                        progress === 100 ? "var(--success)" : "var(--primary)",
                    }}
                  />
                </div>

                <div
                  className="mt-3 flex flex-wrap gap-4 text-sm"
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
                </div>

                {progress === 0 && (
                  <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                    Get started by completing your first task.
                  </p>
                )}
              </section>

              <section
                className="rounded-[28px] p-6 shadow-sm"
                style={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <p
                        className="text-sm font-semibold uppercase tracking-wide"
                        style={{ color: "var(--muted)" }}
                      >
                        Next action
                      </p>

                      <StatusBadge status={progress === 100 ? "completed" : "pending"} />
                    </div>

                    <h2
                      className="mt-3 text-3xl font-bold tracking-tight"
                      style={{ color: "var(--text)" }}
                    >
                      {nextTask ? `Start “${nextTask.title}”` : "Project completed"}
                    </h2>

                    <p className="mt-3 text-sm leading-6" style={{ color: "var(--muted)" }}>
                      {nextTask
                        ? nextMilestone
                          ? `Complete this task to move this project closer to ${nextMilestone}% progress.`
                          : "Focus on one unfinished task before starting anything new."
                        : "You finished all tasks in this project. You can review it or add another task."}
                    </p>
                  </div>

                  <div
                    className="rounded-2xl p-4"
                    style={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {nextTask ? (
                      <Link
                        to={`/task/${nextTask.id}`}
                        className="inline-block rounded-xl px-4 py-3 text-sm font-semibold no-underline"
                        style={{
                          backgroundColor: "var(--primary)",
                          color: "var(--primary-text)",
                        }}
                      >
                        Open focus
                      </Link>
                    ) : (
                      <span
                        className="inline-block rounded-xl px-4 py-3 text-sm font-semibold"
                        style={{
                          backgroundColor: "var(--success-soft)",
                          color: "var(--success)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        All tasks completed
                      </span>
                    )}
                  </div>
                </div>

                <div
                  className="mt-5 rounded-2xl px-4 py-4"
                  style={{
                    backgroundColor: "var(--card)",
                    border: "1px dashed var(--border)",
                  }}
                >
                  <p className="font-semibold" style={{ color: "var(--text)" }}>
                    Focus guidance
                  </p>
                  <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                    {nextTask
                      ? `Pick “${nextTask.title}” and open it in focus mode before starting a new task.`
                      : "This project is complete. Add a new micro-task only if more work is genuinely needed."}
                  </p>
                </div>
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
                  Create a new task
                </h2>

                <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                  Break larger goals into short, manageable micro-tasks.
                </p>

                <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                  Use short action phrases, for example: “Draft intro paragraph” or “Reply to supervisor”.
                </p>

                <form onSubmit={handleCreateTask} className="mt-5" noValidate>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                    <div className="w-full">
                      <input
                        ref={createTaskRef}
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => {
                          setNewTaskTitle(e.target.value);
                          if (newTaskError) setNewTaskError("");
                        }}
                        placeholder='Try "Read 2 pages" or "Reply to one email"'
                        aria-invalid={newTaskError ? "true" : "false"}
                        aria-describedby={newTaskError ? "new-task-error" : undefined}
                        className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                        style={{
                          backgroundColor: "var(--card)",
                          color: "var(--text)",
                          border: "1px solid var(--border)",
                        }}
                      />
                      {newTaskError && (
                        <p
                          id="new-task-error"
                          className="mt-2 text-xs"
                          style={{ color: "var(--danger)" }}
                        >
                          {newTaskError}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="rounded-xl px-4 py-3 text-sm font-semibold whitespace-nowrap outline-none"
                      style={{
                        backgroundColor: "var(--primary)",
                        color: "var(--primary-text)",
                      }}
                    >
                      Add task
                    </button>
                  </div>
                </form>
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
                  Tasks
                </h2>

                <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                  Manage tasks for this project, then open one in focus mode.
                </p>

                <div className="mt-6 space-y-4">
                  {orderedTasks.length === 0 ? (
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
                        Add a task above to start working on this project.
                      </p>
                    </div>
                  ) : (
                    orderedTasks.map((task) => {
                      const isEditing = editingTaskId === task.id;
                      const isRecommended = nextTask?.id === task.id;

                      return (
                        <article
                          key={task.id}
                          className="rounded-2xl p-4 shadow-sm"
                          style={{
                            backgroundColor: "var(--card)",
                            border: isRecommended
                              ? "1px solid var(--primary)"
                              : "1px solid var(--border)",
                          }}
                        >
                          {isEditing ? (
                            <div className="space-y-3">
                              <div>
                                <label
                                  htmlFor={`edit-task-title-${task.id}`}
                                  className="mb-1 block text-sm font-medium"
                                  style={{ color: "var(--text)" }}
                                >
                                  Task title
                                </label>
                                <input
                                  ref={editTaskRef}
                                  id={`edit-task-title-${task.id}`}
                                  type="text"
                                  value={editTaskTitle}
                                  onChange={(e) => {
                                    setEditTaskTitle(e.target.value);
                                    if (editTaskError) setEditTaskError("");
                                  }}
                                  aria-invalid={editTaskError ? "true" : "false"}
                                  aria-describedby={
                                    editTaskError ? `edit-task-error-${task.id}` : undefined
                                  }
                                  className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                                  style={{
                                    backgroundColor: "var(--card)",
                                    color: "var(--text)",
                                    border: "1px solid var(--border)",
                                  }}
                                />
                                {editTaskError && (
                                  <p
                                    id={`edit-task-error-${task.id}`}
                                    className="mt-2 text-xs"
                                    style={{ color: "var(--danger)" }}
                                  >
                                    {editTaskError}
                                  </p>
                                )}
                              </div>

                              <div className="flex flex-wrap gap-2 pt-2">
                                <button
                                  type="button"
                                  onClick={() => handleSaveEditTask(task)}
                                  className="rounded-xl px-4 py-2 text-sm font-semibold outline-none"
                                  style={{
                                    backgroundColor: "var(--primary)",
                                    color: "var(--primary-text)",
                                  }}
                                >
                                  Save
                                </button>

                                <button
                                  type="button"
                                  onClick={handleCancelEditTask}
                                  className="rounded-xl px-4 py-2 text-sm font-semibold outline-none"
                                  style={{
                                    backgroundColor: "var(--secondary)",
                                    color: "var(--secondary-text)",
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-3">
                                  <p
                                    className={`text-lg font-semibold ${
                                      task.completed ? "line-through opacity-80" : ""
                                    }`}
                                    style={{ color: "var(--text)" }}
                                  >
                                    {task.title}
                                  </p>

                                  <StatusBadge
                                    status={task.completed ? "completed" : "pending"}
                                  />

                                  {isRecommended && !task.completed && (
                                    <span
                                      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
                                      style={{
                                        backgroundColor: "var(--pending-soft)",
                                        color: "var(--primary)",
                                        border: "1px solid var(--primary)",
                                      }}
                                    >
                                      ⭐ Recommended
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <Link
                                  to={`/task/${task.id}`}
                                  className="rounded-xl px-4 py-2 text-sm font-semibold no-underline"
                                  style={{
                                    backgroundColor: "var(--primary)",
                                    color: "var(--primary-text)",
                                  }}
                                >
                                  Focus
                                </Link>

                                <button
                                  type="button"
                                  onClick={() => handleToggleTask(task.id, !task.completed)}
                                  className="rounded-xl px-4 py-2 text-sm font-semibold outline-none"
                                  style={{
                                    backgroundColor: task.completed
                                      ? "var(--warning)"
                                      : "var(--success)",
                                    color: task.completed
                                      ? "var(--warning-text)"
                                      : "var(--success-text)",
                                  }}
                                  aria-label={
                                    task.completed
                                      ? `Mark "${task.title}" as pending`
                                      : `Mark "${task.title}" as completed`
                                  }
                                >
                                  {task.completed ? "Reopen" : "Complete"}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleStartEditTask(task)}
                                  className="rounded-xl px-4 py-2 text-sm font-semibold outline-none"
                                  style={{
                                    backgroundColor: "var(--card)",
                                    color: "var(--secondary)",
                                    border: "1px solid var(--border)",
                                  }}
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setDeleteTarget(task)}
                                  className="rounded-xl px-4 py-2 text-sm font-semibold outline-none"
                                  style={{
                                    backgroundColor: "var(--danger-soft)",
                                    color: "var(--danger)",
                                    border: "1px solid var(--danger)",
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </article>
                      );
                    })
                  )}
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete task?"
        description={
          deleteTarget
            ? `This will remove "${deleteTarget.title}". This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete task"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDeleteTask}
      />
    </>
  );
}

type InfoCardProps = {
  label: string;
  value: number | string;
};

function InfoCard({ label, value }: InfoCardProps) {
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
    </article>
  );
}

export default ProjectDetailPage;